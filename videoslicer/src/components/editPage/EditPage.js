import React, { Component, Fragment } from "react";
import axios from "axios";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

import classes from "./EditPage.module.css";
import Breadcrumbs from "../layout/breadcrumbs/Breadcrumbs";
import { BASE_URL } from "../../config";
import VideoJSPlayer from "../videoJSPlayer/VideoJSPlayer";
import NoVideoSVG from "../../assets/svg/no_videos.svg";
import PageSpinner from "../layout/spinners/page/PageSpinner";
import Controls from "./controls/Controls";
import BtnSpinner from "../layout/spinners/btn/BtnSpinner";
import DeleteConfirmAlert from "../modals/deleteConfirmAlert/DeleteConfirmAlert";
import ResultAlert from "../modals/resultAlert/ResultAlert";

import {
  CHILD_TYPES,
  CSAAT_VIDEO_SLICE_CHILDTYPE,
  CSAAT_VIDEO_SLICE_ACTIVE_VIDEO,
} from "../../actions/Types";

class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: "",
      videoClip: "",
      loading: false,
      currentTime: 0,
      ended: false,
      frames: [],
      slicing: false,
      deleting: false,
      resultModal: false,
      res: false,
      selectedTime: 0,
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.fetchVideo();
    this.fetchVideoClip();
    this.markerLength = 0;
  }

  componentWillUnmount() {
    this.mounted = false;

    const videoEl = document.getElementById("video_slicer_preview_video");
    if (videoEl) {
      videoEl.pause();
      videoEl.removeAttribute("src");
      videoEl.load();
      videoEl.remove();
    }
  }

  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////// functions ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  fetchVideo = async () => {
    if (!this.mounted) return;
    this.setState({ loading: true });
    try {
      const res = await axios.get(
        `${BASE_URL}/video/${localStorage.getItem(
          CSAAT_VIDEO_SLICE_ACTIVE_VIDEO
        )}/`
      );
      if (res) {
        // console.log(res.data);
        this.setState({ video: res.data });
        this.initializeEditor();
      }
    } catch (err) {
      // console.log(err);
    }
  };

  fetchVideoClip = async () => {
    if (!this.mounted) return;

    this.setState({ videoClip: "" });

    try {
      const res = await axios.get(
        `${BASE_URL}/video-clip/${localStorage.getItem(
          CSAAT_VIDEO_SLICE_ACTIVE_VIDEO
        )}/`
      );
      if (res) {
        // console.log(res.data);
        this.setState({ videoClip: res.data[0] });
      }
    } catch (err) {
      // console.log(err);
    }
  };

  initializeEditor = () => {
    const self = this;
    this.videoEl = document.getElementById("video_slicer_preview_video");
    this.timeline = document.getElementById("video_slicer_timeline");
    this.timelineDrag = document.getElementById("video_slicer_timeline_drag");

    // on interaction with video controls
    this.videoEl.onplay = function () {
      gsap.ticker.add(self.videoUpdate);
    };
    this.videoEl.onpause = function () {
      gsap.ticker.remove(self.videoUpdate);
    };
    this.videoEl.onended = function () {
      gsap.ticker.remove(self.videoUpdate);
    };

    gsap.registerPlugin(Draggable);

    // make timeline draggable
    Draggable.create(this.timelineDrag, {
      type: "x",
      bounds: this.timeline,
      inertia: true,
      onPress: function (e) {
        // console.log("pressed");
      },
      onDrag: function () {
        self.videoEl.currentTime = (this.x / this.maxX) * self.videoEl.duration;
      },
      onRelease: function (e) {
        e.preventDefault();
      },
    });
  };

  playVideo = () => {
    this.videoEl.play();
  };

  pauseVideo = () => {
    this.videoEl.pause();
  };

  stopVideo = () => {
    this.videoEl.pause();
    this.videoEl.currentTime = 0;
    gsap.set(this.timelineDrag, {
      x: 0,
    });
  };

  backwardVideo = () => {
    if (this.videoEl.currentTime - 5 > 0) {
      const t = this.videoEl.currentTime;
      this.videoEl.currentTime = t - 5;
    }
  };

  forwardVideo = () => {
    if (this.videoEl.currentTime + 5 < this.videoEl.duration) {
      const t = this.videoEl.currentTime;
      this.videoEl.currentTime = t + 5;
    }
  };

  highlightArea = () => {
    // get max and min points
    var max = null;
    var min = null;
    if (this.marker1 > this.marker2) {
      max = this.marker1;
      min = this.marker2;
    } else {
      max = this.marker2;
      min = this.marker1;
    }
    // console.log("min", min);
    // console.log("max", max);

    // get width
    var sw = this.timeline.offsetWidth * (min / this.videoEl.duration);
    var ew = this.timeline.offsetWidth * (max / this.videoEl.duration);
    var width = ew - sw;
    // console.log("width ", width);

    var el = document.createElement("div");
    el.classList.add(`${classes.timeline_progress}`);
    el.id = "timeline_progress";
    el.style.width = `${width}px`;
    // el.style.marginLeft = `${sw}px`
    this.timeline.appendChild(el);
    gsap.set(el, {
      x: sw,
    });
  };

  resetEditor = () => {
    this.stopVideo();

    const markers = document.getElementsByClassName(
      `${classes.timeline_marker}`
    );

    for (let i = 0; i < markers.length; i++) {
      if (markers[i]) {
        this.timeline.removeChild(markers[i]);
        markers[i].remove();
      }
    }

    const highlitedArea = document.getElementById("timeline_progress");
    if (highlitedArea) {
      this.timeline.removeChild(highlitedArea);
    }
    this.markerLength = 0;
  };

  closeDeleteModal = (res) => {
    if (res) {
      this.setState({ deleting: false, videoClip: "" });
    } else {
      this.setState({ deleting: false });
    }
  };

  closeResultModal = () => {
    this.setState({ resultModal: false, res: false });
  };

  convertSec = (sec) => {
    try {
      let measuredTime = new Date(null);
      measuredTime.setSeconds(parseInt(sec)); // specify value of SECONDS
      let MHSTime = measuredTime.toISOString().substr(11, 8);
      return MHSTime;
    } catch (err) {
      return "00:00:00";
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////// event listeners ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  onVideoLoaded = () => {
    this.setState({ loading: false });
    setTimeout(() => {
      window.scroll({
        top: 160,
        behavior: "smooth",
      });
    }, 1500);
  };

  videoUpdate = () => {
    gsap.set(this.timelineDrag, {
      x: (
        (this.videoEl.currentTime / this.videoEl.duration) *
        (this.timeline.offsetWidth - 6)
      ).toFixed(4),
    });
  };

  timelineClicked = (e) => {
    const p = e.clientX - this.timeline.offsetLeft;
    var t = (p * this.videoEl.duration) / (this.timeline.offsetWidth - 6);
    this.videoEl.currentTime = t;
    if (this.videoEl.paused) {
      gsap.set(this.timelineDrag, {
        x: p.toFixed(4),
      });
    }
  };

  timelineDragClicked = () => {
    if (this.markerLength >= 2) {
      return;
    }

    // set marker
    const self = this;

    var marker = document.createElement("div");
    var markerTop = document.createElement("div");
    var markerBody = document.createElement("div");

    marker.classList.add(`${classes.timeline_marker}`);

    var id = this.markerLength;
    markerTop.id = id;
    markerTop.classList.add(`${classes.timeline_marker_top}`);
    markerTop.innerHTML = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M18.984 12.984h-13.969v-1.969h13.969v1.969z"></path>
    </svg>
    `;

    markerBody.classList.add(`${classes.timeline_marker_body}`);

    marker.appendChild(markerTop);
    marker.appendChild(markerBody);

    this.timeline.appendChild(marker);

    if (this.videoEl.currentTime === this.videoEl.duration) {
      gsap.set(marker, {
        x: 0,
      });
    } else {
      gsap.set(marker, {
        x: (
          (this.videoEl.currentTime / this.videoEl.duration) *
          this.timeline.offsetWidth
        ).toFixed(4),
      });
    }

    if (this.markerLength === 0) {
      this.marker1 = this.videoEl.currentTime;
    } else {
      this.marker2 = this.videoEl.currentTime;
    }
    const l = this.markerLength;
    this.markerLength = l + 1;

    // console.log("marker 1", self.marker1);
    // console.log("marker 2", self.marker2);
    // console.log("len", this.markerLength);

    // highlight selected area
    if (this.markerLength === 2) {
      this.highlightArea();

      // update selected time
      const t = Math.abs(this.marker1 - this.marker2);
      this.setState({ selectedTime: t });
    }

    markerTop.onclick = function () {
      // remove marker
      self.timeline.removeChild(marker);

      const l = self.markerLength;
      self.markerLength = l - 1;

      // console.log("marker 1", self.marker1);
      // console.log("marker 2", self.marker2);
      // console.log("len", self.markerLength);

      // remove highlited area
      if (self.markerLength < 2) {
        const el = document.getElementById("timeline_progress");
        if (el) {
          self.timeline.removeChild(el);
        }
        self.setState({ selectedTime: 0 });
      }
    };
  };

  onVideoTimeUpdate = (e) => {
    this.setState({ currentTime: this.videoEl.currentTime });
  };

  sliceVideo = async () => {
    if (this.markerLength < 2) {
      return;
    }

    // get max and min points
    var max = null;
    var min = null;
    if (this.marker1.time > this.marker2.time) {
      max = this.marker1;
      min = this.marker2;
    } else {
      max = this.marker2;
      min = this.marker1;
    }
    var startTime = Math.round(min);
    var endTime = Math.round(max);
    // console.log(startTime)
    // console.log(endTime)

    this.setState({ slicing: true });

    try {
      const res = await axios(`${BASE_URL}/add-video-clip/`, {
        method: "POST",
        data: {
          video_id: this.state.video.id,
          start_time: startTime,
          end_time: endTime,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res) {
        this.setState({ slicing: false, resultModal: true, res: true });
        // console.log(res.data)
        this.fetchVideoClip();
        this.resetEditor();

        // update video record
        const res = await axios(`${BASE_URL}/update-video/${this.state.video.id}/`, {
          method: 'PUT',
          data: {
            "sliced": true
          },
          headers: {
            "Content-Type": "application/json",
          },
        })
      }
    } catch (err) {
      this.setState({ slicing: false, resultModal: true, res: false });
      // console.log(err)
      this.setState({ slicing: false });
    }
  };

  deleteVideoClip = () => {
    this.setState({ deleting: true });
  };

  render() {
    // console.log(this.videoEl.currentTime)
    const childType = localStorage.getItem(CSAAT_VIDEO_SLICE_CHILDTYPE);
    const { video, videoClip } = this.state;
    const sub_links = [
      { name: "Home", link: "/" },
      {
        name:
          childType === CHILD_TYPES.TYPICAL
            ? "Typical Videos"
            : "Atypical Videos",
        link: childType === CHILD_TYPES.TYPICAL ? "/t_videos" : "/at_videos",
      },
    ];

    return (
      <Fragment>
        <Breadcrumbs
          heading="Slice Video"
          sub_links={sub_links}
          current="Slice Video"
          state={null}
        />

        <div className="container">
          {this.state.loading && !video ? (
            <div className={classes.loadingDiv}>
              <PageSpinner />
            </div>
          ) : (
            <div className={classes.editor}>
              <video
                id="video_slicer_preview_video"
                autoPlay={false}
                muted={true}
                controls={false}
                loop={false}
                poster={"http://localhost:8000" + video.thumbnail}
                onLoadedData={this.onVideoLoaded}
                onTimeUpdate={this.onVideoTimeUpdate}
              >
                <source
                  src={"http://localhost:8000" + video.video}
                  type={video.file_type}
                ></source>
                Video playing error
              </video>

              <div
                id="video_slicer_timeline"
                className={classes.timelineDiv}
                onClick={this.timelineClicked}
              >
                <div
                  id="video_slicer_timeline_drag"
                  className={classes.timeline_drag}
                >
                  <div
                    className={classes.timeline_drag_top}
                    onClick={this.timelineDragClicked}
                  >
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.984 12.984h-6v6h-1.969v-6h-6v-1.969h6v-6h1.969v6h6v1.969z"></path>
                    </svg>
                  </div>
                  <div className={classes.timeline_drag_body}></div>
                </div>
                <div className={classes.timeline_background}></div>
              </div>

              <div className={classes.footerDiv}>
                <span>
                  Selected time slot: {this.convertSec(this.state.selectedTime)}
                </span>

                <Controls
                  currentTime={this.videoEl ? this.state.currentTime : 0}
                  duration={video ? video.duration : 0}
                  play={this.playVideo}
                  pause={this.pauseVideo}
                  stop={this.stopVideo}
                  backward={this.backwardVideo}
                  forward={this.forwardVideo}
                />

                <button
                  type="submit"
                  className={classes.slicebtn}
                  onClick={this.sliceVideo}
                >
                  {this.state.slicing ? <BtnSpinner /> : null}
                  Slice
                </button>
              </div>
            </div>
          )}

          <div className={classes.edited}>
            <h2>Sliced Video</h2>

            <div className={classes.video}>
              {this.state.videoClip ? (
                <div className={classes.videoClip}>
                  <VideoJSPlayer vkey={videoClip.id} video={videoClip} />

                  <button onClick={this.deleteVideoClip}>Delete</button>
                </div>
              ) : (
                <div className={classes.empty}>
                  <img src={NoVideoSVG} alt="no video" />
                </div>
              )}
            </div>
          </div>
        </div>

        {this.state.deleting ? (
          <DeleteConfirmAlert
            close={(res) => this.closeDeleteModal(res)}
            id={videoClip.id}
          />
        ) : null}

        {this.state.resultModal ? (
          <ResultAlert res={this.state.res} close={this.closeResultModal} />
        ) : null}
      </Fragment>
    );
  }
}

export default EditPage;

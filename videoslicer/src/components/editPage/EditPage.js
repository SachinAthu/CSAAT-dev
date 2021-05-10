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
import DeleteConfirmAlert from '../modals/deleteConfirmAlert/DeleteConfirmAlert'
import ResultAlert from '../modals/resultAlert/ResultAlert'

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
      markers: [],
      frames: [],
      slicing: false,
      deleting: false,
      resultModal: false,
      res: false,
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.fetchVideo();
    this.fetchVideoClip();
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

    this.setState({ videoClip: '' })

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

  highlightArea = (markers) => {
    // get max and min points
    var max = null;
    var min = null;
    if (markers[0].time > markers[1].time) {
      max = markers[0];
      min = markers[1];
    } else {
      max = markers[1];
      min = markers[0];
    }
    // console.log("min", min);
    // console.log("max", max);

    // get width
    var sw = this.timeline.offsetWidth * (min.time / this.videoEl.duration);
    var ew = this.timeline.offsetWidth * (max.time / this.videoEl.duration);
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
    this.stopVideo()

    const markers = document.getElementsByClassName(`${classes.timeline_marker}`)
    
    for(let i = 0; i < markers.length; i++) {
      if(markers[i]){
        this.timeline.removeChild(markers[i])
        markers[i].remove()
      }
    }

    const highlitedArea = document.getElementById('timeline_progress')
    if(highlitedArea) {
      this.timeline.removeChild(highlitedArea)
    }
    this.setState({ markers: [] })
  }

  closeDeleteModal = (res) => {
    if(res){
      this.setState({ deleting: false, videoClip: '' })
    }else{
      this.setState({ deleting: false })
    }
  }

  closeResultModal = () => {
    this.setState({ resultModal: false, res: false })
  }

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
    // gsap.set(this.timeline_progress, {
    //   scaleX: (this.video.currentTime / this.video.duration).toFixed(5)
    // });
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
    if (this.state.markers.length >= 2) {
      return;
    }

    // set marker
    const self = this;
    var markers = [...this.state.markers];

    var marker = document.createElement("div");
    var markerTop = document.createElement('div')
    var markerBody = document.createElement('div')

    marker.classList.add(`${classes.timeline_marker}`);

    var id = "marker_" + markers.length.toString();
    markerTop.id = id;
    markerTop.classList.add(`${classes.timeline_marker_top}`)
    markerTop.innerHTML = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M18.984 12.984h-13.969v-1.969h13.969v1.969z"></path>
    </svg>
    `;

    markerBody.classList.add(`${classes.timeline_marker_body}`)

    marker.appendChild(markerTop)
    marker.appendChild(markerBody)

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

    markers.push({
      id: id,
      time: this.videoEl.currentTime,
    });
    this.setState({ markers: markers });

    // highlight selected area
    if (markers.length === 2) {
      this.highlightArea(markers);
    }

    markerTop.onclick = function () {
      // remove marker
      self.timeline.removeChild(marker);
      var m = [...self.state.markers];
      var m2 = [];
      for (let i = 0; i < m.length; i++) {
        if (m[i].id !== this.id) {
          m2.push(m[i]);
        }
      }
      self.setState({ markers: m2 });

      // remove highlited area
      if (self.state.markers.length < 2) {
        const el = document.getElementById('timeline_progress')
        if(el){
          self.timeline.removeChild(el)
        }
      }
    };
  };

  onVideoTimeUpdate = (e) => {
    this.setState({ currentTime: this.videoEl.currentTime });
  };

  sliceVideo = async () => {
    const markers = [...this.state.markers]

    if(markers.length < 2) {
      return
    }

    // get max and min points
    var max = null
    var min = null
    if(markers[0].time > markers[1].time){
      max = markers[0]
      min = markers[1]
    }else{
      max = markers[1]
      min = markers[0]
    }
    var startTime = Math.round(min.time)
    var endTime = Math.round(max.time)
    // console.log(startTime)
    // console.log(endTime)

    this.setState({ slicing: true })

    try{
      const res = await axios(`${BASE_URL}/add-video-clip/`, {
        method: 'POST',
        data: {
          "video_id": this.state.video.id,
          "start_time": startTime,
          "end_time": endTime
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      if(res){
        this.setState({ slicing: false, resultModal: true, res: true })
        // console.log(res.data)
        this.fetchVideoClip()
        this.resetEditor()
      }
    }catch(err){
      this.setState({ slicing: false, resultModal: true, res: false })
      // console.log(err)
      this.setState({ slicing: false })
    }
    setTimeout(() => {
    }, 5000)
  };

  deleteVideoClip = () => {
    this.setState({ deleting: true })
  }

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
                <Controls
                  currentTime={this.videoEl ? this.state.currentTime : 0}
                  duration={video ? video.duration : 0}
                  play={this.playVideo}
                  pause={this.pauseVideo}
                  stop={this.stopVideo}
                  backward={this.backwardVideo}
                  forward={this.forwardVideo}
                />

                <button type="submit" className={classes.slicebtn} onClick={this.sliceVideo}>
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

        {this.state.deleting ? <DeleteConfirmAlert 
          close={(res) => this.closeDeleteModal(res)}
          id={videoClip.id}
        /> : null}

        {this.state.resultModal ? <ResultAlert res={this.state.res} close={this.closeResultModal} /> : null}
      </Fragment>
    );
  }
}

export default EditPage;

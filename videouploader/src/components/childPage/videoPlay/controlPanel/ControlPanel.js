import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

import classes from "./ControlPanel.module.css";

import { tooglePlayMode } from "../../../../actions/VideoActions";
import { PLAY_STATUS, PLAY_MODES } from "../../../../actions/Types";

class ControlPanel extends Component {
  static propTypes = {
    playMode: PropTypes.string,
    tooglePlayMode: PropTypes.func.isRequired,
    videos: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      totalTime: 0,
      playState: PLAY_STATUS.STOP,
      videoLoadCount: 0,
      currentTooltipTime: 0,
    };
  }

  componentDidMount() {
    this.setMax();
  }

  componentWillUnmount() {
    this.props.tooglePlayMode(PLAY_MODES.SINGLE);
  }

  /////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// functions ////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  setMax = () => {
    const videos = this.props.videos;
    let max = 0;
    let maxV = {};
    for (let i = 0; i < videos.length; i++) {
      if (parseInt(videos[i].duration) > max) {
        max = parseInt(videos[i].duration);
        maxV = videos[i];
      }
    }
    this.setState({ totalTime: max, maxVideo: maxV });
    this.maxVideoEl = document.getElementById(maxV.id + maxV.name);

    this.initializeTimeline();
  };

  initializeTimeline = () => {
    const self = this;
    this.timeline = document.getElementById("control_panel_timeline");
    this.timelineDrag = document.getElementById("control_panel_timeline_drag");
    this.timelineHighlited = document.getElementById(
      "control_panel_timeline_highlited"
    );

    // this.maxVideoEl.onplay = function () {
    //   gsap.ticker.add(self.timeUpdateListener);
    // };
    // this.maxVideoEl.onpause = function () {
    //   gsap.ticker.remove(self.timeUpdateListener);
    // };
    // this.maxVideoEl.onended = function () {
    //   gsap.ticker.remove(self.timeUpdateListener);
    // };

    this.maxVideoEl.ontimeupdate = function () {
      if (self.props.playMode === PLAY_MODES.ALL) {
        const offset = (
          (this.currentTime / this.duration) *
          (self.timeline.offsetWidth - 10)
        ).toFixed(4);
        gsap.set(self.timelineDrag, {
          x: offset,
        });
        self.timelineHighlited.style.width = `${offset}px`;
        self.setState({ currentTime: this.currentTime });
      }
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
        const videos = self.props.videos;
        const t = (this.x / this.maxX) * self.maxVideoEl.duration;
        for (let i = 0; i < videos.length; i++) {
          let el = document.getElementById(videos[i].id + videos[i].name);
          el.currentTime = t;
        }
        self.timelineHighlited.style.width = `${this.x}px`;
        self.setState({ currentTime: t });
      },
      onRelease: function (e) {
        e.preventDefault();
      },
    });
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

  playAll = () => {
    this.props.tooglePlayMode(PLAY_MODES.ALL);
    const videos = this.props.videos;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      if (videoEl.currentTime < videoEl.duration) {
        videoEl.play();
      }
    }
    this.setState({ playState: PLAY_STATUS.PLAY });
  };

  pauseAll = () => {
    this.props.tooglePlayMode(PLAY_MODES.ALL);
    const videos = this.props.videos;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.pause();
    }
    this.setState({ playState: PLAY_STATUS.PAUSE });
  };

  stopAll = () => {
    this.props.tooglePlayMode(PLAY_MODES.SINGLE);
    const videos = this.props.videos;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.pause();
      videoEl.currentTime = 0;
    }
    gsap.set(this.timelineDrag, {
      x: 0,
    });
    this.timelineHighlited.style.width = `${0}px`;
    this.setState({ playState: PLAY_STATUS.STOP, currentTime: 0 });
  };

  backwardForwardAll = (type, len) => {
    this.props.tooglePlayMode(PLAY_MODES.ALL);
    const videos = this.props.videos;
    var t = this.state.currentTime;

    if (type === 0) {
      // backward
      t = t - len;
    } else {
      // forward
      t = t + len;
    }

    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.currentTime = t;
    }
    this.setState({ currentTime: t });
  };

  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////// event listeners /////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  // timeUpdateListener = () => {
  //   gsap.set(this.timelineDrag, {
  //     x: (
  //       (this.maxVideoEl.currentTime / this.maxVideoEl.duration) *
  //       (this.timeline.offsetWidth - 10)
  //     ).toFixed(4),
  //   });
  // };

  timelineClicked = (e) => {
    const videos = this.props.videos;
    const p = e.clientX - this.timeline.offsetLeft;
    var t = (p * this.maxVideoEl.duration) / this.timeline.offsetWidth;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.currentTime = t;
    }
    if (this.maxVideoEl.paused) {
      gsap.set(this.timelineDrag, {
        x: p.toFixed(4),
      });
    }
    this.timelineHighlited.style.width = `${p}px`;
    this.setState({ currentTime: t });
  };

  timelineMouseMove = (e) => {
    const el = document.getElementById('control_panel_tooltip')
    const t =
      ((e.clientX - this.timeline.offsetLeft) * this.maxVideoEl.duration) /
      this.timeline.offsetWidth;
    this.setState({ currentTooltipTime: t });
 
    
    var offset = 0
    if((e.clientX - this.timeline.offsetLeft) <= 25) {
      offset = 0
    }else if((e.clientX - this.timeline.offsetLeft) >= (this.timeline.offsetWidth - 25)) {
      offset = this.timeline.offsetWidth - 52
    }else{
      offset = (e.clientX - this.timeline.offsetLeft - 25).toFixed(4)
    }
    gsap.set(el, {
      x: offset,
    });
    el.classList.add(`${classes.show}`)
  };

  timelineMouseLeave = (e) => {
    const el = document.getElementById('control_panel_tooltip')
    gsap.set(el, {
      x: 0,
    });
    el.classList.remove(`${classes.show}`)
  };

  render() {
    return (
      <div className={classes.controlPanel}>
        <div
          id="control_panel_timeline"
          className={classes.timeline}
          onClick={this.timelineClicked}
          onMouseMove={this.timelineMouseMove}
          onMouseLeave={this.timelineMouseLeave}
        >
          <div className={classes.timeline_background}></div>

          <div
            id="control_panel_timeline_highlited"
            className={classes.timeline_highlighted}
          ></div>

          <div
            id="control_panel_timeline_drag"
            className={classes.timeline_drag}
          ></div>

          <div id="control_panel_tooltip" className={classes.tooltip}>
            <span>{this.convertSec(this.state.currentTooltipTime)}</span>
            <i></i>
          </div>
        </div>

        <div className={classes.controlers}>
          <span className={classes.currentTime}>
            {this.convertSec(this.state.currentTime)}
          </span>

          <button
            onClick={this.backwardForwardAll.bind(this, 0, 30)}
            className={classes.backwardBtn}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <title>Backward 30s</title>
              <path d="M27.297 2.203c0.391-0.391 0.703-0.25 0.703 0.297v23c0 0.547-0.313 0.688-0.703 0.297l-11.094-11.094c-0.094-0.094-0.156-0.187-0.203-0.297v11.094c0 0.547-0.313 0.688-0.703 0.297l-11.094-11.094c-0.094-0.094-0.156-0.187-0.203-0.297v10.594c0 0.547-0.453 1-1 1h-2c-0.547 0-1-0.453-1-1v-22c0-0.547 0.453-1 1-1h2c0.547 0 1 0.453 1 1v10.594c0.047-0.109 0.109-0.203 0.203-0.297l11.094-11.094c0.391-0.391 0.703-0.25 0.703 0.297v11.094c0.047-0.109 0.109-0.203 0.203-0.297z"></path>
            </svg>
          </button>

          <button
            onClick={this.backwardForwardAll.bind(this, 0, 5)}
            className={classes.backwardBtn}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="28"
              viewBox="0 0 16 28"
            >
              <title>Backward 5s</title>
              <path d="M15.297 2.203c0.391-0.391 0.703-0.25 0.703 0.297v23c0 0.547-0.313 0.688-0.703 0.297l-11.094-11.094c-0.094-0.094-0.156-0.187-0.203-0.297v10.594c0 0.547-0.453 1-1 1h-2c-0.547 0-1-0.453-1-1v-22c0-0.547 0.453-1 1-1h2c0.547 0 1 0.453 1 1v10.594c0.047-0.109 0.109-0.203 0.203-0.297z"></path>
            </svg>
          </button>

          {this.state.playState === PLAY_STATUS.PAUSE ||
          this.state.playState === PLAY_STATUS.STOP ? (
            <button onClick={this.playAll} className={classes.playBtn}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Play</title>
                <path d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM9.984 16.5v-9l6 4.5z"></path>
              </svg>
            </button>
          ) : null}

          {this.state.playState === PLAY_STATUS.PLAY ? (
            <button onClick={this.pauseAll} className={classes.pauseBtn}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Pause</title>
                <path d="M12.984 15.984v-7.969h2.016v7.969h-2.016zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM9 15.984v-7.969h2.016v7.969h-2.016z"></path>
              </svg>
            </button>
          ) : null}

          <button onClick={this.stopAll} className={classes.stopBtn}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Stop</title>
              <path d="M6 6h12v12h-12v-12z"></path>
            </svg>
          </button>

          <button
            onClick={this.backwardForwardAll.bind(this, 1, 5)}
            className={classes.forwardBtn}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="28"
              viewBox="0 0 16 28"
            >
              <title>Forward 5s</title>
              <path d="M0.703 25.797c-0.391 0.391-0.703 0.25-0.703-0.297v-23c0-0.547 0.313-0.688 0.703-0.297l11.094 11.094c0.094 0.094 0.156 0.187 0.203 0.297v-10.594c0-0.547 0.453-1 1-1h2c0.547 0 1 0.453 1 1v22c0 0.547-0.453 1-1 1h-2c-0.547 0-1-0.453-1-1v-10.594c-0.047 0.109-0.109 0.203-0.203 0.297z"></path>
            </svg>
          </button>

          <button
            onClick={this.backwardForwardAll.bind(this, 1, 30)}
            className={classes.forwardBtn}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <title>Forward 30s</title>
              <path d="M0.703 25.797c-0.391 0.391-0.703 0.25-0.703-0.297v-23c0-0.547 0.313-0.688 0.703-0.297l11.094 11.094c0.094 0.094 0.156 0.187 0.203 0.297v-11.094c0-0.547 0.313-0.688 0.703-0.297l11.094 11.094c0.094 0.094 0.156 0.187 0.203 0.297v-10.594c0-0.547 0.453-1 1-1h2c0.547 0 1 0.453 1 1v22c0 0.547-0.453 1-1 1h-2c-0.547 0-1-0.453-1-1v-10.594c-0.047 0.109-0.109 0.203-0.203 0.297l-11.094 11.094c-0.391 0.391-0.703 0.25-0.703-0.297v-11.094c-0.047 0.109-0.109 0.203-0.203 0.297z"></path>
            </svg>
          </button>

          <span className={classes.totalTime}>
            {" "}
            {this.convertSec(this.state.totalTime)}{" "}
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  playMode: state.videoReducer.playMode,
  videos: state.videoReducer.videos,
});

export default connect(mapStateToProps, {
  tooglePlayMode,
})(ControlPanel);

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import classes from "./ControlPanel.module.css";

import {
  tooglePlayMode,
} from "../../../../actions/VideoActions";
import { PLAY_STATUS, PLAY_MODES } from "../../../../actions/Types";

class ControlPanel extends Component {
  static propTypes = {
    playState: PropTypes.string,
    tooglePlayMode: PropTypes.func.isRequired,
    videos: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      totalTime: 0,
      playState: PLAY_STATUS.STOP,
      maxVideo: {},
    };
  }

  componentDidMount() {
    this.setMax();
    
    this.timelineEl = document.getElementById('control_panel_timeline')
    this.timelineEl.value = 0
    this.timelineEl.addEventListener('change', this.timelineOnChangeListener)
    
  }

  componentWillUnmount() {
    this.props.tooglePlayMode(PLAY_MODES.SINGLE);
    if (this.maxVideoEl) {
      this.maxVideoEl.removeEventListener("timeupdate", this.timeUpdateListener);
    }
    if(this.timelineEl) {
      this.timelineEl.removeEventListener('change', this.timelineOnChangeListener);
    }
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

    // timeupdate listener on max lenth video
    const videoEl = document.getElementById('control_panel_videoEl')
    videoEl.setAttribute('src', 'http://localhost:8000' + maxV.video)
    videoEl.setAttribute('type', maxV.file_type)
    videoEl.addEventListener("timeupdate", this.timeUpdateListener);
    this.maxVideoEl = videoEl

    // this.maxVideoEl = document.getElementById(maxV.id + maxV.name);
    // this.maxVideoEl.addEventListener("timeupdate", this.timeUpdateListener);

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
    this.maxVideoEl.play()
    const videos = this.props.videos;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.play();
    }
    this.setState({ playState: PLAY_STATUS.PLAY });
  };
  
  pauseAll = () => {
    this.props.tooglePlayMode(PLAY_MODES.ALL);
    this.maxVideoEl.pause()
    const videos = this.props.videos;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.pause();
    }
    this.setState({ playState: PLAY_STATUS.PAUSE });
  };
  
  stopAll = () => {
    this.props.tooglePlayMode(PLAY_MODES.SINGLE);
    this.maxVideoEl.pause()
    this.maxVideoEl.currentTime = 0
    const videos = this.props.videos;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.pause();
      videoEl.currentTime = 0;
    }
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
    
    this.maxVideoEl.currentTime = t    
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.currentTime = t;
    }
    this.setState({ currentTime: t });
  };
  
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////// event listeners /////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  timelineOnChangeListener = () => {
    const val = this.timelineEl.value;

    this.maxVideoEl.removeEventListener("timeupdate", this.timeUpdateListener);

    let ct = Math.round((this.state.totalTime * val) / 100);
    const videos = this.props.videos;

    this.maxVideoEl.currentTime = ct
    for (let i = 0; i < videos.length; i++) {
      let el = document.getElementById(videos[i].id + videos[i].name);
      const d = el.duration;
      const t = parseInt((d * val) / 100);
      el.currentTime = t;
    }

    this.setState({ currentTime: ct });
    this.maxVideoEl.addEventListener("timeupdate", this.timeUpdateListener);
  };

  timeUpdateListener = () => {
    const maxV = this.state.maxVideo
    
    let t = parseInt(this.maxVideoEl.currentTime);
    let p = (t / parseInt(maxV.duration)) * 100;
    this.setState({ currentTime: t });
    this.timelineEl.value = p

  };

  render() {
    return (
      <div className={classes.controlPanel}>
        <div id="controlPanel_progressBar" className={classes.progressBar}>
          <input
            id="control_panel_timeline"
            type="range"
            className={classes.inputRange__slider}
            min="0"
            max="100"
            step="0.01"
          />
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

        <video
          controls
          width="500px"
          id="control_panel_videoEl"
          style={{ display: "none" }}
          muted={true}
          controls={false}
          autoPlay={false}
        ></video>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  playState: state.videoReducer.playState,
  videos: state.videoReducer.videos,
});

export default connect(mapStateToProps, {
  tooglePlayMode,
})(ControlPanel);

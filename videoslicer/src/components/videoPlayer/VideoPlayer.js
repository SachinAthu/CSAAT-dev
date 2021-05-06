import React, { Component } from "react";

import classes from "./VideoPlayer.module.css";
import SingleVideoPlayerModal from "../modals/singleVideoPlayerModal/SingleVideoPlayerModal";

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
    this.timeout = null
  }

  componentDidMount() {
    const container = document.getElementById(
      this.props.video.id + this.props.video.name + "container"
    );
    container.addEventListener("mouseenter", this.createVideo);
    container.addEventListener("mouseleave", this.createImg);

    this.createImg();
  }

  componentWillUnmount() {
    const container = document.getElementById(
      this.props.video.id + this.props.video.name + "container"
    );
    const videoEl = container.querySelector("video");

    container.removeEventListener("mouseover", this.createVideo);
    container.removeEventListener("mouseout", this.createImg);
    if (videoEl) videoEl.remove();
  }

  /////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// functions /////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  createVideo = () => {
    this.timeout = setTimeout(() => {
      const container = document.getElementById(
        this.props.video.id + this.props.video.name + "container"
      );
  
      var videoEl = document.createElement("video");
      videoEl.setAttribute("key", this.props.key);
      videoEl.muted = true;
      videoEl.controls = false;
      videoEl.autoplay = false;
      var sourceEl = document.createElement("source");
      sourceEl.setAttribute(
        "src",
        "http://localhost:8000" + this.props.video.video
      );
      sourceEl.setAttribute("type", this.props.video.file_type);
      sourceEl.append("Video playing error");
      videoEl.appendChild(sourceEl);
  
      if (container.querySelectorAll("video").length === 0) {
        var shadowEl = container.querySelector('div')
        shadowEl.classList.add(`${classes.animate}`)
        videoEl.onloadeddata = function () {
          shadowEl.classList.remove(`${classes.animate}`)
          var figEl = container.querySelector("figure");
          if (figEl) container.removeChild(figEl);
          container.appendChild(videoEl);
          videoEl.play();
        };
      }

    }, 1000)

  };

  createImg = () => {
    clearTimeout(this.timeout)

    const container = document.getElementById(
      this.props.video.id + this.props.video.name + "container"
    );
    
    var shadowEl = container.querySelector('div')
    shadowEl.classList.remove(`${classes.animate}`)

    var figEl = document.createElement("figure");
    var imgEl = document.createElement("img");
    imgEl.setAttribute(
      "src",
      "https://cache.desktopnexus.com/thumbseg/2198/2198909-bigthumbnail.jpg"
    );
    imgEl.setAttribute("alt", "poster");
    figEl.appendChild(imgEl);

    if (container.querySelectorAll("figure").length === 0) {
      var videoEl = container.querySelector("video");
      if (videoEl) container.removeChild(videoEl);
      container.prepend(figEl);
    }
  };

  createThumbnail = () => {
    // var video = document.getElementById(
    //   this.props.video.id + this.props.video.name + "test"
    // );
    // video.setAttribute("src", "http://localhost:8000" + this.props.video.video);
    // video.setAttribute("type", this.props.video.file_type);
    // var container = document.getElementById(
    //   this.props.video.id + this.props.video.name + "container"
    // );
    // var canvas = container.querySelector("canvas");
    // video.addEventListener("loadeddata", function () {
    //   video.play();
    //   video.currentTime = 20;
    //   video.pause();
    //   var ctx = canvas.getContext("2d");
    //   ctx.drawImage(video, 0, 0);
    //   container.appendChild(canvas);
    //   setTimeout(() => {
    //     video.remove();
    //   }, 2000);
    // });
  };

  /////////////////////////////////////////////////////////////////////////////
  ////////////////////////////// event listeners //////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  render() {
    return (
      <div
        id={this.props.video.id + this.props.video.name + "container"}
        className={classes.container}
        onClick={this.onClickHandler}
      >
        <div className={classes.shadow}></div>
      </div>
    );
  }
}

export default VideoPlayer;

import React, { Component } from "react";

import classes from "./VideoPlayer.module.css";

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
    const imageEl = container.querySelector("figure");

    container.removeEventListener("mouseover", this.createVideo);
    container.removeEventListener("mouseout", this.createImg);
    if (videoEl) {
      videoEl.pause()
      videoEl.removeAttribute('src')
      videoEl.load()
      videoEl.remove()
    }
    if(imageEl){
      imageEl.remove()
    }
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
      videoEl.setAttribute("key", this.props.keyf);
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
    var imgPath = ''
    if(String(this.props.video.thumbnail).includes('http://localhost:8000')){
      imgPath = this.props.video.thumbnail
    }else{
      imgPath = 'http://localhost:8000' + this.props.video.thumbnail
    }
    imgEl.setAttribute("src", imgPath);
    imgEl.setAttribute("alt", "thumbnail");
    figEl.appendChild(imgEl);

    if (container.querySelectorAll("figure").length === 0) {
      var videoEl = container.querySelector("video");
      if (videoEl){
        videoEl.pause()
        videoEl.removeAttribute('src')
        // videoEl.load()
        container.removeChild(videoEl);
        videoEl.remove()
      } 
      container.prepend(figEl);
    }
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

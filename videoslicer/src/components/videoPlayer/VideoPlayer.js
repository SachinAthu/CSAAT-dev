import React, { Component } from "react";

import classes from "./VideoPlayer.module.css";
import SingleVideoPlayerModal from "../modals/singleVideoPlayerModal/SingleVideoPlayerModal";

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      loaded: false
    };
  }

  componentWillUnmount() {
    const el = document.getElementById(this.props.video.id + this.props.video.name)
    el.remove()
  }

  // open the video play modal
  onClickHandler = () => {
    if (!this.props.video.video) {
      return;
    }
    this.setState({ modal: true });
  };

  closeModalWindow = () => {
    this.setState({ modal: false });
  };

  // play video on mouse hover
  onMouseEnterHandler = () => {
    if (!this.props.video.video || !this.state.loaded) {
      return;
    }

    var video = document.getElementById(
      this.props.video.id + this.props.video.name
    );
    video.play();
  };

  // stop video on mouse leave
  onMouseLeaveHandler = () => {
    if (!this.props.video.video) {
      return;
    }

    var video = document.getElementById(
      this.props.video.id + this.props.video.name
    );
    video.pause();
    video.currentTime = 0;
  };

  onLoadedDataHandler = () => {
    this.setState({ loaded: true })
  }

  render() {
    return (
      <div className={classes.container}>
        <video
          key={this.props.key}
          id={this.props.video.id + this.props.video.name}
          className={classes.player} 
          onClick={this.onClickHandler}
          onMouseEnter={this.onMouseEnterHandler}
          onMouseLeave={this.onMouseLeaveHandler}
          onLoadedData={this.onLoadedDataHandler}
          autoPlay={false}
          controls={false}
          muted={true}
        >
          <source 
            src={"http://localhost:8000" + this.props.video.video} 
            type={this.props.video.file_type}
          ></source>
          Video playing error.
        </video>

        {this.state.modal ? (
          <SingleVideoPlayerModal
            video={this.props.video}
            close={this.closeModalWindow}
          />
        ) : null}
      </div>
    );
  }
}

export default VideoPlayer;

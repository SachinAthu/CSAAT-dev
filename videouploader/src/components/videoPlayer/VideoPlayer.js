import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import classes from "./VideoPlayer.module.css";
import SingleVideoPlayerModal from "../modals/singleVideoPlayerModal/SingleVideoPlayerModal";

import { PLAY_MODES } from "../../actions/Types";

class VideoPlayer extends Component {
  static propTypes = {
    playMode: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      loaded: false
    };
    this.timeout = null
  }

  componentWillUnmount() {
    const el = document.getElementById(this.props.video.id + this.props.video.name)
    if(el){
      el.pause()
      el.removeAttribute('src')
      el.load()
      el.remove()
    }
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
    this.timeout = setTimeout(() => {
      if (!this.props.video.video || !this.state.loaded) {
        return;
      }
      if (this.props.playMode === PLAY_MODES.SINGLE) {
        var video = document.getElementById(
          this.props.video.id + this.props.video.name
        );
        video.play();
      }
    }, 3000)
  };

  // stop video on mouse leave
  onMouseLeaveHandler = () => {
    clearTimeout(this.timeout)
    if (!this.props.video.video) {
      return;
    }
    if (this.props.playMode === PLAY_MODES.SINGLE) {
      var video = document.getElementById(
        this.props.video.id + this.props.video.name
      );
      video.pause();
      video.currentTime = 0;
    }
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
          poster={"http://localhost:8000" + this.props.video.thumbnail}
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

const mapStateToProps = (state) => ({
  playMode: state.videoReducer.playMode,
});

export default connect(mapStateToProps)(VideoPlayer);

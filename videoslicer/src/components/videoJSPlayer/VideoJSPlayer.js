import React, { Component } from "react";
import videojs from "video.js";

import "video.js/dist/video-js.min.css";
import "@videojs/themes/dist/forest/index.css";

class VideoJSPlayer extends Component {
  componentDidMount() {
    // instantiate Video.js
    const videoJsOptions = {
      autoplay: false,
      muted: true,
      controls: true,
      preload: "auto",
      inactivityTimeout: 0,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      loop: false,
      sources: [
        {
          src: "http://localhost:8000" + this.props.video.video,
          type: this.props.video.file_type,
        },
      ],
    };

    this.player = videojs(
      this.videoNode,
      videoJsOptions,
      function onPlayerReady() {
      }
    );
   
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
    URL.revokeObjectURL(this.url);
  }

  render() {
    return (
      <div>
        <div data-vjs-player>
          <video
            ref={(node) => (this.videoNode = node)}
            className="video-js vjs-theme-forest"
          ></video>
        </div>
      </div>
    );
  }
}

export default VideoJSPlayer;

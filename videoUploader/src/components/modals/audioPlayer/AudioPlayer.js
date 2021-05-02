import React, { Component } from "react";

import classes from "./AudioPlayer.module.css";
import ModalFrame from "../modalFrame/ModalFrame";

class AudioPlayer extends Component {
  render() {
    return (
      <ModalFrame player={true} close={this.props.close}>
        <div className={classes.container}>
          <div className={classes.pic}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M15 20.016v-8.016h-6v8.016h6zM14.859 10.031q0.469 0 0.797 0.328t0.328 0.797v9.703q0 0.469-0.328 0.797t-0.797 0.328h-5.719q-0.469 0-0.797-0.328t-0.328-0.797v-9.703q0-0.469 0.328-0.82t0.797-0.352zM12 0.984q1.875 0 4.125 0.938t3.609 2.297l-1.406 1.406q-2.625-2.625-6.328-2.625t-6.328 2.625l-1.406-1.406q3.234-3.234 7.734-3.234zM6.984 7.078q2.063-2.063 5.016-2.063t5.016 2.063l-1.453 1.406q-1.453-1.453-3.563-1.453t-3.563 1.453z"></path>
            </svg>
          </div>

          <audio controls>
            <source
              src={"http://localhost:8000" + this.props.audio.audio}
              type={this.props.audio.file_type}
            ></source>
            <p>Your browser does not support this audio type.</p>
          </audio>
        </div>
      </ModalFrame>
    );
  }
}

export default AudioPlayer;

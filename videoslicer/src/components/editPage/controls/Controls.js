import React, { useState } from "react";

import classes from "./Controls.module.css";

const PLAY_STATUS = {
  PLAY: "PLAY",
  PAUSE: "PAUSE",
  STOP: "STOP",
};

const Controls = (props) => {
  const [playState, setPlayState] = useState(PLAY_STATUS.STOP);

  const convertSec = (sec) => {
    try {
      let measuredTime = new Date(null);
      measuredTime.setSeconds(parseInt(sec)); // specify value of SECONDS
      let MHSTime = measuredTime.toISOString().substr(11, 8);
      return MHSTime;
    } catch (err) {
      return "00:00:00";
    }
  };

  return (
    <div className={classes.container}>
      <span className={classes.currentTime}>
        {convertSec(props.currentTime)}
      </span>

      <button onClick={props.backward} className={classes.backwardBtn}>
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

      {playState === PLAY_STATUS.PAUSE || playState === PLAY_STATUS.STOP ? (
        <button
          onClick={() => {
            setPlayState(PLAY_STATUS.PLAY);
            props.play();
          }}
          className={classes.playBtn}
        >
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

      {playState === PLAY_STATUS.PLAY ? (
        <button
          onClick={() => {
            setPlayState(PLAY_STATUS.PAUSE);
            props.pause();
          }}
          className={classes.pauseBtn}
        >
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

      <button
        onClick={() => {
            setPlayState(PLAY_STATUS.STOP);
            props.stop();
        }}
        className={classes.stopBtn}
      >
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

      <button onClick={props.forward} className={classes.forwardBtn}>
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

      <span className={classes.totalTime}>{convertSec(props.duration)}</span>
    </div>
  );
};

export default Controls;

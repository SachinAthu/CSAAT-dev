import React from "react";

import classes from "./ResultAlert.module.css";
import ModalFrame from "../modalFrame/ModalFrame";

const ResultAlert = (props) => {
  return (
    <ModalFrame close={() => props.close()}>
      <div className={classes.container}>
        <div className={classes.header}>
          <h3 className={props.res ? classes.success : classes.failed}>
            {props.res ? 'Successed!' : 'Failed!' }
          </h3>
          <span>
            {props.res ? 'Video sliced succesfully.' : 'An error occured.' }
          </span>
        </div>

        <div className={classes.actions}>
          <button
            type="button"
            className={`${classes.okbtn}`}
            onClick={props.close}
          >
            Ok
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}

export default ResultAlert;

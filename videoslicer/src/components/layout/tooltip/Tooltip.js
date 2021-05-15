import React, { Fragment } from "react";

import classes from "./Tooltip.module.css";
import ModalFrame from "../../modals/modalFrame/ModalFrame";

import {
  CHILD_TYPES,
  CSAAT_VIDEO_SLICE_CHILDTYPE,
} from "../../../actions/Types";

const Tooltip = (props) => {

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
    <ModalFrame close={props.close}>
      {props.obj ? (
        <div className={classes.container}>
          {localStorage.getItem(CSAAT_VIDEO_SLICE_CHILDTYPE) ===
          CHILD_TYPES.TYPICAL ? (
            <Fragment>
              <span>Child Unique No : {props.obj.child_unique_no}</span>
              <span>Child Sequence No : {props.obj.child_sequence_no}</span>
            </Fragment>
          ) : (
            <span>Child Clinic No : {props.obj.child_clinic_no}</span>
          )}
          <span>Child Name : {props.obj.child_name}</span>
          <span>Recorded Date : {props.obj.session_date}</span>
          <span>Camera : {props.obj.camera}</span>
          <span>Camera Angle : {props.obj.camera_angle}</span>
          <span>Duration : {convertSec(props.obj.duration)}</span>
          <span>Video Type : {props.obj.file_type}</span>
          <span>Video Extension : {props.obj.file_extension}</span>
        </div>
      ) : (
        <div className={classes.container}>
          <p>No data available</p>
        </div>
      )}
    </ModalFrame>
  );
};

export default Tooltip;

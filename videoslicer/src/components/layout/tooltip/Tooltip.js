import React, { Fragment, useEffect } from "react";

import classes from "./Tooltip.module.css";
import {
  CHILD_TYPES,
  CSAAT_VIDEO_SLICE_CHILDTYPE,
} from "../../../actions/Types";

const Tooltip = (props) => {
  useEffect(() => {});

  if (props.obj) {
    return (
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
        <span>Duration : {props.obj.duration}</span>
        <span>Video Type : {props.obj.file_type}</span>
        <span>Video Extension : {props.obj.file_extension}</span>
      </div>
    );
  } else {
    return (
      <div className={classes.container}>
        <p>No data available</p>
      </div>
    );
  }
};

export default Tooltip;

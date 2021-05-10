import React from "react";

import classes from "./BtnSpinner.module.css";

export default function BtnSpinner() {
  return (
    <div className={classes.lds_ring}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

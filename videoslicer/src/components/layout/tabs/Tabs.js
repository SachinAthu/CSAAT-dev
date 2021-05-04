import React from "react";

import classes from "./Tabs.module.css";

import { TABS } from "../../../actions/Types";

const Tabs = (props) => {
  const tabClick = (tab) => {
    var ct = document.getElementsByClassName(`${classes.container}`)[0];
    var tabs = ct.querySelectorAll("button");
    var selectedTab = document.getElementById(tab + "tab_btn");

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove(`${classes.selected}`);
    }
    selectedTab.classList.add(`${classes.selected}`);

    props.change(tab)
  };

  return (
    <div className={classes.container}>
      <button
        id={TABS.UNSLICED + "tab_btn"}
        onClick={() => tabClick(TABS.UNSLICED)}
        className={classes.selected}
        autoFocus
      >
        Unsliced
      </button>

      <button
        id={TABS.SLICED + "tab_btn"}
        onClick={() => tabClick(TABS.SLICED)}
      >
        Sliced
      </button>

      <button id={TABS.ALL + "tab_btn"} onClick={() => tabClick(TABS.ALL)}>
        All
      </button>
    </div>
  );
};

export default Tabs;

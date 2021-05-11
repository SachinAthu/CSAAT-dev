import React, { useState } from "react";

import classes from "./Search.module.css";

import {
  CSAAT_VIDEO_SLICE_CHILDTYPE,
  CHILD_TYPES,
} from "../../../actions/Types";

const Search = (props) => {
  const [val, setVal] = useState("");
  var timeout = null;

  const onClickHandler = (e) => {
    const field = document.getElementById("searchField");
    if (!field) {
      return;
    }
    if (val !== field.value) {
      props.click(field.value);
    }
    setVal(field.value);
  };

  const refreshHandler = () => {
    const field = document.getElementById("searchField");
    if(field){
      field.value = ''
    }
    setVal('')
    props.click('')
  }

  const toogleHelp = (option) => {
    const helpTextEl = document.getElementsByClassName(
      `${classes.helptext}`
    )[0];

    if (option === 1) {
      timeout = setTimeout(() => {
        helpTextEl.classList.add(`${classes.show}`);
      }, 1000);
    } else {
      clearTimeout(timeout);
      helpTextEl.classList.remove(`${classes.show}`);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.searchDiv}>
        <input
          id="searchField"
          name="searchField"
          placeholder="Search videos.."
          type="text"
        />

        <button onClick={onClickHandler}>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M9.516 14.016q1.875 0 3.188-1.313t1.313-3.188-1.313-3.188-3.188-1.313-3.188 1.313-1.313 3.188 1.313 3.188 3.188 1.313zM15.516 14.016l4.969 4.969-1.5 1.5-4.969-4.969v-0.797l-0.281-0.281q-1.781 1.547-4.219 1.547-2.719 0-4.617-1.875t-1.898-4.594 1.898-4.617 4.617-1.898 4.594 1.898 1.875 4.617q0 0.984-0.469 2.227t-1.078 1.992l0.281 0.281h0.797z"></path>
          </svg>
        </button>
      </div>

      <svg
        className={classes.help}
        onMouseOver={() => toogleHelp(1)}
        onMouseOut={() => toogleHelp(0)}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M18.984 3h-13.969q-0.844 0-1.43 0.586t-0.586 1.43v13.969q0 0.844 0.586 1.43t1.43 0.586h13.969q0.844 0 1.43-0.586t0.586-1.43v-13.969q0-0.844-0.586-1.43t-1.43-0.586zM12 18q-0.516 0-0.891-0.375t-0.375-0.891 0.375-0.891 0.891-0.375q0.563 0 0.914 0.375t0.352 0.891-0.352 0.891-0.914 0.375zM15 10.594q-0.563 0.844-1.055 1.242t-0.773 0.914q-0.141 0.234-0.188 0.492t-0.047 0.961h-1.828v-0.938t0.328-1.078q0.328-0.656 0.938-1.102t0.984-1.055q0.328-0.375 0.281-0.938t-0.445-0.984-1.195-0.422-1.219 0.492-0.563 1.008l-1.641-0.703q0.328-0.984 1.195-1.734t2.227-0.75q1.078 0 1.852 0.445t1.148 1.055q0.328 0.563 0.422 1.453t-0.422 1.641z"></path>
      </svg>

      <span className={classes.helptext}>
        Search children by{" "}
        {localStorage.getItem(CSAAT_VIDEO_SLICE_CHILDTYPE) ===
        CHILD_TYPES.TYPICAL
          ? "child unique no, child sequence no, "
          : "child clinic no, "}{" "}
        child name, session recorded date, camera, camera angle
      </span>

      <button onClick={refreshHandler} className={classes.refresh}>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <title>Refresh</title>
          <path d="M12 18v-3l3.984 3.984-3.984 4.031v-3q-3.281 0-5.648-2.367t-2.367-5.648q0-2.344 1.266-4.266l1.453 1.453q-0.703 1.266-0.703 2.813 0 2.484 1.758 4.242t4.242 1.758zM12 3.984q3.281 0 5.648 2.367t2.367 5.648q0 2.344-1.266 4.266l-1.453-1.453q0.703-1.266 0.703-2.813 0-2.484-1.758-4.242t-4.242-1.758v3l-3.984-3.984 3.984-4.031v3z"></path>
        </svg>
      </button>
    </div>
  );
};

export default Search;

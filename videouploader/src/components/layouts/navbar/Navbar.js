import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import classes from "./Navbar.module.css";
import logo from "../../../assets/img/logo.png";
import {
  CSAAT_VIDEO_UPLOAD_ACTIVE_NAV,
  NAV_LINKS,
} from "../../../actions/Types";
import { setNav } from "../../../actions/NavigationActions";

class Navbar extends Component {
  static propTypes = {
    setNav: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const el = document.getElementsByClassName(`${classes.nav}`)[0];
    const links = el.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener("click", this.setNav.bind(this, links[i]));
    }
  }

  componentWillUnmount() {
    const el = document.getElementsByClassName(`${classes.nav}`)[0];
    const links = el.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
      links[i].removeEventListener("click", this.setNav.bind(this, links[i]));
    }
    localStorage.removeItem(CSAAT_VIDEO_UPLOAD_ACTIVE_NAV);
  }

  setNav = (link) => {
    let l = "";

    switch (link.innerText) {
      case "Home":
        l = NAV_LINKS.NAV_HOME;
        break;
      case "Typical Children":
        l = NAV_LINKS.NAV_TYPICAL_CHILD;
        break;
      case "Atypical Children":
        l = NAV_LINKS.NAV_ATPICAL_CHILD;
        break;
      case "Cameras":
        l = NAV_LINKS.NAV_CAMERAS;
        break;
      case "Camera Angles":
        l = NAV_LINKS.NAV_CAMERA_ANGLES;
        break;
      default:
        return;
    }

    this.props.setNav(l);
    localStorage.setItem(CSAAT_VIDEO_UPLOAD_ACTIVE_NAV, l);

    this.removeSelected();
    link.classList.add(`${classes.nav_a_selected}`);
  };

  removeSelected = () => {
    const el = document.getElementsByClassName(`${classes.nav}`)[0];
    if (!el) return;
    const links = el.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
      links[i].classList.remove(`${classes.nav_a_selected}`);
    }
  };

  render() {
    let link = null;
    this.removeSelected();
    if (this.props.currentNav) {
      link = this.props.currentNav;
    } else {
      link = localStorage.getItem(CSAAT_VIDEO_UPLOAD_ACTIVE_NAV);
    }

    return (
      <div className={classes.container}>
        <div className={classes.logo}>
          <img src={logo} alt="logo" />

          <div className={classes.logo_1}>
            <h1 className={classes.logo_1_1}>CSAAT</h1>
            <h4 className={classes.logo_1_2}>Video Uploader</h4>
          </div>
        </div>

        <nav className={classes.nav}>
          <ul>
            <li className={classes.csaat_home}>
              <a href="http://127.0.0.1:8000">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.984 9.984h4.031q0-0.797-0.609-1.383t-1.406-0.586-1.406 0.586-0.609 1.383zM18.984 9.281l3 2.719h-3v8.016h-4.969v-6h-4.031v6h-4.969v-8.016h-3l9.984-9 3.984 3.609v-2.625h3v5.297z"></path>
                </svg>
                <span>CSAAT Home</span>
              </a>
            </li>

            <li className={classes.slicer_home}>
              <a href="http://127.0.0.1:8000/video-slicer" target="_blank" rel="noreferrer">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="28"
                  viewBox="0 0 26 28"
                >
                  <path d="M8.703 20h9.297v-9.297zM8 19.297l9.297-9.297h-9.297v9.297zM26 20.5v3c0 0.281-0.219 0.5-0.5 0.5h-3.5v3.5c0 0.281-0.219 0.5-0.5 0.5h-3c-0.281 0-0.5-0.219-0.5-0.5v-3.5h-13.5c-0.281 0-0.5-0.219-0.5-0.5v-13.5h-3.5c-0.281 0-0.5-0.219-0.5-0.5v-3c0-0.281 0.219-0.5 0.5-0.5h3.5v-3.5c0-0.281 0.219-0.5 0.5-0.5h3c0.281 0 0.5 0.219 0.5 0.5v3.5h13.297l3.844-3.859c0.203-0.187 0.516-0.187 0.719 0 0.187 0.203 0.187 0.516 0 0.719l-3.859 3.844v13.297h3.5c0.281 0 0.5 0.219 0.5 0.5z"></path>
                </svg>
                <span>Video Slicer</span>
              </a>
            </li>

            <li
              className={
                link === NAV_LINKS.NAV_HOME ? classes.nav_li_selected : null
              }
            >
              <Link to="/">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.984 20.016h-4.969v-8.016h-3l9.984-9 9.984 9h-3v8.016h-4.969v-6h-4.031v6z"></path>
                </svg>
                <span>Home</span>
              </Link>
            </li>

            <li
              className={
                link === NAV_LINKS.NAV_TYPICAL_CHILD
                  ? classes.nav_li_selected
                  : null
              }
            >
              <Link to="/t_children">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.984 8.016q0-1.125-0.539-2.039t-1.43-1.453-2.016-0.539-2.016 0.539-1.43 1.453-0.539 2.039q0 1.078 0.539 1.992t1.43 1.453 2.016 0.539 2.016-0.539 1.43-1.453 0.539-1.992zM15 9.984v2.016h3v3h2.016v-3h3v-2.016h-3v-3h-2.016v3h-3zM0.984 18v2.016h16.031v-2.016q0-0.797-0.563-1.43t-1.477-1.125-1.992-0.797-2.133-0.469-1.852-0.164-1.852 0.164-2.133 0.469-1.992 0.797-1.477 1.125-0.563 1.43z"></path>
                </svg>
                <span>Typical Children</span>
              </Link>
            </li>

            <li
              className={
                link === NAV_LINKS.NAV_ATPICAL_CHILD
                  ? classes.nav_li_selected
                  : null
              }
            >
              <Link to="/at_children">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.016 8.016q0-1.125-0.539-2.039t-1.453-1.453-2.039-0.539q-1.078 0-1.992 0.539t-1.453 1.453-0.539 2.039q0 1.078 0.539 1.992t1.453 1.453 1.992 0.539q1.125 0 2.039-0.539t1.453-1.453 0.539-1.992zM17.016 9.984v2.016h6v-2.016h-6zM2.016 18v2.016h15.984v-2.016q0-0.797-0.563-1.43t-1.477-1.125-1.992-0.797-2.133-0.469-1.852-0.164-1.828 0.164-2.109 0.469-1.992 0.797-1.477 1.125-0.563 1.43z"></path>
                </svg>
                <span>Atypical Children</span>
              </Link>
            </li>

            <li
              className={
                link === NAV_LINKS.NAV_CAMERAS ? classes.nav_li_selected : null
              }
            >
              <Link to="/cameras">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.016q2.063 0 3.539-1.477t1.477-3.539-1.477-3.539-3.539-1.477-3.539 1.477-1.477 3.539 1.477 3.539 3.539 1.477zM9 2.016h6l1.828 1.969h3.188q0.797 0 1.383 0.609t0.586 1.406v12q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-12q0-0.797 0.586-1.406t1.383-0.609h3.188zM8.813 12q0-1.313 0.938-2.25t2.25-0.938 2.25 0.938 0.938 2.25-0.938 2.25-2.25 0.938-2.25-0.938-0.938-2.25z"></path>
                </svg>
                <span>Cameras</span>
              </Link>
            </li>

            <li
              className={
                link === NAV_LINKS.NAV_CAMERA_ANGLES
                  ? classes.nav_li_selected
                  : null
              }
            >
              <Link to="/camera_angles">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 15.516l3.516-3.516-3.516-3.516v2.531h-6v-2.531l-3.516 3.516 3.516 3.516v-2.531h6v2.531zM20.016 3.984q0.797 0 1.383 0.609t0.586 1.406v12q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-12q0-0.797 0.586-1.406t1.383-0.609h3.188l1.828-1.969h6l1.828 1.969h3.188z"></path>
                </svg>
                <span>Camera Angles</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className={classes.copyright}>
          <span className={classes.copyright_1}>
            &copy; Copyright <strong>CSAAT</strong>
          </span>
          <span className={classes.copyright_2}>All Rights Reserved</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentNav: state.navigationReducer.currentNav,
});

export default connect(mapStateToProps, { setNav })(Navbar);

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import classes from "./Homepage.module.css";
import { setNav } from "../../actions/NavigationActions";
import { NAV_LINKS, CSAAT_VIDEO_SLICE_ACTIVE_NAV, CHILD_TYPES } from "../../actions/Types";
import { Link } from "react-router-dom";
import HomePageImg from '../../assets/svg/homepage.svg'

class Homepage extends Component {
  static propTypes = {
    setNav: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.setNav(NAV_LINKS.NAV_HOME);
    localStorage.setItem(CSAAT_VIDEO_SLICE_ACTIVE_NAV, NAV_LINKS.NAV_HOME);
  }

  render() {
    return (
      <div className={classes.container}>
        <h1>Slice Videos</h1>

        <div className={classes.tasks}>
          <Link to="/t_videos"
          >
            &#10146; <span>Slice Typical Children Videos</span>
          </Link>

          <Link to="/">
            &#10146; <span>Slice Atypical Children Videos</span>
          </Link>
        </div>

        <div className={classes.image}>
          <img src={HomePageImg} alt="homepage" />
        </div>
      </div>
    );
  }
}

export default connect(null, { setNav })(Homepage);

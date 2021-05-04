import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import classes from "./Homepage.module.css";
import { setNav } from "../../actions/NavigationActions";
import { NAV_LINKS, CSAAT_VIDEO_UPLOAD_ACTIVE_NAV, CHILD_TYPES } from "../../actions/Types";
import { Link } from "react-router-dom";
import HomePageImg from '../../assets/svg/homepage.svg'

class Homepage extends Component {
  static propTypes = {
    setNav: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.setNav(NAV_LINKS.NAV_HOME);
    localStorage.setItem(CSAAT_VIDEO_UPLOAD_ACTIVE_NAV, NAV_LINKS.NAV_HOME);
  }

  render() {
    return (
      <div className={classes.container}>
        <h1>Upload Videos</h1>

        <div className={classes.tasks}>
          <Link to="/t_children">
            &#10146; <span>Upload Typical Children Videos</span>
          </Link>

          <Link to="/at_children">
            &#10146; <span>Upload Atypical Children Videos</span>
          </Link>
          
          <Link to="/cameras">
            &#10146; <span>Configure Camera Details</span>
          </Link>
          
          <Link to="/camera_angles">
            &#10146; <span>Configure Camera Angle Details</span>
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

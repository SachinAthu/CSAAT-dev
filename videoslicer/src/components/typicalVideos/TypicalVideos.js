import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import classes from "./TypicalVideos.module.css";
import Breadcrumbs from "../layout/breadcrumbs/Breadcrumbs";
import EmptySVG from "../../assets/svg/empty.svg";
import { BASE_URL } from "../../config";
import ErrorBoundry from "../../ErrorBoundry";
import PageSpinner from "../layout/spinners/page/PageSpinner";
import Search from "../layout/search/Search";
import Tabs from "../layout/tabs/Tabs";
import VideoGridIItem from "../layout/videoGridItem/VideoGridIItem";

import { getVideos, deleteVideos } from "../../actions/VideoActions";
import { setNav } from "../../actions/NavigationActions";
import {
  CSAAT_VIDEO_SLICE_ACTIVE_NAV,
  NAV_LINKS,
  TABS,
} from "../../actions/Types";

class TypicalVideos extends Component {
  static propTypes = {
    videos: PropTypes.array.isRequired,
    getVideos: PropTypes.func.isRequired,
    deleteVideos: PropTypes.func.isRequired,
    setNav: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      nextLink: null,
      prevLink: null,
      isSearching: false,
      loading: false,
    };
    this.lastClick = 0;
  }

  componentDidMount() {
    // clear redux store
    this.props.deleteVideos();

    // set navigation link
    this.props.setNav(NAV_LINKS.NAV_TYPICAL_VIDEO);
    localStorage.setItem(
      CSAAT_VIDEO_SLICE_ACTIVE_NAV,
      NAV_LINKS.NAV_TYPICAL_VIDEO
    );

    this.fetchVideos();

    document.addEventListener("scroll", this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.trackScrolling);
  }

  //////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////// functions //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  // set on scroll event
  trackScrolling = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 120
    ) {
      // fetch more records
      if (!this.state.isSearching) {
        //this.fetchVideos();
      }
    }
  };

  fetchVideos = () => {
    var delay = 20;
    if (this.lastClick >= Date.now() - delay) {
      return;
    }
    this.lastClick = Date.now();

    let url = `${BASE_URL}/videos/`;
    if (this.props.videos.length == 0) {
      this.setState({ loading: true });
    }
    axios
      .get(url)
      .then((res) => {
        const data = res.data;
        this.props.getVideos(data);
        this.setState({
          count: data.count,
          prevLink: data.previous,
          nextLink: data.next,
          loading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  tabChange = (tab) => {
    console.log(tab);
  };

  //////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// event listeners ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  searchValChange = (e) => {
    const val = e.target.value;
  };

  render() {
    const videos = this.props.videos;
    const sub_links = [{ name: "Home", link: "/" }];

    return (
      <Fragment>
        <Breadcrumbs
          heading="Typical Videos"
          sub_links={sub_links}
          current="Typical Videos"
          state={null}
        />

        <div className="container">
          <div className={classes.filterDiv}>
            <Tabs change={(tab) => this.tabChange(tab)} />

            <Search change={(e) => this.searchValChange(e)} />
          </div>

          {videos && videos.length > 0 ? (
            <div className={classes.videoGrid}>
              {videos.map((v, i) => (
                <VideoGridIItem key={i} video={v} history={this.props.history} />
              ))}
            </div>
          ) : (
            <div className={classes.emptyDiv}>
              <img src={EmptySVG} alt="No videos" />
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  videos: state.videoReducer.videos,
});

export default connect(mapStateToProps, { getVideos, deleteVideos, setNav })(
  TypicalVideos
);

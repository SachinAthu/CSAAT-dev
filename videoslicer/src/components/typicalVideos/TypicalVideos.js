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
  CSAAT_VIDEO_SLICE_CHILDTYPE,
  CHILD_TYPES,
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
      tab: ''
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

    // set the child type
    localStorage.setItem(CSAAT_VIDEO_SLICE_CHILDTYPE, CHILD_TYPES.TYPICAL);

    this.fetchVideos(`${BASE_URL}/us-videos/`);

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
        if(this.state.nextLink){
          this.fetchVideos(this.state.nextLink);
        }
      }
    }
  };

  fetchVideos = (url) => {
    var delay = 20;
    if (this.lastClick >= Date.now() - delay) {
      return;
    }
    this.lastClick = Date.now();

    if (this.props.videos && this.props.videos.length == 0) {
      this.setState({ loading: true });
    }
    axios
      .get(url)
      .then((res) => {
        const data = res.data;
        this.props.getVideos(data.results);
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
    this.setState({ tab: tab })
    this.props.deleteVideos();

    let url = "";
    switch (tab) {
      case TABS.ALL:
        url = `${BASE_URL}/videos/`;
        break;
      case TABS.SLICED:
        url = `${BASE_URL}/s-videos/`;
        break;
      case TABS.UNSLICED:
        url = `${BASE_URL}/us-videos/`;
        break;
      default:
        return;
    }

    this.fetchVideos(url);
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

          {this.state.loading ? (
            <div className={classes.loading_div}>
              <PageSpinner />
            </div>
          ) : (
            <Fragment>
              {videos && videos.length > 0 ? (
                <div className={classes.videoGrid}>
                  {/* <VideoGridIItem video={videos[0]} history={this.props.history} /> */}
                  {videos.map((v, i) => (
                    <VideoGridIItem
                      key={i}
                      video={v}
                      history={this.props.history}
                      tab={this.state.tab}
                    />
                  ))}
                </div>
              ) : (
                <div className={classes.emptyDiv}>
                  <img src={EmptySVG} alt="No videos" />
                  <h6>There are no records available</h6>
                </div>
              )}
            </Fragment>
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

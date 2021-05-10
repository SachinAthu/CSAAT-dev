import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import classes from "../../assets/css/VideoGridView.module.css";
import Breadcrumbs from "../layout/breadcrumbs/Breadcrumbs";
import EmptySVG from "../../assets/svg/empty.svg";
import { BASE_URL } from "../../config";
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

class AtypicalVideos extends Component {
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
      tab: TABS.UNSLICED
    };
    this.lastClick = 0;
    this.searchVal = ''
    this.timeout = null
  }

  componentDidMount() {
    this.mounted = true

    // clear redux store
    this.props.deleteVideos();

    // set navigation link
    this.props.setNav(NAV_LINKS.NAV_ATPICAL_VIDEO);
    localStorage.setItem(
      CSAAT_VIDEO_SLICE_ACTIVE_NAV,
      NAV_LINKS.NAV_ATPICAL_VIDEO
    );

    // set the child type
    localStorage.setItem(CSAAT_VIDEO_SLICE_CHILDTYPE, CHILD_TYPES.ANTYPICAL);

    this.fetchVideos(`${BASE_URL}/at-us-videos/`);

    document.addEventListener("scroll", this.trackScrolling);
  }

  componentWillUnmount() {
    this.mounted = false
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

  fetchVideos = async (url) => {
    if(!this.mounted) return

    var delay = 20;
    if (this.lastClick >= Date.now() - delay) {
      return;
    }
    this.lastClick = Date.now();

    if (this.props.videos && this.props.videos.length === 0) {
      this.setState({ loading: true });
    }

    try{
      const res = await axios.get(url)
      const data = res.data;
      this.props.getVideos(data.results);
      this.setState({
        count: data.count,
        prevLink: data.previous,
        nextLink: data.next,
        loading: false,
      });
    }catch(err) {
      // console.log(err);
      this.setState({ loading: false });
    }
    
  };

  filterVideos = async (val) => {
    if(!this.mounted) return
    
    // clearTimeout(this.timeout)
    // this.timeout = null

    let url = ''
    switch (this.state.tab) {
      case TABS.ALL:
        url = `${BASE_URL}/at-f-videos/?search=${val}`;
        break;
      case TABS.SLICED:
        url = `${BASE_URL}/at-s-f-videos/?search=${val}`;
        break;
      case TABS.UNSLICED:
        url = `${BASE_URL}/at-us-f-videos/?search=${val}`;
        break;
      default:
        // console.log('not match')
        return;
    }
    this.setState({ loading: true })

    try{
      const res = await axios.get(url)
      this.setState({ loading: false });
      // console.log(res.data)
      this.props.getVideos(res.data);
    }catch(err) {
      // console.log(err)
    }

  }

  tabChange = (tab) => {
    this.setState({ tab: tab })
    this.props.deleteVideos();

    let url = "";
    switch (tab) {
      case TABS.ALL:
        url = `${BASE_URL}/at-videos/`;
        break;
      case TABS.SLICED:
        url = `${BASE_URL}/at-s-videos/`;
        break;
      case TABS.UNSLICED:
        url = `${BASE_URL}/at-us-videos/`;
        break;
      default:
        return;
    }

    this.fetchVideos(url);
  };

  //////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// event listeners ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  search = (val) => {
    // this.searchVal = val
    // console.log(this.timeout)
    // if(this.timeout) return

    // this.timeout = setTimeout(() => {
    // }, 500)
    
    this.setState({ count: 0, prevLink: null, nextLink: null })
    this.props.deleteVideos()
  
    if(val === ""){
      // load all data
      this.setState({ isSearching: false })
      let url = ''
      switch (this.state.tab) {
        case TABS.ALL:
          url = `${BASE_URL}/at-videos/`;
          break;
        case TABS.SLICED:
          url = `${BASE_URL}/at-s-videos/`;
          break;
        case TABS.UNSLICED:
          url = `${BASE_URL}/at-us-videos/`;
          break;
        default:
          return;
      }
      this.fetchVideos(url)
    }else{
      // load filtered data
      this.setState({ isSearching: true })
      this.filterVideos(val)
    }

  };
  
  render() {
    const videos = this.props.videos;
    const sub_links = [{ name: "Home", link: "/" }];

    return (
      <Fragment>
        <Breadcrumbs
          heading="Atypical Videos"
          sub_links={sub_links}
          current="Atypical Videos"
          state={null}
        />

        <div className="container">
          <div className={classes.filterDiv}>
            <Tabs change={(tab) => this.tabChange(tab)} />

            <Search click={(val) => this.search(val)} />
          </div>

          <div className={classes.countDiv}>
            {this.state.isSearching ? (
              <span>Showing {this.props.videos.length} records</span>
            ) : (
              <span>
                Showing {this.props.videos.length} out of {this.state.count}{" "}
                records
              </span>
            )}
          </div>

          {this.state.loading ? (
            <div className={classes.loading_div}>
              <PageSpinner />
            </div>
          ) : (
            <Fragment>
              {videos && videos.length > 0 ? (
                <div className={classes.videoGrid}>
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
  AtypicalVideos
);

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import classes from "./VideoGridIItem.module.css";
import VideoPlayer from "../../videoPlayer/VideoPlayer";
import Tooltip from "../tooltip/Tooltip";
import { BASE_URL } from "../../../config";
import SingleVideoPlayerModal from '../../modals/singleVideoPlayerModal/SingleVideoPlayerModal'

import { CHILD_TYPES, CSAAT_VIDEO_SLICE_CHILDTYPE, TABS, CSAAT_VIDEO_SLICE_ACTIVE_VIDEO } from "../../../actions/Types";

const VideoGridIItem = (props) => {
  const [tooltipObj, setTooltipObj] = useState(null);
  const [tooltip, setTooltip] = useState(false);
  const [modal, setModal] = useState(false)
  const timeout = useRef(null);
  const mounted = useRef(false)
  
  useEffect(() => {
    mounted.current = true

    return() => {
      mounted.current = false
    }
  }, [])

  const selectVideo = () => {
    let pathname = ''
    const childType = localStorage.getItem(CSAAT_VIDEO_SLICE_CHILDTYPE)
    localStorage.setItem(CSAAT_VIDEO_SLICE_ACTIVE_VIDEO, props.video.id)

    if(childType === CHILD_TYPES.TYPICAL){
      pathname = `/t_videos/${props.video.id}`
    }else{
      pathname = `/at_videos/${props.video.id}`
    }
    props.history.push({
      pathname: pathname,
    });
  };

  const toogleTooltip = async (option) => {
    if(!mounted.current) return

    if (option === 1) {
      timeout.current = setTimeout(() => {
        try{
          const res = axios.get(`${BASE_URL}/video-info/${props.video.id}/`)
          setTooltipObj(res.data);
          setTimeout(() => {
            setTooltip(true)
          }, 200);
        }catch(err) {
          // console.log(err)
        }
      }, 1000);
    } else {
      // console.log('out')
      clearTimeout(timeout.current);
      setTooltip(false)
    }
  };

  // open the video play modal
  const onClickHandler = () => {
    if (!props.video.video) {
      return;
    }
    setModal(true)
  };

  const closeModalWindow = () => {
    setModal(false)
  };

  return (
    <div className={classes.container}>
      <div className={classes.player} onClick={onClickHandler}>
        <VideoPlayer keyf={props.video.id} video={props.video} />
      </div>

      <div className={classes.info}>
        {props.tab === TABS.ALL ? (
          <div className={classes.info_1}>
            {props.video.sliced ? (
              <svg
                className={classes.yes}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="28"
                viewBox="0 0 24 28"
              >
                <path d="M10.703 20.297l9.594-9.594c0.391-0.391 0.391-1.016 0-1.406l-1.594-1.594c-0.391-0.391-1.016-0.391-1.406 0l-7.297 7.297-3.297-3.297c-0.391-0.391-1.016-0.391-1.406 0l-1.594 1.594c-0.391 0.391-0.391 1.016 0 1.406l5.594 5.594c0.391 0.391 1.016 0.391 1.406 0zM24 6.5v15c0 2.484-2.016 4.5-4.5 4.5h-15c-2.484 0-4.5-2.016-4.5-4.5v-15c0-2.484 2.016-4.5 4.5-4.5h15c2.484 0 4.5 2.016 4.5 4.5z"></path>
              </svg>
            ) : (
              <svg
                className={classes.no}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
              >
                <path d="M18.359 20.641l2.281-2.281c0.203-0.203 0.203-0.516 0-0.719l-3.641-3.641 3.641-3.641c0.203-0.203 0.203-0.516 0-0.719l-2.281-2.281c-0.203-0.203-0.516-0.203-0.719 0l-3.641 3.641-3.641-3.641c-0.203-0.203-0.516-0.203-0.719 0l-2.281 2.281c-0.203 0.203-0.203 0.516 0 0.719l3.641 3.641-3.641 3.641c-0.203 0.203-0.203 0.516 0 0.719l2.281 2.281c0.203 0.203 0.516 0.203 0.719 0l3.641-3.641 3.641 3.641c0.203 0.203 0.516 0.203 0.719 0zM28 4.5v19c0 1.375-1.125 2.5-2.5 2.5h-23c-1.375 0-2.5-1.125-2.5-2.5v-19c0-1.375 1.125-2.5 2.5-2.5h23c1.375 0 2.5 1.125 2.5 2.5z"></path>
              </svg>
            )}
          </div>
        ) : null}

        <div
          className={classes.details}
          onMouseEnter={() => toogleTooltip(1)}
          onMouseLeave={() => toogleTooltip(0)}
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M18.984 3h-13.969q-0.844 0-1.43 0.586t-0.586 1.43v13.969q0 0.844 0.586 1.43t1.43 0.586h13.969q0.844 0 1.43-0.586t0.586-1.43v-13.969q0-0.844-0.586-1.43t-1.43-0.586zM12 18q-0.516 0-0.891-0.375t-0.375-0.891 0.375-0.891 0.891-0.375q0.563 0 0.914 0.375t0.352 0.891-0.352 0.891-0.914 0.375zM15 10.594q-0.563 0.844-1.055 1.242t-0.773 0.914q-0.141 0.234-0.188 0.492t-0.047 0.961h-1.828v-0.938t0.328-1.078q0.328-0.656 0.938-1.102t0.984-1.055q0.328-0.375 0.281-0.938t-0.445-0.984-1.195-0.422-1.219 0.492-0.563 1.008l-1.641-0.703q0.328-0.984 1.195-1.734t2.227-0.75q1.078 0 1.852 0.445t1.148 1.055q0.328 0.563 0.422 1.453t-0.422 1.641z"></path>
          </svg>
        </div>

        <button className={classes.select_btn} onClick={selectVideo}>
          Slice
        </button>
      </div>

      {tooltip ? <Tooltip obj={tooltipObj} /> : null}
      
      {modal ? (
          <SingleVideoPlayerModal
            video={props.video}
            close={closeModalWindow}
          />
        ) : null}
    </div>
  );
};

export default VideoGridIItem;

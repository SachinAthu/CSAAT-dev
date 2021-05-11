import { DELETE_VIDEOS, FETCH_VIDEOS } from "./Types";

// get all videos
export const getVideos = (videos) => (dispatch, getState) => {
  dispatch({
    type: FETCH_VIDEOS,
    data: videos,
  });
};

// delete all videos
export const deleteVideos = () => (dispatch, getState) => {
  dispatch({
    type: DELETE_VIDEOS,
  });
};

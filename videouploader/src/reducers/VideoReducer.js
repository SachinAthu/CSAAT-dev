import {
  FETCH_VIDEOS,
  ADD_VIDEO,
  DELETE_VIDEO,
  DELETE_VIDEOS,
  PLAY_MODES,
  TOOGLE_PLAY_MODE,
} from "../actions/Types";

const initialState = {
  videos: [],
  playMode: PLAY_MODES.SINGLE,
  readyPlayerCount: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_VIDEOS:
      return {
        ...state,
        videos: action.data,
      };

    case ADD_VIDEO:
      let v = [...state.videos];
      v.push(action.data);
      return {
        ...state,
        videos: v,
      };

    case DELETE_VIDEO:
      return {
        ...state,
        videos: state.videos.filter((video) => video.id !== action.data),
      };

    case DELETE_VIDEOS:
      return {
        ...state,
        videos: [],
      };

    case TOOGLE_PLAY_MODE:
      return {
        ...state,
        playMode: action.data,
      };

    default:
      return state;
  }
}

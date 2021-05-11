import { DELETE_VIDEOS, FETCH_VIDEOS } from "../actions/Types";

const initialState = {
  videos: [],
};

function isDuplicate(arr, c) {
  for (let i = 0; i < arr.length; i++) {
    if (c.id === arr[i].id) {
      return true;
    }
  }
  return false;
}

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_VIDEOS:
      var videos = [...state.videos];

      if (videos.length > 0) {
        const d = [...action.data];
        for (let i = 0; i < d.length; i++) {
          if (!isDuplicate(videos, d[i])) {
            videos.push(d[i]);
          }
        }
      } else {
        videos = action.data;
      }

      return {
        ...state,
        videos: videos,
      };

    case DELETE_VIDEOS:
        return {
            ...state,
            videos: []
        }

    default:
      return state;
  }
}

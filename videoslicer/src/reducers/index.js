import { combineReducers } from "redux"

import VideoReducer from './VideoReducer.js'
import NavigationReducer from './NavigationReducer'

export default combineReducers({
    videoReducer: VideoReducer,
    navigationReducer: NavigationReducer,
})
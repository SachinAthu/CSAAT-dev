import React, { Component } from "react";
import axios from "axios";

import classes from "./DeleteConfirmAlert.module.css";
import ModalFrame from "../modalFrame/ModalFrame";
import { BASE_URL } from "../../../config";

class DeleteConfirmAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      isError: false,
    };
  }

  deleteVideoClip = async () => {
    this.setState({ deleting: true });
    
    try{
      var res = await axios.delete(`${BASE_URL}/delete-video-clip/${this.props.video_clip_id}/`)
      this.setState({ deleting: false });
      this.setState({ isError: false });

      // update video record
      res = await axios(`${BASE_URL}/update-video/${this.props.video_id}/`, {
      method: 'PUT',
      data: {
        "sliced": false
      },
      headers: {
        "Content-Type": "application/json",
      },
      })
      setTimeout(() => {
        this.props.close(true);
      }, 1000);
    }catch(err){
      // console.log(err)
      this.setState({ deleting: false });
      this.setState({ isError: true });
      setTimeout(() => {
        this.props.close(false);
      }, 1000);
    }

  };

  render() {
    return (
      <ModalFrame close={() => this.props.close(false)}>
        <div className={classes.container} id="deleteConfirmWindow">
          <div className={classes.header}>
            <h3>Delete ?</h3>
            <span>
              Are you sure you want to delete this video? You can't undo this action.
            </span>
          </div>

          <div className={classes.actions}>
            <button
              type="button"
              className={`.button_primary ${classes.deletebtn}`}
              onClick={this.deleteVideoClip}
            >
              {this.state.deleting ? "Deleting..." : "Delete"}
            </button>

            <button
              type="button"
              className={`.button_reset ${classes.cancelbtn}`}
              onClick={() => this.props.close()}
            >
              Cancel
            </button>
          </div>

          {this.state.isError ? (
            <span id="delete_result" className={classes.result}>
              Deletion failed!
            </span>
          ) : null}
        </div>
      </ModalFrame>
    );
  }
}

export default DeleteConfirmAlert;

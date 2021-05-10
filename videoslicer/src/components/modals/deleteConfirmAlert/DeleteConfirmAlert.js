import React, { Component } from "react";
import axios from "axios";

import classes from "./DeleteConfirmAlert.module.css";
import BtnSpinner from "../../layout/spinners/btn/BtnSpinner";
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

  deleteVideoClip = () => {
    this.setState({ deleting: true });

    axios.delete(`${BASE_URL}/delete-video-clip/${this.props.id}/`)
      .then((res) => {
        this.setState({ deleting: false });
        this.setState({ isError: false });
        setTimeout(() => {
          this.props.close(true);
        }, 1000);
      })
      .catch((err) => {
        // console.log(err)
        this.setState({ deleting: false });
        this.setState({ isError: true });
        setTimeout(() => {
          this.props.close(false);
        }, 1000);
      });

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
              {this.state.deleting ? <BtnSpinner /> : null}
              Delete
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

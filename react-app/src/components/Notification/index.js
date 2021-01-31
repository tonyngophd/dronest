import "./Notification.css";
import React from "react";
import { BsX } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { viewNotification } from "../../store/notifications";
import { useHistory } from "react-router-dom";
import { fetchSinglePost } from "../../store/posts";
import timeStamp from '../utils';

const Notification = ({ notif, onClose }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  let timestamp = timeStamp(new Date(notif.createdAt));

  const notifCloseHandler = () => {
    dispatch(viewNotification(notif));
  };

  const notifClickHandler = async () => {
    switch (notif.type) {
      case "follow":
        dispatch(viewNotification(notif));
        history.push(`/${notif.follower.username}`);
        return onClose();
      case "post":
        dispatch(viewNotification(notif));
        history.push(`/p/${notif.postId}`);
        return onClose();
      case "comment":
        dispatch(viewNotification(notif));
        history.push(`/p/${notif.postId}`);
        return onClose();
      default:
        break;
    }
  };

  return (
    <div className="notif-wrapper">
      <div className="notif-wrapper-left" onClick={notifClickHandler}>
        <img
          className="notif-pic"
          src={
            (notif.comment && notif.comment.commenterPic) ||
            (notif.follower && notif.follower.profilePicUrl) ||
            (notif.tagger && notif.tagger.user.profilePicUrl)
          }
        />
        <div className="notif-content">
          <div className="notif-middle">
            <div className="notif-username">
              {notif.comment && notif.comment.commenter}
              {notif.follower && notif.follower.username}
              {notif.tagger && notif.tagger.user.username}
            </div>
            <div className="notif-description">
              {notif.type === "follow" && "followed you"}
              {notif.type === "post" && "tagged you in a post"}
              {notif.type === "comment" && "tagged you in a comment"}
            </div>
          </div>
          <div className="notif-bottom">{timestamp}</div>
        </div>
      </div>

      <BsX onClick={notifCloseHandler} className="notif-x-button" />
    </div>
  );
};

export default Notification;

import "./Notification.css";
import React from "react";

const Notification = ({ notif }) => {
  let createdAt = new Date(notif.createdAt);
  let now = Date.now();
  let elapsed = now - createdAt;
  let timestamp;
  if (elapsed < 1000) {
    timestamp = `NOW`;
  } else if (elapsed < 60000) {
    timestamp = `${Math.floor(elapsed / 1000)} SECONDS AGO`;
  } else if (elapsed < 120000) {
    timestamp = `${Math.floor(elapsed / 60000)} MINUTE AGO`;
  } else if (elapsed < 3600000) {
    timestamp = `${Math.floor(elapsed / 60000)} MINUTES AGO`;
  } else if (elapsed < 7200000) {
    timestamp = `${Math.floor(elapsed / 3600000)} HOUR AGO`;
  } else if (elapsed < 86400000) {
    timestamp = `${Math.floor(elapsed / 3600000)} HOURS AGO`;
  } else {
    timestamp = createdAt.toDateString().split(" ").splice(1, 2).join(" ");
  }

  return (
    <div className="notif-wrapper">
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
  );
};

export default Notification;

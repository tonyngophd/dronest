import React, { useState } from "react";
import "./ProfilePost.css";

const ProfilePost = ({ pic }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      className="profile-post-pic-wrapper"
    >
      <img
        draggable="false"
        className={hover ? "profile-post-pic hovered" : "profile-post-pic"}
        src={pic.url}
      />
      <div
        className={
          hover
            ? "profile-post-pic-overlay hovered"
            : "profile-post-pic-overlay"
        }
      >
        <div className="profile-post-pic-overlay-inner">
          <i className="fas fa-heart"></i>
          {pic.likes}
        </div>
        <div className="profile-post-pic-overlay-inner">
          <i class="fas fa-comment"></i>
          {pic.comments}
        </div>
      </div>
    </div>
  );
};

export default ProfilePost;

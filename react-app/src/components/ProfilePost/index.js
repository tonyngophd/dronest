import React, { useState } from "react";
import "./ProfilePost.css";

const ProfilePost = ({ post }) => {
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
        src={post.images[0].imgUrl}
        alt="pic"
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
          {post.likingUsers.length}
        </div>
        <div className="profile-post-pic-overlay-inner">
          <i className="fas fa-comment"></i>
          {post.comments.length}
        </div>
      </div>
    </div>
  );
};

export default ProfilePost;

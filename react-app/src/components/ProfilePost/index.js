import React from "react";
import "./ProfilePost.css";

const ProfilePost = ({ pic }) => {
  return <img className="profile-post-pic" src={pic.url} />;
};

export default ProfilePost;

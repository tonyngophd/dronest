import React from "react";
import { NavLink } from "react-router-dom";
import "./ProfilePostsNav.css";

const ProfilePostsNav = () => {
  <div className="profile-posts-nav">
    <NavLink className="profile-posts-nav-option">Posts</NavLink>
    <NavLink className="profile-posts-nav-option">Tagged</NavLink>
  </div>;
};

export default ProfilePostsNav;

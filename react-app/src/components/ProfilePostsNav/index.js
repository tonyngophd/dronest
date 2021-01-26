import React from "react";
import { useParams, NavLink } from "react-router-dom";
import "./ProfilePostsNav.css";

const ProfilePostsNav = () => {
  const { username } = useParams();
  return (
    <div className="profile-posts-nav">
      <NavLink
        to={`/${username}`}
        className="profile-posts-nav-option"
        exact
        activeClassName="profile-posts-nav-option-active"
      >
        <i className="fas fa-th" /> POSTS
      </NavLink>
      <NavLink
        to={`/${username}/tagged`}
        className="profile-posts-nav-option"
        exact
        activeClassName="profile-posts-nav-option-active"
      >
        <i className="fas fa-user-tag"></i> TAGGED
      </NavLink>
    </div>
  );
};

export default ProfilePostsNav;

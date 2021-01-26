import React from "react";
import { useParams, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./ProfilePostsNav.css";

const ProfilePostsNav = () => {
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.session.user);
  const { username } = useParams();
  return (
    <div
      className={
        profile.user && user.id === profile.user.id
          ? "profile-posts-nav three"
          : "profile-posts-nav"
      }
    >
      <NavLink
        to={`/${username}`}
        className="profile-posts-nav-option"
        exact
        activeClassName="profile-posts-nav-option-active"
      >
        <i className="fas fa-th" /> POSTS
      </NavLink>
      {profile.user && user.id === profile.user.id && (
        <NavLink
          to={`/${username}/saved`}
          className="profile-posts-nav-option"
          exact
          activeClassName="profile-posts-nav-option-active"
        >
          <i className="fas fa-th" /> SAVED
        </NavLink>
      )}
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

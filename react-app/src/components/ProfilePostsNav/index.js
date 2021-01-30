import React from "react";
import { useParams, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./ProfilePostsNav.css";
import { BsGrid3X3, BsTag, BsHeart, BsBookmark } from "react-icons/bs";

const ProfilePostsNav = () => {
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.session.user);
  const { username } = useParams();
  return (
    <div
      className={
        profile.user && user.id === profile.user.id
          ? "profile-posts-nav four"
          : "profile-posts-nav"
      }
    >
      <NavLink
        to={`/${username}`}
        className="profile-posts-nav-option"
        exact
        activeClassName="profile-posts-nav-option-active"
      >
        <BsGrid3X3 /> POSTS
      </NavLink>
      {profile.user && user.id === profile.user.id && (
        <NavLink
          to={`/${username}/saved`}
          className="profile-posts-nav-option"
          exact
          activeClassName="profile-posts-nav-option-active"
        >
          <BsBookmark /> SAVED
        </NavLink>
      )}
      <NavLink
        to={`/${username}/tagged`}
        className="profile-posts-nav-option"
        exact
        activeClassName="profile-posts-nav-option-active"
      >
        <BsTag /> TAGGED
      </NavLink>
      {profile.user && user.id === profile.user.id && (
        <NavLink
          to={`/${username}/liked`}
          className="profile-posts-nav-option"
          exact
          activeClassName="profile-posts-nav-option-active"
        >
          <BsHeart /> LIKED
        </NavLink>
      )}
    </div>
  );
};

export default ProfilePostsNav;

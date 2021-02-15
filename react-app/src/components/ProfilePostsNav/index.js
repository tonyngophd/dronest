import React from "react";
import { useParams, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./ProfilePostsNav.css";
import { BsGrid3X3, BsTag, BsHeart, BsBookmark, BsCloudUpload } from "react-icons/bs";
import { FcFilmReel } from 'react-icons/fc';
import { FaFly } from 'react-icons/fa';
import { IoCreateOutline } from 'react-icons/io5';

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
      {profile.user && user.id === profile.user.id && (
        <NavLink
          to={`/users/${username}/create`}
          className="profile-posts-nav-option"
          exact
          activeClassName="profile-posts-nav-option-active"
        >
          <IoCreateOutline /> POST
        </NavLink>
      )}
      <NavLink
        to={`/users/${username}`}
        className="profile-posts-nav-option"
        exact
        activeClassName="profile-posts-nav-option-active"
      >
        {/* <BsGrid3X3 /> REELS */}
        <FcFilmReel /> REELS
      </NavLink>
      {profile.user && user.id === profile.user.id && (
        <NavLink
          to={`/users/${username}/saved`}
          className="profile-posts-nav-option"
          exact
          activeClassName="profile-posts-nav-option-active"
        >
          <BsBookmark /> SAVED
        </NavLink>
      )}
      <NavLink
        to={`/users/${username}/tagged`}
        className="profile-posts-nav-option"
        exact
        activeClassName="profile-posts-nav-option-active"
      >
        <BsTag /> TAGGED
      </NavLink>
      {profile.user && user.id === profile.user.id && (
        <NavLink
          to={`/users/${username}/liked`}
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

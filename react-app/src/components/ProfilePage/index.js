import "./ProfilePage.css";
import React, { useEffect, useState } from "react";
import { useParams, Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfilePostsNav from "../ProfilePostsNav";
import ProfileFeed from "../ProfileFeed";
import { fetchUserProfile } from "../../store/profile";

const ProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    dispatch(fetchUserProfile(username));
  }, [dispatch, username]);
  return (
    <div className="profile-page-container">
      {profile.user && (
        <div className="profile-info">
          <img
            draggable="false"
            src={`${profile.user.profilePicUrl}`}
            className="profile-pic"
          />
          <div className="profile-text">
            <div className="profile-username-and-button">
              <span className="profile-username">{profile.user.username}</span>
              {user.id !== profile.user.id && (
                <button className="profile-follow-button">Follow</button>
              )}
              {user.id === profile.user.id && (
                <button className="profile-edit-button">Edit Profile</button>
              )}
            </div>
            <div className="profile-numbers">
              <div className="profile-posts-numbers">
                <span className="profile-number">300</span>
                <span className="profile-number-text"> posts</span>
              </div>
              <Link
                to={`/${username}/followers`}
                className="profile-follower-numbers"
              >
                <span className="profile-number">500</span>
                <span className="profile-number-text"> followers</span>
              </Link>
              <Link
                to={`/${username}/following`}
                className="profile-follower-numbers"
              >
                <span className="profile-number">600</span>
                <span className="profile-number-text"> following</span>
              </Link>
            </div>
            <div className="profile-display-name">{profile.user.name}</div>
            <div className="profile-bio">{profile.user.bio}</div>
            <a
              className="profile-website-url"
              href={`${profile.user.websiteUrl}`}
            >
              {profile.user.websiteUrl}
            </a>
          </div>
        </div>
      )}
      {profile && <ProfilePostsNav />}
      {profile && <ProfileFeed />}
    </div>
  );
};

export default ProfilePage;

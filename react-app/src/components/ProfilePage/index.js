import "./ProfilePage.css";
import React, { useState } from "react";
import { useParams, Link, NavLink } from "react-router-dom";
import ProfilePostsNav from "../ProfilePostsNav";

const ProfilePage = () => {
  const { username } = useParams();
  // const profile = useSelector((state) => state.profile);
  // const user = useSelector((state) => state.session.user);
  return (
    <div className="profile-page-container">
      {/* {profile && ( */}
      <div className="profile-info">
        <img
          draggable="false"
          src="https://premcom.com/wp-content/uploads/2014/01/buffalo-bills-portfolio-logo.jpg"
          className="profile-pic"
        />
        <div className="profile-text">
          <div className="profile-username-and-button">
            <span className="profile-username">dbmille2</span>
            <button className="profile-follow-button">Follow</button>
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
          <div className="profile-display-name">Daniel Miller</div>
          <div className="profile-bio">This is where your bio goes</div>
          <a className="profile-website-url" href="http://google.com">
            google.com
          </a>
        </div>
      </div>
      {/* )} */}
      <ProfilePostsNav />
    </div>
  );
};

export default ProfilePage;

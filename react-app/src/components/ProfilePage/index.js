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
  const [numberOfFollowers, setNumberOfFollowers] = useState(0)
  const [numberOfFollowing, setNumberOfFollowing] = useState(0)
  const [numberOfOwnPosts, setNumberOfOwnPosts] = useState(0)

  useEffect(() => {
    dispatch(fetchUserProfile(username));
  }, [dispatch, username]);

  useEffect(() => {
    if(!profile.user) return;
    if(profile.user.followers && Array.isArray(profile.user.followers)){
      setNumberOfFollowers(profile.user.followers.length)
    }
    if(profile.user.following && Array.isArray(profile.user.following)){
      setNumberOfFollowing(profile.user.following.length)
    }
    if(profile.user.ownPosts && Array.isArray(profile.user.ownPosts)){
      setNumberOfOwnPosts(profile.user.ownPosts.length)
    }
  }, [profile]);

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
                <span className="profile-number">{numberOfOwnPosts}</span>
                <span className="profile-number-text"> posts</span>
              </div>
              <Link
                to={`/${username}/followers`}
                className="profile-follower-numbers"
              >
                <span className="profile-number">{numberOfFollowers}</span>
                <span className="profile-number-text"> followers</span>
              </Link>
              <Link
                to={`/${username}/following`}
                className="profile-follower-numbers"
              >
                <span className="profile-number">{numberOfFollowing}</span>
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

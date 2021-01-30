import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";

import './MiniProfile.css';

function MiniProfile({ user, imageSize = "60px" }) {
  const [numberOfFollowers, setNumberOfFollowers] = useState(0);
  const [numberOfFollowing, setNumberOfFollowing] = useState(0);
  const [numberOfOwnPosts, setNumberOfOwnPosts] = useState(0);

  useEffect(() => {
    if (!user) return;
    if (user.followers && Array.isArray(user.followers)) {
      setNumberOfFollowers(user.followers.length);
    }
    if (user.following && Array.isArray(user.following)) {
      setNumberOfFollowing(user.following.length);
    }
    if (user.ownPosts && Array.isArray(user.ownPosts)) {
      setNumberOfOwnPosts(user.ownPosts.length);
    }
  }, [user]);
  return (
    <div className='miniprofile-container-div'>
      <div className="user-row-left-div">
        <img
          className="user-row-profile-img"
          src={user.profilePicUrl}
          alt={`${user.username}-profile-pic`}
          style={{ width: imageSize, height: imageSize }}
          id={`${user.id}-userProfileImg`}
        />
        <div className="user-row-info-div">
          <div className="user-row-username">{user.username}</div>
          <div className="user-row-display-name">{user.name}</div>
        </div>
      </div>
      <div className="profile-numbers">
        <div className="profile-posts-numbers">
          <span className="profile-number">{numberOfOwnPosts}</span>
          <span className="profile-number-text"> posts</span>
        </div>
        <div
          className="profile-follower-numbers"
        // onClick={handleFollowersClick}
        >
          <span className="profile-number">{numberOfFollowers}</span>
          <span className="profile-number-text"> followers</span>
        </div>
        <div
          className="profile-follower-numbers"
        // onClick={handleFollowingClick}
        >
          <span className="profile-number">{numberOfFollowing}</span>
          <span className="profile-number-text"> following</span>
        </div>
      </div>
    </div>
  )
}

export default MiniProfile;

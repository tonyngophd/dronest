import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { IoImagesOutline } from 'react-icons/io5';

import './MiniProfile.css';
import { nanoid } from 'nanoid';

function MiniProfile({ user, imageSize = "60px", notFollowedYet = false, handleClick }) {
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

  const PostPreview = () => {
    return (
      <div className='mini-profile-images-div'>
        {
          numberOfOwnPosts && user.ownPosts.map(post => <img
            key={nanoid()}
            src={post.images[0].imgUrl}
            alt={post.images[0].imgUrl}
            className='mini-profile-image-preview'
          />)
        }
      </div>
    )
  }

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
      <hr />
      <div className="profile-numbers" style={{ marginLeft: "20px" }}>
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
      <hr />
      {
        numberOfOwnPosts ? <PostPreview /> :
          <div>
            <IoImagesOutline style={{ fontSize: '60px' }} />
            <div>No posts yet - posts will show here when user has</div>
          </div>
      }
    </div>
  )
}

export default MiniProfile;

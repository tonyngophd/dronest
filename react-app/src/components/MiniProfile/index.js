import React, { useState, useEffect } from "react";
import { IoImagesOutline } from "react-icons/io5";

import "./MiniProfile.css";
import { nanoid } from "nanoid";
import { MediaDisplayer } from '../utils';

function MiniProfile({
  hover,
  user,
  imageSize = "60px",
  notFollowedYet = false,
  handleClick,
  className = "miniprofile-container-div"
}) {
  const [numberOfFollowers, setNumberOfFollowers] = useState(0);
  const [numberOfFollowing, setNumberOfFollowing] = useState(0);
  const [numberOfOwnPosts, setNumberOfOwnPosts] = useState(0);
  const [numberOfLikeds, setNumberOfLikeds] = useState(0);
  const [numberOfVieweds, setNumberOfVieweds] = useState(0);
  const [numberOfDrones, setNumberOfDrones] = useState(0);


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
      if (user.ownPosts.length) {
        setNumberOfLikeds(user.ownPosts.map(p => p.likes).reduce((acum, current) => acum + current, 0));
        setNumberOfVieweds(user.ownPosts.map(p => p.views).reduce((acum, current) => acum + current, 0));
      }
    }
    if (user.equipmentList && Array.isArray(user.equipmentList)) {
      setNumberOfDrones(user.equipmentList.length);
    }
  }, [user]);

  const PostPreview = () => {
    return (
      <div className={"mini-profile-images-div"}>
        {numberOfOwnPosts &&
          user.ownPosts
            .slice(0, 3)
            .map((post) => (
              <MediaDisplayer
                key={nanoid()}
                mediaUrl={post.images[0].mediaUrl}
                imgClassname="mini-profile-image-preview"
                vidClassname="mini-profile-image-preview"
                light={true}
              />
            ))}
      </div>
    );
  };

  return (
    <div
      className={
        hover ? className : className + " hidden"
      }
      onClick={handleClick ? handleClick : () => { }}
    >
      <div className="user-row-left-div">
        <img
          className="user-row-profile-img"
          src={user.profilePicUrl}
          alt={`${user.username}-profile-pic`}
          style={{ width: imageSize, height: imageSize }}
          id={`${user.id}-userProfileImg`}
        />
        <div className="user-row-info-div popup">
          <div className="user-row-username">{user.username}</div>
          <div className="user-row-display-name popup">{user.name}</div>
          <div className="user-row-website">{user.websiteUrl}</div>
        </div>
      </div>
      <div
        className="profile-numbers popup"
        style={{ marginLeft: "20px", paddingTop: "5px", paddingBottom: "5px" }}
      >
        <div className="profile-posts-numbers">
          <span className="profile-number">{numberOfOwnPosts}</span>
          <span className="profile-number-text"> posts</span>
        </div>
        <div className="profile-posts-numbers">
          <span className="profile-number">{numberOfLikeds}</span>
          <span className="profile-number-text"> liked</span>
        </div>
        <div className="profile-posts-numbers">
          <span className="profile-number">{numberOfVieweds}</span>
          <span className="profile-number-text"> viewed</span>
        </div>
        <div className="profile-posts-numbers">
          <span className="profile-number">{numberOfDrones}</span>
          <span className="profile-number-text"> drones</span>
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
      {numberOfOwnPosts ? (
        <PostPreview />
      ) : (
          <div className="no-posts-placeholder">
            <IoImagesOutline style={{ fontSize: "60px" }} />
            <div>This user has no posts yet</div>
          </div>
        )}
    </div>
  );
}

export default MiniProfile;

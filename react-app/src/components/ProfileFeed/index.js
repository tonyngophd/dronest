import React from "react";
import { nanoid } from "nanoid";
import "./ProfileFeed.css";
import ProfilePost from "../ProfilePost";
import { useSelector } from "react-redux";

const ProfileFeed = ({ posts }) => {
  return (
    <div className="profile-feed">
      {posts.map((post) => (
        <ProfilePost post={post} key={nanoid()} />
      ))}
    </div>
  );
};

export default ProfileFeed;

import React from "react";
import { nanoid } from "nanoid";
import "./ExploreFeed.css";
import ProfilePost from "../ProfilePost";

const ExploreFeed = ({ posts }) => {
  return (
    <div className="explore-feed">
      {posts.map((post, index) => (
        <ProfilePost post={post} key={nanoid()} />
      ))}
    </div>
  );
};

export default ExploreFeed;

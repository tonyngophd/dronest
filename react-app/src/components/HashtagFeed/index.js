import React from "react";
import { nanoid } from "nanoid";
import "./HashtagFeed.css";
import ProfilePost from "../ProfilePost";

const HashtagFeed = ({ posts }) => {
  return (
    <div className="hashtag-feed">
      {posts.map((post) => (
        <ProfilePost post={post} key={nanoid()} />
      ))}
    </div>
  );
};

export default HashtagFeed;

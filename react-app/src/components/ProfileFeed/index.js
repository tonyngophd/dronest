import React from "react";
import { nanoid } from "nanoid";
import "./ProfileFeed.css";
import ProfilePost from "../ProfilePost";

const ProfileFeed = ({ posts, setShowPostModal }) => {
  return (
    <>
      {posts ? <div className="profile-feed">
        {posts
          .sort((a, b) =>
            new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
          )
          .map((post) => (
            <ProfilePost post={post} key={nanoid()} setShowPostModal={setShowPostModal}/>
          ))}
      </div> : <></>
      }
    </>
  );
};

export default ProfileFeed;

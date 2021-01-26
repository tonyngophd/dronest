import React from "react";
import "./ProfileFeed.css";
import ProfilePost from "../ProfilePost";

const ProfileFeed = () => {
  const pics = [
    {
      url: "https://placeimg.com/500/500",
      likes: 10,
      comments: 15,
    },
    {
      url: "https://placeimg.com/499/499",
      likes: "9,598",
      comments: "5,699",
    },
    {
      url: "https://placeimg.com/498/498",
      likes: 7,
      comments: 12,
    },
    {
      url: "https://placeimg.com/497/497",
      likes: 14,
      comments: 25,
    },
    {
      url: "https://placeimg.com/496/496",
      likes: 34,
      comments: 5,
    },
    {
      url: "https://placeimg.com/495/495",
      likes: 99,
      comments: 3,
    },
    {
      url: "https://placeimg.com/494/494",
      likes: 100,
      comments: 15,
    },
    {
      url: "https://placeimg.com/493/493",
      likes: 109,
      comments: 15,
    },
    {
      url: "https://placeimg.com/492/492",
      likes: 40,
      comments: 5,
    },
  ];
  return (
    <div className="profile-feed">
      {pics.map((pic) => {
        return <ProfilePost pic={pic} />;
      })}
    </div>
  );
};

export default ProfileFeed;

import React from "react";
import "./ProfileFeed.css";
import ProfilePost from "../ProfilePost";

const ProfileFeed = () => {
  const pics = [
    {
      url:
        "https://i.picsum.photos/id/406/600/600.jpg?hmac=IMDaXEom3Ox8j-x6UR0-wDjygrCsFg-952Uef8k9U2Q",
      likes: 10,
      comments: 15,
    },
    {
      url:
        "https://i.picsum.photos/id/406/600/600.jpg?hmac=IMDaXEom3Ox8j-x6UR0-wDjygrCsFg-952Uef8k9U2Q",
      likes: 9,
      comments: 56,
    },
    {
      url:
        "https://i.picsum.photos/id/406/600/600.jpg?hmac=IMDaXEom3Ox8j-x6UR0-wDjygrCsFg-952Uef8k9U2Q",
      likes: 7,
      comments: 12,
    },
    {
      url:
        "https://i.picsum.photos/id/406/600/600.jpg?hmac=IMDaXEom3Ox8j-x6UR0-wDjygrCsFg-952Uef8k9U2Q",
      likes: 14,
      comments: 25,
    },
    {
      url:
        "https://i.picsum.photos/id/406/600/600.jpg?hmac=IMDaXEom3Ox8j-x6UR0-wDjygrCsFg-952Uef8k9U2Q",
      likes: 34,
      comments: 5,
    },
    {
      url:
        "https://i.picsum.photos/id/406/600/600.jpg?hmac=IMDaXEom3Ox8j-x6UR0-wDjygrCsFg-952Uef8k9U2Q",
      likes: 99,
      comments: 3,
    },
    {
      url:
        "https://i.picsum.photos/id/406/600/600.jpg?hmac=IMDaXEom3Ox8j-x6UR0-wDjygrCsFg-952Uef8k9U2Q",
      likes: 100,
      comments: 15,
    },
    {
      url:
        "https://i.picsum.photos/id/406/600/600.jpg?hmac=IMDaXEom3Ox8j-x6UR0-wDjygrCsFg-952Uef8k9U2Q",
      likes: 109,
      comments: 15,
    },
    {
      url:
        "https://i.picsum.photos/id/406/600/600.jpg?hmac=IMDaXEom3Ox8j-x6UR0-wDjygrCsFg-952Uef8k9U2Q",
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

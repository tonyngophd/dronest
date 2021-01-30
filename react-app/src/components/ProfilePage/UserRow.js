import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import fetchAFollowing from "../../store/follow";
import { useDispatch, useSelector } from "react-redux";

import MiniProfile from "../MiniProfile";

export const handleFollowClick = (
  e,
  personToFollowId,
  profilePersonId,
  do_follow = true,
  dispatch
) => {
  e.preventDefault();
  // console.log(`\n\nme of id ${myId} will follow user with id ${personToFollowId}`);
  fetchAFollowing(personToFollowId, profilePersonId, do_follow, dispatch);
};

function UserRow({
  user = {},
  myId = undefined,
  notFollowedYet = true,
  imageSize = "35px",
  followAsButton = true,
  showFollowButtonOrText = true,
  gotoUserPage = true,
  miniProfileEnabled = true,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const profilePerson = useSelector((state) => state.profile.user);
  const [showMiniProfile, setShowMiniProfile] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (gotoUserPage) {
      history.push(`/${user.username}`);
    }
  };

  return (
    user && (
      <div className="user-row-main-div">
        <div
          className="user-row-left-div"
          onMouseOver={(e) => setShowMiniProfile(true)}
          onMouseOut={(e) => setShowMiniProfile(false)}
        >
          <img
            className="user-row-profile-img"
            src={user.profilePicUrl}
            alt={`${user.username}-profile-pic`}
            style={{ width: imageSize, height: imageSize }}
            onClick={handleClick}
            id={`${user.id}-userProfileImg`}
          />
          {miniProfileEnabled && showMiniProfile && <MiniProfile user={user} />}
          <div className="user-row-info-div">
            <div className="user-row-username">{user.username}</div>
            <div className="user-row-display-name">{user.name}</div>
          </div>
        </div>
        {showFollowButtonOrText &&
          (notFollowedYet ? (
            <button
              className={
                followAsButton
                  ? "profile-follow-button user-row-button"
                  : "user-row-minimal-button-to-follow"
              }
              onClick={(e) =>
                handleFollowClick(
                  e,
                  user.id,
                  profilePerson && profilePerson.id,
                  true,
                  dispatch
                )
              }
            >
              Follow
            </button>
          ) : user.id !== myId ? (
            <button
              className={
                followAsButton
                  ? "profile-following-button user-row-button"
                  : "user-row-minimal-button"
              }
              onClick={(e) =>
                handleFollowClick(
                  e,
                  user.id,
                  profilePerson && profilePerson.id,
                  false,
                  dispatch
                )
              }
            >
              Following
            </button>
          ) : (
            <span className=" user-row-button">Myself</span>
          ))}
      </div>
    )
  );
}

export default UserRow;

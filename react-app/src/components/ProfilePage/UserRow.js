import React from "react";
import { Link, useHistory } from "react-router-dom";
import fetchAFollowing from "../../store/follow";
import { useDispatch } from "react-redux";


export const handleFollowClick = (e, myId, personToFollowId, do_follow = true, dispatch) => {
  e.preventDefault();
  // console.log(`\n\nme of id ${myId} will follow user with id ${personToFollowId}`);
  fetchAFollowing(personToFollowId, myId, do_follow, dispatch);
};

function UserRow({
  user = {},
  myId = undefined,
  notFollowedYet = true,
  imageSize = "35px",
  followAsButton = true,
  showFollowButtonOrText = true,
  gotoUserPage = true,
}) {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    if (gotoUserPage) {
      history.push(`/${user.username}`);
    }
  };

  return (
    user && (
      <div className="user-row-main-div">
        <div className="user-row-left-div">
          <img
            className="user-row-profile-img"
            src={user.profilePicUrl}
            alt={`${user.username}-profile-pic`}
            style={{ width: imageSize, height: imageSize }}
            onClick={handleClick}
            id={`${user.id}-userProfileImg`}
          />
          <div className="user-row-info-div">
            <div className="user-row-username">{user.username}</div>
            <div className="user-row-display-name">{user.name}</div>
          </div>
        </div>
        {showFollowButtonOrText &&
          (notFollowedYet ? (
            <button
              className="profile-follow-button user-row-button"
              onClick={(e) => handleFollowClick(e, myId, user.id, true, dispatch)}
            >
              Follow
            </button>
          ) : user.id !== myId ? (
            <button
              className="profile-following-button user-row-button"
              onClick={(e) => handleFollowClick(e, myId, user.id, false, dispatch)}
            >
              Following
            </button>
          ) : (
            <span className=" user-row-button"></span>
          ))}
      </div>
    )
  );
}

export default UserRow;

import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import fetchAFollowing from "../../store/follow";
import { useDispatch, useSelector } from "react-redux";

import MiniProfile from "../MiniProfile";

export const handleFollowClick = async (
  e,
  personToFollowId,
  profilePersonId,
  do_follow = true,
  dispatch,
  setNotFollowed = (() => { })
) => {
  e.preventDefault();
  e.stopPropagation();
  // console.log(`\n\nme of id ${myId} will follow user with id ${personToFollowId}`);
  const res = await fetchAFollowing(personToFollowId, profilePersonId, do_follow, dispatch);
  if (res)
    setNotFollowed(!do_follow);
};

function UserRow({
  user = {},
  myId = undefined,
  notFollowedYet = true,
  imageSize = "35px",
  fontSize = '16px',
  followAsButton = true,
  showFollowButtonOrText = true,
  gotoUserPage = true,
  miniProfileEnabled = true,
  searchable,
  suggestionBox,
  onClose,
  followlist,
  modal,
  online = false,
  short = false,
  nameFieldWidth = 'auto',
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const profilePerson = useSelector((state) => state.profile.user);
  const [showMiniProfile, setShowMiniProfile] = useState(false);
  const [hover, setHover] = useState(false);
  const [notFollowed, setNotFollowed] = useState(notFollowedYet);

  const handleClick = (e) => {
    e.preventDefault();
    if (onClose) {
      onClose();
    }
    if (gotoUserPage) {
      history.push(`/users/${user.username}`);
    }
  };

  return (
    user && (
      <div
        onClick={() => searchable && history.push(`/users/${user.username}`)}
        className={
          !searchable ? "user-row-main-div" : "user-row-main-div search-row"
        }
      >
        <div
          className={
            modal
              ? user.id === myId
                ? "user-row-left-div myself-header modal-me"
                : "user-row-left-div"
              : user.id === myId
                ? "user-row-left-div myself-header"
                : "user-row-left-div"
          }
        >
          <img
            className="user-row-profile-img"
            onMouseOver={(e) => !searchable && setHover(true)}
            onMouseOut={(e) => !searchable && setHover(false)}
            src={user.profilePicUrl}
            alt={`${user.username}-profile-pic`}
            style={{ width: imageSize, height: imageSize }}
            onClick={handleClick}
            id={`${user.id}-userProfileImg`}
          />
          {
            online && <div className='online-indicator'>

            </div>
          }
          {miniProfileEnabled && !followlist && (
            <MiniProfile hover={hover} user={user} />
          )}
          {nameFieldWidth &&
          <div className="user-row-info-div" style={{ fontSize: fontSize, width: nameFieldWidth }}>
            <div className="user-row-username">{user.username}</div>
            <div className="user-row-display-name">{short ? user.name.slice(0, 16) : user.name}</div>
          </div>}
        </div>
        {showFollowButtonOrText &&
          (notFollowed ? (
            <button
              className={
                followAsButton
                  ? "profile-follow-button user-row-button"
                  : "user-row-minimal-button-to-follow"
              }
              onClick={(e) =>
                myId ?
                  handleFollowClick(
                    e,
                    user.id,
                    profilePerson && profilePerson.id,
                    true,
                    dispatch,
                    setNotFollowed
                  ) :
                  history.push('/login')
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
                  dispatch,
                  setNotFollowed
                )
              }
            >
              Following
            </button>
          ) : (
                !suggestionBox && (
                  <span className=" user-row-button myself">Me</span>
                )
              ))}
      </div>
    )
  );
}

export default UserRow;

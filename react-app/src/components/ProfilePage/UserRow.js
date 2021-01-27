import React from 'react';

function UserRow({ user = {}, myId = undefined, notFollowedYet = true, handleFollowClick }) {
  return (
    user &&
    <div className='user-row-main-div'>
      <div className='user-row-left-div'>
        <img className='user-row-profile-img' src={user.profilePicUrl} alt={`${user.username}-profile-picture`} />
        <div className='user-row-info-div'>
          <div className='user-row-username'>{user.username}</div>
          <div>{user.name}</div>
        </div>
      </div>
      {/* TODO check if the user is already in my following list or not to show this button*/}
      {notFollowedYet ?
        <button
          className="profile-follow-button user-row-button"
          onClick={e => handleFollowClick(e, myId, user.id, true)}
        >Follow</button>
        : <button
          className="profile-following-button user-row-button"
          onClick={e => handleFollowClick(e, myId, user.id, false)}
        >Following</button>
      }
    </div>
  )
}

export default UserRow;
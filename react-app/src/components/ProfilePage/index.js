import "./ProfilePage.css";
import React, { useEffect, useState } from "react";
import { useParams, Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from 'nanoid';
import { GrClose } from 'react-icons/gr';

import ProfilePostsNav from "../ProfilePostsNav";
import ProfileFeed from "../ProfileFeed";
import UserRow from './UserRow';
import { fetchUserProfile } from "../../store/profile";

const ProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.session.user);
  const [numberOfFollowers, setNumberOfFollowers] = useState(0);
  const [numberOfFollowing, setNumberOfFollowing] = useState(0);
  const [numberOfOwnPosts, setNumberOfOwnPosts] = useState(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile(username));
  }, [dispatch, username]);

  useEffect(() => {
    if (!profile.user) return;
    if (profile.user.followers && Array.isArray(profile.user.followers)) {
      setNumberOfFollowers(profile.user.followers.length)
    }
    if (profile.user.following && Array.isArray(profile.user.following)) {
      setNumberOfFollowing(profile.user.following.length)
    }
    if (profile.user.ownPosts && Array.isArray(profile.user.ownPosts)) {
      setNumberOfOwnPosts(profile.user.ownPosts.length)
    }
  }, [profile]);

  const handleFollowersClick = e => {
    e.preventDefault();
    setShowFollowersModal(true);
  }

  const handleFollowingClick = e => {
    e.preventDefault();
    setShowFollowingModal(true);
  }

  const hideModal = e => {
    e.preventDefault();
    if ((e.target.className === 'modal') ||
      (e.target.className.animVal !== undefined)) {
      setShowFollowersModal(false);
      setShowFollowingModal(false);
    }
  }

  const notFollowedYet = (userId, myself=user) => {
    if (userId === myself.id) return false; //I'm not going to follow myself!
    if (myself.following) {
      return !myself.following.some(fl => fl.id === userId)
    }
    return true;
  }

  const FollowModal = ({ listOfUsers = [], title = "Followers" }) => {
    return (
      <div className='modal'
        onClick={hideModal}
      >
        <div className='modal-content'>
          <div className='follow-modal-top-div'>
            <div className='follow-modal-title-div'>{title}</div>
            <GrClose className='modal-close' onClick={hideModal} />
          </div>
          <hr className='hr' />
          <div className='modal-content-scroll'>
            {
              listOfUsers.map(u => <div key={nanoid()}>
                <UserRow user={u} myId={u.id} notFollowedYet={notFollowedYet(u.id, user)}/>
              </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      { showFollowersModal && <FollowModal listOfUsers={profile.user.followers} title="Followers" />}
      { showFollowingModal && <FollowModal listOfUsers={profile.user.following} title="Following" />}
      {profile.user && (
        <div className="profile-info">
          <img
            draggable="false"
            src={`${profile.user.profilePicUrl}`}
            className="profile-pic"
          />
          <div className="profile-text">
            <div className="profile-username-and-button">
              <span className="profile-username">{profile.user.username}</span>
              {notFollowedYet(profile.user.id) ?
                <button className="profile-follow-button">Follow</button>
                : (user.id === profile.user.id ?
                  <button className="profile-edit-button">Edit Profile</button>
                  : <button className="profile-edit-button">Message</button>
                )
              }
            </div>
            <div className="profile-numbers">
              <div className="profile-posts-numbers">
                <span className="profile-number">{numberOfOwnPosts}</span>
                <span className="profile-number-text"> posts</span>
              </div>
              <div
                className="profile-follower-numbers"
                onClick={handleFollowersClick}
              >
                <span className="profile-number">{numberOfFollowers}</span>
                <span className="profile-number-text"> followers</span>
              </div>
              <div
                className="profile-follower-numbers"
                onClick={handleFollowingClick}
              >
                <span className="profile-number">{numberOfFollowing}</span>
                <span className="profile-number-text"> following</span>
              </div>
              {/* <Link
                to={`/${username}/followers`}
                className="profile-follower-numbers"
              >
                <span className="profile-number">{numberOfFollowers}</span>
                <span className="profile-number-text"> followers</span>
              </Link> */}
              {/* <Link
                to={`/${username}/following`}
                className="profile-follower-numbers"
              >
                <span className="profile-number">{numberOfFollowing}</span>
                <span className="profile-number-text"> following</span>
              </Link> */}
            </div>
            <div className="profile-display-name">{profile.user.name}</div>
            <div className="profile-bio">{profile.user.bio}</div>
            <a
              className="profile-website-url"
              href={`${profile.user.websiteUrl}`}
            >
              {profile.user.websiteUrl}
            </a>
          </div>
        </div>
      )}
      {profile && <ProfilePostsNav />}
      {profile && <ProfileFeed />}
    </div>
  );
};

export default ProfilePage;

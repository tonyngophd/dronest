import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineHeart, AiOutlineEye } from 'react-icons/ai';
import { FiEye } from 'react-icons/fi';
import timeStamp from '../../utils';
import Modal from '../../AAPopups/Modals';
import LoginForm from '../../auth/LoginForm';

import { likePost, unlikePost, savePost, unsavePost } from '../../../store/posts';

import {
  BsHeart,
  BsChat,
  BsBookmark,
  BsHeartFill,
  BsBookmarkFill,
  BsStar,
  BsStarFill,
} from "react-icons/bs";
import { SiFacebook } from 'react-icons/si';
import { RiShareForwardLine } from 'react-icons/ri';

import {
  EmailShareButton,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  WhatsappShareButton,
} from "react-share";

import UserRow from '../../ProfilePage/UserRow';

import './SingleCard.css';

export function ConfirmIWantToLogInModal({ setShowModal, setShowLoginForm }) {
  const history = useHistory();

  const handelOkClick = e => {
    setShowModal(false);
    setShowLoginForm(true);
  }

  return (
    <Modal setShowModal={setShowModal}
      dronestLogo={false} needsEscapeInput={true}
      title="Please login to like, save or share"
    >
      <div style={{ marginBottom: '20px' }}>
        <div className="short-buttons">
          <button id="cancel-button" className='cancel-button'
            onClick={e => setShowModal(false)}
          >Cancel</button>
          <button onClick={handelOkClick}>OK</button>
        </div>
      </div>
    </Modal>
  );
}

function ShareButtonsWindow({ setShowModal}) {

  return (
    // <div className='share-buttons-div'>
    <Modal setShowModal={setShowModal}>
      <FacebookShareButton
        url={'www.facebook.com'}
        quote={"share on facebook"}
        className="Demo__some-network__share-button"
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton />
      <EmailShareButton />
    </Modal>
    // </div>
  );
}

export function PostModal({ setShowModal, user, post }) {
  const myself = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [iLikedThisPost, updateILikedThisPost] =
    useState(myself && myself.likedPosts.find(p => p.id === post.id) ? true : false);
  const [iFavedThisPost, updateIFavedThisPost] =
    useState(myself && myself.savedPosts.find(p => p.id === post.id) ? true : false);
  const [showConfirmLogin, updateConfirmLogin] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showShareButtons, setShowShareButtons] = useState(false);

  const handleLikeClick = async (e) => {
    if (!myself) {
      updateConfirmLogin(true);
    }
    const res = await dispatch(iLikedThisPost ? unlikePost(post.id) : likePost(post.id));
    if (res)
      updateILikedThisPost(myself.likedPosts.find(p => p.id === post.id) ? true : false);
  }
  const handleFaveClick = async (e) => {
    if (!myself) {
      updateConfirmLogin(true);
    }
    const res = await dispatch(iFavedThisPost ? unsavePost(post.id) : savePost(post.id));
    if (res)
      updateIFavedThisPost(myself.savedPosts.find(p => p.id === post.id) ? true : false);
  }

  const handleShareClick = e => {
    e.preventDefault();
    setShowShareButtons(!showShareButtons);
  }

  return (
    <Modal setShowModal={setShowModal} width={'1000px'}
      dronestLogo={false} needsEscapeInput={true}
      closeXOutSide={true} noTopDiv={true}
    >
      <div className="custom-modal-top-div">
        <div className='post-modal-user-row-div'>
          <UserRow showFollowButtonOrText={true} user={user} />
        </div>
        <div className='post-modal-like-share-save-div'>
          <div className='post-modal-like-div' onClick={handleLikeClick}>
            {iLikedThisPost ?
              <BsHeartFill /> :
              <BsHeart />
            }
            <div className='share-button-div'>
              {post.likes}
            </div>
          </div>
          <div className='post-modal-like-div' onClick={handleFaveClick}>
            {iFavedThisPost ?
              <BsStarFill /> :
              <BsStar />
            }
            <div className='share-button-div'> Save</div>
          </div>
          <div className='post-modal-like-div' onClick={handleShareClick}>
            {
              showShareButtons && <ShareButtonsWindow setShowModal={setShowShareButtons}/>
            }
            <RiShareForwardLine />
            <div className='share-button-div'> Share</div>
          </div>

        </div>
      </div>
      <div className="single-card-modal-images-div">
        <div>
          <img src={post.images[0].mediaUrl} alt="individual picture" />
        </div>
        <div>

        </div>
      </div>
      <div></div>
      {
        showConfirmLogin && <ConfirmIWantToLogInModal
          setShowModal={updateConfirmLogin}
          setShowLoginForm={setShowLoginForm}
        />
      }
      {showLoginForm && <LoginForm setShowModal={setShowLoginForm} redirect={false} />}
    </Modal>
  );
}

export default function SingleCard({ user, moreInfo = true, category = false, location = false }) {
  let src = 'https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/s720x720/146887222_10224900286638677_3698840883103249499_o.jpg?_nc_cat=104&ccb=2&_nc_sid=825194&_nc_ohc=ymzZQjKFmpwAX8sKlQ_&_nc_ht=scontent-iad3-1.xx&tp=7&oh=f9f9313ef82e283cda40f81d16ae8365&oe=604764F6';
  let cat = "Generic";
  let loc = "Great city"
  let timestamp;
  let views = 0;
  let likes = 20;
  let album = 'Generic';
  let equipment = 'Unknown';
  const [showPostModal, setShowPostModal] = useState(false);

  if (user && user.ownPosts && user.ownPosts.length > 0) {
    timestamp = timeStamp(new Date(user.ownPosts[0].createdAt), true, true);
    src = user.ownPosts[0].images[0].mediaUrl;
    loc = user.ownPosts[0].location.city;
    cat = user.ownPosts[0].category.name;
    views = user.ownPosts[0].views;
    likes += user.ownPosts[0].likes;
    album = user.ownPosts[0].album.name;
    equipment = user.ownPosts[0].equipment.name;
  }


  return (
    <div className={category || location ? 'single-card-outer-container-catloc' : 'single-card-outer-container'}>
      <div className={category || location ? 'single-card-top-image-div-catloc' : 'single-card-top-image-div'}>
        <img
          className='single-card-main-img'
          // src='https://tripcamp.s3.amazonaws.com/resources/images/official/spots/NorthernRim%20Campground.jpg'
          src={src}
          onClick={e => setShowPostModal(true)}
          alt='good band picture' />
      </div>
      {category &&
        <div className='single-card-info-div'>
          <div><b>{cat}</b></div>
        </div>
      }
      {location &&
        <div className='single-card-info-div'>
          <div><b>{loc}</b></div>
        </div>
      }
      {moreInfo &&
        <div className='single-card-info-div'>
          <div><b>Album</b>: {album}</div>
          <div>Equipment: {equipment}</div>
          <div className="single-card-love-view-div">
            <div>
              <AiOutlineHeart />
              <span>{likes}</span>
            </div>
            <div>
              <FiEye />
              <span>{views}</span>
            </div>
          </div>
        </div>
      }
      {user && !category &&
        <>
          <hr className='single-card-hr'></hr>
          <div className='single-card-user-and-date-div'>
            <div className='single-card-user-info-div'>
              <UserRow showFollowButtonOrText={false} user={user} />
            </div>
            <div>
              {timestamp}
              {/* {timeStamp(new Date('2021-02-05'), true)} */}
            </div>
          </div>
        </>
      }
      {
        showPostModal && <PostModal user={user} post={user.ownPosts[0]} setShowModal={setShowPostModal} />
      }
    </div>
  );
}
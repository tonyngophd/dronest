import React, { useState } from 'react';
import { AiOutlineHeart, AiOutlineEye } from 'react-icons/ai';
import { FiEye } from 'react-icons/fi';
import timeStamp from '../../utils';
import Modal from '../../AAPopups/Modals';

import {
  BsHeart,
  BsChat,
  BsBookmark,
  BsHeartFill,
  BsBookmarkFill,
} from "react-icons/bs";
import {RiShareForwardLine} from 'react-icons/ri';

import UserRow from '../../ProfilePage/UserRow';

import './SingleCard.css';


export function PostModal({ setShowModal, user, post }) {
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
          <div className='post-modal-like-div'>
            <BsHeart />
            <div className='share-button-div'>
              {post.likes}
            </div>
          </div>
          <div className='post-modal-like-div'>
            <RiShareForwardLine />
            <div className='share-button-div'> Share</div>
          </div>
          <div className='post-modal-like-div'>
            <BsBookmark />
            <div className='share-button-div'> Save</div>
          </div>

        </div>
      </div>
      <div>
        <div>
          <img src={post.images[0].mediaUrl} alt="individual picture" />
        </div>
        <div>

        </div>
      </div>
      <div></div>
    </Modal>
  );
}

export default function SingleCard({ user, moreInfo = true, category = false, location = false }) {
  let src = 'https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/s720x720/146887222_10224900286638677_3698840883103249499_o.jpg?_nc_cat=104&ccb=2&_nc_sid=825194&_nc_ohc=ymzZQjKFmpwAX8sKlQ_&_nc_ht=scontent-iad3-1.xx&tp=7&oh=f9f9313ef82e283cda40f81d16ae8365&oe=604764F6';
  let cat = "Generic";
  let loc = "Great city"
  let timestamp;
  let views = 0;
  let loves = 20;
  let album = 'Generic';
  let equipment = 'Unknown';
  const [showPostModal, setShowPostModal] = useState(false);

  if (user && user.ownPosts && user.ownPosts.length > 0) {
    timestamp = timeStamp(new Date(user.ownPosts[0].createdAt), true, true);
    src = user.ownPosts[0].images[0].mediaUrl;
    loc = user.ownPosts[0].location.city;
    cat = user.ownPosts[0].category.name;
    views = user.ownPosts[0].views;
    loves += Object.keys(user.ownPosts[0].likingUsers).length;
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
              <span>{loves}</span>
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
import React from 'react';
import { AiOutlineHeart, AiOutlineEye } from 'react-icons/ai';
import { FiEye } from 'react-icons/fi';
import timeStamp from '../../utils';

import UserRow from '../../ProfilePage/UserRow';

import './SinglePost.css';


export default function SingplePost({ user, moreInfo = true, category }) {

  return (
    <div className='single-post-outer-container'>
      <div className='single-post-top-image-div'>
        <img
          className='single-post-main-img'
          src='https://tripcamp.s3.amazonaws.com/resources/images/official/spots/NorthernRim%20Campground.jpg'
          alt='good band picture' />
      </div>
      {category &&
        <div className='single-post-info-div'>
          <div><b>{category}</b></div>
        </div>
      }
      {moreInfo &&
        <div className='single-post-info-div'>
          <div><b>Album</b>: Grand Canyon</div>
          <div>Equipment: Drone 1</div>
          <div className="single-post-love-view-div">
            <div>
              <AiOutlineHeart />
              <span>15</span>
            </div>
            <div>
              <FiEye />
              <span>93</span>
            </div>
          </div>
        </div>
      }
      {user &&
        <>
          <hr></hr>
          <div className='single-post-user-and-date-dive'>
            <div className='single-post-user-info-div'>
              <UserRow showFollowButtonOrText={false} user={user} />
            </div>
            <div>
              {/* {user.updatedAt} */}
              {timeStamp(new Date('2021-02-05'), true)}
            </div>
          </div>
        </>
      }
    </div>
  );
}
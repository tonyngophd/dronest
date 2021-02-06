import React from 'react';
import { AiOutlineHeart, AiOutlineEye } from 'react-icons/ai';
import { FiEye } from 'react-icons/fi';
import timeStamp from '../../utils';

import UserRow from '../../ProfilePage/UserRow';

import './SingleCard.css';


export default function SingpleCard({ user, moreInfo = true, category }) {

  return (
    <div className='single-card-outer-container'>
      <div className='single-card-top-image-div'>
        <img
          className='single-card-main-img'
          src='https://tripcamp.s3.amazonaws.com/resources/images/official/spots/NorthernRim%20Campground.jpg'
          alt='good band picture' />
      </div>
      {category &&
        <div className='single-card-info-div'>
          <div><b>{category}</b></div>
        </div>
      }
      {moreInfo &&
        <div className='single-card-info-div'>
          <div><b>Album</b>: Grand Canyon</div>
          <div>Equipment: Drone 1</div>
          <div className="single-card-love-view-div">
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
          <hr className='single-card-hr'></hr>
          <div className='single-card-user-and-date-div'>
            <div className='single-card-user-info-div'>
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
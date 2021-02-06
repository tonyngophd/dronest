import React from 'react';


import UserRow from '../../ProfilePage/UserRow';

import './SingplePost.css';


export default function SingplePost(){

  return (
    <div className='single-post-outer-container'>
      <div className='single-post-top-image-div'>
        <img 
          className='single-post-main-img'
          src='https://tripcamp.s3.amazonaws.com/resources/images/official/spots/NorthernRim%20Campground.jpg' 
          alt='good band picture' />
      </div>
      <div className='single-post-infor-div'>
        <div>Color</div>
        <div>Equipment</div>
        <div>
          <div>Viewed</div>
          <div>Likes</div>
        </div>
      </div>
      <hr></hr>
      <div className='single-post-user-info-div'>
        <UserRow showFollowButtonOrText={false}/>
      </div>
    </div>
  );
}
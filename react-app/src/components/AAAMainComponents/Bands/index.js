import React from 'react';

import SingplePost from '../SingplePost';

import './Bands.css';


export default function Band(){

  return (
    <div className='main-band-container'>
      <SingplePost />
      <SingplePost />
      <SingplePost />
      <SingplePost />
      {/* <SingplePost /> */}
    </div>
  )
}
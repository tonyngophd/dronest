import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchAllUsers } from "../../../store/users";
import SinglePost from '../SinglePost';

import './Bands.css';


export default function Band({ allUsers, numberOfCards = 4, moreInfo = true, categories }) {
  const cardArr = new Array(numberOfCards).fill(true);

  return (
    <div className='main-band-container'>
      {
        cardArr.map((el, i) => 
          <SinglePost 
            user={allUsers && allUsers[i]} 
            moreInfo={moreInfo}
            category={categories && categories[i]}
          />
        )
      }
    </div>
  )
}

export function Bands() {
  const allUsers = useSelector((state) => state.users.allUsers);

  const dispatch = useDispatch();
  const categories = ["Seatle", 'New York', 
    'Grand Canyon', 'Monument Valley', 'Four Corners', 'Arches National Park',
    'Shenandoah Valley',
  ];

  useEffect(() => {
    if (!allUsers.length) dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="homepage-bands-container">
      <Band numberOfCards={5} moreInfo={false} categories={categories}/>
      <Band allUsers={allUsers} />
    </div>
  )
}
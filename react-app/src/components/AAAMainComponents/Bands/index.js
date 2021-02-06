import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GrPrevious, GrNext } from 'react-icons/gr';

import { fetchAllUsers } from "../../../store/users";
import SinglePost from '../SinglePost';

import './Bands.css';

export function NextOrPrevious({ next = true, onClick }) {

  return (
    <div className='previous-or-next-tab-button'
      onClick={onClick}
    >
      {
        next ? <GrNext /> : <GrPrevious />
      }
    </div>
  );
}

export default function Band({ objects, numberOfCards = 4, moreInfo = true, categories }) {
  const cardArr = new Array(numberOfCards).fill(true);
  const [startNumber, setStartNumber] = useState(0);

  const changeStartNumber = (diff = 4) => {
    if(!objects || !Array.isArray(objects) || objects.length < numberOfCards) return;
    let start = startNumber + diff;
    if(start < 0) start = 0;
    if(start > (objects.length -1) - numberOfCards) start = (objects.length -1) - numberOfCards;
    setStartNumber(start);
  };

  return (
    <div className='main-band-container'>
      <NextOrPrevious next={false} onClick={() => changeStartNumber(-4)}/>
      {
        cardArr.map((el, i) =>
          <SinglePost
            user={objects && objects[i + startNumber]}
            moreInfo={moreInfo}
            category={categories && categories[i]}
          />
        )
      }
      <NextOrPrevious  onClick={() => changeStartNumber(4)}/>
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
      <Band numberOfCards={5} moreInfo={false} categories={categories} />
      <Band objects={allUsers} />
    </div>
  )
}
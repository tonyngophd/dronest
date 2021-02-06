import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GrPrevious, GrNext } from 'react-icons/gr';
import { MdNavigateNext } from 'react-icons/md';

import { fetchAllUsers } from "../../../store/users";
import SingleCard from '../SingleCard';

import './Bands.css';
import { nanoid } from 'nanoid';

function Squares({ repeat = 4, onClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div className='square-buttons-div'>
      {new Array(repeat).fill(true).map((el, i) =>
        <div key={nanoid()} 
          className={i===currentIndex?'square-button-active':'square-button'}
          id={`${i}-square${nanoid()}`}
          onClick={e => {
            const index = Number(e.target.id.split('-')[0]);
            setCurrentIndex(index);
            onClick(4 * index, true);
          }}
        />
      )}
    </div>
  );
}

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

export default function Band({ objects, numberOfCards = 4, moreInfo = true, categories, title = 'Nature', link = '/' }) {
  const cardArr = new Array(numberOfCards).fill(true);
  const [startNumber, setStartNumber] = useState(0);

  const changeStartNumber = (diff = 4, fixedStart = false) => {
    if (!objects || !Array.isArray(objects) || objects.length < numberOfCards) return;
    let start = (fixedStart ? 0 : startNumber) + diff;
    if (start < 0) start = 0;
    if (start > (objects.length - 1) - numberOfCards) start = (objects.length - 1) - numberOfCards;
    setStartNumber(start);
  };

  if (title) {
    link = `/${title.replaceAll(' ', '')}`;
  }

  return (
    <div className='main-band-container'>
      <div className='band-title-div'>
        <div>
          <b>
            {title}
          </b>
        </div>
        <div className='squares-view-more-div'>
          <Squares onClick={changeStartNumber} />
          <a href={link}>View More<GrNext className='band-title-div-i' /></a>
        </div>
      </div>
      <div className='band-container'>
        <NextOrPrevious next={false} onClick={() => changeStartNumber(-4)} />
        {
          cardArr.map((el, i) =>
            <SingleCard
              user={objects && objects[i + startNumber]}
              moreInfo={moreInfo}
              category={categories && categories[i]}
            />
          )
        }
        <NextOrPrevious onClick={() => changeStartNumber(4)} />
      </div>
    </div>
  )
}

export function Bands() {
  const allUsers = useSelector((state) => state.users.allUsers);

  const dispatch = useDispatch();
  const categories = ['Seatle', 'New York',
    'Grand Canyon', 'Monument Valley', 'Four Corners', 'Arches National Park',
    'Shenandoah Valley',
  ];
  const tags = ["Travel", 'Graduation',
    'Night', 'Beach', 'IFeelAwesome', 'Love',
    'MeAndPets',
  ];

  useEffect(() => {
    if (!allUsers.length) dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="homepage-bands-container">
      <Band numberOfCards={6} title='Locations' moreInfo={false} categories={categories} />
      <Band objects={allUsers} />
      <Band objects={allUsers} title='City' />
      <Band objects={allUsers} title='People' />
      <Band objects={allUsers} title='Sports' />
      <Band numberOfCards={6} title='Trendy Tags' moreInfo={false} categories={tags} />
    </div>
  )
}
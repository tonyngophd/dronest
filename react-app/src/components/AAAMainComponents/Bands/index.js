import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { GrPrevious, GrNext } from 'react-icons/gr';

import { fetchAllUsers } from "../../../store/users";
import SingleCard from '../SingleCard';
import { ThreeJSBanner } from '../ThreeJS';
import LoginForm from '../../auth/LoginForm';

import './Bands.css';
import { nanoid } from 'nanoid';
import { getRandomInt } from '../../utils';

function Squares({ repeat = 4, onClick, numberOfCards = 4, currentActiveSquare }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (currentActiveSquare) {
      setCurrentIndex(currentActiveSquare);
    }
  }, [currentActiveSquare]);
  return (
    <div className='square-buttons-div'>
      {new Array(repeat).fill(true).map((el, i) =>
        <div key={nanoid()}
          className={i === currentIndex ? 'square-button-active' : 'square-button'}
          id={`${i}-square${nanoid()}`}
          onClick={e => {
            e.preventDefault();
            const index = Number(e.target.id.split('-')[0]);
            setCurrentIndex(index);
            onClick && onClick(numberOfCards * index, true);
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

export function MainBanner() {
  const [currentPic, setCurrentPic] = useState(0);
  let next = currentPic;
  const pictureSrc = [
    'https://tripcamp.s3.amazonaws.com/resources/images/official/spots/glamping/smalls/Valley%20Views%20Glamping,%20NZ.jpg',
    'https://tripcamp.s3.amazonaws.com/resources/images/official/tripcamp-home2.jpg',
    'https://tripcamp.s3.amazonaws.com/resources/images/official/tripcamp-home5.jpg',
    'https://tripcamp.s3.amazonaws.com/resources/images/official/tripcamp-home6.jpg',
  ];
  const maxPicNumber = pictureSrc.length;

  useEffect(() => {
    const intvl = setInterval(() => {
      next++;
      if (next >= maxPicNumber) next = 0;
      setCurrentPic(next);
    }, 5000);
  }, [maxPicNumber]);


  return (
    <div className='main-banner-container'>
      {/* <div className='band-title-div'>
        <div className='squares-view-more-div'>
          <Squares />
        </div>
      </div> */}
      <div className='banner-container'>
        <NextOrPrevious next={false} />
        <div className='banner-img-container'>
          {
            new Array(maxPicNumber).fill(true).map((el, i) =>
              <div key={nanoid()}
                className={i === currentPic ? 'active-banner-img-div' : 'inactive-banner-img-div'}
              >
                <img
                  src={pictureSrc[i]}
                  alt='banner picture'
                  className='banner-img'
                />
              </div>
            )
          }
        </div>
        <NextOrPrevious />
      </div>
      <div className='banner-squares'>
        <Squares repeat={4} onClick={setCurrentPic} numberOfCards={1} currentActiveSquare={currentPic} />
      </div>
    </div>
  );
}

export default function Band({ objects, numberOfCards = 4, moreInfo = true, categories, location, title = 'Nature', link = '/' }) {
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
          {moreInfo && <Squares onClick={changeStartNumber} />}
          <a href={link}>View More<GrNext className='band-title-div-i' /></a>
        </div>
      </div>
      <div className='band-container'>
        <NextOrPrevious next={false} onClick={() => changeStartNumber(-4)} />
        {
          new Array(numberOfCards).fill(true).map((_, i) =>
            <SingleCard
              key={nanoid()}
              user={objects && objects[i + startNumber]}
              moreInfo={moreInfo}
              category={categories && categories[i]}
              location={location}
            />
          )
        }
        <NextOrPrevious onClick={() => changeStartNumber(4)} />
      </div>
    </div>
  )
}

export function Bands() {
  const myself = useSelector((state) => state.session.user);
  const allUsers = useSelector((state) => state.users.allUsers);
  const dispatch = useDispatch();
  const [locatedUserPosts, updateLocatedUserPosts] = useState([]);
  const [categorizedUserPosts, updateCategorizedUserPosts] = useState([]);
  const [categorizedUsers, updateCategorizedUsers] = useState([[]]);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const location = useLocation();

  const categories = ['Seatle', 'New York',
    'Grand Canyon', 'Monument Valley', 'Four Corners', 'Arches National Park',
    'Shenandoah Valley',
  ];
  const tags = ["Travel", 'Graduation',
    'Night', 'Beach', 'IFeelAwesome', 'Love',
    'MeAndPets',
  ];

  const titles = [
    'Nature', 'City', 'Thermal', 'Industrial', 'Sports'
  ];
  const maxNumberOfBands = 4;

  useEffect(() => {
    if (location.pathname.includes('/login')) {
      setShowLoginForm(true);
    } else {
      setShowLoginForm(false);
    }
  }, [location]);

  useEffect(() => {
    // if (myself && !allUsers.length) dispatch(fetchAllUsers());
    if (!allUsers.length) dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!allUsers.length) return;
    const locations = new Set();
    const cagetories = new Set();
    let users = [];
    for (let i = 0; i < allUsers.length; i++) {
      if (locations.size >= 10) break;
      const user = allUsers[i];
      if (user.ownPosts && user.ownPosts.length) {
        const randInt = getRandomInt(0, user.ownPosts.length);
        const post = user.ownPosts[randInt];
        if (post.location && post.location.city) {
          if (!locations.has(post.location.city)) {
            locations.add(post.location.city);
            users.push({ ...user, ownPosts: [post] })
          }
        }
      }
    }

    if (users.length >= 6) {
      updateLocatedUserPosts(users);
    }

    users = [];
    for (let i = 0; i < allUsers.length; i++) {
      if (cagetories.size >= 10) break;
      const user = allUsers[i];
      if (user.ownPosts && user.ownPosts.length) {
        const randInt = getRandomInt(0, user.ownPosts.length);
        const post = user.ownPosts[randInt];
        if (post.category && post.category.name) {
          if (!cagetories.has(post.category.name)) {
            cagetories.add(post.category.name);
            users.push({ ...user, ownPosts: [post] })
          }
        }
      }
    }

    if (users.length >= 6) {
      updateCategorizedUserPosts(users);
    }

    const catdUsers = [];
    for (let ti = 0; ti < titles.length; ti++) {
      let set = new Set();
      users = [];
      for (let i = 0; i < allUsers.length; i++) {
        // if (set.size >= 10) break;
        const user = allUsers[i];
        if (user.ownPosts && user.ownPosts.length) {
          const posts = user.ownPosts.filter(p => p.category ? p.category.name.includes(titles[ti]) : false);
          if (posts.length) {
            users.push({ ...user, ownPosts: [...posts] })
          }
        }
      }
      if (users.length) catdUsers.push(users);
    }
    updateCategorizedUsers(catdUsers);
  }, [allUsers])


  return (
    <div className="homepage-bands-container">
      {
        showLoginForm && <LoginForm setShowModal={setShowLoginForm}/>
      }

      <ThreeJSBanner />
      {/* <MainBanner /> */}
      <Band objects={locatedUserPosts} numberOfCards={6} title='Locations' moreInfo={false} location={true} />
      {
        new Array(maxNumberOfBands).fill(1).map((el, i) =>
          <Band objects={categorizedUsers[i]} title={titles[i]} key={nanoid()} />)
      }
      <Band objects={categorizedUserPosts} numberOfCards={6} title='Trendy Tags' moreInfo={false} categories={tags} />
    </div>
  )
}
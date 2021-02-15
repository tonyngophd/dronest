import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { GrPrevious, GrNext } from 'react-icons/gr';

import { fetchAllUsers, fetchANumberOfUsers } from "../../../store/users";
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
    'https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/148906718_10214572140055495_8986972067349990422_o.jpg?_nc_cat=105&ccb=3&_nc_sid=825194&_nc_ohc=8ATHVIkHewgAX-SHrps&_nc_ht=scontent-iad3-1.xx&oh=c536a1a48839127ed191a648ad1d0d44&oe=605152CE',
    'https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/148320108_10160467443344338_6638501313697117140_o.jpg?_nc_cat=100&ccb=3&_nc_sid=b9115d&_nc_ohc=GrZHWBY-Bm0AX8TQGeH&_nc_oc=AQmp5SXuP8M8mGZgJwUvclNQvxl61p-X8t241HbM2_rA-4Vx-fRK-o7Oh-Kr38aTFW0&_nc_ht=scontent-iad3-1.xx&oh=40b1cbc8637db1fa8907029fc48b3e0d&oe=604EB68E',
    'https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/150109958_10160587926132646_7976725861019250203_o.jpg?_nc_cat=108&ccb=3&_nc_sid=b9115d&_nc_ohc=k0eRr9Z6GQwAX_VwI6f&_nc_ht=scontent-iad3-1.xx&oh=e37f2c3314536a0aeec64bc61ddc363f&oe=6050A94E',
    'https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/150932344_4244345375593598_2408695030024088538_o.jpg?_nc_cat=105&ccb=3&_nc_sid=825194&_nc_ohc=Bd3mcsolmLgAX9HKq1j&_nc_ht=scontent-iad3-1.xx&oh=3d7dad4a25b010560149766cef7c7639&oe=605029BB',
  ];
  const maxPicNumber = pictureSrc.length;

  useEffect(() => {
    const intvl = setInterval(() => {
      next++;
      if (next >= maxPicNumber) next = 0;
      setCurrentPic(next);
    }, 5000);
  }, [maxPicNumber]);

  const nextOrPrevClick = (e, next = true, currentPic) => {
    e.preventDefault();
    let current = currentPic;
    if(next) current++;
    else current--;
    if(current > 3 ) current = 0;
    if(current < 0) current = 3;
    setCurrentPic(current);
  }


  return (
    <div className='main-banner-container'>
      <div className='banner-container'>
        <NextOrPrevious next={false} onClick={e => nextOrPrevClick(e, false, currentPic)}/>
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
        <NextOrPrevious  onClick={e => nextOrPrevClick(e, true, currentPic)}/>
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
  const [categorizedUsers, updateCategorizedUsers] = useState([]);
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
    // if (!allUsers.length) dispatch(fetchAllUsers());
    if (!allUsers.length) {
      dispatch(fetchAllUsers());
      // dispatch(fetchANumberOfUsers(0, 10));
      // setTimeout(() => dispatch(fetchAllUsers()), 1000);
    }
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
      if (users.length) {
        catdUsers.push(users);
        updateCategorizedUsers(catdUsers);
      }
    }
  }, [allUsers])


  return (
    <div className="homepage-bands-container">
      {
        showLoginForm && <LoginForm setShowModal={setShowLoginForm} />
      }

      {/* <ThreeJSBanner /> */}
      <MainBanner />
      {
        locatedUserPosts.length > 0 && <Band objects={locatedUserPosts} numberOfCards={6} title='Locations' moreInfo={false} location={true} />
      }
      {
        categorizedUsers.length > 0 && new Array(maxNumberOfBands).fill(1).map((el, i) =>
          <Band objects={categorizedUsers[i]} title={titles[i]} key={nanoid()} />)
      }
      {
        categorizedUserPosts.length > 0 && <Band objects={categorizedUserPosts} numberOfCards={6} title='Trendy Tags' moreInfo={false} categories={tags} />
      }
    </div>
  )
}
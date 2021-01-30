import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Stories, { WithSeeMore } from 'react-insta-stories';


import './Story.css';
import { nanoid } from 'nanoid';

export function StoryTopBox() {
  const [notifHover, setNotifHover] = useState(false);
  const [openStory, setOpenStory] = useState(false);


  // this is temporary
  const users = useSelector(state => state.users.allUsers);
  const [usersWithRecentPosts, setUsersWithRecentPosts] = useState([]);

  useEffect(() => {
    if (!users) return;
    setUsersWithRecentPosts(users.filter(
      user => user.ownPosts.length
    ))
  }, [users])


  const stories = [
    'https://example.com/pic.jpg',
    {
      url: 'https://example.com/pic2.jpg',
      duration: 5000,
      // seeMore: SeeMore, // some component
    },
    {
      url: 'https://example.com/pic3.jpg',
      duration: 2000,
      seeMore: ({ close }) => {
        return <div onClick={close}>Hello, click to close this.</div>;
      },
    },
  ];

  return (
    <div
      className="feed_container story-topbox-container"
    >
      <div className='feed_post-container feed_post-info story-topbox-main-div'>
        {
          usersWithRecentPosts && usersWithRecentPosts.map(user =>
            <div key={nanoid()}>
              <Link to={`/${user.username}`}>
                <div className="feed_post-header story-topbox-user-div">
                  <img src={user.profilePicUrl} alt="user-icon" className="story-profile-image"
                    style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                  />
                  <div className="feed_post-username story-username-div">{user.username}</div>
                </div>
              </Link>
            </div>)
        }
      </div>
      {
        openStory && <Stories
          stories={stories}
          width={300}
          height={500}
        />
      }
      {/* <div onClick={() => setIsPostOpen(true)} className="post-tab-new-post">
      <BsPlusSquare className="hvr-grow" />
    </div>
    <div onClick={() => setIsPostOpen(true)} className="post-tab-new-story">
      <BsClockHistory className="hvr-grow" />
    </div> */}
    </div>
  )
}

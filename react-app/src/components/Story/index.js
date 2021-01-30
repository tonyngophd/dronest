import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Stories, { WithSeeMore } from 'react-insta-stories';


import './Story.css';
import { nanoid } from 'nanoid';

export function StoryTopBox() {
  const [openStory, setOpenStory] = useState(false);
  const [stories, updateStories] = useState([]);  

  // this is temporary
  const users = useSelector(state => state.users.allUsers);
  const [usersWithRecentPosts, setUsersWithRecentPosts] = useState([]);

  useEffect(() => {
    if (!users) return;
    setUsersWithRecentPosts(users.filter(
      user => user.ownPosts.length
    ))
  }, [users])
  useEffect(() => {
    updateStories(
      usersWithRecentPosts.map(user => {
        return {
          url: user.ownPosts[0].images[0].imgUrl,
          duration: 2000,
          header: {
            heading: user.username,
            subheading: 'Posted 30m ago',
            profileImage: user.profilePicUrl,
          },
          // seeMore: ({ close }) => {
          //   return <div onClick={close}>Hello, click to close this.</div>;
          // },
        }
      })
    )
  }, [usersWithRecentPosts]);  



  return (
    <>
      {
        openStory && stories.length && <StoriesFullPage stories={stories}/>
      }
      <div
        className="feed_container story-topbox-container"
      >
        <div className='feed_post-container feed_post-info story-topbox-main-div'>
          {
            usersWithRecentPosts && usersWithRecentPosts.map(user =>
              <div key={nanoid()}>
                {/* <Link to={`/stories/${user.username}`}> */}
                <div className="feed_post-header story-topbox-user-div">
                  <img src={user.profilePicUrl} alt="user-icon" className="story-profile-image"
                    style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                    onClick={e => setOpenStory(true)}
                  />
                  <div className="feed_post-username story-username-div">{user.username}</div>
                </div>
                {/* </Link> */}
              </div>)
          }
        </div>
      </div>
    </>
  )
}

export function StoriesFullPage({stories = []}) {
  // const users = useSelector(state => state.users.allUsers);
  // const [usersWithRecentPosts, setUsersWithRecentPosts] = useState([]);
  // const [openStory, setOpenStory] = useState(false);
  // const [stories, updateStories] = useState([]);

  // useEffect(() => {
  //   if (!users) return;
  //   setUsersWithRecentPosts(users.filter(
  //     user => user.ownPosts.length
  //   ))
  // }, [users])

  // useEffect(() => {
  //   updateStories(
  //     usersWithRecentPosts.map(user => {
  //       return {
  //         url: user.ownPosts[0].images[0].imgUrl,
  //         duration: 2000,
  //         header: {
  //           heading: user.username,
  //           subheading: 'Posted 30m ago',
  //           profileImage: user.profilePicUrl,
  //         },
  //         // seeMore: ({ close }) => {
  //         //   return <div onClick={close}>Hello, click to close this.</div>;
  //         // },
  //       }
  //     })
  //   )
  // }, [usersWithRecentPosts]);

  return (
    <div className='story-fullpage-container'>
      <Stories
        stories={stories}
        width={600}
        height={800}
      />
    </div>
  );
}

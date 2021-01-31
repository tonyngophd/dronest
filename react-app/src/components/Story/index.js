import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Stories, { WithSeeMore } from 'react-insta-stories';
import { GrClose, GrNext, GrPrevious } from "react-icons/gr";


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
        // openStory && stories.length && <StoriesFullPageComponent stories={stories}/>
        // openStory && stories.length && <StoriesFullPage stories={stories} />
      }
      <div
        className="feed_container story-topbox-container"
      >
        <div className='feed_post-container feed_post-info story-topbox-main-div'>
          {
            usersWithRecentPosts && usersWithRecentPosts.map(user =>
              <div key={nanoid()}>
                <Link to={`/stories/${user.username}`}>
                  <div className="feed_post-header story-topbox-user-div">
                    <img src={user.profilePicUrl} alt="user-icon" className="story-profile-image"
                      style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                    // onClick={e => setOpenStory(true)}
                    />
                    <div className="feed_post-username story-username-div">{user.username}</div>
                  </div>
                </Link>
              </div>)
          }
        </div>
      </div>
    </>
  )
}

export function StoriesFullPageComponent({ stories = [] }) {
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
export function StoriesFullPage() {
  const users = useSelector(state => state.users.allUsers);
  const [usersWithRecentPosts, setUsersWithRecentPosts] = useState([]);
  // const [openStory, setOpenStory] = useState(false);
  const [stories, updateStories] = useState([]);
  const history = useHistory();

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
    <div className='story-fullpage-container'>
      <div className='stories-view-div'>
        <GrPrevious className="stories-prev" />
        <div>
          {/* <div className="feed_post-header story-topbox-user-div">
            <img src={user.profilePicUrl} alt="user-icon" className="story-profile-image"
              style={{ width: '60px', height: '60px', borderRadius: '50%' }}
            // onClick={e => setOpenStory(true)}
            />
            <div className="feed_post-username story-username-div">{user.username}</div>
          </div> */}

          {stories.length && <Stories
            stories={stories}
            width={500}
            height={700}
            onStoryEnd={() => setTimeout(() => history.goBack(), 5000)}
          />
          }
        </div>
        <GrNext className="stories-next" />
      </div>
      <div className="fullpage-stories-close"
        onClick={e => history.goBack()}
        style={{ color: 'white' }}
      >
        <GrClose />
      </div>
    </div>
  );
}

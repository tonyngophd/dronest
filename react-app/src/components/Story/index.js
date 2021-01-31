import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
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
  const [allStories, updateAllStories] = useState([]);
  const [userAndStoriesObj, setUserAndStoriesObj] = useState({});
  const [currentUser, updateCurrentUser] = useState(undefined);
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    if (!users) return;
    setUsersWithRecentPosts(users.filter(
      user => user.ownPosts.length
    ))
  }, [users])

  useEffect(() => {
    updateAllStories(
      usersWithRecentPosts.map(user => {
        return user.ownPosts.map(post => {
          return {
            url: post.images[0].imgUrl,
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
      })
    )
    let obj = {};
    for (let i = 0; i < usersWithRecentPosts.length; i++) {
      let user = usersWithRecentPosts[i];
      obj[user.username] = i;
    }
    setUserAndStoriesObj(obj);
    console.log('obj', obj);
  }, [usersWithRecentPosts]);

  useEffect(() => {
    if (!Object.keys(userAndStoriesObj).length) return;
    updateCurrentUser(userAndStoriesObj[params.username]);
  }, [params.username, userAndStoriesObj])

  const shiftUser = (next = true) => {
    if (!Object.keys(userAndStoriesObj).length) return;
    const len = allStories.length;
    let current = currentUser;
    if (next) {
      current++;
      if (current >= len) current = 0;
    } else {
      current--;
      if (current < 0) current = 0;
    }
    const username = Object.keys(userAndStoriesObj)[current];
    updateCurrentUser(current);
    history.push(`/stories/${username}`);
  }

  return (
    <div className='story-fullpage-container'>
      <div className='stories-view-div'>
        <div className="stories-lineup-div">
          {allStories && (currentUser !== undefined) &&
            <div className="active-stories" >
              <GrPrevious className="stories-prev"
                onClick={e => shiftUser(false)}
              />
              <Stories
                stories={allStories[currentUser]}
                width={500}
                height={700}
                onStoryEnd={() => setTimeout(() => shiftUser(), 1000)}
              />
              <GrNext className="stories-next"
                onClick={e => shiftUser()}
              />
            </div>}
        </div>
      </div>
      <div className="fullpage-stories-close"
        onClick={e => history.push('/')}
        style={{ color: 'white' }}
      >
        <GrClose />
      </div>
    </div>
  );
}


/*
                  <div className="stories-lineup-inactive-user-div">
                    <img src={usersWithRecentPosts[index].profilePicUrl} alt="user-icon" className="story-profile-image"
                      style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                    // onClick={e => setOpenStory(true)}
                    />
                    <div className="feed_post-username story-username-div" style={{ color: 'white' }}>
                      {usersWithRecentPosts[index].username}
                    </div>
                  </div>

          {<div className="feed_post-header story-topbox-user-div">
            <img src={user.profilePicUrl} alt="user-icon" className="story-profile-image"
              style={{ width: '60px', height: '60px', borderRadius: '50%' }}
            // onClick={e => setOpenStory(true)}
            />
            <div className="feed_post-username story-username-div">{user.username}</div>
          </div>                 
*/
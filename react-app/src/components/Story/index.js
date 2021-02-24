import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import Stories, { WithSeeMore } from 'react-insta-stories';
// import Comment from "../Comment";
import { fetchAllUsers } from '../../store/users';
import { GrClose, GrNext, GrPrevious } from "react-icons/gr";
import timeStamp, { MediaDisplayer } from '../utils';


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
      (user, i) => user.ownPosts.length && i < 10
    ))
  }, [users])
  useEffect(() => {
    updateStories(
      usersWithRecentPosts.map(user => {
        return {
          url: user.ownPosts[0].images[0].mediaUrl,
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
    <UserListRow users={usersWithRecentPosts} title='Stories' />
  );
}

export function UserListRow({ users, title }) {

  return (
    <div className='feed_post-container  story-topbox-container'>
      {
        // openStory && stories.length && <StoriesFullPageComponent stories={stories}/>
        // openStory && stories.length && <StoriesFullPage stories={stories} />
      }
      <div className='stories-title-div'>
        {title}
      </div>
      <div
        className='feed_post-container story-topbox-main-div'
      >
        {
          users && users.map(user =>
            <div key={nanoid()}>
              <Link to={`/stories/${user.username}`}>
                <div className="feed_post-header story-topbox-user-div">
                  <MediaDisplayer mediaUrl={user.profilePicUrl}
                    imgClassname="story-profile-image"
                    vidClassname="story-profile-image"
                    style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                  />
                  <div className="feed_post-username story-username-div">{user.username}</div>
                </div>
              </Link>
            </div>)
        }
      </div>
    </div>
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
  const [fiveStories, updateFiveStories] = useState([]);
  const [userAndStoriesObj, setUserAndStoriesObj] = useState({});
  const [currentUser, updateCurrentUser] = useState(undefined);
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!users.length) dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!users) return;
    setUsersWithRecentPosts(users.filter(
      user => user.ownPosts.length
    ))
  }, [users])

  const mediaType = (mediaType, includesYandF = false) => {
    if (mediaType.includes('image')) {
      return 'image';
    } else if (mediaType.includes('mp4')) {
      return 'video';
    } else if (includesYandF && (mediaType.includes('youtu') || mediaType.includes('facebook'))) {
      return 'video';
    }
    return undefined;
  }

  useEffect(() => {
    updateAllStories(
      usersWithRecentPosts.map(user => {
        return user.ownPosts
          .filter(post => mediaType(post.images[0].mediaType) !== undefined)
          .map(post => {
            return {
              url: post.images[0].mediaUrl,
              type: mediaType(post.images[0].mediaType),
              duration: 2000,
              header: {
                heading: user.username,
                subheading: `Posted ${timeStamp(new Date(post.createdAt))}`,
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
  }, [usersWithRecentPosts]);

  useEffect(() => {
    if (!Object.keys(userAndStoriesObj).length) return;
    updateCurrentUser(userAndStoriesObj[params.username]);
  }, [params.username, userAndStoriesObj])

  useEffect(() => {
    let fiveS = new Array(5).fill(undefined);
    if (currentUser !== undefined && allStories.length) {
      if (allStories[currentUser])
        fiveS[2] = allStories[currentUser];
      if (currentUser - 2 >= 0 && usersWithRecentPosts[currentUser - 2]) {
        fiveS[0] = usersWithRecentPosts[currentUser - 2]
      }
      if (currentUser - 1 >= 0 && usersWithRecentPosts[currentUser - 1]) {
        fiveS[1] = usersWithRecentPosts[currentUser - 1]
      }
      if (currentUser + 1 < allStories.length && usersWithRecentPosts[currentUser + 1]) {
        fiveS[3] = usersWithRecentPosts[currentUser + 1]
      }
      if (currentUser + 2 < allStories.length && usersWithRecentPosts[currentUser + 2]) {
        fiveS[4] = usersWithRecentPosts[currentUser + 2]
      }
    }
    updateFiveStories(fiveS);
  }, [currentUser, allStories]);

  const shiftUser = ({ next = true, userIndex = undefined, automatic = false } = {}) => {
    if (!Object.keys(userAndStoriesObj).length) return;
    const len = allStories.length;

    let current = currentUser;
    if (userIndex !== undefined) {
      current = userIndex;
    } else {
      if (next) {
        current++;
        if (current >= len) {
          if (automatic) {
            return history.push(`/users`);
          }
          current = 0;
        }
      } else {
        current--;
        if (current < 0) current = len - 1;
      }
    }
    const username = Object.keys(userAndStoriesObj)[current];
    updateCurrentUser(current);
    history.push(`/stories/${username}`);
  }

  return (
    <div className='story-fullpage-container'>
      <div className='stories-view-div'>
        <div className="stories-lineup-div">
          {fiveStories.length > 0 && (currentUser !== undefined) && fiveStories[2] !== undefined &&
            fiveStories.map((stories, index) =>
              <div key={nanoid()}>
                {
                  index === 2 ?
                    <div className="active-stories" >
                      <GrPrevious className="stories-prev"
                        onClick={e => shiftUser({ next: false })}
                      />
                      <div style={{ overflow: 'hidden', borderRadius: '10px' }}>
                        <Stories
                          stories={stories}
                          width={500}
                          height={700}
                          storyStyles={{
                            minHeight: '100%',
                            minWidth: "100%",
                            maxHeight: 'auto',
                            objectFit: "cover",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onAllStoriesEnd={() => setTimeout(() => shiftUser({ automatic: true }), 2000)}
                        />
                      </div>
                      <GrNext className="stories-next"
                        onClick={e => shiftUser()}
                      />
                    </div>
                    : (stories !== undefined ?
                      <div
                        className="stories-lineup-inactive-user-div"
                        onClick={e => {
                          shiftUser({ userIndex: currentUser + index - 2 });
                        }}
                      >
                        <div className='inactive-story-user-profile-img'>
                          <img src={stories.profilePicUrl} alt="user-icon" className="story-profile-image"
                            style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                          />
                          {/* <MediaDisplayer mediaUrl={stories.profilePicUrl}
                            imgClassname="story-profile-image"
                            vidClassname="story-profile-image"
                            style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                          /> */}
                          <div className="feed_post-username story-username-div"
                            style={{ color: 'white' }}
                          >
                            {stories.username}
                          </div>
                        </div>
                        <img
                          src={
                            stories.ownPosts.find(p => mediaType(p.images[0].mediaType) === 'image')
                              .images[0].mediaUrl ||
                            stories.ownPosts[0].images[0].mediaUrl}
                          alt={stories.ownPosts[0].mediaUrl}
                          style={{ minWidth: '100%', minHeight: '100%', objectFit: 'cover' }}
                        />
                        {/* <MediaDisplayer mediaUrl={stories.ownPosts[0].images[0].mediaUrl}
                          imgClassname="story-profile-image"
                          vidClassname="story-profile-image"
                          style={{ minWidth: '100%', minHeight: '100%', objectFit: 'cover' }}
                        />                         */}
                      </div> :
                      <div className='stories-lineup-dummy-user-div' />
                    )
                }
              </div>
            )
          }
        </div>
      </div>
      <div className="fullpage-stories-close"
        onClick={e => history.push('/users')}
        style={{ color: 'white' }}
      >
        <GrClose />
      </div>
    </div>
  );
}

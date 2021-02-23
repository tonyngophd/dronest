import React, { useEffect, useState } from "react";
import "./feed.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeFeed, fetchAllPosts } from "../../store/posts";
import Post, { BarePost } from "../Post";
import { nanoid } from "nanoid";
import { fetchNotifications } from "../../store/notifications";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "react-loader-spinner";
import { PostModal } from '../AAAMainComponents/SingleCard';
import { MediaDisplayer } from '../utils';
import ProfilePost from "../ProfilePost";


const Feed = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const feed = useSelector((state) => state.posts.homeFeed);
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);
  useEffect(() => {
    dispatch(fetchHomeFeed(user.id, page));
  }, [dispatch, user, page]);

  const setPost = (arr, num) => {
    let newArr = []
    for (let i = 0; i < num; i++) {
      newArr.push(arr[i]);
    }
    return newArr;
  }

  let num = 5;
  return (
    <>
      {feed && (
        <InfiniteScroll
          className="feed_container"
          dataLength={Object.values(feed).length}
          next={() => setPage(page + 1)}
          hasMore={true}
          loader={
            <Loader
              className="three-dots"
              type="ThreeDots"
              color="rgb(58,66,105)"
              height={100}
              width={100}
              timeout={1000}
            />
          }
        >
          {Object.values(feed)
            .sort((a, b) =>
              new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
            )
            .map((post) => (
              <Post post={post} key={nanoid()} />
            ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export const AllPosts = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const feed = useSelector((state) => state.posts.allFeed);
  const [page, setPage] = useState(0);
  const [postToPop, setPostToPop] = useState(undefined);
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalPost, setModalPost] = useState(null);


  // useEffect(() => {
  //   dispatch(fetchNotifications());
  // }, []);
  useEffect(() => {
    dispatch(fetchAllPosts(page));
  }, [dispatch, page]);

  const handleClick = (e, post) => {
    setPostToPop(post);
    setShowPostModal(true);
  }

  const columns = 3;
  return (
    <div className="feed_grid_container explore-page">
      {feed && (
        <InfiniteScroll
          className="feed_grid_container"
          dataLength={Object.values(feed).length}
          next={() => setPage(page + 1)}
          hasMore={true}
          loader={
            <Loader
              className="three-dots profile-style"
              type="ThreeDots"
              color="rgb(58,66,105)"
              height={100}
              width={100}
              timeout={1000}
            />
          }
        >
          <div className='three-column-div'>
            {
              new Array(columns).fill(1).map((_, index) =>
                <div className='feed_grid_container_column' key={nanoid()}>
                  {Object.values(feed)
                    .sort((a, b) =>
                      new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
                    )
                    .filter((p, i) => (i % columns) === index)
                    .map(post =>
                      <div onClick={e => setModalPost(post)} key={nanoid()}>
                        <ProfilePost post={post}
                          setShowPostModal={setModalPost}
                        />
                      </div>
                    )}
                </div>)
            }
          </div>
        </InfiniteScroll>
      )}
      {
        modalPost &&
          <PostModal user={modalPost.user} posts={[modalPost]} setShowModal={setModalPost} />
      }
    </div>
  );
};

export default Feed;

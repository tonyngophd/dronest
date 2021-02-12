import React, { useEffect, useState } from "react";
import "./feed.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeFeed, fetchAllPosts } from "../../store/posts";
import Post, { BarePost } from "../Post";
import { nanoid } from "nanoid";
import { fetchNotifications } from "../../store/notifications";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "react-loader-spinner";


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

  useEffect(() => {
    console.log('FEEED', feed)
  }, [feed]);

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

  // useEffect(() => {
  //   dispatch(fetchNotifications());
  // }, []);
  useEffect(() => {
    dispatch(fetchAllPosts(page));
  }, [dispatch, page]);


  return (
    <>
      {feed && (
        <InfiniteScroll
          className="feed_grid_container"
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
          {
            new Array(3).fill(1).map((_, index) =>
              <div className='feed_grid_container_column' key={nanoid()}>
                {Object.values(feed)
                  .sort((a, b) =>
                    new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
                  )
                  .filter((p, i) => i % 3 === index)
                  .map((post) => (
                    // <BarePost post={post} key={nanoid()} />
                    <img src={post.images[0].mediaUrl} key={nanoid()}/>
                  ))}
              </div>)
          }
        </InfiniteScroll>
      )}
    </>
  );
};

export default Feed;

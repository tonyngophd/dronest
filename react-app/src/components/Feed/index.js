import React, { useEffect } from "react";
import "./feed.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeFeed } from "../../store/posts";
import Post from "../Post";
import { nanoid } from "nanoid";
import { fetchNotifications } from "../../store/notifications";
import InfiniteScroll from "react-infinite-scroll-component"

const Feed = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const feed = useSelector((state) => state.posts.homeFeed);
  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);
  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchHomeFeed(user.id));
  }, [dispatch, user]);

  const setPost = (arr, num) => {
    let newArr = []
    for (let i = 0; i < num; i++) {
      newArr.push(arr[i]);
    }
    return newArr;
  }

  let num = 5;
  console.log('FEEED', feed)
  return (

    // <>
    //   {feed && (
    //     <div className="feed_container">
    //       {setPost(feed.map((post) => (
    //         <Post post={post} key={nanoid()} />
    //       )), 6)}
    //     </div>
    //   )}
    // </>

    <>
      {feed && (
        <div className="feed_container">
          {feed.map((post) => (
            <Post post={post} key={nanoid()} />
          ))}
        </div>
      )}
    </>
  );
};

export default Feed;

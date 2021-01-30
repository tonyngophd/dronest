import React, { useEffect, useState } from "react";
import "./feed.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeFeed } from "../../store/posts";
import Post from "../Post";
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
    dispatch(fetchNotifications());
    dispatch(fetchHomeFeed(user.id, page));
  }, [dispatch, user, page]);

  return (
    <>
      {feed && (
        <InfiniteScroll
          className="feed_container"
          dataLength={feed.length}
          next={() => setPage(page + 1)}
          hasMore={true}
          loader={
            <Loader
              type="Puff"
              color="#00BFFF"
              height={100}
              width={100}
              timeout={3000} //3 secs
            />
          }
        >
          {feed.map((post) => (
            <Post post={post} key={nanoid()} />
          ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export default Feed;

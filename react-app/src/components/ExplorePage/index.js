import "./ExplorePage.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExploreFeed } from "../../store/posts";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "react-loader-spinner";
import ProfilePost from "../ProfilePost";
import { nanoid } from "nanoid";

const ExplorePage = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.posts.exploreFeed);
  const [page, setPage] = useState(0);
  useEffect(() => {
    dispatch(fetchExploreFeed(page));
  }, [dispatch, page]);
  return (
    <div className="hashtag-page-container explore-page">
      {feed && (
        <InfiniteScroll
          className="hashtag-feed"
          dataLength={feed.length}
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
          {feed.map((post) => (
            <ProfilePost post={post} key={nanoid()} />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default ExplorePage;

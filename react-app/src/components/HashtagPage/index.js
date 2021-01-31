import "./HashtagPage.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfilePost from "../ProfilePost";
import { fetchHashtagFeed } from "../../store/posts";
import { nanoid } from "nanoid";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "react-loader-spinner";

const HashtagPage = () => {
  const { hashtag } = useParams();
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.posts.hashtagFeed);
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchHashtagFeed(hashtag, page));
  }, [dispatch, hashtag, page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="hashtag-page-container">
      {feed && Object.values(feed).length > 0 && (
        <>
          <div className="hashtag-info">
            <img
              draggable="false"
              src={`${Object.values(feed)[0].images[0].imgUrl}`}
              className="hashtag-header-pic"
            />
            <div className="hashtag-text">
              <div className="hashtag-name">#{hashtag}</div>
              <div className="hashtag-number">
                <span className="hashtag-number-posts">{}</span> posts
              </div>
            </div>
          </div>
          <div className="hashtag-most-recent">Most recent</div>
        </>
      )}
      {feed && (
        <InfiniteScroll
          className="hashtag-feed"
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
          {Object.values(feed)
            .sort((a, b) =>
              new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
            )
            .map((post) => (
              <ProfilePost post={post} key={nanoid()} />
            ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default HashtagPage;

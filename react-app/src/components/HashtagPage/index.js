import "./HashtagPage.css";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HashtagFeed from "../HashtagFeed";
import { fetchHashtagFeed } from "../../store/posts";

const HashtagPage = () => {
  const { hashtag } = useParams();
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.posts.hashtagFeed);

  useEffect(() => {
    dispatch(fetchHashtagFeed(hashtag));
  }, [dispatch, hashtag]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="hashtag-page-container">
      {feed && (
        <>
          <div className="hashtag-info">
            <img
              draggable="false"
              src={`${feed[0].images[0].imgUrl}`}
              className="hashtag-header-pic"
            />
            <div className="hashtag-text">
              <div className="hashtag-name">#{hashtag}</div>
              <div className="hashtag-number">
                <span className="hashtag-number-posts">{feed.length}</span>{" "}
                posts
              </div>
            </div>
          </div>
          <div className="hashtag-most-recent">Most recent</div>
        </>
      )}
      {feed && <HashtagFeed posts={feed} />}
    </div>
  );
};

export default HashtagPage;

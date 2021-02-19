import "./ExplorePage.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExploreFeed } from "../../store/posts";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "react-loader-spinner";
import ProfilePost from "../ProfilePost";
import { nanoid } from "nanoid";
import { fetchNotifications } from "../../store/notifications";
import { PostModal } from '../AAAMainComponents/SingleCard';


const ExplorePage = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.posts.exploreFeed);
  const [page, setPage] = useState(0);
  const [modalPost, setModalPost] = useState(null);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchExploreFeed(page));
  }, [dispatch, page]);

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
                      <div onClick={e => setModalPost(post)}>
                        <ProfilePost post={post} key={nanoid()}
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

export default ExplorePage;

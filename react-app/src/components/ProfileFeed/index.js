import React from "react";
import { nanoid } from "nanoid";
import "./ProfileFeed.css";
import ProfilePost from "../ProfilePost";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "react-loader-spinner";



const ProfileFeed = ({ posts, setShowPostModal }) => {
  const columns = 3;
  return (
    <>
      {
        posts ?
          <InfiniteScroll
            className="feed_grid_container"
            dataLength={posts.length}
            // next={() => setPage(page + 1)}
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
            scrollThreshold={1.0}
            hasChildren={true}
          // inverse={true}
          >
            <div className='three-column-div'>
              {
                new Array(columns).fill(1).map((_, index) =>
                  <div className='feed_grid_container_column' key={nanoid()}>
                    {posts
                      .sort((a, b) =>
                        new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
                      )
                      .filter((p, i) => (i % columns) === index)
                      .map(post =>
                        <ProfilePost post={post} key={nanoid()} setShowPostModal={setShowPostModal} />
                      )}
                  </div>)
              }
            </div>
          </InfiniteScroll> : <></>
      }
    </>
  );
};

export default ProfileFeed;

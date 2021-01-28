import React, { useEffect } from "react";
import "./feed.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeFeed } from '../../store/posts'
import Post from '../Post'
import { nanoid } from "nanoid";

const Feed = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const feed = useSelector(state => state.posts.homeFeed)

  useEffect(() => {
    dispatch(fetchHomeFeed(user.id))
  }, [dispatch, user])
  // const posts = [
  //   {
  //     user: {
  //       username: "Michael",
  //       profilePicUrl: "https://placeimg.com/498/498"
  //     },
  //     posts: {
  //       captionRawData: "This is a cool test"
  //     },
  //     images: {
  //       imgUrl: "https://placeimg.com/500/500"
  //     }
  //   },
  //   {
  //     user: {
  //       username: "Daniel",
  //       profilePicUrl: "https://placeimg.com/497/497"
  //     },
  //     posts: {
  //       captionRawData: "I love Fruit"
  //     },
  //     images: {
  //       imgUrl: "https://placeimg.com/494/494"
  //     }
  //   },
  //   {
  //     user: {
  //       username: "Adam",
  //       profilePicUrl: "https://placeimg.com/496/496"
  //     },
  //     posts: {
  //       captionRawData: "Dubstep is cool"
  //     },
  //     images: {
  //       imgUrl: "https://placeimg.com/493/493"
  //     }
  //   },
  //   {
  //     user: {
  //       username: "Tony",
  //       profilePicUrl: "https://placeimg.com/495/495"
  //     },
  //     posts: {
  //       captionRawData: "Where am I right now?"
  //     },
  //     images: {
  //       imgUrl: "https://placeimg.com/500/500"
  //     }
  //   },
  // ]

  return (
    <>
      {feed && (<div className="feed_container">
        {feed.map((post) =>
          <Post post={post} key={nanoid()}/>
        )}
      </div>)}
    </>
    // <div className="feed_container">
    //   {posts.map((post) => {
    //     return <div className="feed_post-container">
    //       <div className="feed_post-header">
    //         <img src={post.user.profilePicUrl} alt="user-icon" />
    //         <p>{post.user.username}</p>
    //       </div>
    //       <div className="feed_post-image">
    //         <img src={post.images.imgUrl} alt="user-icon" />
    //       </div>
    //       <div className="feed_post-info">
    //         <div className="feed_post-info-icons">
    //           <FaRegHeart className="post-icon" />
    //           <FaRegCommentDots className="post-icon" />
    //         </div>
    //         <div className="feed_post-info-comments">
    //           <p className="info-likes"> 100 Likes</p>
    //           <div className="info-caption">
    //             <p className="caption-user">{post.user.username}</p>
    //             <p className="caption-bio">{post.posts.captionRawData}</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   })}
    // </div>
  );
};

export default Feed;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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


  return (
    <>
      {feed && (<div className="feed_container">
        {feed.map((post) =>
          <Post post={post} key={nanoid()}/>
        )}
      </div>)}
    </>
  );
};

export default Feed;

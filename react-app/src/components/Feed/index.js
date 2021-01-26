import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import "./feed.css";

const Feed = () => {
  return (
    <div className="feed_container">
      <div className="feed_post-container">
        <div className="feed_post-header">
          <img src="/images/test.png" alt="user-icon" />
          <p>Michael</p>
        </div>
        <div className="feed_post-image">
          <img src="/images/test2.jpg" alt="user-icon" />
        </div>
        <div className="feed_post-info">
          <div className="feed_post-info-icons">
            <FaRegHeart className="post-icon" />
            <FaRegCommentDots className="post-icon" />
          </div>
          <div className="feed_post-info-comments">
            <p className="info-user">Michael</p>
            <p className="info-caption">This is a picture of me at a party!</p>
          </div>
        </div>
      </div>
      <div className="feed_post-container">
        <div className="feed_post-header">
          <img src="/images/test.png" alt="user-icon" />
          <p>Michael</p>
        </div>
        <div className="feed_post-image">
          <img src="/images/test.png" alt="user-icon" />
        </div>
        <div className="feed_post-info">
          <div className="feed_post-info-icons">
            <FaRegHeart className="post-icon" />
            <FaRegCommentDots className="post-icon" />
          </div>
          <div className="feed_post-info-comments">
            <p className="info-user">Michael</p>
            <p className="info-caption">
              This is an icon I made out of my face!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;

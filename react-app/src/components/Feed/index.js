import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './feed.css';

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

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feed;

import React from 'react'
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import { Link } from 'react-router-dom';

function Post({ post }) {
    return (
        <div className="feed_post-container">
            <div className="feed_post-header">
                <Link className="post-header-pic" to={post.user.username}>
                    <img src={post.user.profilePicUrl} alt="user-icon" />
                </Link>
                <Link className="post-header-name" to={`/${post.user.username}`}>
                    <p>{post.user.username}</p>
                </Link>
            </div>
            <div className="feed_post-image">
                <img src={post.images[0].imgUrl} alt="user-icon" />
            </div>
            <div className="feed_post-info">
                <div className="feed_post-info-icons">
                    <FaRegHeart className="post-icon" />
                    <FaRegCommentDots className="post-icon" />
                </div>
                <div className="feed_post-info-comments">
                    <p className="info-likes"> 100 Likes</p>
                    <div className="info-caption">
                        <p className="caption-user">{post.user.username}</p>
                        <p className="caption-bio">{post.captionRawData}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Post

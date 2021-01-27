import React from 'react'
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";

function Post({ post }) {
    return (
        <div className="feed_post-container">
            <div className="feed_post-header">
                <img src={post.user.profilePicUrl} alt="user-icon" />
                <p>{post.user.username}</p>
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


export default Post

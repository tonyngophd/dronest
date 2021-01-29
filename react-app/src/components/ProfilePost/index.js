import React, { useState, useEffect } from "react";
import "./ProfilePost.css";
import PicModal from "../PicModal";
import PicModalCaption from "../PicModalCaption";
import CommentInput from "../CommentInput";
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import Comment from "../Comment";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BsHeart,
  BsChat,
  BsBookmark,
  BsHeartFill,
  BsBookmarkFill,
} from "react-icons/bs";
import { likePost, unlikePost } from "../../store/posts";

const ProfilePost = ({ post }) => {
  const [hover, setHover] = useState(false);
  const user = useSelector((state) => state.session.user);
  const [liked, setLiked] = useState(post.likingUsers[user.id]);
  const [likes, setLikes] = useState(Object.values(post.likingUsers).length);
  const [numComments, setNumComments] = useState(post.comments.length);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const [isPicOpen, setIsPicOpen] = useState(false);
 
  const likeHandler = () => {
    if (liked) {
      dispatch(unlikePost(post.id));
      setLiked(false);
      setLikes(likes - 1);
    } else {
      dispatch(likePost(post.id));
      setLiked(true);
      setLikes(likes + 1);
    }
  };
  return (
    <>
      <div
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        className="profile-post-pic-wrapper"
        onClick={() => setIsPicOpen(true)}
      >
        <img
          draggable="false"
          className={hover ? "profile-post-pic hovered" : "profile-post-pic"}
          src={post.images[0].imgUrl}
          alt="pic"
        />
        <div
          className={
            hover
              ? "profile-post-pic-overlay hovered"
              : "profile-post-pic-overlay"
          }
        >
          <div className="profile-post-pic-overlay-inner">
            <i className="fas fa-heart"></i>
            {likes}
          </div>
          <div className="profile-post-pic-overlay-inner">
            <i className="fas fa-comment"></i>
            {numComments}
          </div>
        </div>
      </div>
      <PicModal open={isPicOpen} onClose={() => setIsPicOpen(false)}>
        <div className="pic-modal-container">
          <img className="modal-img" src={post.images[0].imgUrl} />
          <div className="pic-modal-right">
            <Link className="pic-modal-header" to={`/${post.user.username}`}>
              <img src={post.user.profilePicUrl} alt="user-icon" />
              <span className="feed_post-username">{post.user.username}</span>
            </Link>
            <div className="caption-and-comments">
              <div className="pic-modal-caption-wrapper">
                <img
                  className="commenter-pic"
                  src={post.user.profilePicUrl}
                  alt="pic"
                />
                <Link to={`/${post.user.username}`}>
                  <div className="caption-user-modal">{post.user.username}</div>
                </Link>
                <PicModalCaption post={post} />
              </div>
              <div className="pic-modal-comments">
                {post &&
                  post.comments.map((comment) => {
                    return (
                      <div className="modal-comment">
                        <img
                          className="commenter-pic"
                          src={comment.commenterPic}
                        />
                        <Comment comment={comment} />
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="pic-modal-utils">
              <div className="feed_post-info-icons">
                <div className="feed_post-info-icons-left">
                  {liked ? (
                    <BsHeartFill
                      onClick={likeHandler}
                      className="post-icon heart-full"
                    />
                  ) : (
                    <BsHeart onClick={likeHandler} className="post-icon" />
                  )}
                  <BsChat className="post-icon-comment" />
                </div>
                <div className="feed_post-info-icons-right">
                  <BsBookmark className="post-icon-bk" />
                </div>
              </div>
              <p className="info-likes">
                {likes} {likes === 1 ? "like" : "likes"}
              </p>
              <div className="modal-comment-input">
                <CommentInput
                  modal={true}
                  post={post}
                  increaseNumComments={() => setNumComments(numComments + 1)}
                />
              </div>
            </div>
          </div>
        </div>
      </PicModal>
    </>
  );
};

export default ProfilePost;

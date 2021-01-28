import React, { useState, useEffect } from "react";
import "./ProfilePost.css";
import PicModal from "../PicModal";
import PicModalCaption from "../PicModalCaption";
import CommentInput from "../CommentInput";
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import Comment from "../Comment";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSinglePost } from "../../store/posts";

const ProfilePost = ({ post }) => {
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const [isPicOpen, setIsPicOpen] = useState(false);
  const singlePost = useSelector((state) => state.posts.singlePost);
  useEffect(() => {
    dispatch(fetchSinglePost(post.id));
  }, [dispatch, post]);
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
            {post.likingUsers.length}
          </div>
          <div className="profile-post-pic-overlay-inner">
            <i className="fas fa-comment"></i>
            {post.comments.length}
          </div>
        </div>
      </div>
      <PicModal open={isPicOpen} onClose={() => setIsPicOpen(false)}>
        <div className="pic-modal-container">
          <img className="modal-img" src={post.images[0].imgUrl} />
          <div className="pic-modal-right">
            <Link className="pic-modal-header" to={`/${profile.user.username}`}>
              <img src={profile.user.profilePicUrl} alt="user-icon" />
              <span className="feed_post-username">
                {profile.user.username}
              </span>
            </Link>
            <div className="caption-and-comments">
              <div className="pic-modal-caption-wrapper">
                <img
                  className="commenter-pic"
                  src={profile.user.profilePicUrl}
                  alt="pic"
                />
                <Link to={`/${profile.user.username}`}>
                  <div className="caption-user-modal">
                    {profile.user.username}
                  </div>
                </Link>
                <PicModalCaption post={post} />
              </div>
              <div className="pic-modal-comments">
                {singlePost &&
                  singlePost.comments.map((comment) => {
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
                <FaRegHeart className="post-icon" />
                <FaRegCommentDots className="post-icon" />
              </div>
              <p className="info-likes">{post.likingUsers.length} likes</p>
              <div className="modal-comment-input">
                <CommentInput modal={true} post={post} />
              </div>
            </div>
          </div>
        </div>
      </PicModal>
    </>
  );
};

export default ProfilePost;

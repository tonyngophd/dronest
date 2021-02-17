import React, { useState, useEffect } from "react";
import { nanoid } from 'nanoid';
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
import {
  fetchSinglePost,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
} from "../../store/posts";
import timeStamp from '../utils';
import { deleteAPost } from '../../store/posts';
import { RiDeleteBin6Line } from 'react-icons/ri';

const ProfilePost = ({ post }) => {
  const [hover, setHover] = useState(false);
  const user = useSelector((state) => state.session.user);
  const [liked, setLiked] = useState(post.likingUsers[user.id]);
  const [saved, setSaved] = useState(post.userSaves[user.id]);
  const [likes, setLikes] = useState(Object.values(post.likingUsers).length);
  const [numComments, setNumComments] = useState(post.comments.length);
  const dispatch = useDispatch();
  const singlePost = useSelector((state) => state.posts.singlePost);
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
  const saveHandler = () => {
    if (saved) {
      dispatch(unsavePost(post.id));
      setSaved(false);
    } else {
      dispatch(savePost(post.id));
      setSaved(true);
    }
  };

  let timestamp = timeStamp(new Date(post.createdAt));


  const deleteHandler = (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    if (postId)
      dispatch(deleteAPost(postId));
  };


  return (
    <>
      <div
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        className="profile-post-pic-wrapper"
        onClick={() => {
          dispatch(fetchSinglePost(post.id));
          setIsPicOpen(true);
        }}
      >
        <img
          draggable="false"
          className={hover ? "profile-post-pic hovered" : "profile-post-pic"}
          src={post.images[0].mediaUrl}
          alt="pic"
        />
        <div
          className={
            hover
              ? "profile-post-pic-overlay hovered"
              : "profile-post-pic-overlay"
          }
        >
          <RiDeleteBin6Line className='profile-post-overlay-delete' 
            onClick={e => deleteHandler(e, post.id)}
          />

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
          <img className="modal-img" src={post.images[0].mediaUrl} />
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
                {singlePost.comments &&
                  singlePost.comments.map((comment) => {
                    return (
                      <div className="modal-comment" key={nanoid()}>
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
                  {saved ? (
                    <BsBookmarkFill
                      onClick={saveHandler}
                      className="post-icon-bk bk-full"
                    />
                  ) : (
                      <BsBookmark
                        onClick={saveHandler}
                        className="post-icon-bk"
                      />
                    )}
                </div>
              </div>
              <p className="info-likes">
                {likes} {likes === 1 ? "like" : "likes"}
              </p>
              <div className="post-timestamp">{timestamp}</div>
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

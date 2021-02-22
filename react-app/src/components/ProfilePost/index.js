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
} from "../../store/posts";
import { MediaDisplayer } from '../utils';
import { deleteAPost } from '../../store/posts';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEye } from 'react-icons/fi';

const ProfilePost = ({ post, setShowPostModal }) => {
  const [hover, setHover] = useState(false);
  const myself = useSelector((state) => state.session.user);
  const [likes, setLikes] = useState(post.likes);
  const [numComments, setNumComments] = useState(post.comments.length);
  const dispatch = useDispatch();

  const deleteHandler = (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    if (postId)
      dispatch(deleteAPost(postId));
  };

  const handleClick = e => {
    setShowPostModal(post.id);
  }


  return (
    <>
      <div
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        className="profile-post-pic-wrapper"
        onClick={() => {
          dispatch(fetchSinglePost(post.id));
        }}
      >
        <MediaDisplayer mediaUrl={post.images[0].mediaUrl}
          imgClassname={hover ? "profile-post-pic hovered" : "profile-post-pic"}
          vidClassname="profile-post-pic"
          vidWidth='400px'
          vidHeight='225px'
          imgHandleClick={handleClick}
          vidHandleClick={handleClick}
        />
        <div
          className={
            hover
              ? "profile-post-pic-overlay hovered"
              : "profile-post-pic-overlay"
          }
        >
          {
            (myself.id === post.user.id) && <RiDeleteBin6Line className='profile-post-overlay-delete'
              onClick={e => deleteHandler(e, post.id)}
            />
          }
          <div className="profile-post-pic-overlay-inner">
            <i className="fas fa-heart"></i>
            {likes}
          </div>
          <div className="profile-post-pic-overlay-inner">
            <i className="fas fa-eye"></i>
            {post.views}
          </div>
          <div className="profile-post-pic-overlay-inner">
            <i className="fas fa-comment"></i>
            {numComments}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePost;

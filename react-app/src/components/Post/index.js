import React, { useState, useEffect } from "react";
import { nanoid } from 'nanoid';
// import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import {
  BsHeart,
  BsChat,
  BsBookmark,
  BsHeartFill,
  BsBookmarkFill,
} from "react-icons/bs";
import { RiDeleteBin6Line } from 'react-icons/ri';
import Editor from "@draft-js-plugins/editor";
import { EditorState, convertFromRaw } from "draft-js";
import createMentionPlugin from "@draft-js-plugins/mention";
import { useHistory, Link } from "react-router-dom";
import CommentInput from "../CommentInput";
import Comment from "../Comment";
import "./post.css";
import { likePost, unlikePost, savePost, unsavePost } from "../../store/posts";
import { useDispatch, useSelector } from "react-redux";
import timeStamp from '../utils';
import { deleteAPost } from '../../store/posts';

function Post({ post }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const comments = post.comments; 
  const [liked, setLiked] = useState(post.likingUsers[user.id]);
  const [saved, setSaved] = useState(post.userSaves[user.id]);
  const [likes, setLikes] = useState(Object.values(post.likingUsers).length);
  const [clicks, setClicks] = useState(0);
  const [userMentionPlugin] = useState(
    createMentionPlugin({
      mentionComponent: (mentionProps) => (
        <span
          className={`${mentionProps.className} post-mention`}
          onClick={(event) => {
            event.stopPropagation();
            history.push(`/${mentionProps.mention.name}`);
          }}
        >
          {mentionProps.children}
        </span>
      ),
      theme: {
        mention: "mention",
      },
      mentionPrefix: "@",
    })
  );
  const [hashtagMentionPlugin] = useState(
    createMentionPlugin({
      mentionComponent: (mentionProps) => (
        <span
          className={`${mentionProps.className} post-mention`}
          onClick={(event) => {
            event.stopPropagation();
            history.push(`/explore/tags/${mentionProps.mention.name}/`);
          }}
        >
          {mentionProps.children}
        </span>
      ),
      theme: {
        mention: "mention",
      },
      mentionTrigger: "#",
      mentionPrefix: "#",
    })
  );

  const plugins = [userMentionPlugin, hashtagMentionPlugin];
  let data = "";
  if (post.captionRawData) {
    data = JSON.parse(post.captionRawData);
    data = convertFromRaw(data);
  }
  const [editorState, setEditorState] = useState(
    (data?EditorState.createWithContent(data):EditorState.createEmpty())
  );

  let timestamp = timeStamp(new Date(post.createdAt));

  useEffect(() => {
    if (clicks === 2 && !liked) {
      dispatch(likePost(post.id));
      setLiked(true);
      setLikes(likes + 1);
    }
    setTimeout(() => setClicks(0), 300);
  }, [clicks]);

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

  const deleteHandler = (e) => {
    e.preventDefault();
    let postId = Number(e.target.id.split("-")[0]);
    if(!postId){
      try{
        postId = Number(e.target.parentNode.parentNode.id.split("-")[0]);
      } catch(e){        
      }
    }
    if(postId)
       dispatch(deleteAPost(postId));
  };

  return (
    <div className="feed_post-container">
      <div className='feed_post-profile-and-delete-button'>
        <Link to={`/${post.user.username}`}>
          <div className="feed_post-header">
            <img
              src={post.user.profilePicUrl}
              draggable="false"
              alt="user-icon"
            />
            <p className="feed_post-username">{post.user.username}</p>
          </div>
        </Link>
        {user.id === post.user.id && <div className="feed_post-delete-button"
          id={`${post.id}-post`}
        >
          <RiDeleteBin6Line id={`${post.id}-deletebutton`} onClick={deleteHandler} />
        </div>}
      </div>
      <div className="feed_post-image">
        <img
          onClick={() => setClicks(clicks + 1)}
          src={
            (post.images[0] && post.images[0].mediaUrl) ||
            "https://placeimg.com/500/500"
          }
          draggable="false"
          alt="user-icon"
        />
      </div>
      <div className="feed_post-info">
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
            <BsChat
              onClick={() => history.push(`/p/${post.id}`)}
              className="post-icon-comment"
            />
          </div>
          <div className="feed_post-info-icons-right">
            {saved ? (
              <BsBookmarkFill
                onClick={saveHandler}
                className="post-icon-bk bk-full"
              />
            ) : (
                <BsBookmark onClick={saveHandler} className="post-icon-bk" />
              )}
          </div>
        </div>
        <div className="feed_post-info-comments">
          <p className="info-likes">
            {likes} {likes === 1 ? "like" : "likes"}
          </p>
          <div className="info-caption">
            <Link to={`/${post.user.username}`}>
              <div className="caption-user">{post.user.username}</div>
            </Link>

            <div className="post-caption">
              <Editor
                editorState={editorState}
                readOnly={true}
                plugins={plugins}
                onChange={(editorState) => setEditorState(editorState)}
              />
            </div>
          </div>

          <div className="post-comments-container">
            {comments &&
              comments.map((comment) => {
                return <Comment home={true} comment={comment}  key={nanoid()}/>;
              })}
          </div>
          <Link to={`/p/${post.id}`}>
            <div className="post-timestamp">{timestamp}</div>
          </Link>
          <div className="post-new-comment">
            <CommentInput post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}
export function BarePost({ post }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const comments = post.comments; 
  const [liked, setLiked] = useState(post.likingUsers[user.id]);
  const [saved, setSaved] = useState(post.userSaves[user.id]);
  const [likes, setLikes] = useState(Object.values(post.likingUsers).length);
  const [clicks, setClicks] = useState(0);
  const [userMentionPlugin] = useState(
    createMentionPlugin({
      mentionComponent: (mentionProps) => (
        <span
          className={`${mentionProps.className} post-mention`}
          onClick={(event) => {
            event.stopPropagation();
            history.push(`/${mentionProps.mention.name}`);
          }}
        >
          {mentionProps.children}
        </span>
      ),
      theme: {
        mention: "mention",
      },
      mentionPrefix: "@",
    })
  );
  const [hashtagMentionPlugin] = useState(
    createMentionPlugin({
      mentionComponent: (mentionProps) => (
        <span
          className={`${mentionProps.className} post-mention`}
          onClick={(event) => {
            event.stopPropagation();
            history.push(`/explore/tags/${mentionProps.mention.name}/`);
          }}
        >
          {mentionProps.children}
        </span>
      ),
      theme: {
        mention: "mention",
      },
      mentionTrigger: "#",
      mentionPrefix: "#",
    })
  );

  const plugins = [userMentionPlugin, hashtagMentionPlugin];
  let data = "";
  if (post.captionRawData) {
    data = JSON.parse(post.captionRawData);
    data = convertFromRaw(data);
  }
  const [editorState, setEditorState] = useState(
    (data?EditorState.createWithContent(data):EditorState.createEmpty())
  );

  let timestamp = timeStamp(new Date(post.createdAt));

  useEffect(() => {
    if (clicks === 2 && !liked) {
      dispatch(likePost(post.id));
      setLiked(true);
      setLikes(likes + 1);
    }
    setTimeout(() => setClicks(0), 300);
  }, [clicks]);

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

  const deleteHandler = (e) => {
    e.preventDefault();
    let postId = Number(e.target.id.split("-")[0]);
    if(!postId){
      try{
        postId = Number(e.target.parentNode.parentNode.id.split("-")[0]);
      } catch(e){        
      }
    }
    if(postId)
       dispatch(deleteAPost(postId));
  };

  return (
    <div className="feed_post-container">
      {/* <div className='feed_post-profile-and-delete-button'>
        <Link to={`/${post.user.username}`}>
          <div className="feed_post-header">
            <img
              src={post.user.profilePicUrl}
              draggable="false"
              alt="user-icon"
            />
            <p className="feed_post-username">{post.user.username}</p>
          </div>
        </Link>
        {user.id === post.user.id && <div className="feed_post-delete-button"
          id={`${post.id}-post`}
        >
          <RiDeleteBin6Line id={`${post.id}-deletebutton`} onClick={deleteHandler} />
        </div>}
      </div> */}
      <div className="feed_post-image">
        <img
          onClick={() => setClicks(clicks + 1)}
          src={
            (post.images[0] && post.images[0].mediaUrl) ||
            "https://placeimg.com/500/500"
          }
          draggable="false"
          alt="user-icon"
        />
      </div>
      {/* <div className="feed_post-info">
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
            <BsChat
              onClick={() => history.push(`/p/${post.id}`)}
              className="post-icon-comment"
            />
          </div>
          <div className="feed_post-info-icons-right">
            {saved ? (
              <BsBookmarkFill
                onClick={saveHandler}
                className="post-icon-bk bk-full"
              />
            ) : (
                <BsBookmark onClick={saveHandler} className="post-icon-bk" />
              )}
          </div>
        </div>
        <div className="feed_post-info-comments">
          <p className="info-likes">
            {likes} {likes === 1 ? "like" : "likes"}
          </p>
          <div className="info-caption">
            <Link to={`/${post.user.username}`}>
              <div className="caption-user">{post.user.username}</div>
            </Link>

            <div className="post-caption">
              <Editor
                editorState={editorState}
                readOnly={true}
                plugins={plugins}
                onChange={(editorState) => setEditorState(editorState)}
              />
            </div>
          </div>

          <div className="post-comments-container">
            {comments &&
              comments.map((comment) => {
                return <Comment home={true} comment={comment}  key={nanoid()}/>;
              })}
          </div>
          <Link to={`/p/${post.id}`}>
            <div className="post-timestamp">{timestamp}</div>
          </Link>
          <div className="post-new-comment">
            <CommentInput post={post} />
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Post;

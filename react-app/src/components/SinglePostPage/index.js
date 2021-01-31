import React, { useState, useEffect } from "react";
import "./SinglePostPage.css";
import PicModal from "../PicModal";
import PicModalCaption from "../PicModalCaption";
import CommentInput from "../CommentInput";
import Comment from "../Comment";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../store/notifications";
import {
  BsHeart,
  BsChat,
  BsBookmark,
  BsHeartFill,
  BsBookmarkFill,
} from "react-icons/bs";
import { fetchSinglePost, likePost, unlikePost } from "../../store/posts";
import { fetchUserProfile } from "../../store/profile";
import ProfileFeed from "../ProfileFeed";

const SinglePostPage = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.session.user);
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [count, setCount] = useState(1);
  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchSinglePost(id));
  }, [id]);

  const singlePost = useSelector((state) => state.posts.singlePost);
  useEffect(() => {
    if (count !== 1) {
      setLiked(singlePost.likingUsers[user.id]);
      setLikes(Object.values(singlePost.likingUsers).length);
      dispatch(fetchUserProfile(singlePost.user.username));
    }
    setCount(count + 1);
  }, [singlePost]);

  const likeHandler = () => {
    if (liked) {
      dispatch(unlikePost(singlePost.id));
      setLiked(false);
      setLikes(likes - 1);
    } else {
      dispatch(likePost(singlePost.id));
      setLiked(true);
      setLikes(likes + 1);
    }
  };
  let createdAt = new Date(singlePost.createdAt);
  let now = Date.now();
  let elapsed = now - createdAt;
  let timestamp;
  if (elapsed < 1000) {
    timestamp = `NOW`;
  } else if (elapsed < 60000) {
    timestamp = `${Math.floor(elapsed / 1000)} SECONDS AGO`;
  } else if (elapsed < 120000) {
    timestamp = `${Math.floor(elapsed / 60000)} MINUTE AGO`;
  } else if (elapsed < 3600000) {
    timestamp = `${Math.floor(elapsed / 60000)} MINUTES AGO`;
  } else if (elapsed < 7200000) {
    timestamp = `${Math.floor(elapsed / 3600000)} HOUR AGO`;
  } else if (elapsed < 86400000) {
    timestamp = `${Math.floor(elapsed / 3600000)} HOURS AGO`;
  } else {
    timestamp = createdAt.toDateString().split(" ").splice(1, 2).join(" ");
  }

  return (
    <>
      {singlePost.likingUsers && (
        <div className="pic-modal-container single-post">
          {singlePost.images && (
            <img
              className="modal-img single-image"
              src={singlePost.images[0].imgUrl}
            />
          )}
          <div className="pic-modal-right single-post-right">
            <Link
              className="pic-modal-header"
              to={`/${singlePost.user.username}`}
            >
              <img src={singlePost.user.profilePicUrl} alt="user-icon" />
              <span className="feed_post-username">
                {singlePost.user.username}
              </span>
            </Link>
            <div className="caption-and-comments">
              <div className="pic-modal-caption-wrapper">
                <img
                  className="commenter-pic"
                  src={singlePost.user.profilePicUrl}
                  alt="pic"
                />
                <Link to={`/${singlePost.user.username}`}>
                  <div className="caption-user-modal">
                    {singlePost.user.username}
                  </div>
                </Link>
                <PicModalCaption post={singlePost} />
              </div>
              <div className="pic-modal-comments">
                {singlePost.comments &&
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
            <div className="pic-modal-utils single-post-utils">
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
              <div className="post-timestamp">{timestamp}</div>
              <div className="modal-comment-input">
                <CommentInput modal={true} post={singlePost} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SinglePostPage;

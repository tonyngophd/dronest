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
import { Plugins } from '../utils';
import Modal from '../AAPopups/Modals';

function Post({ post }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const comments = post.comments; 
  const [liked, setLiked] = useState(post.likingUsers[user.id]);
  const [saved, setSaved] = useState(post.userSaves[user.id]);
  const [likes, setLikes] = useState(Object.values(post.likingUsers).length);
  const [clicks, setClicks] = useState(0);

  const plugins = Plugins();
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
  
  const plugins = Plugins();
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
    </div>
  );
}

export function AddAPostModal({setShowModal}) {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.session.user);
	const [errors, setErrors] = useState([]);
	const [messages, setMessages] = useState([]);
	const [username, setUsername] = useState(user && user.username);
	const [name, setName] = useState(user && user.name);
	const [email, setEmail] = useState(user && user.email);
	const [bio, setBio] = useState(user && user.bio);
	const [websiteUrl, setWebsiteUrl] = useState(user && user.websiteUrl);
	const [profilePicUrl, setProfilePicUrl] = useState(user && user.profilePicUrl);
	const [showChangeUsername, setShowChangeUsername] = useState(false);

	const onUpdateProfile = async (e) => {
		e.preventDefault();

		// const resJson = await dispatch(updateUser(username, name, email, bio, websiteUrl, profilePicUrl));
		// if (resJson.errors) {
		// 	setErrors(resJson.errors);
		// } else {
		// 	setErrors([]);
		// 	setMessages(["Profile updated successfully!"])
		// 	setTimeout(() => setShowModal(false), 1500);
		// }
	};

	const updateUsername = (e) => {
		setUsername(e.target.value);
	};

	const updateName = (e) => {
		setName(e.target.value);
	};

	const updateEmail = (e) => {
		setEmail(e.target.value);
	};

	const updateBio = (e) => {
		setBio(e.target.value);
	};

	const updateWebsiteUrl = (e) => {
		setWebsiteUrl(e.target.value);
	};

	const updateProfilePicUrl = (e) => {
		setProfilePicUrl(e.target.value);
	};

	// if (!user) {
	// 	return <Redirect to="/login" />;
	// }

	const closeModal = (e) => {
		e.preventDefault();
		if (
			e.target.className === "modal" ||
			e.target.className.animVal !== undefined
		) {
			setShowModal(false);
		}
	}

	const escapeHideModal = e => {
		if (e.key === 'Escape')
			setShowModal(false);
	}

	const onSubmitClick = e => {
		e.stopPropagation();
		// setPasswordIsSubmitting(true);
		// setNewPasswordIsSubmitting(true);
		// setNewCPasswordIsSubmitting(true);    
	}
  return (
    <Modal setShowModal={setShowModal}>
			<form className="login-form" onSubmit={onUpdateProfile}>
				<div className='errors-div'>
					{errors.map((error) => (
						<div key={nanoid()}>{error}</div>
					))}
				</div>
				{messages.length ? <div className='errors-div' style={{ color: 'green' }}>
					{messages.map((m) => (
						<div key={nanoid()}>{m}</div>
					))}
				</div> :
					<>
						<div className="update-form-element" style={{ width: '300px', marginBottom: '20px' }}>
							<label htmlFor="changeusernameswitch" style={{ width: '200px' }}>Change Username? </label>
							<input
								style={{ width: '30px' }}
								type="checkbox"
								name="changeusernameswitch"
								onClick={e => {
									e.stopPropagation();
									setShowChangeUsername(e.target.checked);
								}}
								onChange={e => e}
								checked={showChangeUsername}
							/>
						</div>
						{showChangeUsername && <div className="update-form-element">
							<label htmlFor="username">Username: </label>
							<input
								type="text"
								name="username"
								placeholder="Username"
								onChange={updateUsername}
								value={username}
							></input>
						</div>}
						<div className="update-form-element">
							<label htmlFor="name">Name: </label>
							<input
								type="text"
								name="name"
								placeholder="Name"
								onChange={updateName}
								value={name}
								autoFocus={true}
							></input>
						</div>
						<div className="update-form-element">
							<label htmlFor="email">Email: </label>
							<input
								type="email"
								name="email"
								placeholder="Email"
								onChange={updateEmail}
								value={email}
							></input>
						</div>
						<div className="update-form-element">
							<label htmlFor="bio">Bio: </label>
							<input
								type="text"
								name="bio"
								placeholder="Bio"
								onChange={updateBio}
								value={bio}
							></input>
						</div>
						<div className="update-form-element">
							<label htmlFor="websiteUrl">Website Url: </label>
							<input
								type="text"
								name="websiteUrl"
								placeholder="Website URL"
								onChange={updateWebsiteUrl}
								value={websiteUrl}
							></input>
						</div>
						<div className="update-form-element">
							<label htmlFor="profilePicUrl">Profile Pic Url: </label>
							<input
								type="text"
								name="profilePicUrl"
								placeholder="Profile Picture URL"
								onChange={updateProfilePicUrl}
								value={profilePicUrl}
							></input>
						</div>
						<div className="buttons">
							<button type="submit" id="login-button" onClick={onSubmitClick}>Update</button>
							<button id="cancel-button" className='cancel-button' onClick={e => setShowModal(false)}>Cancel</button>
						</div>
					</>}
			</form>
    </Modal>
  );
}

export default Post;

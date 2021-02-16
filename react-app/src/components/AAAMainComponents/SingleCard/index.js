import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineHeart, AiOutlineEye } from 'react-icons/ai';
import { FiEye } from 'react-icons/fi';
import timeStamp from '../../utils';
import Modal from '../../AAPopups/Modals';
import LoginForm from '../../auth/LoginForm';
import { nanoid } from 'nanoid';
import { NextOrPrevious } from '../Bands';

import {
  likePost, unlikePost, savePost, unsavePost, loadSinglePost,
} from '../../../store/posts';
import { fetchAUsersPostView } from '../../../store/users';

import {
  BsHeart,
  BsChat,
  BsBookmark,
  BsHeartFill,
  BsBookmarkFill,
  BsStar,
  BsStarFill,
} from "react-icons/bs";
import { SiFacebook } from 'react-icons/si';
import { RiShareForwardLine } from 'react-icons/ri';
import Editor from "@draft-js-plugins/editor";
import { EditorState, convertFromRaw } from "draft-js";
import createMentionPlugin from "@draft-js-plugins/mention";
import { Plugins } from '../../utils';
import { notFollowedYet } from "../../ProfilePage";

import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  TumblrShareButton,
  TumblrIcon,
  TwitterShareButton,
  TwitterIcon,
  ViberShareButton,
  ViberIcon,
  WhatsappShareButton,
  WhatsappIcon
} from "react-share";

import UserRow from '../../ProfilePage/UserRow';
import CommentInput from "../../CommentInput";
import Comment from "../../Comment";
import PicModalCaption from "../../PicModalCaption";
import { MapWithMarkerClusterer } from '../../GoogleMaps';


import './SingleCard.css';

export function FullScreenPicModal({ setShowModal, media }) {
  let src = media.imgUrl;
  useEffect(() => {
    console.log(media.imgUrl);
  }, [media]);
  return (
    <Modal setShowModal={setShowModal}
      dronestLogo={false} needsEscapeInput={true}
      closeXOutSide={true} noTopDiv={true}
      width='100vw' noScrollBar={true}
    >
      <div className='fullscreen-img-container'>
        <img src={media.mediaUrl} alt={media.mediaUrl}
          className='fullscreen-img'
        />
      </div>
    </Modal>
  );
}

export function ConfirmIWantToLogInModal({ setShowModal, setShowLoginForm }) {
  const history = useHistory();

  const handelOkClick = e => {
    setShowModal(false);
    setShowLoginForm(true);
  }

  return (
    <Modal setShowModal={setShowModal}
      dronestLogo={false} needsEscapeInput={true}
      title="Please login to like, save or share"
    >
      <div style={{ marginBottom: '20px' }}>
        <div className="short-buttons">
          <button id="cancel-button" className='cancel-button'
            onClick={e => setShowModal(false)}
          >Cancel</button>
          <button onClick={handelOkClick}>OK</button>
        </div>
      </div>
    </Modal>
  );
}

function ShareButtonsWindow({ setShowModal }) {
  const ListOfButtons = [
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    PinterestShareButton,
    RedditShareButton,
    TumblrShareButton,
    TwitterShareButton,
    ViberShareButton,
    WhatsappShareButton,
  ];
  const ListOfIcons = [
    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    PinterestIcon,
    RedditIcon,
    TumblrIcon,
    TwitterIcon,
    ViberIcon,
    WhatsappIcon,
  ]

  return (
    <div className='share-buttons-div'>
      <Modal setShowModal={setShowModal}
        shieldBackground={false} title="Share this post"
        dronestLogo={false}
        width={'200px'}
        needsEscapeInput={true}
      >
        <div style={{ display: 'flex', minWidth: '100px', justifyContent: 'space-evenly' }}>
          {
            ListOfButtons.map((El, i) =>
              <div key={nanoid()} style={{ margin: 'auto 2px' }}>
                <El
                  url={'www.dronest.com'}
                  quote={"Share on your social media"}
                >
                  {
                    ListOfIcons.map((Icon, j) => j === i ? <Icon size={32} round key={nanoid()} /> : false)
                  }
                </El>
              </div>
            )
          }
        </div>
      </Modal>
    </div>
  );
}

export function PostModal({ setShowModal, user, posts }) {
  const myself = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [postIndex, setPostIndex] = useState(0)
  const [post, setPost] = useState(posts[postIndex]);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [iLikedThisPost, updateILikedThisPost] =
    useState(myself && myself.likedPosts.find(p => p.id === post.id) ? true : false);
  const [iFavedThisPost, updateIFavedThisPost] =
    useState(myself && myself.savedPosts.find(p => p.id === post.id) ? true : false);
  const [showConfirmLogin, updateConfirmLogin] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showShareButtons, setShowShareButtons] = useState(false);
  const history = useHistory();
  const comments = useSelector(state => state.posts.singlePost.comments);
  const [spot, setSpot] = useState(undefined);
  const [showPicFullScreen, setShowPicFullScreen] = useState(false);
  const [currentPic, setCurrentPic] = useState(null);

  useEffect(() => {
    if (postIndex >= 0 && postIndex < posts.length) {
      setPost(posts[postIndex]);
      dispatch(loadSinglePost(posts[postIndex]));
      dispatch(fetchAUsersPostView(posts[postIndex].id, posts[postIndex].images[mediaIndex].id));
      setSpot({
        city: post.location.city,
        stateProvince: post.location.state,
        zipCode: post.location.zipCode,
        country: post.location.country,
        gpsLocation: [post.location.latitude, post.location.longitude]
      })
    }
  }, [postIndex]);

  useEffect(() => {
    if (!myself) return;
    updateILikedThisPost(myself.likedPosts.find(p => p.id === post.id) ? true : false);
    updateIFavedThisPost(myself.savedPosts.find(p => p.id === post.id) ? true : false);
  }, [post, myself]);

  const handleLikeClick = async (e) => {
    if (!myself) {
      return updateConfirmLogin(true);
    }
    const res = await dispatch(iLikedThisPost ? unlikePost(post.id) : likePost(post.id));
    if (res)
      updateILikedThisPost(myself.likedPosts.find(p => p.id === post.id) ? true : false);
  }
  const handleFaveClick = async (e) => {
    if (!myself) {
      return updateConfirmLogin(true);
    }
    const res = await dispatch(iFavedThisPost ? unsavePost(post.id) : savePost(post.id));
    if (res)
      updateIFavedThisPost(myself.savedPosts.find(p => p.id === post.id) ? true : false);
  }


  // const tryfetchLatLong = async () => {
  //   const res = await fetch('http://api.positionstack.com/v1/forward?access_key=a085731167a663896cade0e428d324ec&query=1600 Pennsylvania Ave NW, Washington DC\
  //   &limit=1\
  //   &output=json');
  //   const res2 = await res.json();
  //   console.log('map', res2);
  // }


  const handleShareClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!myself) {
      return updateConfirmLogin(true);
    }
    setShowShareButtons(!showShareButtons);
    // tryfetchLatLong();
  }

  const onNextPostClick = e => {
    e.preventDefault();
    let index = postIndex + 1;
    if (index > posts.length - 1) index = 0;
    setPostIndex(index);
  }

  const onPrevPostClick = e => {
    e.preventDefault();
    let index = postIndex - 1;
    if (index < 0) index = posts.length - 1;
    setPostIndex(index);
  }

  const onNextMediaClick = e => {
    e.preventDefault();
    let index = mediaIndex + 1;
    if (index > post.images.length - 1) index = 0;
    setMediaIndex(index);
  }

  const onPrevMediaClick = e => {
    e.preventDefault();
    let index = mediaIndex - 1;
    if (index < 0) index = post.images.length - 1;
    setMediaIndex(index);
  }

  const plugins = Plugins();
  let data = "";
  if (post.captionRawData) {
    data = JSON.parse(post.captionRawData);
    data = convertFromRaw(data);
  }
  const [editorState, setEditorState] = useState(
    (data ? EditorState.createWithContent(data) : EditorState.createEmpty())
  );
  let timestamp = timeStamp(new Date(post.createdAt));


  return (
    <>
      <Modal setShowModal={setShowModal}
        dronestLogo={false} needsEscapeInput={true}
        closeXOutSide={true} noTopDiv={true}
        width='1100px'
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center', width: '100%'

        }}>
          {posts.length > 1 && <div style={{
            position: 'fixed',
            left: '30px', zIndex: '200',
            backgroundColor: 'lightgreen',
            borderRadius: '5px', overflow: 'hidden'
          }}>
            <NextOrPrevious next={false} onClick={onPrevPostClick} />
          </div>}
          <div style={{ width: '100%' }}>
            {/* <div className="custom-modal-top-div">

            </div> */}
            <div className="single-card-modal-images-div">
              <div className='post-modal-img-div'>
                <img src={post.images[mediaIndex].mediaUrl} alt="individual picture"
                  className='post-modal-img'
                  // onLoad={e=>console.log(e.target.width)} 
                  onClick={e => {
                    setCurrentPic(post.images[mediaIndex]);
                    setShowPicFullScreen(true);
                  }}
                />
                {
                  post.images.length > 1 && 
                  <div className='post-modal-img-preview-div'>
                    <NextOrPrevious next={false} onClick={onPrevMediaClick} />
                    {
                      post.images.map((m, i) => 
                      <div key={nanoid()}>
                        <img src={m.mediaUrl} alt='' 
                          className={i===mediaIndex?'post-modal-img-preview-current':'post-modal-img-preview'}
                          onClick={e => setMediaIndex(i)}
                        />
                      </div>)
                    }
                    <NextOrPrevious next={true} onClick={onNextMediaClick} />
                  </div>
                }
              </div>
              <div>
                <div className='post-modal-user-like-save-share'>
                  <div className='post-modal-user-row-div'>
                    <UserRow
                      user={user}
                      // searchable={searchable}
                      myId={myself ? myself.id : 0}
                      notFollowedYet={myself ? notFollowedYet(user.id, myself) : true}
                      key={nanoid()}
                      followAsButton={true}
                    />
                  </div>
                  <div className='post-modal-like-share-save-div'>
                    <div className='post-modal-like-div' onClick={handleLikeClick}>
                      {iLikedThisPost ?
                        <BsHeartFill /> :
                        <BsHeart />
                      }
                      <div className='share-button-div'>
                        {post.likes}
                      </div>
                    </div>
                    <div className='post-modal-like-div' onClick={handleFaveClick}>
                      {iFavedThisPost ?
                        <BsStarFill /> :
                        <BsStar />
                      }
                      <div className='share-button-div'> Save</div>
                    </div>
                    <div className='post-modal-like-div' onClick={handleShareClick}>
                      {
                        showShareButtons && <ShareButtonsWindow setShowModal={setShowShareButtons} />
                      }
                      <RiShareForwardLine />
                      <div className='share-button-div'> Share</div>
                    </div>
                  </div>
                </div>
                <div className='post-modal-like-share-save-div'>
                  <PicModalCaption post={post} />
                </div>
                <div>
                  <div className="postmodal-comments-container">
                    {comments &&
                      comments.map((comment) =>
                        <div className="modal-comment" key={nanoid()} style={{ marginBottom: '0px', marginTop: '0px' }}>
                          <img
                            className="commenter-pic"
                            src={comment.commenterPic}
                            style={{ width: '30px', height: '30px', marginLeft: '0px', marginRight: '5px' }}
                          />
                          <Comment comment={comment} home={false} nameFontSize='12px' />
                        </div>)}
                  </div>
                  <div className="post-new-comment">
                    <CommentInput
                      post={post} className='modal-comment-editor-wrapper'
                      insideCN='post-modal-commentinput-div' modal={true}
                      hasBorder={true} />
                  </div>
                </div>
                <div className='home-side-map'>
                  {
                    spot && <MapWithMarkerClusterer
                      center={{ lat: spot.gpsLocation[0], lng: spot.gpsLocation[1] }}
                      zoom={5}
                      spots={[spot]} />
                  }
                </div>
              </div>
            </div>

            <div>

            </div>
            {
              showConfirmLogin && <ConfirmIWantToLogInModal
                setShowModal={updateConfirmLogin}
                setShowLoginForm={setShowLoginForm}
              />
            }
            {showLoginForm && <LoginForm setShowModal={setShowLoginForm} redirect={false} />}
          </div>
          {posts.length > 1 && <div style={{
            position: 'fixed',
            right: '30px', zIndex: '200',
            backgroundColor: 'lightgreen',
            borderRadius: '5px', overflow: 'hidden'
          }}>
            <NextOrPrevious onClick={onNextPostClick} />
          </div>}
        </div>
      </Modal>
      {
        showPicFullScreen && <FullScreenPicModal setShowModal={setShowPicFullScreen} media={currentPic} />
      }
    </>
  );
}

export default function SingleCard({ user, moreInfo = true, category = false, location = false }) {
  let src = 'https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/s720x720/146887222_10224900286638677_3698840883103249499_o.jpg?_nc_cat=104&ccb=2&_nc_sid=825194&_nc_ohc=ymzZQjKFmpwAX8sKlQ_&_nc_ht=scontent-iad3-1.xx&tp=7&oh=f9f9313ef82e283cda40f81d16ae8365&oe=604764F6';
  let cat = "Generic";
  let loc = "Great city"
  let timestamp;
  let views = 0;
  let likes = 0;
  let album = 'Generic';
  let equipment = 'Unknown';
  const [showPostModal, setShowPostModal] = useState(false);

  if (user && user.ownPosts && user.ownPosts.length > 0) {
    timestamp = timeStamp(new Date(user.ownPosts[0].createdAt), true, true);
    src = user.ownPosts[0].images[0].mediaUrl;
    loc = user.ownPosts[0].location.city;
    cat = user.ownPosts[0].category.name;
    views = user.ownPosts[0].views;
    likes += user.ownPosts[0].likes;
    album = user.ownPosts[0].album.name;
    equipment = user.ownPosts[0].equipment.name;
  } else {
    return <></>;
  }

  const handleClick = e => {
    setShowPostModal(true);
  }

  return (
    <div className={category || location ? 'single-card-outer-container-catloc' : 'single-card-outer-container'}>
      <div className={category || location ? 'single-card-top-image-div-catloc' : 'single-card-top-image-div'}>
        <img
          className='single-card-main-img'
          // src='https://tripcamp.s3.amazonaws.com/resources/images/official/spots/NorthernRim%20Campground.jpg'
          src={src}
          onClick={handleClick}
          alt='good band picture' />
      </div>
      {category &&
        <div className='single-card-info-div'>
          <div><b>{cat}</b></div>
        </div>
      }
      {location &&
        <div className='single-card-info-div'>
          <div><b>{loc}</b></div>
        </div>
      }
      {moreInfo &&
        <div className='single-card-info-div'>
          <div><b>Album</b>: {album}</div>
          <div>Equipment: {equipment}</div>
          <div className="single-card-love-view-div">
            <div>
              <AiOutlineHeart />
              <span>{likes}</span>
            </div>
            <div>
              <FiEye />
              <span>{views}</span>
            </div>
          </div>
        </div>
      }
      {user && !category &&
        <>
          <hr className='single-card-hr'></hr>
          <div className='single-card-user-and-date-div'>
            <div className='single-card-user-info-div'>
              <UserRow showFollowButtonOrText={false} user={user} short={true} />
            </div>
            <div>
              {timestamp}
              {/* {timeStamp(new Date('2021-02-05'), true)} */}
            </div>
          </div>
        </>
      }
      {
        showPostModal && <PostModal user={user} posts={user.ownPosts} setShowModal={setShowPostModal} />
      }
    </div>
  );
}
import { updateAUsersPostPOJO } from './users';
import { updateAProfilePostPOJO } from './profile';
import {
  updateUsersLikePOJO,
  updateUsersFavePOJO,
  removeAPostOfSessionUserPOJO
} from './session';

import { removeAPostOfProfileUserPOJO } from './profile';

const CREATE_POST = "posts/CREATE_POST";
const DELETE_POST = "posts/DELETE_POST";
const CREATE_COMMENT = "posts/CREATE_COMMENT";
const CREATE_MODAL_COMMENT = "posts/CREATE_MODAL_COMMENT";

const FETCH_HOME_FEED = "posts/FETCH_HOME_FEED";
const FETCH_ALL_FEED = "posts/FETCH_ALL_FEED";
const FETCH_SINGLE_POST = "posts/FETCH_SINGLE_POST";
const FETCH_HASHTAG_FEED = "posts/FETCH_HASHTAG_FEED";
const FETCH_EXPLORE_FEED = "posts/FETCH_EXPLORE_FEED";

const createNewPost = (post) => ({
  type: CREATE_POST,
  payload: post,
});

const deleteAPostPOJO = (postId) => ({
  type: DELETE_POST,
  payload: postId,
});

const createNewComment = (comment) => ({
  type: CREATE_COMMENT,
  payload: comment,
});
const createModalComment = (comment) => ({
  type: CREATE_MODAL_COMMENT,
  payload: comment,
});

const loadHomeFeed = (feed) => ({
  type: FETCH_HOME_FEED,
  payload: feed,
});

const loadAllFeedPOJO = (feed) => ({
  type: FETCH_ALL_FEED,
  payload: feed,
});

const loadHashtagFeed = (feed) => ({
  type: FETCH_HASHTAG_FEED,
  payload: feed,
});

const loadExploreFeed = (feed) => ({
  type: FETCH_EXPLORE_FEED,
  payload: feed,
});

export const loadSinglePost = (post) => ({
  type: FETCH_SINGLE_POST,
  payload: post,
});

export const uploadPost = (
  userId,
  mentionedUsers,
  hashtags,
  rawData,
  images
) => async (dispatch) => {
  mentionedUsers = mentionedUsers.map((user) => {
    return user.id;
  });
  // console.log(mentionedUsers);
  const form = new FormData();
  form.append("userId", userId);
  form.append("mentionedUsers", JSON.stringify(mentionedUsers));
  form.append("hashtags", JSON.stringify(hashtags));
  form.append("rawData", JSON.stringify(rawData));
  form.append('numberOfImages', images.length);
  images.forEach((image, i) => form.append(`image_${i}`, image));

  const res = await fetch("/api/posts/", {
    method: "POST",
    body: form,
  });
  if (res.ok) {
    const newPost = await res.json();
    if(!newPost.errors)
      dispatch(createNewPost(newPost));
    return newPost;
  }
};

export const uploadComment = (
  userId,
  mentionedUsers,
  rawData,
  postId,
  modal
) => async (dispatch) => {
  mentionedUsers = mentionedUsers.map((user) => {
    return user.id;
  });
  const form = new FormData();
  form.append("userId", userId);
  form.append("mentionedUsers", JSON.stringify(mentionedUsers));
  form.append("rawData", JSON.stringify(rawData));
  form.append("parentPostId", postId);
  const res = await fetch("/api/comments/", {
    method: "POST",
    body: form,
  });
  const newComment = await res.json();
  if (!modal) {
    dispatch(createNewComment(newComment));
  } else {
    dispatch(createModalComment(newComment));
  }
};

export const fetchHomeFeed = (userId, page) => async (dispatch) => {
  const res = await fetch(`/api/posts/${userId}/feed/${page}`);
  let feed = await res.json();
  feed = feed["posts"];
  dispatch(loadHomeFeed(feed));
};
export const fetchAllPosts = (page) => async (dispatch) => {
  const res = await fetch(`/api/posts/feed/${page}`);
  let feed = await res.json();
  feed = feed["posts"];
  dispatch(loadAllFeedPOJO(feed));
};

export const fetchHashtagFeed = (hashtag, page) => async (dispatch) => {
  const res = await fetch(`/api/posts/tag/${hashtag}/${page}`);
  let feed = await res.json();
  feed = feed["posts"];
  dispatch(loadHashtagFeed(feed));
};

export const fetchExploreFeed = (page) => async (dispatch) => {
  const res = await fetch(`/api/posts/explore/${page}`);
  let feed = await res.json();
  feed = feed["posts"];
  dispatch(loadExploreFeed(feed));
};

export const fetchSinglePost = (postId) => async (dispatch) => {
  const res = await fetch(`/api/posts/${postId}`);
  let post = await res.json();
  post = post["post"];
  dispatch(loadSinglePost(post));
};

export const likeComment = (commentId) => async (dispatch) => {
  const res = await fetch(`/api/posts/comments/${commentId}/like`);
};

export const unlikeComment = (commentId) => async (dispatch) => {
  const res = await fetch(`/api/posts/comments/${commentId}/unlike`);
};

export const likePost = (postId) => async (dispatch) => {
  const res = await fetch(`/api/posts/${postId}/like`);
  if (res.ok) {
    const res2 = await res.json();
    dispatch(updateAUsersPostPOJO(res2.post));
    dispatch(updateAProfilePostPOJO(res2.post));
    // dispatch(loadSinglePost(res2.post));
    dispatch(updateUsersLikePOJO(res2.post));
    return res2;
  }
};

export const unlikePost = (postId) => async (dispatch) => {
  const res = await fetch(`/api/posts/${postId}/unlike`);
  if (res.ok) {
    const res2 = await res.json();
    dispatch(updateAUsersPostPOJO(res2.post));
    dispatch(updateAProfilePostPOJO(res2.post));
    // dispatch(loadSinglePost(res2.post));
    dispatch(updateUsersLikePOJO(res2.post, 'unlike'));
    return res2;
  }
};

export const savePost = (postId) => async (dispatch) => {
  const res = await fetch(`/api/posts/${postId}/save`);
  if (res.ok) {
    const res2 = await res.json();
    dispatch(updateAUsersPostPOJO(res2.post));
    dispatch(updateAProfilePostPOJO(res2.post));
    // dispatch(loadSinglePost(res2.post));
    dispatch(updateUsersFavePOJO(res2.post));
    return res2;
  }
};

export const unsavePost = (postId) => async (dispatch) => {
  const res = await fetch(`/api/posts/${postId}/unsave`);
  if (res.ok) {
    const res2 = await res.json();
    dispatch(updateAUsersPostPOJO(res2.post));
    dispatch(updateAProfilePostPOJO(res2.post));
    // dispatch(loadSinglePost(res2.post));
    dispatch(updateUsersFavePOJO(res2.post, 'unsave'));
    return res2;
  }
};

export const deleteAPost = (postId) => async (dispatch) => {
  const res = await fetch(`/api/posts/${postId}/delete`);
  if (res.ok) {
    const res2 = await res.json();
    dispatch(deleteAPostPOJO(res2['postId']));
    dispatch(removeAPostOfSessionUserPOJO(res2['postId']));
    dispatch(removeAPostOfProfileUserPOJO(res2['postId']));
  }
};

const initialState = {
  allFeed: {},
  homeFeed: {},
  exploreFeed: {},
  hashtagFeed: {},
  singlePost: { comments: [] },
};

const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case CREATE_POST:
      newState = Object.assign({}, state);
      newState.homeFeed = { ...action.payload, ...newState.homeFeed };
      newState.allFeed = { ...action.payload, ...newState.allFeed };
      return newState;
    case DELETE_POST:
      newState = Object.assign({}, state);
      newState.homeFeed = { ...newState.homeFeed };
      newState.allFeed = { ...newState.allFeed };
      delete newState.homeFeed[action.payload]
      delete newState.allFeed[action.payload]
      // newState.homeFeed = { ...(newState.homeFeed.filter(feed => feed.id !== action.payload)) };
      return newState;
    case CREATE_COMMENT:
      newState = Object.assign({}, state);
      const parentPostId = action.payload.parentPostId;
      if (newState.homeFeed[parentPostId])
        newState.homeFeed[parentPostId].comments = [
          ...newState.homeFeed[parentPostId].comments,
          action.payload,
        ];
      if (newState.allFeed[parentPostId])
        newState.allFeed[parentPostId].comments = [
          ...newState.allFeed[parentPostId].comments,
          action.payload,
        ];
      return newState;
    case CREATE_MODAL_COMMENT:
      newState = Object.assign({}, state);
      newState.singlePost.comments = [
        ...newState.singlePost.comments,
        action.payload,
      ];
      return newState;
    case FETCH_HOME_FEED:
      newState = Object.assign({}, state);
      newState.homeFeed = { ...newState.homeFeed, ...action.payload };
      return newState;
    case FETCH_ALL_FEED:
      newState = Object.assign({}, state);
      newState.allFeed = { ...newState.allFeed, ...action.payload };
      return newState;
    case FETCH_HASHTAG_FEED:
      newState = Object.assign({}, state);
      newState.hashtagFeed = { ...newState.hashtagFeed, ...action.payload };
      return newState;
    case FETCH_EXPLORE_FEED:
      newState = Object.assign({}, state);
      newState.exploreFeed = { ...newState.exploreFeed, ...action.payload };
      return newState;
    case FETCH_SINGLE_POST:
      newState = Object.assign({}, state);
      newState.singlePost = action.payload;
      return newState;
    default:
      return state;
  }
};

export default reducer;

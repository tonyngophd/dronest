import { login, logout, authenticate, signup, updateProfile } from "../services/auth";
import { loadProfileBasicInfoPOJO } from './profile';

const SET_USER = "session/SET_USER";
const ADD_A_MESSAGE = "session/ADD_A_MESSAGE";
const REMOVE_USER = "session/REMOVE_USER";
const ADD_USER_LIKE = "session/ADD_USER_LIKE";
const REMOVE_USER_LIKE = "session/REMOVE_USER_LIKE";
const ADD_USER_FAVE = "session/ADD_USER_FAVE";
const REMOVE_USER_FAVE = "session/REMOVE_USER_FAVE";
const UPDATE_A_FOLLOWING = 'session/UPDATE_A_FOLLOWING';
// const RESTORE_USER = 'user/RESTORE_USER';

export const setUserPOJO = (user) => ({
  type: SET_USER,
  user,
});
export const updateAFollowingPOJO = (followee, add = true) => ({
  type: UPDATE_A_FOLLOWING,
  followee,
  add,
});
export const setUserAddAMessagePOJO = (message) => ({
  type: ADD_A_MESSAGE,
  message,
});

const removeUserPOJO = () => ({
  type: REMOVE_USER,
});

export const updateUsersLikePOJO = (post, type="like") => ({
  type: type === "like" ? ADD_USER_LIKE : REMOVE_USER_LIKE,
  post,
});
export const updateUsersFavePOJO = (post, type="fave") => ({
  type: type === "fave" ? ADD_USER_FAVE : REMOVE_USER_FAVE,
  post,
});

export const loginUser = (credential, password) => async (dispatch) => {
  const res = await login(credential, password);
  if (!res.errors) {
    dispatch(setUserPOJO(res));
  }
  return res;
};

export const restoreUser = () => async (dispatch) => {
  const res = await authenticate();
  if (!res.errors) {
    dispatch(setUserPOJO(res));
  }
  return res;
};

export const logoutUser = () => async (dispatch) => {
  const res = await logout();
  dispatch(removeUserPOJO());
  return res;
};

export const signupUser = (username, name, email, password, bio, websiteUrl, profilePicUrl) => async (dispatch) => {
  const res = await signup(username, name, email, password, bio, websiteUrl, profilePicUrl);
  if (!res.errors) {
    dispatch(setUserPOJO(res));
  }
  return res;
};

export const updateUser = (username, name, email, bio, websiteUrl, profilePicUrl) => async (dispatch) => {
  const res = await updateProfile(username, name, email, bio, websiteUrl, profilePicUrl);
  if (!res.errors) {
    dispatch(setUserPOJO(res));
    dispatch(loadProfileBasicInfoPOJO(res));
  }
  return res;
};

const initialState = {
  user: null,
};

const reducer = (state = initialState, action) => {
  let newState;
  let post;
  switch (action.type) {
    case UPDATE_A_FOLLOWING:
      newState = Object.assign({}, state);
      if(action.add){
        newState.user.following.push(action.followee);
      } else {
        newState.user.following = newState.user.following.filter(u => u.id !== action.followee.id);
      }
      return newState;
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.user;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    case ADD_A_MESSAGE:
      newState = Object.assign({}, state);
      newState.user.messages.push(action.message);
      return newState;
    case ADD_USER_LIKE:
      newState = Object.assign({}, state);
      newState.user.likedPosts.push(action.post);
      return newState;
    case REMOVE_USER_LIKE:
      newState = Object.assign({}, state);
      newState.user.likedPosts = newState.user.likedPosts.filter(p => p.id !== action.post.id);
      return newState;
    case ADD_USER_FAVE:
      newState = Object.assign({}, state);
      newState.user.savedPosts.push(action.post);
      return newState;
    case REMOVE_USER_FAVE:
      newState = Object.assign({}, state);
      newState.user.savedPosts = newState.user.savedPosts.filter(p => p.id !== action.post.id);
      return newState;
    default:
      return state;
  }
};

export default reducer;

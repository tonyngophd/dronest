import { login, logout, authenticate, signup, updateProfile } from "../services/auth";
import { loadProfileBasicInfoPOJO } from './profile';

const SET_USER = "session/SET_USER";
const ADD_A_MESSAGE = "session/ADD_A_MESSAGE";
const REMOVE_USER = "session/REMOVE_USER";
// const RESTORE_USER = 'user/RESTORE_USER';

export const setUserPOJO = (user) => ({
  type: SET_USER,
  user,
});
export const setUserAddAMessagePOJO = (message) => ({
  type: ADD_A_MESSAGE,
  message,
});

const removeUserPOJO = () => ({
  type: REMOVE_USER,
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
  switch (action.type) {
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
    default:
      return state;
  }
};

export default reducer;

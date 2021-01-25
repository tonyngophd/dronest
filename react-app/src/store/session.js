import { login, logout, authenticate, signup } from "../services/auth";

const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
// const RESTORE_USER = 'user/RESTORE_USER';

const setUserPOJO = (user) => ({
  type: SET_USER,
  user,
});

const removeUserPOJO = () => ({
  type: REMOVE_USER,
});

export const loginUser = (email, password) => async (dispatch) => {
  const res = await login(email, password);
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

export const signupUser = (username, email, password) => async (dispatch) => {
  const res = await signup(username, email, password);
  if (!res.errors) {
    dispatch(setUserPOJO(res));
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
    default:
      return state;
  }
};

export default reducer;

import { login } from '../services/auth'

const SET_USER = 'user/SET_USER';
const REMOVE_USER = 'user/REMOVE_USER';
// const RESTORE_USER = 'user/RESTORE_USER';

const setUserPOJO = (user) => ({
  type: SET_USER,
  user
});
const removeUserPOJO = () => ({
  type: REMOVE_USER
});


export const login = ({ email, password }) => async dispatch => {
  const res = await login(email, password);
  if (res.ok) {
    const fedback_user = res.data.user; //we need this user back from backend, NOT the provided
    dispatch(setUserPOJO(fedback_user));
  }
  return res;
}

const initialState = {
  user: null
};

const userReducer = (state = initialState, action) => {
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
}

export default userReducer;
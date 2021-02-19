const FETCH_PROFILE = "profile/FETCH_PROFILE";
const REMOVE_A_POST = "profile/REMOVE_A_POST";
const UPDATE_A_PROFILE_POST = "profile/UPDATE_A_PROFILE_POST";


export const removeAPostOfProfileUserPOJO = (postId) => ({
  type: REMOVE_A_POST,
  postId
});

export const loadProfileBasicInfoPOJO = (user) => ({
  type: FETCH_PROFILE,
  payload: user,
});

export const fetchUserProfile = (username) => async (dispatch) => {
  const res = await fetch(`/api/users/${username}`);
  const user = await res.json();
  dispatch(loadProfileBasicInfoPOJO(user));
};

export const updateAProfilePostPOJO = (post) => ({
  type: UPDATE_A_PROFILE_POST,
  payload: post,
});

const initialState = {
  user: null,
};

const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case FETCH_PROFILE:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_A_POST:
      newState = Object.assign({}, state);
      newState.user.ownPosts = newState.user.ownPosts.filter(p => p.id !== action.postId);
      return newState;
    case UPDATE_A_PROFILE_POST:
      newState = Object.assign({}, state);
      const user = newState.user;
      if (user && user.ownPosts.length) {
        const post = user.ownPosts.find(p => p.id === action.payload.id);
        if (post) {
          for (let key in action.payload)
            post[key] = action.payload[key]
        }
      }
      return newState;
    default:
      return state;
  }
};

export default reducer;

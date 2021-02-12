const ADD_ALL_USERS = "users/ADD_ALL_USERS";
const UPDATE_A_USER = "users/UPDATE_A_USER";
const UPDATE_A_USER_POST = "users/UPDATE_A_USER_POST";
// const ADD_SUGGESTED_USERS = "users/ADD_SUGGESTED_USERS";

//TODO: work on an algorithm to suggest a small list of people only

export const addAllUsersPOJO = (allUsers) => ({
  type: ADD_ALL_USERS,
  payload: allUsers,
});

export const updateAUsersPOJO = (user) => ({
  type: UPDATE_A_USER,
  payload: user,
});

export const updateAUsersPostPOJO = (post) => ({
  type: UPDATE_A_USER_POST,
  payload: post,
});

export const fetchAllUsers = () => async (dispatch) => {
  try {
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      dispatch(addAllUsersPOJO(data.users));
    }
  } catch (e) {

  }
};

const initialState = {
  allUsers: [],
};

const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_ALL_USERS:
      newState = Object.assign({}, state);
      newState.allUsers = action.payload;
      return newState;
    case UPDATE_A_USER:
      newState = Object.assign({}, state);
      const user = newState.allUsers.find(u => u.id === action.payload.id);
      for (let key in action.payload)
        user[key] = action.payload[key]
      return newState;
    case UPDATE_A_USER_POST:
      newState = Object.assign({}, state);
      const user = newState.allUsers.find(u => u.id === action.payload.id);
      if (user.ownPosts.length) {
        const post = user.ownPosts.find(p => p.id === action.payload.id);
        for (let key in action.payload)
          post[key] = action.payload[key]
      }
      return newState;
    default:
      return state;
  }
};

export default reducer;

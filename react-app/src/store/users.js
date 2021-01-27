const ADD_ALL_USERS = "users/ADD_ALL_USERS";
// const ADD_SUGGESTED_USERS = "users/ADD_SUGGESTED_USERS";

//TODO: work on an algorithm to suggest a small list of people only

export const addAllUsersPOJO = (allUsers) => ({
  type: ADD_ALL_USERS,
  payload: allUsers,
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
    default:
      return state;
  }
};

export default reducer;

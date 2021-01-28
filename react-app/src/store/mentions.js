const FETCH_USER_MENTIONS = "mentions/FETCH_USER_MENTIONS";
const FETCH_HASHTAG_MENTIONS = "mentions/FETCH_HASHTAG_MENTIONS";
const FETCH_USER_MENTIONS_COMMENTS = "mentions/FETCH_USER_MENTIONS_COMMENTS";
const FETCH_HASHTAG_MENTIONS_COMMENTS =
  "mentions/FETCH_HASHTAG_MENTIONS_COMMENTS";
const CLEAR_MENTIONS = "mentions/CLEAR_MENTIONS";

const initialState = {
  users: [],
  hashtags: [],
  usersComments: [],
  hashtagsComments: [],
};

const loadUserMentions = (users) => ({
  type: FETCH_USER_MENTIONS,
  payload: users,
});

const loadHashtagMentions = (hashtags) => ({
  type: FETCH_HASHTAG_MENTIONS,
  payload: hashtags,
});

const loadUserMentionsComments = (users) => ({
  type: FETCH_USER_MENTIONS_COMMENTS,
  payload: users,
});

const loadHashtagMentionsComments = (hashtags) => ({
  type: FETCH_HASHTAG_MENTIONS_COMMENTS,
  payload: hashtags,
});

export const clearMentions = () => ({
  type: CLEAR_MENTIONS,
});

export const fetchUserMentions = (query) => async (dispatch) => {
  const res = await fetch(`/api/users/mentions/${query}`);
  const users = await res.json();
  dispatch(loadUserMentions(users));
};

export const fetchHashtagMentions = (query) => async (dispatch) => {
  const res = await fetch(`/api/hashtags/mentions/${query}`);
  const hashtags = await res.json();
  dispatch(loadHashtagMentions(hashtags));
};

export const fetchUserMentionsComments = (query) => async (dispatch) => {
  const res = await fetch(`/api/users/mentions/${query}`);
  const users = await res.json();
  dispatch(loadUserMentionsComments(users));
};

export const fetchHashtagMentionsComments = (query) => async (dispatch) => {
  const res = await fetch(`/api/hashtags/mentions/${query}`);
  const hashtags = await res.json();
  dispatch(loadHashtagMentionsComments(hashtags));
};

const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case FETCH_USER_MENTIONS:
      newState = Object.assign({}, state);
      newState.users = action.payload.users;
      return newState;
    case FETCH_HASHTAG_MENTIONS:
      newState = Object.assign({}, state);
      newState.hashtags = action.payload.hashtags;
      return newState;
    case FETCH_USER_MENTIONS_COMMENTS:
      newState = Object.assign({}, state);
      newState.usersComments = action.payload.users;
      return newState;
    case FETCH_HASHTAG_MENTIONS_COMMENTS:
      newState = Object.assign({}, state);
      newState.hashtagsComments = action.payload.hashtags;
      return newState;
    case CLEAR_MENTIONS:
      newState = Object.assign({}, state);
      newState.users = [];
      newState.hashtags = [];
      newState.usersComments = [];
      newState.hashtagsComments = [];
      return newState;
    default:
      return state;
  }
};

export default reducer;

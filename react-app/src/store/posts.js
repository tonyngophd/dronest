const CREATE_POST = "posts/CREATE_POST";
const CREATE_COMMENT = "posts/CREATE_COMMENT";

const FETCH_HOME_FEED = "posts/FETCH_HOME_FEED";
const FETCH_SINGLE_POST = "posts/FETCH_SINGLE_POST";
const FETCH_HASHTAG_FEED = "posts/FETCH_HASHTAG_FEED";
const FETCH_EXPLORE_FEED = "posts/FETCH_EXPLORE_FEED";

const createNewPost = (post) => ({
  type: CREATE_POST,
  payload: post,
});

const createNewComment = (comment) => ({
  type: CREATE_COMMENT,
  payload: comment,
});

const loadHomeFeed = (feed) => ({
  type: FETCH_HOME_FEED,
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

const loadSinglePost = (post) => ({
  type: FETCH_SINGLE_POST,
  payload: post,
});

export const uploadPost = (
  userId,
  mentionedUsers,
  hashtags,
  rawData,
  image
) => async (dispatch) => {
  mentionedUsers = mentionedUsers.map((user) => {
    return user.id;
  });
  console.log(mentionedUsers);
  const form = new FormData();
  form.append("userId", userId);
  form.append("mentionedUsers", JSON.stringify(mentionedUsers));
  form.append("hashtags", JSON.stringify(hashtags));
  form.append("rawData", JSON.stringify(rawData));
  form.append("image", image);
  const res = await fetch("/api/posts/", {
    method: "POST",
    body: form,
  });
  const newPost = res.json();
};

export const uploadComment = (
  userId,
  mentionedUsers,
  rawData,
  postId
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
  const newComment = res.json();
};

export const fetchHomeFeed = (userId, page) => async (dispatch) => {
  const res = await fetch(`/api/posts/${userId}/feed/${page}`);
  let feed = await res.json();
  feed = feed["posts"];
  dispatch(loadHomeFeed(feed));
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

export const likePost = (postId) => async (dispatch) => {
  const res = await fetch(`/api/posts/${postId}/like`);
};

export const unlikePost = (postId) => async (dispatch) => {
  const res = await fetch(`/api/posts/${postId}/unlike`);
};

const initialState = {
  homeFeed: [],
  exploreFeed: [],
  hashtagFeed: [],
};

const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case CREATE_POST:
      newState = Object.assign({}, state);
      newState.postTest = action.payload;
      return newState;
    case FETCH_HOME_FEED:
      newState = Object.assign({}, state);
      newState.homeFeed = [...newState.homeFeed, ...action.payload];
      return newState;
    case FETCH_HASHTAG_FEED:
      newState = Object.assign({}, state);
      newState.hashtagFeed = [...newState.hashtagFeed, ...action.payload];
      return newState;
    case FETCH_EXPLORE_FEED:
      newState = Object.assign({}, state);
      newState.exploreFeed = [...newState.exploreFeed, ...action.payload];
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

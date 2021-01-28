const CREATE_POST = "posts/CREATE_POST";
const CREATE_COMMENT = "posts/CREATE_COMMENT";

const FETCH_HOME_FEED = "posts/FETCH_HOME_FEED";

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

export const fetchHomeFeed = (userId) => async (dispatch) => {
  const res = await fetch(`/api/posts/${userId}/feed`);
  let feed = await res.json();
  feed = feed["posts"];
  dispatch(loadHomeFeed(feed));
};

const initialState = {};

const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case CREATE_POST:
      newState = Object.assign({}, state);
      newState.postTest = action.payload;
      return newState;
    case FETCH_HOME_FEED:
      newState = Object.assign({}, state);
      newState.homeFeed = action.payload;
      return newState;
    default:
      return state;
  }
};

export default reducer;

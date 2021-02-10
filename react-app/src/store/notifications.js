const FETCH_NOTIFICATIONS = "notifications/FETCH_NOTIFICATIONS";
const VIEW_FOLLOW_NOTIFICATION = "notifications/VIEW_FOLLOW_NOTIFICATION";
const VIEW_TAG_NOTIFICATION = "notifications/VIEW_TAG_NOTIFICATION";
const VIEW_COMMENT_NOTIFICATION = "notifications/VIEW_COMMENT_NOTIFICATION";
const VIEW_ALL_NOTIFICATIONS = "notifications/VIEW_ALL_NOTIFICATIONS";

const loadNotifications = (notifications) => ({
  type: FETCH_NOTIFICATIONS,
  payload: notifications,
});

const deleteFollowNotification = (id) => ({
  type: VIEW_FOLLOW_NOTIFICATION,
  payload: id,
});

const deleteTagNotification = (id) => ({
  type: VIEW_TAG_NOTIFICATION,
  payload: id,
});

const deleteCommentNotification = (id) => ({
  type: VIEW_COMMENT_NOTIFICATION,
  payload: id,
});

const deleteAllNotifications = () => ({
  type: VIEW_ALL_NOTIFICATIONS,
});

export const fetchNotifications = () => async (dispatch) => {
  const res = await fetch("/api/users/notifications");
  let notifications = await res.json();
  notifications = notifications["notifications"];
  if(notifications) dispatch(loadNotifications(notifications));
  return "HI";
};

export const viewNotification = (notif) => async (dispatch) => {
  // console.log(notif);
  switch (notif.type) {
    case "follow":
      await fetch(`/api/users/notifications/follows/${notif.id}`);
      return dispatch(deleteFollowNotification(notif.id));
    case "post":
      await fetch(`/api/users/notifications/posts/${notif.id}`);
      return dispatch(deleteTagNotification(notif.id));
    case "comment":
      await fetch(`/api/users/notifications/comments/${notif.id}`);
      return dispatch(deleteCommentNotification(notif.id));
    default:
      break;
  }
};

export const viewAllNotifications = () => async (dispatch) => {
  await fetch(`/api/users/notifications/clear`);
  dispatch(deleteAllNotifications());
};

const initialState = {};

const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      newState = Object.assign({}, state);
      newState = action.payload;
      return newState;
    case VIEW_FOLLOW_NOTIFICATION:
      newState = Object.assign({}, state);
      newState.num_follows--;
      newState.total--;
      delete newState.follows[action.payload];
      return newState;
    case VIEW_TAG_NOTIFICATION:
      newState = Object.assign({}, state);
      newState.num_post_tags--;
      newState.total--;
      delete newState.posts[action.payload];
      return newState;
    case VIEW_COMMENT_NOTIFICATION:
      newState = Object.assign({}, state);
      newState.num_comment_tags--;
      newState.total--;
      delete newState.comments[action.payload];
      return newState;
    case VIEW_ALL_NOTIFICATIONS:
      newState = Object.assign({}, state);
      newState.total = 0;
      newState.num_follows = 0;
      newState.num_post_tags = 0;
      newState.num_comment_tags = 0;
      newState.follows = {};
      newState.post = {};
      newState.comments = {};
      return newState;
    default:
      return state;
  }
};

export default reducer;

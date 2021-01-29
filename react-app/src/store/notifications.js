const FETCH_NOTIFICATIONS = "notifications/FETCH_NOTIFICATIONS";

const loadNotifications = (notifications) => ({
  type: FETCH_NOTIFICATIONS,
  payload: notifications,
});

export const fetchNotifications = () => async (dispatch) => {
  const res = await fetch("/api/users/notifications");
  let notifications = await res.json();
  notifications = notifications["notifications"];
  dispatch(loadNotifications(notifications));
  return "HI";
};

const initialState = {};

const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      newState = Object.assign({}, state);
      newState = action.payload;
      return newState;
    default:
      return state;
  }
};

export default reducer;

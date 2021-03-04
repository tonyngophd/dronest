import { setUserPOJO } from './session';
// import { loadProfileBasicInfoPOJO } from './profile';

const ADD_A_MESSAGE = "messages/ADD_A_MESSAGE";
const LOAD_ALL_MESSAGES = "messages/LOAD_ALL_MESSAGES";

export const addAMessagePOJO = (message) => ({
  type: ADD_A_MESSAGE,
  message,
});
export const addAllMessagesPOJO = (messages) => ({
  type: LOAD_ALL_MESSAGES,
  messages,
});


export const sendAMessage = async (senderId, receiverId, messageBody, dispatch) => {
  const res1 = await fetch(`/api/users/messages/receivers/${receiverId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ senderId, messageBody })
  });
  const res2 = await res1.json();

  if (!res2.errors) {
    // console.log("\n\n\nres2", res2);
    dispatch(setUserPOJO(res2.user));
    // if(receiverId === profilePersonId)
    //   dispatch(loadProfileBasicInfoPOJO(res2.followee))
  }
};


export const uploadMessage = async (
  senderId,
  receiverId,
  mentionedUsers,
  rawData,
  dispatch
) => {
  mentionedUsers = mentionedUsers.map((user) => {
    return user.id;
  });
  const form = new FormData();
  form.append("senderId", senderId);
  form.append("receiverId", receiverId);
  form.append("mentionedUsers", JSON.stringify(mentionedUsers));
  form.append("rawData", JSON.stringify(rawData));
  const res1 = await fetch("/api/users/messages", {
    method: "POST",
    body: form,
  });

  const res2 = await res1.json();

  if (!res2.errors) {
    // console.log("\n\n\nres2", res2);
    dispatch(setUserPOJO(res2.user));
    // if(receiverId === profilePersonId)
    //   dispatch(loadProfileBasicInfoPOJO(res2.followee))
  }
};

export const uploadConvoMessage = async (
  senderId,
  receiverIds,
  mentionedUsers,
  rawData,
  dispatch
) => {
  mentionedUsers = mentionedUsers.map((user) => {
    return user.id;
  });
  const form = new FormData();
  form.append("senderId", senderId);
  form.append("receiverIds", receiverIds);
  form.append("mentionedUsers", JSON.stringify(mentionedUsers));
  form.append("rawData", JSON.stringify(rawData));
  const res1 = await fetch("/api/users/conversations", {
    method: "POST",
    body: form,
  });

  const res2 = await res1.json();

  if (!res2.errors) {
    dispatch(addAMessagePOJO(res2.message));
  }
};

export const uploadConvoMessage2 = (
  senderId,
  receiverIds,
  mentionedUsers,
  rawData,
) => async (dispatch) => {
  mentionedUsers = mentionedUsers.map((user) => {
    return user.id;
  });
  const form = new FormData();
  form.append("senderId", senderId);
  form.append("receiverIds", receiverIds);
  form.append("mentionedUsers", JSON.stringify(mentionedUsers));
  form.append("rawData", JSON.stringify(rawData));
  const res1 = await fetch("/api/users/conversations", {
    method: "POST",
    body: form,
  });

  const res2 = await res1.json();

  if (!res2.errors) {
    dispatch(addAMessagePOJO(res2.message));
    return res2.message;
  }
};

export const fetchAllMessages = () => async (dispatch) => {
  try {
    const res = await fetch("/api/users/conversations");
    if (res.ok) {
      const data = await res.json();
      dispatch(addAllMessagesPOJO(data.messages));
    }
  } catch (e) {

  }
};

// export const logoutUser = () => async (dispatch) => {
//   const res = await logout();
//   dispatch(removeUserPOJO());
//   return res;
// };


const initialState = {
  all: [],
  sent: [],
  received: []
};

const reducer = (state = initialState, action) => {
  let newState;
  let post;
  switch (action.type) {
    case LOAD_ALL_MESSAGES:
      newState = Object.assign({}, state);
      newState.all = [...action.messages]
      return newState;

    case ADD_A_MESSAGE:
      newState = Object.assign({}, state);
      newState.all.push(action.message)
      return newState;

    default:
      return state;
  }
};

export default reducer;

// This is not really a reducer, it is just a helper

// import { loadProfileBasicInfoPOJO } from './profile';
import { setUserPOJO, setUserAddAMessagePOJO } from './session';
const sendAMessage = async (senderId, receiverId, messageBody, dispatch) => {
  const res1 = await fetch(`/api/users/messages/receivers/${receiverId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ senderId, messageBody })
  });
  const res2 = await res1.json();

  if(!res2.errors){
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

  if(!res2.errors){
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

  if(!res2.errors){
    console.log('res2.message', res2.message);
    dispatch(setUserAddAMessagePOJO(res2.message));
  }
};

export default sendAMessage;
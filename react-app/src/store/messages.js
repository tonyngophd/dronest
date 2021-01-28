// This is not really a reducer, it is just a helper

// import { loadProfileBasicInfoPOJO } from './profile';
import { setUserPOJO } from './session';
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


export default sendAMessage;
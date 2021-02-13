// This is not really a reducer, it is just a helper

import { loadProfileBasicInfoPOJO } from './profile';
import { setUserPOJO, updateAFollowingPOJO } from './session';
//(personToFollowId, myId, profile.user.id
const fetchAFollowing = async (personToFollowId, profilePersonId, do_follow, dispatch) => {
  const res1 = await fetch(`/api/users/follow/${personToFollowId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ do_follow })
  });
  const res2 = await res1.json();
  // console.log('\n\n\nres2', res2, '\ndispatch', dispatch);
  // dispatch(loadProfileBasicInfoPOJO(user));
  if(!res2.errors){
    // dispatch(setUserPOJO(res2.follower));
    dispatch(updateAFollowingPOJO(res2.followee, do_follow));
    // console.log("personToFollowId", personToFollowId, "\nprofilePersonId", profilePersonId);
    if(personToFollowId === profilePersonId)
      dispatch(loadProfileBasicInfoPOJO(res2.followee))
  }
};


export default fetchAFollowing;
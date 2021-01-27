// This is not really a reducer, it is just a helper

import { loadProfileBasicInfoPOJO } from './profile';
import { setUserPOJO } from './session';
//(personToFollowId, myId, profile.user.id
const fetchAFollowing = async (personToFollowId, profilePersonId, dispatch) => {
  const res1 = await fetch(`/api/users/follow/${personToFollowId}`);
  const res2 = await res1.json();
  // console.log('\n\n\nres2', res2, '\ndispatch', dispatch);
  // dispatch(loadProfileBasicInfoPOJO(user));
  if(!res2.errors){
    dispatch(setUserPOJO(res2.follower));
    if(personToFollowId === profilePersonId)
      dispatch(loadProfileBasicInfoPOJO(res2.followee))
  }
};


export default fetchAFollowing;
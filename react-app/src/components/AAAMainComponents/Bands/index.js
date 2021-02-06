import React, { useEffect }  from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchAllUsers } from "../../../store/users";
import SinglePost from '../SinglePost';

import './Bands.css';


export default function Band(){
  const allUsers = useSelector((state) => state.users.allUsers);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!allUsers.length) dispatch(fetchAllUsers());
  }, [dispatch]);  


  return (
    <div className='main-band-container'>
      <SinglePost user={allUsers[0]}/>
      <SinglePost user={allUsers[1]}/>
      <SinglePost user={allUsers[2]}/>
      <SinglePost />
      {/* <SinglePost /> */}
    </div>
  )
}
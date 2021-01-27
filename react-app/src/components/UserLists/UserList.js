import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from 'nanoid';


import { fetchAllUsers } from '../../store/users';
import UserRow from '../ProfilePage/UserRow';
import { notFollowedYet } from '../ProfilePage';


import './UserLists.css';

export function MinimalUserList() {
  const allUsers = useSelector((state) => state.users.allUsers);
  const myself = useSelector((state) => state.session.user);
  // const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!allUsers.length)
      dispatch(fetchAllUsers());
  }, [dispatch]);

  const userComponents = allUsers.map((user) => {
    return (
      <li key={user.id}>
        <NavLink to={`/${user.username}`}>{user.username}</NavLink>
      </li>
    );
  });

  return (
    <div className='all-users-div'>
      {allUsers.map(user => <UserRow user={user} myId={myself.id} notFollowedYet={notFollowedYet(user.id, myself)} key={nanoid()} />)}
    </div>
  );
}

function UserList() {

  return (
    <div className='users-page-main-div'>
      <h1>Admin Page - User List</h1>
      <MinimalUserList />
    </div>
  );
}


export default UserList;

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, addAllUsersPOJO } from '../../store/users';
import UserRow from '../ProfilePage/UserRow';
import { notFollowedYet } from '../ProfilePage';


import './UserLists.css';

function UsersList() {
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
    <div className='users-page-main-div'>
      <h1>Admin Page - User List</h1>
      <div className='all-users-div'>
        {allUsers.map(user => <UserRow user={user} myId={myself.id} notFollowedYet={notFollowedYet(user.id, myself)} />)}
      </div>
    </div>
  );
}

export default UsersList;

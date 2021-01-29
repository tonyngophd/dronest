import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";

import { fetchAllUsers } from "../../store/users";
import UserRow from "../ProfilePage/UserRow";
import { notFollowedYet } from "../ProfilePage";

import "./UserLists.css";

export function MinimalUserList({ includeMyself = true, followAsButton=true, searchable = false, searchText = "" }) {
  const allUsers = useSelector((state) => state.users.allUsers);
  const myself = useSelector((state) => state.session.user);
  // const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!allUsers.length) dispatch(fetchAllUsers());
  }, [dispatch]);

  const userComponents = allUsers.map((user) => {
    return (
      <li key={user.id}>
        <NavLink to={`/${user.username}`}>{user.username}</NavLink>
      </li>
    );
  });

  const searchFunction = (user, searchText) => {
    for (let key in user) {
      if (typeof(user[key]) === 'string' &&
        user[key].toLowerCase().includes(searchText.toLowerCase())) {
        return true;
      }
    }
    return false;
  }
  let allUsersWithoutMyself;
  if (searchable) {    
    allUsersWithoutMyself = allUsers.filter(
      (user) => (user.id !== myself.id) && searchFunction(user, searchText)
    );
  } else {
    allUsersWithoutMyself = allUsers.filter(
      (user) => user.id !== myself.id
    );
  }

  return (
    <div className="all-users-div">
      {includeMyself && (
        <UserRow user={myself} myId={myself.id} notFollowedYet={false} />
      )}
      {allUsersWithoutMyself.map((user) => (
        <UserRow
          user={user}
          myId={myself.id}
          notFollowedYet={notFollowedYet(user.id, myself)}
          key={nanoid()}
          followAsButton={followAsButton}
        />
      ))}
    </div>
  );
}

function UserList() {
  return (
    <div className="users-page-main-div">
      <h3>User List</h3>
      <MinimalUserList />
    </div>
  );
}

export default UserList;

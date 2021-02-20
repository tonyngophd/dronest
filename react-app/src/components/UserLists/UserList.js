import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";

import { fetchAllUsers } from "../../store/users";
import UserRow from "../ProfilePage/UserRow";
import { notFollowedYet } from "../ProfilePage";
import { StoryTopBox } from '../Story';
import MiniProfile from '../MiniProfile';

import "./UserLists.css";

export function MinimalUserList({
  includeMyself = true,
  followAsButton = true,
  searchable = false,
  searchText = "",
}) {
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
        <NavLink to={`/users/${user.username}`}>{user.username}</NavLink>
      </li>
    );
  });

  const searchFunction = (user, searchText) => {
    for (let key in user) {
      if (
        typeof user[key] === "string" &&
        user[key].toLowerCase().includes(searchText.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  };
  let allUsersWithoutMyself;
  if (myself) {
    if (searchable) {
      allUsersWithoutMyself = allUsers.filter(
        (user) => user.id !== myself.id && searchFunction(user, searchText)
      );
    } else {
      allUsersWithoutMyself = allUsers.filter((user) => user.id !== myself.id);
    }
  } else {
    allUsersWithoutMyself = allUsers;
  }

  return (
    <div
      className={
        searchable ? "all-users-div search-dropdown-box" : "all-users-div"
      }
    >
      {myself && includeMyself && (
        <UserRow user={myself} myId={myself.id} notFollowedYet={false} />
      )}
      {allUsersWithoutMyself
        .filter((user) => {
          return searchable ? true : (myself ? notFollowedYet(user.id, myself) : true);
        })
        .slice(0, searchable ? 10000 : 20)
        .map((user) => (
          <UserRow
            user={user}
            searchable={searchable}
            myId={myself && myself.id}
            notFollowedYet={myself ? notFollowedYet(user.id, myself) : true}
            key={nanoid()}
            followAsButton={followAsButton}
          />
        ))}
    </div>
  );
}
export function MiniProfileLists({
  includeMyself = true,
  followAsButton = true,
  searchable = false,
  searchText = "",
}) {
  const allUsers = useSelector((state) => state.users.allUsers);
  const myself = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!allUsers.length) dispatch(fetchAllUsers());
  }, [dispatch]);

  let allUsersWithoutMyself;
  if (myself) {
    allUsersWithoutMyself = allUsers.filter((user) => user.id !== myself.id);
  } else {
    allUsersWithoutMyself = allUsers;
  }

  return (
    <div
      className={
        "all-users-miniprofile-div"
      }
    >
      {/* {myself && includeMyself && (
        <UserRow user={myself} myId={myself.id} notFollowedYet={false} />
      )} */}
      {allUsersWithoutMyself
        // .filter((user) => {
        //   return searchable ? true : (myself ? notFollowedYet(user.id, myself) : true);
        // })
        // .slice(0, searchable ? 10000 : 20)
        .map((user) => (
          <MiniProfile
            user={user}
            className='miniprofile-container-div static'
            hover={true}
            myId={myself && myself.id}
            notFollowedYet={myself ? notFollowedYet(user.id, myself) : true}
            key={nanoid()}
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

export function UsersPageOriginal() {
  return (
    <div className="users-page-main-div">
      <StoryTopBox />
      <div className='user-list-and-mini-profiles'>
        <MinimalUserList />
        <MiniProfileLists />
      </div>
    </div>
  );
}

export default UserList;

import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { BareUserList } from "../UserLists";
import UserRow from "../ProfilePage/UserRow";
import "./suggestions.css";

const Suggestions = ({
  UserList = BareUserList,
  followAsButton = false,
  searchable = false,
  searchText = "",
  style = undefined,
}) => {
  const myself = useSelector((state) => state.session.user);

  return (
    <div
      className={
        searchable
          ? "mini-profile-and-suggestions searchable"
          : "mini-profile-and-suggestions"
      }
      style={style}
    >
      {!searchable && (
        <>
          <UserRow
            user={myself}
            myId={myself.id}
            notFollowedYet={false}
            imageSize="50px"
            suggestionBox={true}
          />
          <div className="suggestions-for-you-title">
            <span className="suggest">Suggestions for you</span>
            <Link className="see-all" to="/users">
              See all
            </Link>
          </div>
        </>
      )}
      <div
        className={
          searchable
            ? "suggestions_container searchable"
            : "suggestions_container"
        }
      >
        <UserList
          includeMyself={false}
          limit={7}
          searchable={searchable}
          searchText={searchText}
          followAsButton={followAsButton}
        />
      </div>
    </div>
  );
};

export default Suggestions;

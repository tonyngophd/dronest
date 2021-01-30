import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Suggestions from "../Suggestions";
import { BareUserList } from "../UserLists";
import { BsSearch, BsX } from "react-icons/bs";
import * as searchActions from "../../store/search";

import "./Search.css";

export default function MainSearchBar({
  className = "search-over-banner-div",
}) {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    dispatch(searchActions.setSearchPOJO({ text: searchValue }));
  }, [searchValue]);

  const onInputChange = (e) => {
    e.preventDefault();
    setSearchValue(e.target.value);
    // console.log("search box value:", e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(searchActions.setSearchPOJO({ text: searchValue }));
    setSearchValue("");
  };
  return (
    <div
      className={
        focused
          ? "search-and-dropdown-display-main-box focused-search"
          : "search-and-dropdown-display-main-box"
      }
    >
      <form type="submit" className={className} onSubmit={handleSubmit}>
        <BsSearch className="search-icon" />
        <input
          className="main-search-bar"
          type="text"
          placeholder="Search..."
          onBlur={(e) => {
            e.preventDefault();
            setFocused(false);
            setSearchValue("");
          }}
          value={searchValue}
          onChange={onInputChange}
          onFocus={() => setFocused(true)}
          autoFocus={
            window.location.pathname.includes("allspots") ? true : false
          }
        ></input>
        <BsX
          className="search-icon-x"
          onClick={(e) => {
            e.preventDefault();
            setSearchValue("");
          }}
        />
      </form>
      <div className="search-dropdown">
        {searchValue && (
          <Suggestions
            UserList={BareUserList}
            searchable={true}
            searchText={searchValue}
            style={{
              maxHeight: "300px",
              overflowY: "scroll",
              marginLeft: "-160px",
            }}
          />
        )}
      </div>
    </div>
  );
}

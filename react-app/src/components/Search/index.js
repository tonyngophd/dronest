import React from "react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Suggestions from "../Suggestions";
import { BareUserList } from "../UserLists";
import { BsSearch, BsX } from "react-icons/bs";
import * as searchActions from "../../store/search";

import "./Search.css";

export default function MainSearchBar({
  className = "search-over-banner-div",
}) {
  const loggedInUser = useSelector((state) => state.session.user);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const [focused, setFocused] = useState(false);
  const [allowedClear, setAllowedClear] = useState(true);
  const dropdownRef = useRef();

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

  const handleEscapeKey = e => {
    if (e.key === 'Escape') {
      setSearchValue("");
    }
  }

  const handleBlur = (e) => {
    e.preventDefault();
    if (allowedClear) {
      setTimeout(() => {
        setFocused(false);
        setSearchValue("");
      }, 1000);
    }
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
          className={focused ? "main-search-bar focused" : "main-search-bar"}
          type="text"
          placeholder="Search..."
          onBlur={handleBlur}
          value={searchValue}
          onChange={onInputChange}
          onFocus={() => setFocused(true)}
          autoFocus={
            window.location.pathname.includes("allspots") ? true : false
          }
          onKeyUp={handleEscapeKey}
        ></input>
        <BsX
          className="search-icon-x"
          onClick={(e) => {
            e.preventDefault();
            setSearchValue("");
          }}
        />
      </form>
      <div className="search-dropdown"
        onClick={e => {setAllowedClear(false)}}
        onBlur={e => {setAllowedClear(true)}}
        ref={dropdownRef}
      >
        {searchValue && (
          loggedInUser ?
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
            :
            <div>
              <p></p>
              <p></p>
              <p></p>
              <p>Search function when not logged in</p>
              <p>is being implemented</p>
            </div>)
        }
      </div>
    </div>
  );
}

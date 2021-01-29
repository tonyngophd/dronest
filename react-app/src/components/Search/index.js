import React from "react";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Suggestions from '../Suggestions';
import { BareUserList } from "../UserLists";

import * as searchActions from '../../store/search';

import './Search.css';

export default function MainSearchBar({
  className = 'search-over-banner-div'
}) {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(searchActions.setSearchPOJO({ text: searchValue }));
  }, [searchValue]);

  const onInputChange = e => {
    e.preventDefault();
    setSearchValue(e.target.value);
    // console.log("search box value:", e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(searchActions.setSearchPOJO({ text: searchValue }));
    setSearchValue("");
  }
  return (
    <div className="search-and-dropdown-display-main-box">
      <form
        type='submit'
        className={className}
        onSubmit={handleSubmit}
      >
        <i className="fas fa-search search-icon-class" ></i>
        <input
          className='main-search-bar'
          type='text'
          placeholder='Search...'
          value={searchValue}
          onChange={onInputChange}
          autoFocus={window.location.pathname.includes('allspots') ? true : false}
        >
        </input>
        <i className="fas fa-times search-icon-class"
          style={{ color: 'lightgray' }}
          onClick={e => { e.preventDefault(); setSearchValue("") }}
        />
      </form>
      <div className='search-dropdown'>
        {
          searchValue && <Suggestions UserList={BareUserList} 
            searchable={true} searchText={searchValue} 
            style={{maxHeight: "300px", overflowY: "scroll"}}
            />
        }
      </div>
    </div>
  );
}
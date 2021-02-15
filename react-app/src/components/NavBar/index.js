import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FcHome } from "react-icons/fc";
import { AiOutlineHome } from "react-icons/ai";
import { IoPaperPlaneOutline, IoImagesOutline } from "react-icons/io5";
import { FaWpexplorer, FaUsers } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BsHeart } from "react-icons/bs";

import LogoutButton from "../auth/LogoutButton";
import { useSelector } from "react-redux";

import MainSearchBar from "../Search";
import "./NavBar.css";

const NavBar = () => {
  const user = useSelector((state) => state.session.user);
  const [showLoggedOut, setShowLoggedOut] = useState(false);

  useEffect(() => {
    if (showLoggedOut) {
      setTimeout(() => setShowLoggedOut(false), 2000);
    }
  }, [showLoggedOut])

  return (
    <div className='top-navbar-container' >
      <nav className="top-navbar">
        <NavLink
          to="/"
          exact={true}
          className="nav-title-logo"
        >
          <img
            className="hvr-grow hvr-pulse"
            src={require("../../pictures/dronestlogo3.png")}
            style={{ width: '140px', objectFit: 'cover' }}
          />
          {/* <p className="nav-title navbar-content hvr-grow ">Dronest</p> */}
          {/* <p className="nav-title navbar-content hvr-grow login-form_header"><img src="https://instavibes.s3.amazonaws.com/images/InstaVibes2.png" /></p> */}
        </NavLink>
        {/* {user && <MainSearchBar />} */}
        <MainSearchBar />
        {/* <input
        className="search-navbar-content"
        type="text"
        placeholder="Search.."
      ></input> */}
        <div className="navbar-content right-side">
          <NavLink to="/" exact={true} activeclassname="active">
            <AiOutlineHome
              className={
                user
                  ? "navbar-icon hvr-shrink"
                  : "navbar-icon hvr-shrink logged-out"
              }
              activeclassname="active"
            />
          </NavLink>
          <NavLink to="/users" exact={true} activeclassname="active">
            <FaUsers
              className={
                user
                  ? "navbar-icon hvr-shrink"
                  : "navbar-icon hvr-shrink logged-out"
              }
              activeclassname="active"
            />
          </NavLink>
          {!user && (
            <>
              <NavLink
                to="/login"
                exact={true}
                activeclassname="active"
                className="navbar-icon logged-out login-button"
              >
                Login
            </NavLink>
              <NavLink
                to="/sign-up"
                exact={true}
                activeclassname="active"
                className="navbar-icon logged-out login-button"
              >
                Sign Up
            </NavLink>
            </>
          )}
          {user && (
            <>
              <NavLink to="/messages/" exact={true} activeclassname="active">
                <IoPaperPlaneOutline className="navbar-icon hvr-shrink  " />
              </NavLink>
              <NavLink to="/explore" exact={true} activeclassname="active">
                <FaWpexplorer className="navbar-icon home-page hvr-shrink " />
              </NavLink>
              <NavLink
                to={`/users/${user.username}/liked`}
                exact={true}
                activeclassname="active"
              >
                <BsHeart className="navbar-icon home-page hvr-shrink heart-button " />
              </NavLink>
              <NavLink
                to='/allposts'
                exact={true}
                activeClassName='active'
              >
                <IoImagesOutline className="navbar-icon home-page hvr-shrink heart-button " />
              </NavLink>
              <NavLink to={`/users/${user.username}`}>
                <CgProfile className="navbar-icon home-page hvr-shrink profile-button " />
              </NavLink>
              <LogoutButton className="navbar-icon home-page der hvr-grow" setShowLoggedOut={setShowLoggedOut} />
            </>
          )}
          {/* <NavLink to="/users" exact={true} activeclassname="active">
          <FaUsers className='navbar-icon' />
        </NavLink> */}
        </div>
        {
          showLoggedOut &&
          <div className='show-user-have-logged-out-outer-div'>
            <div className='show-user-have-logged-out-inner-div'>
              You have safely logged out!
          </div>
          </div>
        }
      </nav>
    </div>
  );
};

export default NavBar;

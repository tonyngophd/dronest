import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FcHome } from "react-icons/fc";
import { AiOutlineHome } from "react-icons/ai";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { FaWpexplorer, FaUsers } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BsHeart } from "react-icons/bs";

import LogoutButton from "../auth/LogoutButton";
import { useSelector } from "react-redux";

import MainSearchBar from "../Search";
import "./NavBar.css";

const NavBar = () => {
  const user = useSelector((state) => state.session.user);

  return (
    <nav className="top-navbar">
      <NavLink
        to="/"
        exact={true}
        className="nav-title-logo"
        activeclassname="active"
      >
        <img
          className="lioness hvr-grow hvr-pulse"
          src={require("./insta.png")}
        />
        <p className="nav-title navbar-content hvr-grow ">InstaVibes</p>
        {/* <p className="nav-title navbar-content hvr-grow login-form_header"><img src="https://instavibes.s3.amazonaws.com/images/InstaVibes2.png" /></p> */}
      </NavLink>
      {user && <MainSearchBar />}
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
            <NavLink to="/messages" exact={true} activeclassname="active">
              <IoPaperPlaneOutline className="navbar-icon hvr-shrink  " />
            </NavLink>
            <NavLink to="/explore" exact={true} activeclassname="active">
              <FaWpexplorer className="navbar-icon home-page hvr-shrink " />
            </NavLink>
            <NavLink
              to={`/${user.username}/liked`}
              exact={true}
              activeclassname="active"
            >
              <BsHeart className="navbar-icon home-page hvr-shrink heart-button " />
            </NavLink>
            <NavLink to={`/${user.username}`}>
              <CgProfile className="navbar-icon home-page hvr-shrink profile-button " />
            </NavLink>
            <LogoutButton className="navbar-icon home-page der hvr-grow" />
          </>
        )}
        {/* <NavLink to="/users" exact={true} activeclassname="active">
          <FaUsers className='navbar-icon' />
        </NavLink> */}
      </div>
    </nav>
  );
};

export default NavBar;

import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FcHome } from "react-icons/fc";
import { AiOutlineHome } from 'react-icons/ai'
import { IoPaperPlaneOutline } from "react-icons/io5";
import { FaWpexplorer, FaUsers } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BsHeart } from "react-icons/bs";

import LogoutButton from "../auth/LogoutButton";
import { useSelector } from "react-redux";
import "./NavBar.css";

const NavBar = () => {
  const user = useSelector((state) => state.session.user);

  return (
    <nav className="top-navbar">
      <p className="navbar-content hvr-shrink">InstaVibes</p>
      <input
        className="navbar-content"
        type="text"
        placeholder="Search.."
      ></input>
<<<<<<< HEAD
      <div className="navbar-content ">
        <NavLink to="/" exact={true} activeClassName="active">
          <FcHome className="navbar-icon" />
=======
      <div className="navbar-content">
        <NavLink to="/" exact={true} activeclassname="active">
          <AiOutlineHome className="navbar-icon" activeclassname='active'/>
>>>>>>> df38aaf0fe791b55164d48a8e5f224ce0a313d1e
        </NavLink>
        {!user && (
          <>
            <NavLink
              to="/login"
              exact={true}
              activeclassname="active"
              className="navbar-icon"
              style={{ width: "60px" }}
            >
              Login
            </NavLink>
            <NavLink
              to="/sign-up"
              exact={true}
              activeclassname="active"
              className="navbar-icon"
              style={{ width: "60px" }}
            >
              Sign Up
            </NavLink>
          </>
        )}
        {user && (
          <>
<<<<<<< HEAD
            <NavLink to="/messages" exact={true} activeClassName="active">
              <IoPaperPlaneOutline className="navbar-icon hvr-shrink" />
            </NavLink>
            <NavLink to="/explore" exact={true} activeClassName="active">
              <FaWpexplorer className="navbar-icon hvr-shrink" />
            </NavLink>
            <NavLink to="/likes" exact={true} activeClassName="active">
              <BsHeart className="navbar-icon hvr-shrink" />
=======
            <NavLink to="/messages" exact={true} activeclassname="active">
              <IoPaperPlaneOutline className="navbar-icon" />
            </NavLink>
            <NavLink to="/explore" exact={true} activeclassname="active">
              <FaWpexplorer className="navbar-icon" />
            </NavLink>
            <NavLink to="/likes" exact={true} activeclassname="active">
              <BsHeart className="navbar-icon" />
>>>>>>> df38aaf0fe791b55164d48a8e5f224ce0a313d1e
            </NavLink>
            <NavLink to={`/${user.username}`}>
              <CgProfile className="navbar-icon hvr-shrink" />
            </NavLink>
            <LogoutButton className="navbar-icon  hvr-shrink" />
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

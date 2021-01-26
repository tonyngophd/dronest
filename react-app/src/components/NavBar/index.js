import React from "react";
import { NavLink } from "react-router-dom";
import { FcHome } from 'react-icons/fc'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { FaWpexplorer, FaUsers } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'


import LogoutButton from "../auth/LogoutButton";
import { useSelector } from "react-redux";
import './NavBar.css'

const NavBar = () => {
  const user = useSelector((state) => state.session.user);

  return (
    <nav className="top-navbar">
      <p className="navbar-content">InstaVibes</p>
      <input className="navbar-content" type="text" placeholder="Search.."></input>
      <div className="navbar-content">
        <NavLink to="/" exact={true} activeClassName="active">
          <FcHome className='navbar-icon' />
        </NavLink>
        {!user && (
          <>
            <NavLink to="/login" exact={true} activeClassName="active">
              Login
              </NavLink>
            <NavLink to="/sign-up" exact={true} activeClassName="active">
              Sign Up
              </NavLink>
          </>
        )}
        {user && <>
          <IoPaperPlaneOutline className="navbar-icon" />
          <FaWpexplorer className='navbar-icon' />
          <CgProfile className='navbar-icon' />
          <LogoutButton className='navbar-icon'/>
        </>}
        <NavLink to="/users" exact={true} activeClassName="active">
          <FaUsers className='navbar-icon' />
          </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;

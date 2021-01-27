import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FcHome } from 'react-icons/fc'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { FaWpexplorer, FaUsers } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'
import { BsHeart } from 'react-icons/bs'


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
            <NavLink to="/login" exact={true} activeClassName="active" className='navbar-icon' style={{ width: '60px' }}>
              Login
              </NavLink>
            <NavLink to="/sign-up" exact={true} activeClassName="active" className='navbar-icon' style={{ width: '60px' }}>
              Sign Up
              </NavLink>
          </>
        )}
        {user && <>
          <NavLink to="/messages" exact={true} activeClassName="active">
            <IoPaperPlaneOutline className="navbar-icon" />
          </NavLink>
          <NavLink to="/explore" exact={true} activeClassName="active">
            <FaWpexplorer className='navbar-icon' />
          </NavLink>
          <NavLink to="/likes" exact={true} activeClassName="active">
            <BsHeart className='navbar-icon' />
          </NavLink>
          <NavLink to={`/${user.username}`}>
            <CgProfile className='navbar-icon' />
          </NavLink>
          <LogoutButton className='navbar-icon' />
        </>}
        {/* <NavLink to="/users" exact={true} activeClassName="active">
          <FaUsers className='navbar-icon' />
        </NavLink> */}
      </div>
    </nav>
  );
};

export default NavBar;

import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import { useSelector } from "react-redux";
import './NavBar.css'

const NavBar = () => {
  const user = useSelector((state) => state.session.user);

  return (
    <nav>
      <p className="navbar-content">InstaVibes</p>
      <input className="navbar-content" type="text" placeholder="Search.."></input>
      <ul className="navbar-content">
        <li className="navbar-link">
          <NavLink to="/" exact={true} activeClassName="active">
            Home
          </NavLink>
        </li>
        {!user && (
          <>
            <li className="navbar-link">
              <NavLink to="/login" exact={true} activeClassName="active">
                Login
              </NavLink>
            </li>

            <li className="navbar-link">
              <NavLink to="/sign-up" exact={true} activeClassName="active">
                Sign Up
              </NavLink>
            </li>
          </>
        )}
        <li className="navbar-link">
          <NavLink to="/users" exact={true} activeClassName="active">
            Users
          </NavLink>
        </li>
        {user && (
          <li className="navbar-link">
            <LogoutButton />
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;

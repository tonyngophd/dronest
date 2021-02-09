import React, { useState } from "react";
// import { logout } from "../../services/auth";
import { useDispatch } from "react-redux";
import { GrLogout } from "react-icons/gr";
import { IoExitOutline } from "react-icons/io5";
import { logoutUser } from "../../store/session";

const LogoutButton = ({ className, setShowLoggedOut}) => {
  const dispatch = useDispatch();

  const onLogout = async (e) => {
    e.preventDefault();
    dispatch(logoutUser());
    if(setShowLoggedOut){
      setShowLoggedOut(true);
    }
  };

  return (
    <div onClick={onLogout} className={className}>
      <IoExitOutline />    
    </div>
  );
};

export default LogoutButton;

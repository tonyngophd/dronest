import React from "react";
// import { logout } from "../../services/auth";
import { useDispatch } from "react-redux";
import { GrLogout } from 'react-icons/gr'
import { logoutUser } from "../../store/session";

const LogoutButton = ({className}) => {
  const dispatch = useDispatch();
  const onLogout = async (e) => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  return <div onClick={onLogout} className={className}><GrLogout /></div>;
};

export default LogoutButton;

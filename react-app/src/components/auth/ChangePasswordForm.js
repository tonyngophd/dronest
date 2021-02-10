import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import { nanoid } from 'nanoid';
import { Route } from 'react'
// import SignUpForm from './SignUpForm'
import './LoginForm.css'
import { GrClose } from "react-icons/gr";

// import { loginUser } from "../../store/session";
import { changePassword } from '../../services/auth';

const ChangePasswordForm = ({ setShowModal }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  // const history = useHistory();

  const onChangePassword = async (e) => {
    e.preventDefault();
    // e.stopPropagation();
    if(newPassword !== newConfirmPassword){
      setErrors(["Passwords do not match"]);
    } else {
      dispatch(changePassword(user.email, password, newPassword));
    }
    if (errors) {
      setErrors(errors);
    }
  };

  const updatePassword = (e, cb = setPassword) => {
    cb(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  const closeModal = (e) => {
    // e.preventDefault();
    if (
      e.target.className === "modal" ||
      e.target.className.animVal !== undefined
    ) {
      setShowModal(false);
    }
  }

  const escapeHideModal = e => {
    if(e.key === 'Escape')
      closeModal();
  }

  return (
    <div className="modal" onClick={closeModal} onKeyUp={escapeHideModal}>
      {/* <div className="login-img">
        <img src={require("../../pictures/signuppicture1.jpg")}/>
      </div> */}
      {/* <input type='text' onKeyUp={escapeHideModal}/> */}
      <div className="modal-content" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="follow-modal-top-div">
          <div className="follow-modal-title-div">Login</div>
          <div className="login-form_header">
            {/* <h1>Instavibes</h1> */}
            <img src={require("../../pictures/dronestlogo3.png")} />
          </div>
          <GrClose className="modal-close" onClick={closeModal} />
        </div>
        <form className="login-form" onSubmit={onChangePassword}>

          <div>
            {errors.map((error) => (
              <div key={nanoid()}>{error}</div>
            ))}
          </div>
          <div className="login-form-element">
            <label htmlFor="password"></label>
            <input
              name="password"
              type="password"
              placeholder="Veriry current password"
              value={password}
              onChange={updatePassword}
            />
          </div>
          <div className="login-form-element">
            <label htmlFor="password"></label>
            <input
              name="password"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => updatePassword(e, setNewPassword)}
            />
          </div>
          <div className="login-form-element">
            <label htmlFor="password"></label>
            <input
              name="password"
              type="password"
              placeholder="Confirm New Password"
              value={newConfirmPassword}
              onChange={e => updatePassword(e, setNewConfirmPassword)}
            />
          </div>
          <div className="login-form-element">
            <label htmlFor="password"></label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={updatePassword}
            />
          </div>
          <div className="buttons">
            <button type="submit" id="login-button" onClick={e => e.stopPropagation()}>Change Password</button>
            <button id="cancel-button" onClick={closeModal}>Cancel</button>
          </div>
          <p className="OR">OR</p>
          <div className="login-form-footer">
            <p>Don't have an account?</p>
            <Link to="/sign-up">
              sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;

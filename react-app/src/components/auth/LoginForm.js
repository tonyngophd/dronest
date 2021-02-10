import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import { nanoid } from 'nanoid';
import { Route } from 'react'
// import SignUpForm from './SignUpForm'
import './LoginForm.css'
import { GrClose } from "react-icons/gr";

import { loginUser } from "../../store/session";

const LoginForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const onLogin = async (e) => {
    e.preventDefault();
    // e.stopPropagation();
    const resJson = await dispatch(loginUser(credential.toLocaleLowerCase(), password));
    if (resJson.errors) {
      setErrors(resJson.errors);
    }
  };

  const updateCredential = (e) => {
    setCredential(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  const demoUser = (e) => {
    e.stopPropagation();
    setCredential("demo@aa.io");
    setPassword("password")
  }

  const closeModal = (e) => {
    if (!e) return history.push('/');
    e.preventDefault();
    if (
      e.target.className === "modal" ||
      e.target.className.animVal !== undefined
    ) {
      history.push('/');
    }
  }

  const escapeHideModal = e => {
    if (e.key === 'Escape')
      closeModal();
  }

  return (
    <div className="modal" onClick={closeModal} onKeyUp={escapeHideModal}>
      <div className="modal-content" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="follow-modal-top-div">
          <div className="follow-modal-title-div">Login</div>
          <div className="login-form_header">
            <img src={require("../../pictures/dronestlogo3.png")} />
          </div>
          <GrClose className="modal-close" onClick={closeModal} />
        </div>
        <form className="login-form" onSubmit={onLogin}>
          <div className='errors-div'>
            {errors.map((error) => (
              <div key={nanoid()}>{error}</div>
            ))}
          </div>
          <div className="login-form-element">
            <label htmlFor="credential"></label>
            <input
              name="credential"
              type="text"
              placeholder="Email or username"
              value={credential}
              onChange={updateCredential}
              autoFocus={true}
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
            <button type="submit" id="login-button" onClick={e => e.stopPropagation()}>Log in</button>
            <button onClick={demoUser} type="submit" id="demo-login-button">Demo</button>
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

export default LoginForm;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { nanoid } from 'nanoid';
import { Route } from 'react'
import SignUpForm from './SignUpForm'
import './LoginForm.css'

import { loginUser } from "../../store/session";

const LoginForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
    if (user && user.errors) {
      setErrors(user.errors);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  const demoUser = (event) => {
    setEmail("demo@aa.io");
    setPassword("password")
  }

  return (
    <div className="login_container">
      <div className="login-img">
        <img src={require("../../pictures/signuppicture1.jpg")}/>
      </div>
      <div className="login_form-container">
        <form className="login-form" onSubmit={onLogin}>
          <div className="login-form_header">
            {/* <h1>Instavibes</h1> */}
            <img src={require("../../pictures/dronestlogo3.png")}/>
          </div>
          <div>
            {errors.map((error) => (
              <div key={nanoid()}>{error}</div>
            ))}
          </div>
          <div className="login-form-element">
            <label htmlFor="email"></label>
            <input
              name="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={updateEmail}
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
            <button type="submit">Log in</button>
            <button onClick={demoUser} type="submit">Demo</button>
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

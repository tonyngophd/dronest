import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import { nanoid } from 'nanoid';
import './LoginForm.css'
import Modal from '../AAPopups/Modals';


import { loginUser } from "../../store/session";

const LoginForm = ({ setShowModal, redirect = true }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const onLogin = async (e) => {
    e.preventDefault();
    // e.stopPropagation();
    const resJson = await dispatch(loginUser(credential, password));
    if (resJson.errors) {
      setErrors(resJson.errors);
    }
  };

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  }

  const updateCredential = (e) => {
    setCredential(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    if(redirect)
      return <Redirect to="/" />;
    else {
      //Do something else if needed
    }
  }

  const demoUser = (e) => {
    e.stopPropagation();
    setCredential("demo@aa.io");
    setPassword("password")
  }

  return (
    <Modal setShowModal={setShowModal} title="Login">
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
          <button type="submit" id="login-button" onClick={handleClick}>Log in</button>
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
    </Modal>
  );
};

export default LoginForm;

import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../store/session";
import './SignUpForm.css'

const SignUpForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [bio, setBio] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [profilePicUrl, setPriofilePicUrl] = useState("");

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      dispatch(signupUser(username, name, email, password, bio, websiteUrl, profilePicUrl));
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateName = (e) => {
    setName(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  const updateBio = (e) => {
    setBio(e.target.value);
  };

  const updateWebsiteUrl = (e) => {
    setWebsiteUrl(e.target.value);
  };

  const updateProfilePicUrl = (e) => {
    setPriofilePicUrl(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="signup-form_container">
      <div className="signup-form_header">
        <img src="https://instavibes.s3.amazonaws.com/InstaVibes2.png"></img>
        <h5>Sign up to see photos from your friends</h5>
      </div>
      <form className="signup-form" onSubmit={onSignUp}>
        <div className="login-form-element">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={updateUsername}
            value={username}
          ></input>
        </div>
        <div className="login-form-element">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={updateName}
            value={name}
          ></input>
        </div>
        <div className="login-form-element">
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={updateEmail}
            value={email}
          ></input>
        </div>
        <div className="login-form-element">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={updatePassword}
            value={password}
          ></input>
        </div>
        <div className="login-form-element">
          <input
            type="password"
            name="repeat_password"
            placeholder="Confrim Password"
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
          ></input>
        </div>
        <div className="login-form-element">
          <input
            type="text"
            name="bio"
            placeholder="Bio"
            onChange={updateBio}
            value={bio}
          ></input>
        </div>
        <div className="login-form-element">
          <input
            type="text"
            name="bio"
            placeholder="Website URL"
            onChange={updateWebsiteUrl}
            value={websiteUrl}
          ></input>
        </div>
        <div className="login-form-element">
          <input
            type="text"
            name="bio"
            placeholder="Profile Picture URL"
            onChange={updateProfilePicUrl}
            value={profilePicUrl}
          ></input>
        </div>
        <button type="submit">Sign Up</button>
        <div className="signup-form-footer">
          <p>Already have an account?</p>
          <Link to="/login">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;

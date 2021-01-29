import React, { useState } from "react";
import { Redirect } from "react-router-dom";
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
      <h1>InstaVibes</h1>
      <form className="signup-form" onSubmit={onSignUp}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={updateUsername}
            value={username}
          ></input>
        </div>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={updateName}
            value={name}
          ></input>
        </div>
        <div>
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={updateEmail}
            value={email}
          ></input>
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={updatePassword}
            value={password}
          ></input>
        </div>
        <div>
          <input
            type="password"
            name="repeat_password"
            placeholder="Confrim Password"
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
          ></input>
        </div>
        <div>
          <input
            type="text"
            name="bio"
            placeholder="Bio"
            onChange={updateBio}
            value={bio}
          ></input>
        </div>
        <div>
          <input
            type="text"
            name="bio"
            placeholder="Website URL"
            onChange={updateWebsiteUrl}
            value={websiteUrl}
          ></input>
        </div>
        <div>
          <input
            type="text"
            name="bio"
            placeholder="Profile Picture URL"
            onChange={updateProfilePicUrl}
            value={profilePicUrl}
          ></input>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;

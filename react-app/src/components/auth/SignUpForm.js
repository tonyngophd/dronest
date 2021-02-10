import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from 'nanoid';
import { GrClose } from "react-icons/gr";

import { signupUser, updateUser } from "../../store/session";
import './SignUpForm.css'

const SignUpForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [bio, setBio] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");

  const onUpdateProfile = async (e) => {
    e.preventDefault();
    if (password && password === repeatPassword) {
      const resJson = await dispatch(signupUser(username, name, email, password, bio, websiteUrl, profilePicUrl));
      if (resJson.errors) {
        setErrors(resJson.errors);
      }
    } else {
      setErrors(['Passwords do not match']);
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
    setProfilePicUrl(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="signup-form_container">
      <div className="signup-form_header">
        <img src={require("../../pictures/dronestlogo3.png")}></img>
        <h5>Sign up for to see much more drone arts</h5>
      </div>
      <form className="signup-form" onSubmit={onUpdateProfile}>
        <div className='errors-div'>
          {errors.map((error) => (
            <div key={nanoid()}>{error}</div>
          ))}
        </div>
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
            type="email"
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
            placeholder="Confirm Password"
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


export const UpdateProfileModal = ({ setShowModal }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState(user && user.username);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [bio, setBio] = useState(user && user.bio);
  const [websiteUrl, setWebsiteUrl] = useState(user && user.websiteUrl);
  const [profilePicUrl, setProfilePicUrl] = useState(user && user.profilePicUrl);
  const [showChangeUsername, setShowChangeUsername] = useState(false);

  const onUpdateProfile = async (e) => {
    e.preventDefault();
    if (true) {
      const resJson = await dispatch(updateUser(username, name, email, bio, websiteUrl, profilePicUrl));
      if (resJson.errors) {
        setErrors(resJson.errors);
      }
    } else {
      setErrors(['Passwords do not match']);
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

  const updateBio = (e) => {
    setBio(e.target.value);
  };

  const updateWebsiteUrl = (e) => {
    setWebsiteUrl(e.target.value);
  };

  const updateProfilePicUrl = (e) => {
    setProfilePicUrl(e.target.value);
  };

  if (!user) {
    return <Redirect to="/login" />;
  }

  const closeModal = (e) => {
    e.preventDefault();
    if (
      e.target.className === "modal" ||
      e.target.className.animVal !== undefined
    ) {
      setShowModal(false);
    }
  }

  const escapeHideModal = e => {
    if (e.key === 'Escape')
      setShowModal(false);
  }

  const onSubmitClick = e => {
    e.stopPropagation();
    // setPasswordIsSubmitting(true);
    // setNewPasswordIsSubmitting(true);
    // setNewCPasswordIsSubmitting(true);    
  }

  return (
    <div className="modal" onClick={closeModal} onKeyUp={escapeHideModal}>
      <div className="modal-content" style={{ display: 'flex', alignItems: 'center', width: '500px' }}>
        <div className="follow-modal-top-div">
          <div className="follow-modal-title-div" style={{ fontSize: '14px', padding: '0px' }}>Change <br /> Password</div>
          <div className="login-form_header">
            <img src={require("../../pictures/dronestlogo3.png")} />
          </div>
          <GrClose className="modal-close" onClick={closeModal} />
        </div>
        <form className="login-form" onSubmit={onUpdateProfile}>
          <div className='errors-div'>
            {errors.map((error) => (
              <div key={nanoid()}>{error}</div>
            ))}
          </div>
          <div className="update-form-element">
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={updateUsername}
              value={username}
              autoFocus={true}
            ></input>
          </div>
          <div className="update-form-element">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={updateName}
              value={name}
            ></input>
          </div>
          <div className="update-form-element">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={updateEmail}
              value={email}
            ></input>
          </div>
          <div className="update-form-element">
            <label htmlFor="bio">Bio: </label>
            <input
              type="text"
              name="bio"
              placeholder="Bio"
              onChange={updateBio}
              value={bio}
            ></input>
          </div>
          <div className="update-form-element">
            <label htmlFor="websiteUrl">Website Url: </label>
            <input
              type="text"
              name="websiteUrl"
              placeholder="Website URL"
              onChange={updateWebsiteUrl}
              value={websiteUrl}
            ></input>
          </div>
          <div className="update-form-element">
            <label htmlFor="profilePicUrl">Profile Pic Url: </label>
            <input
              type="text"
              name="profilePicUrl"
              placeholder="Profile Picture URL"
              onChange={updateProfilePicUrl}
              value={profilePicUrl}
            ></input>
          </div>
          <div className="buttons">
            <button type="submit" id="login-button" onClick={onSubmitClick}>Update</button>
            <button id="cancel-button" className='cancel-button' onClick={e => setShowModal(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default SignUpForm;

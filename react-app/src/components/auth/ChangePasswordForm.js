import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Redirect  } from "react-router-dom";
import { nanoid } from 'nanoid';
import './LoginForm.css'
import { GrClose } from "react-icons/gr";

import { changePassword } from '../../services/auth';

const ChangePasswordForm = ({ setShowModal }) => {
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== newConfirmPassword || !password || !newPassword) {
      const errs = [];
      if (!password)
        errs.push(["Please provide current password"]);
      if (!newPassword)
        errs.push(["Please provide new password"]);
      if (newPassword !== newConfirmPassword)
        errs.push(["Passwords do not match"]);

      setErrors(errs);
    }
    else {
      const resJson = await changePassword(user.email, password, newPassword);
      if (resJson.errors) {
        setErrors([resJson.errors]);
      } else {
        setErrors([]);
        setMessages([resJson.success])
        setTimeout(() => setShowModal(false), 2000);
      }
    }
  };

  const updatePassword = (e, cb = setPassword) => {
    cb(e.target.value);
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

  return (
    <div className="modal" onClick={closeModal} onKeyUp={escapeHideModal}>
      <div className="modal-content" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="follow-modal-top-div">
          <div className="follow-modal-title-div" style={{fontSize: '14px', padding: '0px'}}>Change Password</div>
          <div className="login-form_header">
            <img src={require("../../pictures/dronestlogo3.png")} />
          </div>
          <GrClose className="modal-close" onClick={closeModal} />
        </div>
        <form className="login-form" onSubmit={onChangePassword}>
          <div className='errors-div'>
            {errors.map((error) => (
              <div key={nanoid()}>{error}</div>
            ))}
          </div>
          {messages.length ? <div className='errors-div' style={{ color: 'green' }}>
            {messages.map((m) => (
              <div key={nanoid()}>{m}</div>
            ))}
          </div> :
            <>
              <div className="login-form-element">
                <label htmlFor="password"></label>
                <input
                  name="password"
                  type="password"
                  placeholder="Verify current password"
                  value={password}
                  onChange={updatePassword}
                  autoFocus={true}
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
              <div className="buttons">
                <button type="submit" id="login-button" onClick={e => e.stopPropagation()}>Change Password</button>
                <button id="cancel-button" className='cancel-button' onClick={e => setShowModal(false)}>Cancel</button>
              </div>
            </>}
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;

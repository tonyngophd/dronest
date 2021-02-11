import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { nanoid } from 'nanoid';
import './LoginForm.css'
import Modal from '../AAPopups/Modals';

import { changePassword } from '../../services/auth';

const ChangePasswordForm = ({ setShowModal }) => {
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [password, setPassword] = useState("");
  const [passwordIsSubmitting, setPasswordIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordIsSubmitting, setNewPasswordIsSubmitting] = useState(false);
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [newCPasswordIsSubmitting, setNewCPasswordIsSubmitting] = useState(false);

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== newConfirmPassword || !password || !newPassword) {
      const errs = [];
      if (!password)
        errs.push("Please provide current password");
      if (!newPassword)
        errs.push("Please provide new password");
      if (newPassword !== newConfirmPassword)
        errs.push("Passwords do not match");

      setErrors(errs);
    }
    else {
      const resJson = await changePassword(user.email, password, newPassword);
      if (resJson.errors) {
        setErrors(resJson.errors);
      } else {
        setErrors([]);
        setMessages([resJson.success])
        setTimeout(() => setShowModal(false), 2000);
      }
    }
  };

  const updatePassword = (e, cb = setPassword, cb2 = setPasswordIsSubmitting) => {
    cb(e.target.value);
    cb2(false);
  };


  if (!user) {
    return <Redirect to="/login" />;
  }

  const onSubmitClick = e => {
    e.stopPropagation();
    setPasswordIsSubmitting(true);
    setNewPasswordIsSubmitting(true);
    setNewCPasswordIsSubmitting(true);
  }

  const Title = <>Change <br/> Password</>;

  return (
    <Modal setShowModal={setShowModal} title={Title}>
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
            <div className={passwordIsSubmitting &&
              errors.includes("Please provide current password") ?
              "login-form-element-error"
              : "login-form-element"}>
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
            <div className={newPasswordIsSubmitting &&
              errors.includes("Please provide new password") ?
              "login-form-element-error"
              : "login-form-element"}>
              <label htmlFor="password"></label>
              <input
                name="password"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => updatePassword(e, setNewPassword, setNewPasswordIsSubmitting)}
              />
            </div>
            <div className={newCPasswordIsSubmitting &&
              errors.includes("Passwords do not match") ?
              "login-form-element-error"
              : "login-form-element"}>
              <label htmlFor="password"></label>
              <input
                name="password"
                type="password"
                placeholder="Confirm New Password"
                value={newConfirmPassword}
                onChange={e => updatePassword(e, setNewConfirmPassword, setNewCPasswordIsSubmitting)}
              />
            </div>
            <div className="buttons">
              <button type="submit" id="login-button" onClick={onSubmitClick}>Change Password</button>
              <button id="cancel-button" className='cancel-button' onClick={e => setShowModal(false)}>Cancel</button>
            </div>
          </>}
      </form>
    </Modal>
  );
};

export default ChangePasswordForm;

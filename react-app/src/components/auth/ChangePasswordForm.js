import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Redirect  } from "react-router-dom";
import { nanoid } from 'nanoid';
import './LoginForm.css'
import { GrClose } from "react-icons/gr";
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
    setPasswordIsSubmitting(true);
    setNewPasswordIsSubmitting(true);
    setNewCPasswordIsSubmitting(true);    
  }

  return (
    <div className="modal" onClick={closeModal} onKeyUp={escapeHideModal}>
      <div className="modal-content" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="follow-modal-top-div">
          <div className="follow-modal-title-div" style={{fontSize: '14px', padding: '0px'}}>Change <br/> Password</div>
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
              <div className={passwordIsSubmitting && 
                  errors.includes("Please provide current password")? 
                  "login-form-element-error" 
                  :"login-form-element"}>
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
                  errors.includes("Please provide new password")? 
                  "login-form-element-error" 
                  :"login-form-element"}>
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
                  errors.includes("Passwords do not match")? 
                  "login-form-element-error" 
                  :"login-form-element"}>
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
      </div>
    </div>
  );
};

export default ChangePasswordForm;

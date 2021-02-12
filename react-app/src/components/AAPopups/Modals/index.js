import React from "react";
import { GrClose } from "react-icons/gr";

import './Modals.css';

const Modal = ({ setShowModal, children, title, action,
  width, dronestLogo = true, needsEscapeInput = false,
  closeXOutSide = false, noTopDiv = false, shieldBackground = true
}) => {

  const closeModal = (e) => {
    e.preventDefault();
    if (e.target.className === "modal") {
      setShowModal(false);
      if (action) return action();
    }
  }

  const escapeHideModal = e => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setShowModal(false);
    }
  }
  return (
    <div className={shieldBackground?'modal':'gibberish'}
      onClick={closeModal} onKeyUp={escapeHideModal}
    >
      <div className={shieldBackground?'modal-content':'modal-content-dep-parents'}
        style={{
          display: 'flex', alignItems: 'center', width: width ? width : "noAdditionalEffect",
        }}>
        {noTopDiv ?
          <GrClose className='modal-close-top-right-screen' onClick={e => setShowModal(false)} />
          :
          <>
            <div className="follow-modal-top-div">
              <div className="follow-modal-title-div" style={{ fontSize: '14px', padding: '0px' }}>{title}</div>
              {dronestLogo && <div className="login-form_header">
                <img src={require("../../../pictures/dronestlogo3.png")} />
              </div>}
              <GrClose className={closeXOutSide ? 'modal-close-top-right-screen' : "modal-close"} onClick={e => setShowModal(false)} />
            </div>
          </>}
        {children}
        {needsEscapeInput &&
          <input
            autoFocus={true}
            type='text'
            onKeyUp={escapeHideModal}
            style={{ position: 'fixed', top: '-100px', left: '-10px' }}
          />
        }
      </div>
    </div>
  );
};

export default Modal;

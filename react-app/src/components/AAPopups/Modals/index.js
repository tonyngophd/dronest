import React from "react";
import { GrClose } from "react-icons/gr";

const Modal = ({ setShowModal, children }) => {


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
          <div className="follow-modal-title-div" style={{fontSize: '14px', padding: '0px'}}>Change <br/> Password</div>
          <div className="login-form_header">
            <img src={require("../../../pictures/dronestlogo3.png")} />
          </div>
          <GrClose className="modal-close" onClick={closeModal} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;

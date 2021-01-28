import "./PicModal.css";
import ReactDOM from "react-dom";
import React from "react";

const PicModal = ({ open, children, onClose }) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <div className="pic-overlay" onClick={onClose}></div>
      <div className="pic-modal">{children}</div>
    </>,
    document.getElementById("pic-portal")
  );
};

export default PicModal;

import "./NewPostModal.css";
import ReactDOM from "react-dom";
import React from "react";

const NewPostModal = ({ open, children, onClose }) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <div className="new-post-overlay" onClick={onClose}></div>
      <div className="new-post-modal">{children}</div>
    </>,
    document.getElementById("new-post-portal")
  );
};

export default NewPostModal;

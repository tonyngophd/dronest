import React, { useState } from "react";
import "./NotificationCenter.css";

const NotificationCenter = ({ initialTab }) => {
  const [current, setCurrent] = useState(initialTab);
  const [allActive, setAllActive] = useState(current === 1);
  const [followActive, setFollowActive] = useState(current === 2);
  const [postActive, setPostActive] = useState(current === 3);
  const [commentActive, setCommentActive] = useState(current === 4);
  return (
    <div className="notif-center-container">
      <div className="notif-center-header">
        <span className="notif-center-header-text">Notifications</span>
        <button className="clear-all-button">Clear all</button>
      </div>
      <div className="notif-center-body">
        <div className="notif-center-nav">
          <div
            onClick={() => {
              setAllActive(true);
              setFollowActive(false);
              setPostActive(false);
              setCommentActive(false);
              setCurrent(1);
            }}
            className={
              allActive
                ? "notif-center-nav-option active"
                : "notif-center-nav-option"
            }
          ></div>
          <div
            onClick={() => {
              setAllActive(false);
              setFollowActive(true);
              setPostActive(false);
              setCommentActive(false);
              setCurrent(2);
            }}
            className={
              followActive
                ? "notif-center-nav-option active"
                : "notif-center-nav-option"
            }
          ></div>
          <div
            onClick={() => {
              setAllActive(false);
              setFollowActive(false);
              setPostActive(true);
              setCommentActive(false);
              setCurrent(3);
            }}
            className={
              postActive
                ? "notif-center-nav-option active"
                : "notif-center-nav-option"
            }
          ></div>
          <div
            onClick={() => {
              setAllActive(false);
              setFollowActive(false);
              setPostActive(false);
              setCommentActive(true);
              setCurrent(1);
            }}
            className={
              commentActive
                ? "notif-center-nav-option active"
                : "notif-center-nav-option"
            }
          ></div>
        </div>
        <div className="notif-center-content"></div>
      </div>
    </div>
  );
};

export default NotificationCenter;

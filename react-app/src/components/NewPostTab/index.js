import "./NewPostTab.css";
import React, { useState } from "react";
import NewPostModal from "../NewPostModal";
import NewPostModalNav from "../NewPostModalNav";
import NewPost from "../NewPost";
import { useDispatch, useSelector } from "react-redux";
import { clearMentions } from "../../store/mentions";
import {
  BsBell,
  BsClockHistory,
  BsPlusSquare,
  BsTag,
  BsChat,
} from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";
import NotificationCenter from "../NotificationCenter";

const NewPostTab = () => {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifHover, setNotifHover] = useState(false);
  const [initial, setInitial] = useState(1);
  return (
    <div
      className={
        notifHover ? "post-tab-container notif-hover" : "post-tab-container"
      }
    >
      <div onClick={() => setIsPostOpen(true)} className="post-tab-new-post">
        <BsPlusSquare className="hvr-grow" />
      </div>
      <div onClick={() => setIsPostOpen(true)} className="post-tab-new-story">
        <BsClockHistory className="hvr-grow" />
      </div>
      <div
        className="notification-buttons"
        onMouseOver={() => setNotifHover(true)}
        onMouseOut={() => setNotifHover(false)}
      >
        <div
          onClick={() => {
            setInitial(1);
            setIsNotifOpen(true);
          }}
          className="hvr-grow post-tab-notifications all-notifs"
        >
          <BsBell />
          {notifications.total > 0 && (
            <div className="all-notifs-count notifs-count">
              {notifications.total}
            </div>
          )}
        </div>

        <div className="nofifications-options">
          <div
            onClick={() => {
              setInitial(2);
              setIsNotifOpen(true);
            }}
            className="hvr-grow post-tab-notifications follow-notifs"
          >
            <AiOutlineUserAdd />
            {notifications.num_follows > 0 && (
              <div className="follow-notifs-count notifs-count">
                {notifications.num_follows}
              </div>
            )}
          </div>
          <div
            onClick={() => {
              setInitial(3);
              setIsNotifOpen(true);
            }}
            className="hvr-grow post-tab-notifications tag-notifs"
          >
            <BsTag />
            {notifications.num_post_tags > 0 && (
              <div className="tag-notifs-count notifs-count">
                {notifications.num_post_tags}
              </div>
            )}
          </div>
          <div
            onClick={() => {
              setInitial(4);
              setIsNotifOpen(true);
            }}
            className="hvr-grow post-tab-notifications comment-notifs"
          >
            <BsChat />
            {notifications.num_comment_tags > 0 && (
              <div className="comment-notifs-count notifs-count">
                {notifications.num_comment_tags}
              </div>
            )}
          </div>
        </div>
      </div>
      <NewPostModal
        isNotif={true}
        open={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      >
        <NotificationCenter
          onClose={() => setIsNotifOpen(false)}
          initialTab={initial}
        />
      </NewPostModal>

      <NewPostModal
        open={isPostOpen}
        onClose={() => {
          dispatch(clearMentions());
          setIsPostOpen(false);
        }}
      >
        <NewPostModalNav />
        <NewPost
          onPost={() => {
            dispatch(clearMentions());
            setIsPostOpen(false);
          }}
        />
      </NewPostModal>
    </div>
  );
};

export default NewPostTab;

import "./NewPostTab.css";
import React, { useState } from "react";
import NewPostModal from "../NewPostModal";
import NewPostModalNav from "../NewPostModalNav";
import NewPost from "../NewPost";
import { useDispatch } from "react-redux";
import { clearMentions } from "../../store/mentions";

const NewPostTab = () => {
  const dispatch = useDispatch();
  const [isPostOpen, setIsPostOpen] = useState(false);
  return (
    <div className="post-tab-container">
      <div onClick={() => setIsPostOpen(true)} className="post-tab-new-post">
        <i className="las la-plus-square"></i>
      </div>
      <div onClick={() => setIsPostOpen(true)} className="post-tab-new-story">
        <i className="las la-user-clock"></i>
      </div>
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

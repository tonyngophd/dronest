import "./NewPostTab.css";
import React, { useState } from "react";
import NewPostModal from "../NewPostModal";
import NewPostModalNav from "../NewPostModalNav";
import NewPost from "../NewPost";

const NewPostTab = () => {
  const [isPostOpen, setIsPostOpen] = useState(false);
  return (
    <div className="post-tab-container">
      <div onClick={() => setIsPostOpen(true)} className="post-tab-new-post">
        <i className="las la-plus-square"></i>
      </div>
      <div onClick={() => setIsPostOpen(true)} className="post-tab-new-story">
        <i className="las la-user-clock"></i>
      </div>
      <NewPostModal open={isPostOpen} onClose={() => setIsPostOpen(false)}>
        <NewPostModalNav />
        <NewPost />
      </NewPostModal>
    </div>
  );
};

export default NewPostTab;

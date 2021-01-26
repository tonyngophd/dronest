import React, { useState, useRef } from "react";
import "./NewPost.css";
import { EditorState, convertToRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "draft-js-mention-plugin";
import "draft-js/dist/Draft.css";

const UserTag = (props) => {
  const { mention, theme, searchValue, isFocused, ...parentProps } = props;

  return (
    <div {...parentProps}>
      <div className={theme.mentionSuggestionsEntryContainer}>
        <div className={theme.mentionSuggestionsEntry}>
          <div className={theme.mentionSuggestionsEntryContainerLeft}>
            <img
              src={mention.profilePicUrl}
              className={theme.mentionSuggestionsEntryProfilePic}
              alt="profile"
            />
          </div>
          <div className={theme.mentionSuggestionsEntryContainerRight}>
            <div className={theme.mentionSuggestionsEntryName}>
              {mention.name}
            </div>
            <div className={theme.mentionSuggestionsEntryUsername}>
              {mention.username}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewPost = () => {
  const [image, setImage] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const ref = useRef();

  const updateFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImgSrc(URL.createObjectURL(file));
    }
  };

  const submitImage = (image) => {

  }

  const focus = () => {
    ref.current.focus();
  };

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  return (
    <div className="new-post-input-container">
      {!imgSrc && (
        <>
          <div className="image-placeholder" />
          <label htmlFor={"image-input"} className="image-upload">
            <i className="las la-plus-square image-upload-plus"></i>
          </label>
          <input id={"image-input"} type="file" onChange={updateFile}></input>
        </>
      )}
      {imgSrc && <img className="image-preview" src={imgSrc} alt="" />}
      <div className="editor-wrapper">
        <div className="editor" onFocus={focus}>
          <Editor
            editorState={editorState}
            placeholder="Enter a caption..."
            onChange={(editorState) => setEditorState(editorState)}
            ref={(event) => (ref.current = event)}
          />
        </div>
      </div>
    </div>
  );
};

export default NewPost;

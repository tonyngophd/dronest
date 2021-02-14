import React, { useState } from "react";
import Editor from "@draft-js-plugins/editor";
import { EditorState, convertFromRaw } from "draft-js";
import createMentionPlugin from "@draft-js-plugins/mention";
import { useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./PicModalCaption.css";
import { Plugins } from '../utils';

function PicModalCaption({ post }) {
  const profile = useSelector((state) => state.profile);
  const history = useHistory();
  const plugins = Plugins();
  let data = "";
  if (post.captionRawData) {
    data = JSON.parse(post.captionRawData);
    data = convertFromRaw(data);
  }
  const [editorState, setEditorState] = useState(
    (data?EditorState.createWithContent(data):EditorState.createEmpty())
  );

  return (
    <div className="pic-modal-caption-wrapper">
      <Editor
        editorState={editorState}
        readOnly={true}
        plugins={plugins}
        onChange={(editorState) => setEditorState(editorState)}
      />
    </div>
  );
}

export default PicModalCaption;

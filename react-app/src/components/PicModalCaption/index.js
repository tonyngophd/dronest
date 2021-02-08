import React, { useState } from "react";
import Editor from "@draft-js-plugins/editor";
import { EditorState, convertFromRaw } from "draft-js";
import createMentionPlugin from "@draft-js-plugins/mention";
import { useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./PicModalCaption.css";

function PicModalCaption({ post }) {
  const profile = useSelector((state) => state.profile);
  const history = useHistory();
  const [userMentionPlugin] = useState(
    createMentionPlugin({
      mentionComponent: (mentionProps) => (
        <span
          className={`${mentionProps.className} post-mention`}
          onClick={(event) => {
            event.stopPropagation();
            history.push(`/${mentionProps.mention.name}`);
          }}
        >
          {mentionProps.children}
        </span>
      ),
      theme: {
        mention: "mention",
      },
      mentionPrefix: "@",
    })
  );
  const [hashtagMentionPlugin] = useState(
    createMentionPlugin({
      mentionComponent: (mentionProps) => (
        <span
          className={`${mentionProps.className} post-mention`}
          onClick={(event) => {
            event.stopPropagation();
            history.push(`/explore/tags/${mentionProps.mention.name}/`);
          }}
        >
          {mentionProps.children}
        </span>
      ),
      theme: {
        mention: "mention",
      },
      mentionTrigger: "#",
      mentionPrefix: "#",
    })
  );
  const plugins = [userMentionPlugin, hashtagMentionPlugin];
  let data = "";
  if (post.captionRawData) {
    data = JSON.parse(post.captionRawData);
    data = convertFromRaw(data);
  }
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(data)
  );

  return (
    <div className="pic-modal-caption">
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

import React, { useState } from "react";
import "./Comment.css";
import { EditorState, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin from "draft-js-mention-plugin";
import { useHistory, Link } from "react-router-dom";

function Comment({ comment, message = undefined }) {
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
  let data = JSON.parse(message ? message : comment.captionRawData);
  data = convertFromRaw(data);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(data)
  );
  return (
    <div className="comment-wrapper">
      <div className="comment">
        {!message && <Link to={`/${comment.commenter}`}>
          <div className="comment-user">{comment.commenter}</div>
        </Link>}
        <Editor
          editorState={editorState}
          readOnly={true}
          plugins={plugins}
          onChange={(editorState) => setEditorState(editorState)}
        />
      </div>
    </div>
  );
}
export default Comment;

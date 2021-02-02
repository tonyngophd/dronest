import React, { useState, useEffect } from "react";
import "./Comment.css";
import { EditorState, convertFromRaw } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import { useDispatch, useSelector } from "react-redux";
// import createMentionPlugin from "draft-js-mention-plugin";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';

import { useHistory, Link } from "react-router-dom";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { likeComment, unlikeComment } from "../../store/posts";
import timeStamp from '../utils';

function Comment({ home, comment, message = undefined }) {
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  let timestamp = timeStamp(new Date(comment ? comment.createdAt : message.createdAt), true);

  useEffect(() => {
    if (!message) {
      setLiked(comment.likingUsers[user.id]);
      setLikes(Object.values(comment.likingUsers).length);
    }
  }, []);

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
  let data;
  let messageIsPlainText = false;
  try {
    data = JSON.parse(message ? message : comment.captionRawData);
    data = convertFromRaw(data);
  } catch (e) {
    data = message;
    messageIsPlainText = true;
  }

  const [editorState, setEditorState] = useState(
    messageIsPlainText ? undefined : EditorState.createWithContent(data)
  );

  const likeHandler = () => {
    if (liked) {
      dispatch(unlikeComment(comment.id));
      setLiked(false);
      setLikes(likes - 1);
    } else {
      dispatch(likeComment(comment.id));
      setLiked(true);
      setLikes(likes + 1);
    }
  };

  return (
    <div className={home ? "comment-wrapper" : "comment-modal-wrapper"}>
      <div className="comment">
        {!message && comment && (
          <Link to={`/${comment.commenter}`}>
            <div className="comment-user">{comment.commenter}</div>
          </Link>
        )}
        {messageIsPlainText ? (
          <>{data}</>
        ) : (
            <Editor
              editorState={editorState}
              readOnly={true}
              plugins={plugins}
              onChange={(editorState) => setEditorState(editorState)}
            />
          )}
      </div>
      {!home && !message && (
        <div className="time-and-likes-comment">
          <div className="comment-timestamp">{timestamp}</div>
          {likes > 0 && (
            <span className={"comment-likes"}>
              {likes} {likes === 1 ? "like" : "likes"}
            </span>
          )}
        </div>
      )}
      {!message && liked && (
        <BsHeartFill onClick={likeHandler} className="comment-heart filled" />
      )}
      {!message && !liked && (
        <BsHeart onClick={likeHandler} className="comment-heart" />
      )}
    </div>
  );
}
export default Comment;

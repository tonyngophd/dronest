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
import timeStamp, { Plugins } from '../utils';

function Comment({ insideCN = "", home, comment, inputMessage = undefined, replaceText = undefined }) {
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  let message = inputMessage ?
    (typeof (inputMessage) === "string" && inputMessage.includes(replaceText) ?
      inputMessage.replaceAll(replaceText, ":") : inputMessage)
    : undefined;
  ;
  let timestamp = timeStamp(new Date(comment ? comment.createdAt : message.createdAt), true);

  useEffect(() => {
    if (!message) {
      setLiked(comment.likingUsers[user.id]);
      setLikes(Object.values(comment.likingUsers).length);
    }
  }, []);

  const plugins = Plugins();
  let data;
  let messageIsPlainText = false;
  try {
    data = JSON.parse(message ? message : comment.captionRawData);
    data = convertFromRaw(data);
  } catch (e) {
    message ? data = message : data = "";
    messageIsPlainText = true;
  }

  const [editorState, setEditorState] = useState(
    messageIsPlainText ? undefined : (data ? EditorState.createWithContent(data) : EditorState.createEmpty())
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
    <div className={insideCN ?
      insideCN : (home ? "comment-wrapper" : "comment-modal-wrapper")}
    >
      <div className="comment">
        {!message && comment && (
          <Link to={`/${comment.commenter}`}>
            <div className="comment-user">{comment.commenter}</div>
            {!home && !message && <div className="comment-timestamp"
              style={{ fontWeight: 'normal', fontSize: '14px' }}>{timestamp}</div>}
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
      {/* {!home && !message && (
        <div className="time-and-likes-comment">
          {likes > 0 && (
            <span className={"comment-likes"}>
              {likes} {likes === 1 ? "like" : "likes"}
            </span>
          )}
        </div>
      )} */}
      <div style={{display: 'flex', flexDirection: 'column', width: '20px'}}>
        {!message && liked && (
          <BsHeartFill onClick={likeHandler} className="comment-heart filled" />
        )}
        {!message && !liked && (
          <BsHeart onClick={likeHandler} className="comment-heart" />
        )}
        {!home && !message && likes > 0 && (
          <div className="comment-heart" style={{marginTop: '10px', marginLeft: '-40px', transform: 'translateX(-10px)'}}>
            {likes}
          </div>
        )}
      </div>
    </div>
  );
}
export default Comment;

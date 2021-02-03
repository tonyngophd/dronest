import "./CommentInput.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Editor from "@draft-js-plugins/editor";
import { EditorState, convertToRaw } from "draft-js";
// import createMentionPlugin, {  defaultSuggestionsFilter,} from "draft-js-mention-plugin";
import createMentionPlugin, {  defaultSuggestionsFilter,} from "@draft-js-plugins/mention";
import '@draft-js-plugins/mention/lib/plugin.css';

import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserMentionsComments,
  fetchHashtagMentionsComments,
  clearMentions,
} from "../../store/mentions";
import {
  uploadComment,
  fetchHomeFeed,
  fetchSinglePost,
} from "../../store/posts";

import sendAMessage, { uploadMessage } from "../../store/messages";

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
              alt="pic"
            />
          </div>

          <div className={theme.mentionSuggestionsEntryContainerRight}>
            <div className={theme.mentionSuggestionsEntryDisplayName}>
              {mention.displayName}
            </div>

            <div className={theme.mentionSuggestionsEntryUsername}>
              {mention.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hashtag = (props) => {
  const { mention, theme, searchValue, isFocused, ...parentProps } = props;

  return (
    <div {...parentProps}>
      <div className={theme.mentionSuggestionsEntryContainer}>
        <div className={theme.mentionSuggestionsEntry}>
          <div className={theme.mentionSuggestionsEntryTagInfo}>
            #{mention.name}
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentInput = ({
  post,
  modal,
  increaseNumComments,
  className = "comment-editor-wrapper",
  insideCN = "",
  action = "Post",
  placeHolder = "Add a comment...",
  receiverId,
  sendChat = null,
}) => {
  const user = useSelector((state) => state.session.user);
  const userMentions = useSelector((state) => state.mentions.usersComments);
  const hashtagMentions = useSelector(
    (state) => state.mentions.hashtagsComments
  );
  const ref = useRef();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const dispatch = useDispatch();
  const [focused, setFocused] = useState(null);
  const [mentionOpen, setMentionOpen] = useState(false);
  const onMentionOpenChange = useCallback((_open) => {
    setMentionOpen(_open);
  }, []);  
  const [hashtagOpen, setHastagOpen] = useState(false);
  const onHastangOpenChange = useCallback((_open) => {
    setHastagOpen(_open);
  }, []);    

  const focus = () => {
    ref.current.focus();
    setFocused(true);
  };

  // useEffect(() => {
  //   dispatch(clearMentions());
  // }, [ref]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    setButtonDisabled(!editorState.getCurrentContent().hasText());
  }, [editorState]);

  const [userMentionPlugin] = useState(
    createMentionPlugin({
      userMentions,
      mentionComponent: (mentionProps) => (
        <span className={mentionProps.className}>{mentionProps.children}</span>
      ),
      entityMutability: "IMMUTABLE",
      theme: {
        mention: "mention",
        mentionSuggestions: "mentionSuggestions",
        mentionSuggestionsEntry: "mentionSuggestionsEntry",
        mentionSuggestionsEntryFocused: "mentionSuggestionsEntryFocused",
        mentionSuggestionsEntryDisplayName:
          "mentionSuggestionsEntryDisplayName",
        mentionSuggestionsEntryUsername: "mentionSuggestionsEntryUsername",
        mentionSuggestionsEntryProfilePic: "mentionSuggestionsEntryProfilePic",
      },
      mentionPrefix: "@",
      supportWhitespace: true,
    })
  );

  const [hashtagMentionPlugin] = useState(
    createMentionPlugin({
      hashtagMentions,
      mentionComponent: (mentionProps) => (
        <span className={mentionProps.className}>{mentionProps.children}</span>
      ),
      entityMutability: "IMMUTABLE",
      theme: {
        mention: "mention",
        mentionSuggestions: "mentionSuggestions",
        mentionSuggestionsEntry: "mentionSuggestionsEntry",
        mentionSuggestionsEntryFocused: "mentionSuggestionsEntryFocused",
        mentionSuggestionsEntryTagInfo: "mentionSuggestionsEntryHashtag",
      },
      mentionTrigger: "#",
      mentionPrefix: "#",
      supportWhitespace: false,
    })
  );
  const [query, setQuery] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [hashtagQuery, setHashtagQuery] = useState(null);
  const [hashtagSuggestions, setHashtagSuggestions] = useState([]);
  useEffect(() => {
    if (query) dispatch(fetchUserMentionsComments(query));
  }, [dispatch, query]);

  useEffect(() => {
    focused && setSuggestions(userMentions);
  }, [userMentions]);

  useEffect(() => {
    if (hashtagQuery) dispatch(fetchHashtagMentionsComments(hashtagQuery));
  }, [dispatch, hashtagQuery]);

  useEffect(() => {
    const newSuggestion = [{ name: hashtagQuery }];
    let exists = false;
    hashtagMentions &&
      hashtagMentions.forEach((mention) => {
        if (mention.name == hashtagQuery) exists = true;
      });
    if (hashtagQuery && !exists && focused) {
      setHashtagSuggestions([...hashtagMentions, ...newSuggestion]);
    } else if (hashtagQuery && exists && focused) {
      setHashtagSuggestions(hashtagMentions);
    }
  }, [hashtagMentions]);

  const { MentionSuggestions } = userMentionPlugin;
  const HashtagMentionSuggestions = hashtagMentionPlugin.MentionSuggestions;
  const plugins = [userMentionPlugin, hashtagMentionPlugin];

  const submitComment = async () => {
    const contentState = editorState.getCurrentContent();
    let rawData = convertToRaw(contentState);
    setEditorState(EditorState.createEmpty());
    let mentionedUsers = [];
    for (let key in rawData.entityMap) {
      const ent = rawData.entityMap[key];
      switch (ent.type) {
        case "mention":
          mentionedUsers.push(ent.data.mention);
          break;
        default:
          break;
      }
    }
    if (action === "Post") {
      increaseNumComments && increaseNumComments();
      await dispatch(
        uploadComment(user.id, mentionedUsers, rawData, post.id, modal)
      );
      modal && dispatch(fetchSinglePost(post.id));
    } else {
      // await sendAMessage(user.id, receiverId, rawData.message, dispatch);
      if(sendChat){
        sendChat(rawData, user.username);
      }
      await uploadMessage(
        user.id,
        receiverId,
        mentionedUsers,
        rawData,
        dispatch
      );
    }
  };

  return (
    <div className={className}>
      <div
        className={
          insideCN
            ? insideCN
            : modal
            ? "comment-editor comment-pic-modal"
            : "comment-editor"
        }
        onBlur={() => setFocused(false)}
        onFocus={focus}
      >
        <Editor
          editorState={editorState}
          plugins={plugins}
          placeholder={placeHolder}
          onChange={(editorState) => {
            return setEditorState(editorState);
          }}
          ref={(event) => (ref.current = event)}
        />
        <MentionSuggestions
          onSearchChange={({ value }) => {
            setQuery(value);
          }}
          suggestions={suggestions}
          entryComponent={UserTag}
          open={mentionOpen}
          onOpenChange={onMentionOpenChange}
        />
        <HashtagMentionSuggestions
          onSearchChange={({ value }) => {
            setHashtagQuery(value);
          }}
          suggestions={hashtagSuggestions}
          open={hashtagOpen}
          onOpenChange={onHastangOpenChange}
        />
      </div>
      <button
        disabled={buttonDisabled}
        // onClick={submitAction ? submitAction : submitComment}
        onClick={submitComment}
        className="comment-submit"
      >
        {action}
      </button>
    </div>
  );
};

export default CommentInput;

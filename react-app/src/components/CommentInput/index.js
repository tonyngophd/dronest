import "./CommentInput.css";
import React, { useState, useRef, useEffect } from "react";
import Editor from "draft-js-plugins-editor";
import { EditorState, convertToRaw } from "draft-js";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "draft-js-mention-plugin";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserMentionsComments,
  fetchHashtagMentionsComments,
  clearMentions,
} from "../../store/mentions";
import { uploadComment, fetchHomeFeed } from "../../store/posts";

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

const CommentInput = ({ post }) => {
  const user = useSelector((state) => state.session.user);
  const userMentions = useSelector((state) => state.mentions.usersComments);
  const hashtagMentions = useSelector(
    (state) => state.mentions.hashtagsComments
  );
  const ref = useRef();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const dispatch = useDispatch();

  const focus = () => {
    ref.current.focus();
  };

  useEffect(() => {
    dispatch(clearMentions());
  }, [ref]);
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
    setSuggestions(userMentions);
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
    if (hashtagQuery && !exists) {
      setHashtagSuggestions([...hashtagMentions, ...newSuggestion]);
    } else if (hashtagQuery && exists) {
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
    await dispatch(uploadComment(user.id, mentionedUsers, rawData, post.id));
    dispatch(fetchHomeFeed(user.id));
  };

  return (
    <div className="comment-editor-wrapper">
      <div className="comment-editor" onFocus={focus}>
        <Editor
          editorState={editorState}
          plugins={plugins}
          placeholder="Add a comment..."
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
        />
        <HashtagMentionSuggestions
          onSearchChange={({ value }) => {
            setHashtagQuery(value);
          }}
          suggestions={hashtagSuggestions}
          entryComponent={Hashtag}
        />
      </div>
      <button
        disabled={buttonDisabled}
        onClick={submitComment}
        className="comment-submit"
      >
        Post
      </button>
    </div>
  );
};

export default CommentInput;

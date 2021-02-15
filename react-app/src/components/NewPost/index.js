import React, { useState, useRef, useEffect, useCallback } from "react";
import "./NewPost.css";
import { EditorState, convertToRaw } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import "draft-js/dist/Draft.css";
import '@draft-js-plugins/mention/lib/plugin.css';

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserMentions, fetchHashtagMentions } from "../../store/mentions";
import { uploadPost } from "../../store/posts";
import { fetchHomeFeed } from "../../store/posts";
import { fetchUserProfile } from "../../store/profile";

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

const NewPost = ({ onPost }) => {
  const [image, setImage] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const user = useSelector((state) => state.session.user);
  const profile = useSelector((state) => state.profile.user);
  const userMentions = useSelector((state) => state.mentions.users);
  const hashtagMentions = useSelector((state) => state.mentions.hashtags);
  const ref = useRef();
  const dispatch = useDispatch();
  const [mentionOpen, setMentionOpen] = useState(false);
  const onMentionOpenChange = useCallback((_open) => {
    setMentionOpen(_open);
  }, []);  
  const [hashtagOpen, setHastagOpen] = useState(false);
  const onHastangOpenChange = useCallback((_open) => {
    setHastagOpen(_open);
  }, []);  

  const updateFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImgSrc(URL.createObjectURL(file));
    }
  };

  const focus = () => {
    ref.current.focus();
  };

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

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
    if (query) dispatch(fetchUserMentions(query));
  }, [dispatch, query]);

  useEffect(() => {
    setSuggestions(userMentions);
  }, [userMentions]);

  useEffect(() => {
    if (hashtagQuery) dispatch(fetchHashtagMentions(hashtagQuery));
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

  const submitPost = async () => {
    if (!image) return;
    const contentState = editorState.getCurrentContent();
    let rawData = convertToRaw(contentState);
    setEditorState(EditorState.createEmpty());
    let mentionedUsers = [];
    let hashtags = [];
    for (let key in rawData.entityMap) {
      const ent = rawData.entityMap[key];
      switch (ent.type) {
        case "mention":
          mentionedUsers.push(ent.data.mention);
          break;
        case "#mention":
          hashtags.push(ent.data.mention);
          break;
        default:
          break;
      }
    }
    setImage(null);
    setImgSrc(null);
    onPost();
    await dispatch(
      uploadPost(user.id, mentionedUsers, hashtags, rawData, image)
    );
    if (profile && profile.id === user.id) {
      dispatch(fetchUserProfile(profile.username));
    }
  };

  return (
    <div className="new-post-input-container">
      {imgSrc && <img className="image-preview" src={imgSrc} alt="" />}
      {/* {!imgSrc && <div className="image-preview" />} */}
      {/* {user && (
        <div className="new-post-username">
          <Link to={`/users/${user.username}`}>{user.username}</Link>
        </div>
      )} */}
      {!imgSrc && (
        <>
          <div className="image-placeholder">
            <label htmlFor={"image-input"} className="image-upload">
              <i className="las la-plus-square image-upload-plus"></i>
            </label>
            <input id={"image-input"} type="file" onChange={updateFile}></input>
          </div>
        </>
      )}      
      {imgSrc && (
        <>
          <div className="add-image-button">
            <label htmlFor={"image-input"} className="image-upload">
              <i className="las la-plus-square image-upload-plus"></i>
            </label>
            <input id={"image-input"} type="file" onChange={updateFile}></input>
          </div>
        </>
      )}      
      <div className="editor-wrapper">
        <div className="editor" onFocus={focus}>
          <Editor
            editorState={editorState}
            plugins={plugins}
            placeholder="Enter a caption..."
            onChange={(editorState) => setEditorState(editorState)}
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
            entryComponent={Hashtag}
            open={hashtagOpen}
            onOpenChange={onHastangOpenChange}
          />
        </div>
      </div>
      <div className="new-post-buttons">
        <div className="new-post-cancel" onClick={onPost}>
          Cancel
        </div>
        <div className="new-post-submit" onClick={submitPost}>
          Post
        </div>
      </div>
    </div>
  );
};

export default NewPost;

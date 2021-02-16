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
import { nanoid } from "nanoid";
import { RiDeleteBin6Line } from 'react-icons/ri';


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
  const [images, setImages] = useState([]);
  const [imgSrcs, setImgSrcs] = useState([]);
  const myself = useSelector((state) => state.session.user);
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

  const updateFiles = (e) => {
    const files = e.target.files;

    if (files.length) {
      setImages(files);
      setImgSrcs(Object.values(files).map(file => URL.createObjectURL(file)));
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
    if (!images.length) return;
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
    setImages([]);
    setImgSrcs([]);
    onPost();
    await dispatch(
      uploadPost(myself.id, mentionedUsers, hashtags, rawData, images)
    );
    if (profile && profile.id === myself.id) {
      dispatch(fetchUserProfile(profile.username));
    }
  };

  const handleDragOver = e => {
    e.preventDefault();
    console.log('drag', e.target);
  }
  const handleDrop = e => {
    e.preventDefault();
    console.log('drop', e.target);
  }

  return (
    <div className="new-post-input-container">
      <div className='new-post-img-previews'>
        {imgSrcs.map((src, index) =>
          <div className='image-preview-container'>
            <img className="image-preview" src={src} alt="" key={nanoid()} />
            <RiDeleteBin6Line className='img-prev-delete-button' />
            <div className='img-prev-number'>
              {index}
            </div>
          </div>
        )}
      </div>
      <div className="image-placeholder" >
        <label htmlFor={"image-input"} className="image-upload">
          <i className="las la-plus-square image-upload-plus"></i>
        </label>
        <input id={"image-input"}
          type="file" multiple={true}
          onChange={updateFiles}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDrop={handleDrop}
        />
      </div>
      {/* {imgSrcs.map( src =>
        <>
          <div className="add-image-button">
            <label htmlFor={"image-input"} className="image-upload">
              <i className="las la-plus-square image-upload-plus"></i>
            </label>
            <input id={"image-input"} type="file" onChange={updateFiles}></input>
          </div>
        </>
      )} */}
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

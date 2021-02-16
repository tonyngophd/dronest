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
import { RiDeleteBin6Line, RiDragDropLine } from 'react-icons/ri';
import { GrDropbox } from 'react-icons/gr';


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

  const updateFiles = (e) => {
    const files = e.target.files;

    if (files.length) {
      setImages([...files]);
      setImgSrcs(Object.values(files).map(file => URL.createObjectURL(file)));
    }
  };

  const handleDragOver = e => {
    e.preventDefault();
  }
  const handleDrop = e => {
    //https://stackoverflow.com/questions/8006715/drag-drop-files-into-standard-html-file-input
    const files = e.dataTransfer.files;

    if (files.length) {
      setImages([...images, ...files]);
      setImgSrcs([...imgSrcs, ...Object.values(files).map(file => URL.createObjectURL(file))]);
    }

    e.preventDefault();
  }

  const handleDeleteClick = (e, index) => {
    e.preventDefault();
    setImgSrcs(imgSrcs.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index));
  }

  const [currentDraggedIndex, setCurrentDraggedIndex] = useState(null);
  const handleSingleImageDragStart = (e, index) => {
    setCurrentDraggedIndex(index);
  }
  const handleSingleImageDragEnd = (e, index) => {
    setCurrentDraggedIndex(null);
  }

  const handleSingleImageDrop = (e, droppedIndex) => {
    if(currentDraggedIndex + 1){
      const srcs = imgSrcs;
      const draggedSrc = srcs[currentDraggedIndex];
      srcs[currentDraggedIndex] = srcs[droppedIndex];
      srcs[droppedIndex] = draggedSrc;
      setImgSrcs(srcs);
      const imgs = images;
      const draggedImg = imgs[currentDraggedIndex];
      imgs[currentDraggedIndex] = imgs[droppedIndex];
      imgs[droppedIndex] = draggedImg;
      setImages(imgs);
    }
    e.preventDefault();    
  }
  const handleSingleImageOverCapture = (e) => {
    e.preventDefault();
  }

  return (
    <div className="new-post-input-container">
      <div className='new-post-img-previews'>
        {imgSrcs.map((src, index) =>
          <div className='image-preview-container' key={nanoid()} draggable={true}
            onDragStart={e => handleSingleImageDragStart(e, index)}
            // onDragEnd={e => handleSingleImageDragEnd(e, index)}
            // onDrop={e => handleSingleImageDrop(e, index)}
            // onDragOverCapture={e => handleSingleImageOverCapture(e)}
          >
            <img className="image-preview" src={src} alt="" />
            {/* <RiDeleteBin6Line className='img-prev-delete-button'
              onClick={e => handleDeleteClick(e, index)}
            />
            <div className='img-prev-number'>
              {index}
            </div> */}
          </div>
        )}
      </div>
      <div className="image-placeholder"
        onChange={updateFiles}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDrop={handleDrop}
      >
        <label htmlFor={"image-input"} className="image-upload">
          <RiDragDropLine className="las la-plus-square image-upload-plus" />
          <i className="las la-plus-square image-upload-plus"></i>
          <GrDropbox className="las la-plus-square image-upload-plus" />
        </label>
        <input
          className="image-placeholder"
          id={"image-input"}
          type="file" multiple={true}
        />
        <span>Click to add files or Drag and Drop files here to add them</span>
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
        <div className="new-post-cancel" onClick={e => {
          onPost();
          setImages([]);
          setImgSrcs([]);
        }}>
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

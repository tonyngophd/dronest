import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import createMentionPlugin from "@draft-js-plugins/mention";
import ReactPlayer from 'react-player';
import Darkmode from 'darkmode-js';
import { loadDarkModePOJO } from '../../store/darkmode';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { FaSun } from 'react-icons/fa';
import { BsMoon } from 'react-icons/bs';
import classes from './styles.module.css';


export function MediaDisplayer({
  mediaUrl, imgClassname = 'single-card-main-img',
  vidClassname = 'single-card-main-vid',
  imgHandleClick, vidHandleClick, controls = true,
  light = false, config, vidHeight = '100%', style, fileType,
  vidWidth
}) {
  let mediatType = 'image';
  if (mediaUrl.toLowerCase().includes('facebook') ||
    mediaUrl.toLowerCase().includes('youtu') ||
    mediaUrl.toLowerCase().includes('mp4') ||
    (fileType && fileType.toLowerCase().includes('vid'))
  ) {
    mediatType = 'video';
  }

  if (mediatType !== 'image' && mediatType !== 'video') {
    return <div className={imgClassname}>Unsupported media type</div>;
  }

  return (
    <>{
      mediatType === 'image' ?
        <img
          className={imgClassname}
          src={mediaUrl}
          onClick={imgHandleClick}
          alt='good band picture' /> :
        <div className={vidClassname} onClick={vidHandleClick}>
          <ReactPlayer
            url={mediaUrl}
            controls={controls}
            light={light}
            config={config}
            height={vidHeight}
            width={vidWidth}
            style={style}
          />
        </div>
    }
    </>
  );
}

export function Plugins() {
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

  return [userMentionPlugin, hashtagMentionPlugin];
}

export default function timeStamp(createdAt, short = false, yearIncluded = false) {
  let now = Date.now();
  let elapsed = now - createdAt;
  let timestamp;

  let s, m1, m, h1, h;
  if (short) {
    s = "s";
    m1 = m = "m";
    h1 = h = "h";
  } else {
    s = "SECONDS AGO";
    m1 = "MINUTE AGO";
    m = "MINUTES AGO";
    h1 = "HOUR AGO";
    h = "HOURS AGO";
  }
  const space = short ? "" : " ";
  if (elapsed < 1000) {
    timestamp = short ? `Now` : `NOW`;
  } else if (elapsed < 60000) {
    timestamp = `${Math.floor(elapsed / 1000)}${space}${s}`;
  } else if (elapsed < 120000) {
    timestamp = `${Math.floor(elapsed / 60000)}${space}${m1}`;
  } else if (elapsed < 3600000) {
    timestamp = `${Math.floor(elapsed / 60000)}${space}${m}`;
  } else if (elapsed < 7200000) {
    timestamp = `${Math.floor(elapsed / 3600000)}${space}${h1}`;
  } else if (elapsed < 86400000) {
    timestamp = `${Math.floor(elapsed / 3600000)}${space}${h}`;
  } else {
    timestamp = createdAt.toDateString().split(" ")
      .splice(1, yearIncluded ? 3 : 2).join(" ");
  }

  return timestamp;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const defaultOptions = {
  // bottom: '800px', // default: '32px'
  // top: '0px',
  right: 'unset', // default: '32px'
  left: '32px', // default: 'unset'
  time: '0.5s', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '#fff',  // default: '#fff'
  buttonColorDark: '#100f2c',  // default: '#100f2c'
  buttonColorLight: '#fff', // default: '#fff'
  saveInCookies: false, // default: true,
  label: '🌓', // default: ''
  autoMatchOsTheme: true // default: true
}

export function DarkModeButton({ top, right, bottom, left }) {
  const dispatch = useDispatch();
  const darkmode = new Darkmode(defaultOptions);
  const [isDark, setIsDark] = useState('light');
  const [isSetLocal] = useState(localStorage.getItem("dronest_darkmode"));

  // button toggler
  const darkModeHandler = () => {
    darkmode.toggle();
    const isSet = darkmode.isActivated();
    localStorage.setItem("dronest_darkmode", isSet);
    setIsDark(isSet ? 'dark' : 'light');
    dispatch(loadDarkModePOJO(isSet));
  }

  useEffect(() => {
    if((isSetLocal === 'true' && !darkmode.isActivated() ) ){
      darkmode.toggle();
      const isSet = darkmode.isActivated();
      setIsDark(isSet ? 'dark' : 'light');
      dispatch(loadDarkModePOJO(isSet));
    } 
  }, [isSetLocal]);
  return (
    <div
      className={classes.darkmode_button_div}
    >
      {/* <DarkModeSwitch
        style={{ marginBottom: '32px', position: 'absolute' }}
        checked={isDarkMode}
        onChange={toggleDarkMode}
        size={40}
      /> */}
      <DarkModeToggle
        size='large'
        isDark={isDark}
        onClick={darkModeHandler}
        border='#000'
      />
    </div>
  );
}

export function DarkModeToggle({
  onClick,
  isDark,
  size,
  border
}) {
  const toggleCSS = [classes.toggle]
  size === 'small' && toggleCSS.push(classes.small)
  isDark === 'dark' && toggleCSS.push(classes.dark)

  return (
    <div
      style={{ borderColor: isDark === 'dark' ? border : '' }}
      className={toggleCSS.join(' ')}
      onClick={onClick}
    >
      <div className={classes.toggle__slide} />
      <span className={classes.toggle__sunlight}>
        <FaSun />
      </span>
      <span className={classes.toggle__moon}>
        <BsMoon />
      </span>
    </div>
  )
}


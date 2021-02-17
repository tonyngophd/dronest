import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import createMentionPlugin from "@draft-js-plugins/mention";
import ReactPlayer from 'react-player';

export function MediaDisplayer({
  mediaUrl, imgClassname = 'single-card-main-img',
  vidClassname = 'single-card-main-vid',
  imgHandleClick, vidHandleClick, controls = true,
  light = false, config, height = '100%', style, fileType,
  width
}) {
  let mediatType = 'image';
  if (mediaUrl.toLowerCase().includes('facebook') ||
    mediaUrl.toLowerCase().includes('youtu') ||
    mediaUrl.toLowerCase().includes('mp4') || 
    (fileType && fileType.toLowerCase().includes('vid'))
  ) {
    mediatType = 'video';
  }

  if(mediatType !== 'image' && mediatType !== 'video') 
  {
    return <div className={imgClassname}>Unsupported media type</div>;
  }

  return (
    <>{
      mediatType === 'image' ?
      // Math.random() < 0.7 ?
        <img
          className={imgClassname}
          src={mediaUrl}
          onClick={imgHandleClick}
          alt='good band picture' /> :
        <div className={vidClassname} onClick={vidHandleClick}>
          <ReactPlayer
            // url='https://www.facebook.com/100012533494609/videos/493072851120494'
            // url='https://www.facebook.com/gn.aerials/videos/151961382328554'
            url={mediaUrl}
            controls={controls}
            light={light}
            config={config}
            height={height}
            width={width}
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


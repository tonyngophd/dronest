import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { EditorState, convertToRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "draft-js-mention-plugin";
import "draft-js/dist/Draft.css";
import { Link } from "react-router-dom";
import { BiChat } from 'react-icons/bi';


import { fetchUserMentions, fetchHashtagMentions } from "../../store/mentions";
import { uploadPost } from "../../store/posts";
import UserRow from "../ProfilePage/UserRow";

import sendAMessage from '../../store/messages';

import './MessagePage.css'
import { nanoid } from 'nanoid';
import User from '../User';
import { GrUp } from 'react-icons/gr';


function MessagePage() {
  const myself = useSelector((state) => state.session.user);
  const [currentMsg, setCurrentMsg] = useState("");
  const [currentReceiver, setCurrentReceiver] = useState(null);
  const dispatch = useDispatch();
  const [allReceiverIds, setAllReceiverIds] = useState(Array.from(new Set(myself.followers.concat(myself.following).map(u => u.id))));
  const [allReceivers, setAllReceivers] = useState([]);
  const [currentGroupedMsgs, setCurrentGroupedMsgs] = useState([]);


  useEffect(() => {
    const groupedMsgs = [];
    if (currentReceiver) {
      // console.log("myself", myself.messages);
      const msgs = myself.messages
        .filter(msg => msg.receiverId === currentReceiver.id || msg.senderId === currentReceiver.id);
      // console.log('\nmsgs', msgs, "\ncurrentReceiver", currentReceiver, "\nmyself", myself.messages);
      if (msgs.length) {
        let currentSenderId = msgs[0].senderId;
        let j = 0;
        groupedMsgs.push(Object.assign({},msgs[0]));
        delete groupedMsgs[0].message;
        groupedMsgs[0].message = [msgs[0].message];
        for (let i = 1; i < msgs.length; i++) {
          if (msgs[i].senderId === currentSenderId) {
            groupedMsgs[j].message.push(msgs[i].message);
          } else {
            currentSenderId = msgs[i].senderId;
            j++;
            groupedMsgs.push(Object.assign({},msgs[i]));
            delete groupedMsgs[j].message;
            groupedMsgs[j].message = [msgs[i].message];
          }
        }
      }
    }
    // console.log('groupedMsgs', groupedMsgs);
    setCurrentGroupedMsgs(groupedMsgs);
  }, [myself, currentReceiver]);

  useEffect(() => {
    const all = myself.followers.concat(myself.following);
    setAllReceivers(allReceiverIds.map(id => all.filter(u => u.id === id)[0]));
  }, [allReceiverIds]);
  // useEffect(() => {
  //   console.log("allReceivers", allReceivers);
  // }, [allReceivers]);

  const receiverClick = e => {
    e.preventDefault();
    const receiverId = Number(e.target.id.split('-')[0]);
    setCurrentReceiver(allReceivers.filter(u => u.id === receiverId)[0]);
    // console.log('receiverId', receiverId, allReceivers.filter(u => u.id === receiverId)[0]);
  }

  const msgClick = (e) => {
    e.preventDefault();
    // console.log(myself.id, currentReceiver.id, currentMsg);
    sendAMessage(myself.id, currentReceiver.id, currentMsg, dispatch);
    setCurrentMsg("");
  };

  const MessageBubble = ({ msg }) => {
    return (
      <div className={msg.senderId === myself.id ?
        'message-bubble-container-me-right' : "message-bubble-container-them-left"}>
        <div className={msg.senderId === myself.id ?
          "message-bubble-me-right" : "message-bubble-them-left"}>
          {
            msg.message.map(m => <div key={nanoid()} id={nanoid()}>
              {m}
            </div>)
          }
        </div>
      </div>
    );
  };

  return (
    <div className='message-page-main-div'>
      <div className='message-page-left-panel'>
        <div className='top-left-div'>
          {myself.username}
        </div>
        <div className='middle-left-div'></div>
        <div className='main-left-div'>
          {allReceivers.map(u => <div
            key={nanoid()}
            id={`${u.id}-receiver`}
            onClick={receiverClick}
          >
            <UserRow
              user={u}
              myId={myself.id}
              showFollowButtonOrText={false}
              gotoUserPage={false}
            />
          </div>
          )}
        </div>
      </div>
      <div className="message-page-right-panel">
        <div className="top-right-div">
          {currentReceiver && (
            <UserRow
              user={currentReceiver}
              myId={myself.id}
              showFollowButtonOrText={false}
              gotoUserPage={false}
            />
          )}
          <h1 className="top-right hvr-wobble-bottom">Inbox</h1>
        </div>
        <div className='main-right-div'>
          {currentReceiver ?
            <div className='message-pannel-div'>
              <div className='messages-div'>
                {currentGroupedMsgs.map(msg =>
                  <MessageBubble key={nanoid()} msg={msg} />)}
              </div>
              <div className='message-typing-box-div'>
                <form className='message-input-form'>
                  <input
                    type='text'
                    className='message-input-box'
                    value={currentMsg}
                    onChange={e => setCurrentMsg(e.target.value)}
                    autoFocus={true}
                  />
                  {/* <textarea className='message-input-box'></textarea> */}
                  <button type='submit' onClick={msgClick}>Send</button>
                </form>
              </div>
            </div> :
            <div className='empty-message-box-div'>
              <div>
                <BiChat fontSize={'120px'} />
              </div>
              <div className='title-and-button-message-box-div'>
                <span className='title-message-box-div'>Your Messages</span>
                <span className='subtitle-message-box-div'>Send private photos and messages to a friend or group.</span>
                <button className='button-message-box-div'>Send Messages</button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default MessagePage;

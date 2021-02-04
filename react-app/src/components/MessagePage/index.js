import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, userParams } from 'react-router-dom';

import "draft-js/dist/Draft.css";
import { Link } from "react-router-dom";
import { BiChat } from "react-icons/bi";

import { fetchUserMentions, fetchHashtagMentions } from "../../store/mentions";
import { uploadPost } from "../../store/posts";
import UserRow from "../ProfilePage/UserRow";
import Comment from "../Comment";

import sendAMessage from "../../store/messages";
import { setUserAddAMessagePOJO } from '../../store/session';

import "./MessagePage.css";
import { nanoid } from "nanoid";
import User from "../User";
import { GrUp } from "react-icons/gr";
import CommentInput from "../CommentInput";

import { fetchNotifications } from "../../store/notifications";

function MessagePage() {
  const myself = useSelector((state) => state.session.user);
  const [currentMsg, setCurrentMsg] = useState("");
  const [currentReceiver, setCurrentReceiver] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const [allReceiverIds, setAllReceiverIds] = useState(
    Array.from(
      new Set(myself.followers.concat(myself.following).map((u) => u.id))
    )
  );
  const [allUniqueReceivers, setAllUniqueReceivers] = useState([]);
  const [currentGroupedMsgs, setCurrentGroupedMsgs] = useState([]);
  const [username, setUserName] = useState('');
  const [messageSession, setMessageSession] = useState(null);
  const webSocket = useRef(null);
  const [userId, setUserId] = useState(null);
  const [listOfOnlineUsers, updateListOfOnlineUsers] = useState([]);
  const [instantMessage, setInstantMessage] = useState({});

  useEffect(() => {
    const groupedMsgs = [];
    if (currentReceiver) {
      // console.log("myself", myself.messages);
      const msgs = myself.messages.filter(
        (msg) =>
          msg.receiverId === currentReceiver.id ||
          msg.senderId === currentReceiver.id
      );
      // console.log('\nmsgs', msgs, "\ncurrentReceiver", currentReceiver, "\nmyself", myself.messages);
      if (msgs.length) {
        let currentSenderId = msgs[0].senderId;
        let j = 0;
        groupedMsgs.push(Object.assign({}, msgs[0]));
        delete groupedMsgs[0].message;
        groupedMsgs[0].message = [msgs[0].message];
        for (let i = 1; i < msgs.length; i++) {
          if (msgs[i].senderId === currentSenderId) {
            groupedMsgs[j].message.push(msgs[i].message);
          } else {
            currentSenderId = msgs[i].senderId;
            j++;
            groupedMsgs.push(Object.assign({}, msgs[i]));
            delete groupedMsgs[j].message;
            groupedMsgs[j].message = [msgs[i].message];
          }
        }
      }
    }
    dispatch(fetchNotifications());
    setCurrentGroupedMsgs(groupedMsgs);
    console.log('groupedMsgs', groupedMsgs, instantMessage);
  }, [myself, currentReceiver, instantMessage]);

  useEffect(() => {
    const all = myself.followers.concat(myself.following);
    setAllUniqueReceivers(
      allReceiverIds.map((id) => all.find((u) => u.id === id))
    );
  }, [allReceiverIds]);
  // useEffect(() => {
  //   console.log("allUniqueReceivers", allUniqueReceivers);
  // }, [allUniqueReceivers]);

  useEffect(() => {
    const id = Number(params.userId);
    if (id) {
      setCurrentReceiver(allUniqueReceivers.find((u) => u.id === id));
    }
  }, [params.userId, allUniqueReceivers])


  useEffect(() => {
    if (myself) {
      setUserName(myself.username);
      setUserId(myself.id);
    }
  }, [myself]);

  useEffect(() => {
    if (!username || !userId) {
      return;
    }

    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.onopen = () => {
      sendMessage('add-new-person', { userId, username });
    };

    ws.onmessage = (e) => {
      console.log(`Processing incoming message ${e.data}...`);

      const message = JSON.parse(e.data);

      switch (message.type) {
        case 'start-message-session':
        case 'end-message-session':
          setMessageSession(message.data);
          break;
        case 'update-message-session':
          const messages = message.data.messages;
          if(messages && messages.length){
            const lastMessage = messages.pop();
            console.log("lastMessage", lastMessage);
            const msg = {
              senderId: lastMessage.senderId,
              receiverId: lastMessage.receiverId,
              message: lastMessage.msg,
            }
            setInstantMessage(msg);
            dispatch(setUserAddAMessagePOJO(msg));
          }
          break;
        case 'update-online-user-list':
          updateListOfOnlineUsers(message.data);
          break;
        default:
          throw new Error(`Unknown message type: ${message.type}`);
      }
    };

    ws.onerror = (e) => {
      console.error(e);
    };

    ws.onclose = (e) => {
      console.log(`Connection closed: ${e}`);
      webSocket.current = null;
      setUserName('');
      setMessageSession(null);
    };

    const sendMessage = (type, data) => {
      const message = JSON.stringify({
        type,
        data,
      });

      console.log(`Sending message ${message}...`);

      ws.send(message);
    };

    webSocket.current = {
      ws,
      sendMessage,
    };

    return function cleanup() {
      if (webSocket.current !== null) {
        webSocket.current.ws.close();
      }
    };
  }, [username, userId]);


  const sendChat = (senderId, senderName, receiverId, receiverName, msg, convoId) => {
    webSocket.current.sendMessage('chat-message', { senderId, senderName, receiverId, receiverName, convoId, msg });
  };

  const addAChatFriend = (myId, myUsername, friendId, friendUsername, convoId) => {
    webSocket.current.sendMessage('add-chat-friend', { myId, myUsername, friendId, friendUsername, convoId });
  };

  const receiverClick = (e) => {
    e.preventDefault();
    const receiverId = Number(e.target.id.split("-")[0]);
    const recver = allUniqueReceivers.find((u) => u.id === receiverId);
    setCurrentReceiver(recver);
    addAChatFriend(myself.id, myself.username, receiverId, recver.username, 'newConvo');
    // console.log('receiverId', receiverId, allUniqueReceivers.filter(u => u.id === receiverId)[0]);
  };

  // const msgClick = (e) => {
  //   e.preventDefault();
  //   // console.log(myself.id, currentReceiver.id, currentMsg);
  //   sendAMessage(myself.id, currentReceiver.id, currentMsg, dispatch);
  //   sendChat(currentMsg, username);
  //   setCurrentMsg("");
  // };

  const MessageBubble = ({ msg }) => {
    let divClass1, divClass2, divClass3;
    if (msg.senderId === myself.id) {
      divClass1 = "message-bubble-container-me-right";
      divClass2 = "message-bubble-me-right";
      divClass3 = 'message-and-profileimg-bubble-me-right';
    } else {
      divClass1 = "message-bubble-container-them-left";
      divClass2 = "message-bubble-them-left";
      divClass3 = 'message-and-profileimg-bubble-them-left';
    }
    return (
      <div className={divClass1}>
        {msg.senderId === myself.id ? (
          <div className={divClass3}>
            <div className={divClass2}>
              {msg.message.map((m) => (
                <div key={nanoid()}>
                  {/* {m} */}
                  <Comment message={m} />
                </div>
              ))}
            </div>
            <img
              className="user-row-profile-img"
              src={myself.profilePicUrl}
              alt={myself.profilePicUrl}
            />
          </div>
        ) : (
            <div className={divClass3}>
              <img
                className="user-row-profile-img"
                src={currentReceiver.profilePicUrl}
                alt={currentReceiver.profilePicUrl}
                style={{ marginRight: "0px" }}
              />
              <div className={divClass2}>
                {msg.message.map((m) => (
                  <div key={nanoid()}>
                    {/* {m} */}
                    <Comment message={m} />
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="message-page-main-div">
      <div className="message-page-left-panel durp">
        <div className="top-left-div">
          {/* <div className="user-name">{myself.username}</div> */}
          <UserRow
            user={myself}
            myId={myself.id}
            showFollowButtonOrText={false}
            gotoUserPage={false}
            miniProfileEnabled={true}
          />
        </div>

        <div className="main-left-div">
          {allUniqueReceivers.map((u) => (
            <div key={nanoid()} id={`${u.id}-receiver`} onClick={receiverClick}>
              <UserRow
                user={u}
                myId={myself.id}
                showFollowButtonOrText={false}
                gotoUserPage={false}
                miniProfileEnabled={false}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="message-page-right-panel">
        {/* <h3 className="top-right hvr-wobble-bottom">Inbox</h3> */}
        {currentReceiver ? (
          <>
            <div className="top-right-div">
              <UserRow
                user={currentReceiver}
                myId={myself.id}
                showFollowButtonOrText={false}
                gotoUserPage={false}
              />
            </div>
            <div className="main-right-div">
              <div className="message-pannel-div">
                <div className="messages-div">
                  {currentGroupedMsgs.map((msg) => (
                    <MessageBubble key={nanoid()} msg={msg} />
                  ))}
                </div>
                <div className="message-typing-box-div">
                  {/* <form className='message-input-form'>
                    <input
                      type='text'
                      className='message-input-box'
                      value={currentMsg}
                      onChange={e => setCurrentMsg(e.target.value)}
                      autoFocus={true}
                    />
                    <button type='submit' onClick={msgClick}>Send</button>
                  </form> */}
                  <CommentInput
                    className="message-input-box-draftjs"
                    insideCN="innner-message-input-box-draftjs"
                    action="Send"
                    placeHolder="Type your message"
                    receiverId={currentReceiver.id}
                    receiverName={currentReceiver.username}
                    sendChat={sendChat}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
            <div className="empty-message-box-div durp">
              <div>
                <BiChat fontSize={"120px"} />
              </div>
              <div className="title-and-button-message-box-div">
                <span className="title-message-box-div">Your Messages</span>
                <span className="subtitle-message-box-div">
                  Send private photos and messages to a friend or group.
              </span>
                <button className="button-message-box-div">Send Messages</button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default MessagePage;

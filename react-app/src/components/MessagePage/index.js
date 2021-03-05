import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';

import "draft-js/dist/Draft.css";
// import { Link } from "react-router-dom";
import { BiChat } from "react-icons/bi";

// import { fetchUserMentions, fetchHashtagMentions } from "../../store/mentions";
// import { uploadPost } from "../../store/posts";
import { fetchAllMessages, addAMessagePOJO } from "../../store/messages";
import UserRow from "../ProfilePage/UserRow";
import Comment from "../Comment";
import { convoKeyFromUserArray, userArrayFromConvoKey } from '../utils';


import "./MessagePage.css";
import { nanoid } from "nanoid";
// import { GrUp } from "react-icons/gr";
import CommentInput from "../CommentInput";
import { StoryTopBox } from '../Story';
import { TiTimesOutline } from 'react-icons/ti';
import { IoAddOutline } from 'react-icons/io5';

// import { fetchNotifications } from "../../store/notifications";

function MessagePage() {
  const myself = useSelector((state) => state.session.user);
  const myMessages = useSelector((state) => state.messages.all);
  // const [currentMsg, setCurrentMsg] = useState("");
  const [currentReceivers, setCurrentReceivers] = useState([]);
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
  const chatboxRef = useRef(null);
  const replaceText = 'Re9$L^$%';
  const darkModeIsSet = useSelector(state => state.darkMode.isSet);
  const [conversations, setConversations] = useState({});
  const [currentCovoIndex, setCurrentConvoIndex] = useState(0);
  const groupConvoStartIndex = 10;
  const indivConvoStartIndex = 1000;
  const [draggedUserId, setDraggedUserId] = useState(null);

  useEffect(() => {
    const all = myself.followers.concat(myself.following);
    setAllUniqueReceivers(
      allReceiverIds.map((id) => all.find((u) => u.id === id))
    );
  }, [allReceiverIds]);


  useEffect(() => {
    const id = Number(params.userId);
    if (id) {
      setCurrentReceivers([allUniqueReceivers.find((u) => u.id === id)]);
    }
  }, [params.userId, allUniqueReceivers])


  useEffect(() => {
    if (myself) {
      if (!myMessages.length)
        dispatch(fetchAllMessages());
      setUserName(myself.username);
      setUserId(myself.id);
    }
  }, [myself]);
  useEffect(() => {
    if (myself && allUniqueReceivers.length) {
      const obj = {};
      myMessages.forEach(msg => {
        if (!msg.receiverIdList) return;
        const recIdList = msg.receiverIdList.split('_').map(id => Number(id));
        recIdList.push(msg.senderId);
        const newList = recIdList.filter(id => id !== myself.id);
        if (newList.length < 2) return;
        const listOfUsers = newList.map(id => allUniqueReceivers.find(u => u.id === id));
        for (let i = 0; i < listOfUsers.length; i++) {
          if (!listOfUsers[i]) {
            // Users not a follower or following yet ==> TODO: need to check if true
            return;
          }
        }
        newList.sort();
        obj[newList.join('_')] = listOfUsers;
      })
      setConversations({ ...conversations, ...obj });
    }
  }, [myself, allUniqueReceivers, myMessages]);

  useEffect(() => {
    const groupedMsgs = [];
    if (currentReceivers.length) {
      const msgs = myMessages.filter(msg => {
        if (!msg.receiverIdList) return false;
        const recIdList = msg.receiverIdList.split('_').map(id => Number(id));
        recIdList.push(msg.senderId);
        recIdList.sort();
        const currIds = currentReceivers.map(r => r.id)
        currIds.push(myself.id);
        currIds.sort();
        if (recIdList.length !== currIds.length) return false;
        for (let i = 0; i < recIdList.length; i++) {
          if (recIdList[i] !== currIds[i]) return false;
        }
        return true;
      }
        // msg.receiverId === currentReceiver.id ||
        // msg.senderId === currentReceiver.id
      );
      // if (Object.keys(instantMessage).length) {
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
    // dispatch(fetchNotifications());
    setCurrentGroupedMsgs(groupedMsgs);
  }, [myself, currentReceivers, myMessages]);

  useEffect(() => {
    if (instantMessage) {
      const totalReceivers = currentReceivers.length;
      if (instantMessage.totalReceivers !== totalReceivers) return;
      const receiverIdList = [myself.id, ...currentReceivers.map(el => el.id)].sort().join('_');
      const instIdList = [instantMessage.senderId, ...instantMessage.receiverIdList.split('_')].sort().join('_');
      if (instIdList !== receiverIdList) return;
    }
    const lastMsg = currentGroupedMsgs[currentGroupedMsgs.length - 1];
    if (lastMsg && lastMsg.senderId === instantMessage.senderId) {
      lastMsg.message.push(instantMessage.message);
      const msgs = [...currentGroupedMsgs];
      msgs.pop();
      msgs.push(lastMsg);
      setCurrentGroupedMsgs(msgs);
    } else {
      const insM = { ...instantMessage, message: [instantMessage.message] };
      setCurrentGroupedMsgs([...currentGroupedMsgs, insM]);
    }
    // }    
  }, [instantMessage]);

  useEffect(() => {
    if (chatboxRef.current) chatboxRef.current.scrollIntoView(false, { behavior: "smooth" });
  }, [currentGroupedMsgs]);


  useEffect(() => {
    if (!username || !userId) {
      return;
    }

    const REACT_APP_WS_URL = process.env.REACT_APP_WS_URL;
    const ws = new WebSocket(REACT_APP_WS_URL);

    ws.onopen = () => {
      sendMessage('add-new-person', { userId, username });
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      // console.log(`Got a message ${message}`);
      // console.log(message, message.data, message.data.messages);

      switch (message.type) {
        case 'start-message-session':
        case 'end-message-session':
          setMessageSession(message.data);
          break;
        case 'update-message-session':
          const messages = message.data.messages;
          if (messages && messages.length) { //&& message.receiverId !== message.senderId
            const lastMessage = messages.pop();
            let msg = JSON.stringify(lastMessage.message);
            const test2 = msg.replaceAll(':', replaceText);
            // console.log("test2", `${test2}`, typeof(test2))
            const goodReactMsg = { ...lastMessage, message: test2 };
            if (lastMessage.senderId !== myself.id)
              setInstantMessage(goodReactMsg);
            // dispatch(setUserAddAMessagePOJO(goodReactMsg));
            if (lastMessage.receiverId === myself.id)
              dispatch(addAMessagePOJO(goodReactMsg));
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
      // console.log(`Connection closed: ${e}`);
      webSocket.current = null;
      setUserName('');
      setMessageSession(null);
    };

    const sendMessage = (type, data) => {
      const message = JSON.stringify({
        type,
        data,
      });

      // console.log(`Sending message ${message}...`);

      if (ws.readyState === 1) ws.send(message);
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

  /*
          totalReceivers=len(receiverIds),
        receiverIdList='_'.join(map(str,receiverIds))
  */
  const sendInstantChat = (senderId, senderName, receiverIds, receiverNames, message, convoKey) => {
    if (webSocket.current)
      webSocket.current.sendMessage('chat-message', {
        senderId, senderName,
        receiverIds,
        receiverNames, convoKey, message,
        totalReceivers: receiverIds.length,
        receiverIdList: receiverIds.join('_'),
        createdAt: new Date(),
        updatedAt: new Date()
      });
  };

  const addAChatFriend = (myId, myUsername, friendId, friendUsername, convoKey) => {
    if (webSocket.current)
      webSocket.current.sendMessage('add-chat-friend', { myId, myUsername, friendId, friendUsername, convoKey });
  };
  const startAGroupConvo = (receivers) => {
    if (webSocket.current) {
      const simplifiedReceivers = receivers.map(el => ({ id: el.id, username: el.username }));
      const convoKey = convoKeyFromUserArray([
        { site: window.location.host },
        { id: myself.id, username: myself.username },
        ...simplifiedReceivers
      ]);
      webSocket.current.sendMessage('start-a-group-convo', { myId: myself.id, myUsername: myself.username, convoKey });
    }
  };

  const receiverClick = (e, receiverId) => {
    e.preventDefault();
    const recver = allUniqueReceivers.find((u) => u.id === receiverId);
    setCurrentReceivers([recver]);
    const convoKey = convoKeyFromUserArray([
      { site: window.location.host },
    ]);
    addAChatFriend(myself.id, myself.username, receiverId, recver ? recver.username : "username", convoKey);
  };

  // const msgClick = (e) => {
  //   e.preventDefault();
  //   // console.log(myself.id, currentReceiver.id, currentMsg);
  //   sendAMessage(myself.id, currentReceiver.id, currentMsg, dispatch);
  //   sendInstantChat(currentMsg, username);
  //   setCurrentMsg("");
  // };

  const addAUserToAConvoClick = (e, receiverId) => {
    e.preventDefault();
    const recver = allUniqueReceivers.find((u) => u.id === receiverId);
    if (!currentReceivers.includes(recver)) {
      setCurrentReceivers([...currentReceivers, recver]);
    }
    const convoKey = convoKeyFromUserArray([
      { site: window.location.host },
      { id: myself.id, username: myself.username },
      ...currentReceivers.map(el => ({ id: el.id, username: el.username }))
    ]);
    addAChatFriend(myself.id, myself.username, receiverId, recver ? recver.username : "username", convoKey);
    setCurrentConvoIndex(0);
  }

  const removeAUserFromAConvoClick = (e, receiverId) => {
    e.preventDefault();
    setCurrentReceivers(currentReceivers.filter(r => r.id !== receiverId));
  }

  const currentRvsInConvosList = () => {
    const currList = currentReceivers.map(u => u.id);
    currList.sort();
    const str = currList.join('_');
    for (let key in conversations) {
      if (key === str) {
        return true;
      }
    }
    // setCurrentConvoIndex(0);
    return false;
  }

  const userNOTInCurrentReceiverList = receiverId => {
    return !currentReceivers.map(u => u.id).includes(receiverId);
  }


  const MessageBubble = ({ msg }) => {
    let divClass1, divClass2, divClass3;
    let theOtherSender;
    if (msg.senderId === myself.id) {
      divClass1 = "message-bubble-container-me-right";
      divClass2 = "message-bubble-me-right";
      divClass3 = 'message-and-profileimg-bubble-me-right';
    } else {
      divClass1 = "message-bubble-container-them-left";
      divClass2 = "message-bubble-them-left";
      divClass3 = 'message-and-profileimg-bubble-them-left';
      theOtherSender = allUniqueReceivers.find(u => u.id === msg.senderId);
      if (!theOtherSender) return <></>;
    }
    return (
      <div className={divClass1}>
        {msg.senderId === myself.id ? (
          <div className={divClass3}>
            <div className={divClass2}>
              {msg.message.map((m) => (
                <div key={nanoid()}>
                  <Comment inputMessage={m} replaceText={replaceText} />
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
              src={theOtherSender.profilePicUrl}
              alt='profilePicUrl'
              style={{ marginRight: "0px" }}
            />
            <div className={divClass2}>
              {msg.message.map((m) => (
                <div key={nanoid()}>
                  <Comment inputMessage={m} replaceText={replaceText} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='message-page-story-messaged-div'>
      <StoryTopBox />
      <div className="message-page-main-div">
        <div className="message-page-left-panel durp">
          <div className="top-left-div">
            <UserRow
              user={myself}
              myId={myself.id}
              showFollowButtonOrText={false}
              gotoUserPage={false}
              miniProfileEnabled={true}
            />
          </div>
          <div className="main-left-div">
            {currentReceivers.length > 1 && !currentRvsInConvosList() &&
              <div className={currentCovoIndex === 0 ? 'users-div-row-left selected' : 'users-div-row-left'}>
                <div className='users-div-row-left-inner'>
                  <div className='users-div-row-left-inner'>
                  </div>
                  {currentReceivers.map((user, i) =>
                    <div className={
                      darkModeIsSet ? "indiv-user-row-left-div"
                        : "indiv-user-row-left-div"}
                      style={{ left: `${35 * i + 5}px` }}
                      key={nanoid()}>
                      <UserRow
                        user={user}
                        myId={myself.id}
                        showFollowButtonOrText={false}
                        gotoUserPage={false}
                        miniProfileEnabled={false}
                        short={true}
                        nameFieldWidth={null}
                      />
                    </div>)}
                </div>
              </div>}
            {
              Object.values(conversations).map((listOfUsers, index) =>
                <div className={currentCovoIndex === index + groupConvoStartIndex ? 'users-div-row-left selected' : 'users-div-row-left'}
                  onClick={e => {
                    setCurrentReceivers(listOfUsers);
                    startAGroupConvo(listOfUsers);
                    setCurrentConvoIndex(index + groupConvoStartIndex);
                  }}
                  key={nanoid()}
                >
                  <div className='users-div-row-left-inner'>
                    <div className='users-div-row-left-inner'>
                    </div>
                    {listOfUsers.map((user, i) =>
                      <div className={
                        darkModeIsSet ? "indiv-user-row-left-div"
                          : "indiv-user-row-left-div"}
                        style={{ left: `${35 * i + 5}px` }}
                        key={nanoid()}>
                        <UserRow
                          user={user}
                          myId={myself.id}
                          showFollowButtonOrText={false}
                          gotoUserPage={false}
                          miniProfileEnabled={false}
                          short={true}
                          nameFieldWidth={null}
                        />
                      </div>)}
                  </div>
                </div>
              )
            }
            {allUniqueReceivers.map((u, index) => (
              <div className={currentCovoIndex === index + indivConvoStartIndex ?
                (userNOTInCurrentReceiverList(u.id) ? 'user-row-div selected grabbable' : 'user-row-div selected')
                :
                (userNOTInCurrentReceiverList(u.id) ? 'user-row-div grabbable' : 'user-row-div')}
                draggable={userNOTInCurrentReceiverList(u.id) ? true : false}
                key={nanoid()}
                onDragCapture={e => {
                  setDraggedUserId(u.id);
                }}
                onDragEnd={e => {
                  setDraggedUserId(null);
                }}
              >
                <div className='user-row-clickable-div'
                  key={nanoid()} id={`${u.id}-receiver`}
                  // onDoubleClick={e => addAUserToAConvoClick(e, u.id)}
                  onClick={e => {
                    receiverClick(e, u.id);
                    setCurrentConvoIndex(index + indivConvoStartIndex);
                  }}
                >
                  <UserRow
                    user={u}
                    myId={myself.id}
                    showFollowButtonOrText={false}
                    gotoUserPage={false}
                    miniProfileEnabled={false}
                    online={listOfOnlineUsers.find(ou => ou.id === u.id)}
                  />
                </div>
                <div>
                  {userNOTInCurrentReceiverList(u.id) &&
                    <IoAddOutline className='add-this-user' onClick={e => addAUserToAConvoClick(e, u.id)} />
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="message-page-right-panel"
          // onDragEnterCapture={e => {
          //   console.log("Dragged user entered right pannel with id", draggedUserId);
          //   addAUserToAConvoClick(e, draggedUserId);
          // }}
          onDragOver={e => {
            e.preventDefault();
          }}
          onDrop={e => {
            console.log('Right pandel drag DROPPED');
            addAUserToAConvoClick(e, draggedUserId);
            setDraggedUserId(null);
          }}
        >
          {/* <h3 className="top-right hvr-wobble-bottom">Inbox</h3> */}
          {currentReceivers.length > 0 ? (
            <>
              <div className='users-div-top-right'>
                {currentReceivers.map((user, i) =>
                  <div className={
                    darkModeIsSet ? "indiv-user-top-right-div dark_background"
                      : "indiv-user-top-right-div light_background"}
                    style={{ left: `${400 / currentReceivers.length * i}px` }}
                    key={nanoid()}>
                    <UserRow
                      user={user}
                      myId={myself.id}
                      showFollowButtonOrText={false}
                      gotoUserPage={false}
                    />
                    <TiTimesOutline className='remove-this-user'
                      onClick={e => removeAUserFromAConvoClick(e, user.id)}
                    />
                  </div>)}
              </div>
              <div className="main-right-div">
                <div className="message-pannel-div">
                  <div className="messages-div">
                    {currentGroupedMsgs.map((msg) => (
                      <MessageBubble key={nanoid()} msg={msg} />
                    ))}
                    <div ref={chatboxRef} />
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
                      insideCN="inner-message-input-box-draftjs"
                      action="Send"
                      placeHolder="Type your message"
                      receiverIds={currentReceivers.map(u => u.id)}
                      receiverNames={currentReceivers.map(u => u.username)}
                      sendInstantChat={sendInstantChat}
                      convoKey={convoKeyFromUserArray([
                        { site: window.location.host },
                        { id: myself.id, username: myself.username },
                        ...currentReceivers.map(el => ({ id: el.id, username: el.username }))
                      ])}
                      setInstantMessage={setInstantMessage}
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
                <button className="button-message-box-div profile-follow-button">Send Messages</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagePage;

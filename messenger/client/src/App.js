import React, { useState, useEffect, useRef } from 'react';

import Home from './components/Home';
import MessageCore from './components/MessageCore';

const App = () => {
  const [username, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [messageSession, setMessageSession] = useState(null);
  const webSocket = useRef(null);

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
        case 'update-message-session':
        case 'end-message-session':
          setMessageSession(message.data);
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

  const updatePersonNameAndId = (id, username) => {
    setUserId(id);
    setUserName(username);
  };


  const sendChat = (senderId, senderName, receiverId, receiverName, msg, convoId) => {
    webSocket.current.sendMessage('chat-message', { senderId, senderName, receiverId, receiverName, convoId, msg });
  };
  
  const addAChatFriend = (myId, myUsername, friendId, friendUsername, convoId) => {
    webSocket.current.sendMessage('add-chat-friend', { myId, myUsername, friendId, friendUsername, convoId});
  };

   const backgroundColor = () => {
    if(messageSession){
      if(username === messageSession.peopleArr[0].username){
        return 'lightblue';
      } else {
        return 'lightgreen';
      }
    } else {
      return 'lightgray';
    }
  };

  return (
    <div style={{backgroundColor: backgroundColor(), display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '500px'}}>
      <h1>Minimum Instant Messenger</h1>
      <h2>With JS and WebSocket</h2>
      {username ? (
        <MessageCore
          userId={userId}
          username={username} 
          messageSession={messageSession} 
          sendChat={sendChat}
          addAChatFriend={addAChatFriend}
          />
      ) : (
          <Home updatePersonNameAndId={updatePersonNameAndId} />
        )}
    </div>
  );
}

export default App;

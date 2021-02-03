import React, { useState, useEffect, useRef } from 'react';

import Home from './components/Home';
import MessageCore from './components/MessageCore';

const App = () => {
  const [username, setUserName] = useState('');
  const [messageSession, setMessageSession] = useState(null);
  const webSocket = useRef(null);

  useEffect(() => {
    if (!username) {
      return;
    }

    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.onopen = () => {
      sendMessage('add-new-person', { username });
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
  }, [username]);

  const updatePersonName = (username) => {
    setUserName(username);
  };


  const sendChat = (msg, username) => {
    webSocket.current.sendMessage('chat-message', { username, msg });
  };

  const playAgain = (username) => {
    setMessageSession(null);
    webSocket.current.sendMessage('add-new-person', { username });
  };

  const quit = () => {
    setUserName('');
  };

  return (
    <div style={{backgroundColor: Math.random()<0.5?"lightblue":'lightgray'}}>
      <h1>Messenger</h1>
      {username ? (
        <MessageCore
          username={username} 
          messageSession={messageSession} 
          playAgain={playAgain} 
          quit={quit} 
          sendChat={sendChat}
          />
      ) : (
          <Home updatePersonName={updatePersonName} />
        )}
    </div>
  );
}

export default App;

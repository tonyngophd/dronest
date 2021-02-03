
import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import styles from './MessageCore.module.css';


const MessageCore = ({ username, messageSession, sendChat }) => {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    if (messageSession && messageSession.messages) {
      console.log("messageSession.messages", messageSession.messages, messageSession.messages.map(m => [m.name, m.text]));
    }
  }, [messageSession])


  const handleChatSubmit = e => { 
    e.preventDefault(); 
    sendChat(msg, username);
    setMsg('');
  };

  return (
    <div className={styles.messageSession}>
      { messageSession ? (
        <>
          <div className={styles.persons}>
            <div>Person {messageSession.person1.username}</div>
            <div>Person {messageSession.person2.username}</div>
          </div>
          {messageSession.messages &&
            <div>
              <div>
                {messageSession.messages.map(m => 
                  <p key={nanoid()}>
                    <span>{m.username} </span>
                    <span>{m.msg}</span>
                  </p>
                )}
              </div>
              <form onSubmit={handleChatSubmit}>
                <input type='text' value={msg} onChange={e=>setMsg(e.target.value)}/>
                <button type='submit'>Send</button>
              </form>
            </div>}

        </>
      ) : (
          <h3 className={styles.announcement}>Waiting for messageSession to start...</h3>
        )}
    </div>
  );
}

export default MessageCore;

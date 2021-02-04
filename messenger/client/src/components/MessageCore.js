
import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import styles from './MessageCore.module.css';


const MessageCore = ({ userId, username, messageSession, sendChat, addAChatFriend }) => {
  const [msg, setMsg] = useState('');
  const [chatFriends, updateChatFriends] = useState([]);
  const [friendName, setFriendName] = useState('');
  const [friendId, setFriendId] = useState(-1);
  // useEffect(() => {
  //   if (messageSession && messageSession.messages) {
  //     console.log("messageSession.messages", messageSession.messages, messageSession.messages.map(m => [m.name, m.text]));
  //   }
  // }, [messageSession])


  const handleChatSubmit = e => {
    e.preventDefault();
    sendChat(userId, username, friendId, friendName, msg, "convoId");
    setMsg('');
  };

  const personsName = (name, short = false) => name === username ? (short ? 'Me' : `Me (${name})`) : name;

  const PersonsNames = () => {
    const peopleArray = messageSession.peopleArr;
    const me = peopleArray.find(person => person.username === username);
    const others = peopleArray.filter(person => person.username !== username);

    return (
      <>
        <div>
          {
            others.map(person => <div key={nanoid()}>{personsName(person.username)}</div>)
          }
        </div>
        <div>{me.username}</div>
      </>
    );
  }

  const handleNameSubmit = e => {
    e.preventDefault();
    addAChatFriend(userId, username, friendId, friendName, 'newConvo');
    setFriendName('');
    setFriendId(-1)
  }

  return (
    <div className={styles.messageSession}>
      { messageSession ? (
        <>
          <div style={{marginBottom: '20px'}}>
            <form onSubmit={handleNameSubmit}>
              <label>FriendId </label>
              <input
                type='number'
                min={0}
                value={friendId}
                onChange={e => setFriendId(Number(e.target.value))}
                style={{width: '50px'}}
              />
              <input
                type='text'
                value={friendName}
                onChange={e => setFriendName(e.target.value)}
                style={{width: '100px'}}                
              />
              <button type='submit'>Enter</button>
            </form>
          </div>
          <div className={styles.persons}>
            <PersonsNames />
          </div>
          {messageSession.messages &&
            <div style={{marginTop: "100px"}}>
              <div>
                {messageSession.messages.map(m =>
                  <p key={nanoid()} className={m.senderId === userId ? styles.individual_message_right : styles.individual_message_left}>
                    <span className={styles.person_name}><b>{personsName(m.senderName, true)}</b></span>
                    <span >{m.msg}</span>
                  </p>
                )}
              </div>
              <form onSubmit={handleChatSubmit}>
                <input type='text' value={msg} onChange={e => setMsg(e.target.value)} placeholder="Enter a message" />
                <button type='submit'>Send</button>
              </form>
            </div>}

        </>
      ) : (
          <h3 className={styles.announcement}>Waiting for another person to join the chat...</h3>
        )}
    </div>
  );
}

export default MessageCore;

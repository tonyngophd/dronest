
const express = require('express');
const path = require('path');
const { createServer } = require('http');
const morgan = require('morgan');
const WebSocket = require('ws');

const { port } = require('./config');
const { MessageSession, Person } = require('./messageSession-state');

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = createServer(app);

const wss = new WebSocket.Server({ server });

let messageSession = null;

const broadcastMessage = (type, data, persons) => {
  const message = JSON.stringify({
    type,
    data,
  });

  // console.log(`Broadcasting message ${message}...`);

  persons.forEach((person) => {
    // console.log(person.ws.readyState);
    //TODO: broadcast to only the person in the conversation
    if (person && person.ws && person.ws.readyState === 1) {
      person.ws.send(message, (err) => {
        if (err) {
          // TODO Handle errors.
          console.error(err);
        }
      });
    }
  });
};

const startMessageSession = async () => {
  const data = messageSession.getData();
  // await messageSession.checkDB();
  broadcastMessage('start-message-session', data, messageSession.getPersons());
};

const addNewPerson = (id, username, ws) => {
  const person = new Person(id, username, ws);
  console.log("person", id, person.getData());

  if (messageSession === null) {
    messageSession = new MessageSession(person);
  } else {
    // TODO Ignore any additional person connections.
    // console.log(`Ignoring person ${username}...`);
    // person.id = messageSession.peopleArr.length;
    if (!messageSession.peopleIdObj[`${person.id}`]) {
      messageSession.addPerson(person);
    }
  }
  if (messageSession.peopleArr.length >= 1) {
    startMessageSession();
  } else {
    ws.close();
  }
  // if (messageSession === null) {
  //   messageSession = new MessageSession(person);
  // } else if (!messageSession.peopleArr[1]) {
  //   messageSession.addPerson(person)
  //   startMessageSession();
  // } else {
  //   // TODO Ignore any additional person connections.
  //   // console.log(`Ignoring person ${username}...`);
  //   if(!messageSession.peopleIdObj[`${person.id}`]){
  //     messageSession.addPerson(person);
  //   }
  //   ws.close();
  // }
};

const pushChatMsgs = (chatData) => {
  // console.log('pushChatMsgs', chatData);
  const persons = messageSession.getPersons();
  const people = [];
  let { senderId, receiverId } = chatData;
  if(receiverId < 0) receiverId = undefined;
  const key = new Set([senderId, receiverId]);
  const data = messageSession.getData(key);
  if(data.conversations[key]){
    console.log('data.conversations[key]', data.conversations[key]);
    const arr = Array.from(key);
    arr.forEach(el =>
      people.push(persons.find(p => p.id === el))
    );
    // console.log('People', people);
  } else {
    if(senderId && receiverId){
      messageSession.conversations[key] = [senderId, receiverId];
      //TODO add this later
    // } else {
    //   if(senderId){
    //     people.push(persons.find(p => p.id === senderId))
    //   }
    }
  }
  // console.log('People', people);
  if(people.length > 1) broadcastMessage('update-message-session', data, people);
};


const recordChat = (chatData) => {
  messageSession.messages.push(chatData);
  pushChatMsgs(chatData);
}

const addAChatFriend = (data) => {
  const { myId, myUsername, friendId, friendUsername, convoId } = data;
  // console.log(messageSession.peopleUnObj[username]);
  if (messageSession) {
    let myself, friend;
    if (messageSession.peopleUnObj[myUsername] !== undefined) {
      myself = messageSession.peopleArr.find(p => p.username === myUsername).getData();
      if (myself) {
        console.log("myself", myself);
        // const convoId = new Set()
        // messageSession.conversations.push();
      }
    }
    if (messageSession.peopleUnObj[friendUsername] !== undefined) {
      friend = messageSession.peopleArr.find(p => p.username === friendUsername).getData();
      if (friend) {
        console.log("friend", friend);
        // const convoId = new Set()
        // messageSession.conversations.push();
      }
    }
    if(myself && friend){
      const convoId = new Set([myself.id, friend.id]);
      messageSession.conversations[convoId] = [myself.username, friend.username];
      console.log(messageSession.conversations);
    }
  }
}

//Processing incoming message {"type":"chat-message","data":{"username":"p2","msg":"hi there"}}
const processIncomingMessage = (jsonData, ws) => {
  // console.log(`Processing incoming message ${jsonData}...`);

  const message = JSON.parse(jsonData);

  switch (message.type) {
    case 'add-new-person':
      addNewPerson(message.data.userId, message.data.username, ws);
      break;
    case 'chat-message':
      recordChat(message.data, ws);
      break;
    case 'add-chat-friend':
      addAChatFriend(message.data);
      break;
    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
};

wss.on('connection', (ws) => {
  ws.on('message', (jsonData) => {
    processIncomingMessage(jsonData, ws);
  });

  ws.on('close', () => {
    // If there's a messageSession available...
    // if (messageSession !== null) {
    //   const [ person1, person2 ] = messageSession.peopleArr;

    //   // If the closed WS belonged to either person 1 or person 2
    //   // then we need to abort the messageSession.
    //   if (person1.ws === ws || (person2 && person2.ws === ws)) {
    //     // If the closed WS doesn't belong to person 1
    //     // then close their WS, otherwise if there's a
    //     // person 2 then close their WS.
    //     if (person1.ws !== ws) {
    //       person1.ws.close();
    //     } else if (person2 ) {
    //       person2.ws.close();
    //     }
    //     messageSession = null;
    //   }
    // }
    console.log('closed');
  });
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));

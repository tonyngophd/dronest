
const express = require('express');
const path = require('path');
const { createServer } = require('http');
const morgan = require('morgan');
const WebSocket = require('ws');

const { port } = require('./config');
const { MessageSession, Person } = require('./messageSession-state');
const { User, DirectMessage } = require('./db/models');


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
  //TODO: send the previous message in the convo if user participated in a previous convo
  // await messageSession.checkDB();
  const personToBroadcastTo = messageSession.peopleArr[messageSession.peopleArr.length - 1];
  broadcastMessage('start-message-session', data, [personToBroadcastTo]);
};

const updateListOfOnlineUsers = async () => {
  const data = messageSession.peopleArr.map(p => p.getData());
  //TODO: send the list of online people when they are only on the followers or following list
  // await messageSession.checkDB();
  broadcastMessage('update-online-user-list', data, messageSession.peopleArr);
};

const addNewPerson = (id, username, ws) => {
  const person = new Person(id, username, ws);

  if (messageSession === null) {
    messageSession = new MessageSession(person);
  } else {
    if (!messageSession.peopleIdObj[`${person.id}`]) {
      messageSession.addPerson(person);
    }
  }
  if (messageSession.peopleArr.length >= 1) {
    startMessageSession();
    updateListOfOnlineUsers();
  } else {
    ws.close();
  }
};

const pushChatMsgs = (chatData) => {
  const persons = messageSession.getPersons();
  const people = [];
  let { senderId, senderName, receiverId, receiverName } = chatData;
  if (receiverId < 0) receiverId = undefined;
  const key = new Set([senderId, receiverId]);
  const data = messageSession.getData(key);
  if (messageSession.conversations[key]) {
    console.log('messageSession.conversations[key]', messageSession.conversations[key]);
    const arr = Array.from(key);
    arr.forEach(el =>
      people.push(persons.find(p => p.id === el))
    );
  } else {
    if (senderId && receiverId && (senderId !== receiverId)) {
      messageSession.conversations[key] = {
        usernames: [senderName, receiverName],
        userIds: [senderId, receiverId],
      };

      //TODO add this later
      // } else {
      //   if(senderId){
      //     people.push(persons.find(p => p.id === senderId))
      //   }
    }
  }
  // console.log('People', people);
  if (people.length > 1) broadcastMessage('update-message-session', data, people);
};


const recordChat = async (chatData) => {
  console.log('\n\n\nBefore: chatData', chatData);
  let latestMessage;
  let i = 0;
  while (!latestMessage && (i++ < 10)) {
    await new Promise(r => setTimeout(r, 100));
    latestMessage = await DirectMessage.findAll({
      limit: 1,
      where: {
        senderId: chatData.senderId,
        receiverId: chatData.receiverId,
        message: JSON.stringify(chatData.message)
      },
      order: [['createdAt', 'DESC']]
    });
    if (latestMessage && latestMessage[0]) {
      console.log('chatData', chatData, latestMessage[0].toJSON());
      // messageSession.messages.push(chatData);
      messageSession.messages.push(latestMessage[0].toJSON());
      pushChatMsgs(chatData);
    }
  }
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
    if (myself && friend && (myself !== friend)) {
      const convoId = new Set([myself.id, friend.id]);
      messageSession.conversations[convoId] = {
        usernames: [myself.username, friend.username],
        userIds: [myself.id, friend.id],
      };
      console.log(messageSession.conversations);
    }
  }
}

//Processing incoming message {"type":"chat-message","data":{"username":"p2","message":"hi there"}}
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
    if (!messageSession) return;
    const personLeft = messageSession.peopleArr.find(p =>
      p.ws === ws
    )

    if (personLeft) {
      messageSession.peopleArr = messageSession.peopleArr.filter(p =>
        p.ws !== ws
      )
      delete messageSession.peopleIdObj[personLeft.id];
      delete messageSession.peopleUnObj[personLeft.username];
      for (let key in messageSession.conversations) {
        if (messageSession.conversations[key].userIds.includes(personLeft.id)) {
          delete messageSession.conversations[key];
        }
      }
    }
    if (!messageSession.peopleArr.length) {
      messageSession = null;
    }
    console.log('closed');
  });
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));

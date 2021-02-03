/* eslint-disable max-classes-per-file */

class Player {
  constructor(username, ws) {
    this.username = username;
    this.ws = ws;
  }

  getData() {
    return {
      username: this.username,
    };
  }
}

class MessageSession {
  constructor(person1) {
    this.person1 = person1;
    this.person2 = null;
    this.messages = [{ username: person1.username, msg: "Hello there" }, { username: this.person2?this.person2.username:"user2", msg: "Hi back!" }];
  }

  // get gameOverMessage() {
  // }

  getPlayers() {
    return [this.person1, this.person2];
  }


  getData() {
    return {
      person1: this.person1.getData(),
      person2: this.person2.getData(),
      messages: this.messages
    };
  }
}

module.exports = {
  MessageSession,
  Player,
};

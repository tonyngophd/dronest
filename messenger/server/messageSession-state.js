/* eslint-disable max-classes-per-file */

const { User, DirectMessage } = require('./db/models');
const { Op } = require('sequelize');


class Person {
  constructor(id, username, ws) {
    this.id = id;
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
    this.styles = ['lightblue', 'lightgray'];
    this.messages = [];
    this.people = {};
    this.people[`${person1.id}`] = person1;
    this.latestMessage = {};
  }

  // get messageSessionOver() {
  // }

  getPersons() {
    // return this.people;
    return [this.person1, this.person2];
  }


  getData() {
    return {
      person1: this.person1.getData(),
      person2: this.person2.getData(),
      messages: this.messages
    };
  }

  async checkDB() {
    const p1 = await User.findOne({
      where: {
        username: this.person1.username
      },
      include: [{ model: DirectMessage, as: 'sent' }, { model: DirectMessage, as: 'received' }]
    });

    // const person = await JSON.parse(p1);
    console.log("person 1", p1.toJSON().sent);
  }
}

module.exports = {
  MessageSession,
  Person,
};

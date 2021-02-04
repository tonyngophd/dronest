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
      id: this.id,
      username: this.username,
    };
  }
}

class MessageSession {
  constructor(person) {
    this.styles = ['lightblue', 'lightgray'];
    this.messages = [];
    this.peopleIdObj = {};
    this.peopleIdObj[`${person.id}`] = person.username;
    this.peopleUnObj = {};
    this.peopleUnObj[`${person.username}`] = person.id;
    this.peopleArr = [person];
    this.latestMessage = {};
    this.conversations = {};
  }

  // get messageSessionOver() {
  // }

  addPerson(person){
    this.peopleIdObj[`${person.id}`] = person.username;
    this.peopleUnObj[`${person.username}`] = person.id;
    this.peopleArr.push(person);
  }

  getPersons() {
    // return this.peopleIdObj;
    return this.peopleArr;
  }


  getData() {
    return {
      //TODO optimize this!
      peopleIdObj: this.peopleIdObj,
      peopleUnObj: this.peopleUnObj,
      peopleArr: this.peopleArr.map(p => p.getData()),
      messages: this.messages
    };
  }

  async checkDB() {
    const p1 = await User.findOne({
      where: {
        username: this.peopleArr[0].username
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

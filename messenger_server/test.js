
class User{
  constructor(username){
    this.username = username;
  }

  get userName(){ //Notice the getter is userName, different from this.username
    //otherwise it complains saying Maximum call stack size exceeded 
    return this.username;
  }
  set userName(newUsername){//Notice the setter is userName, different from this.username
    //otherwise it complains saying Maximum call stack size exceeded 
    this.username = newUsername;
  }
}

const joe = new User('joe');

console.log(joe.userName, joe.username); //Output: joe joe
joe.userName = 'jesse';
console.log(joe.userName, joe.username); //Output: jesse jesse

class TestPrivate{
  #p = 3; //private object property (not class property)
  constructor(v1, v2){
    this.v1 = v1;
    this.v2 = v2;
  }

  getP(){
    return this.#p;
  }
  incP(v = 1){
    this.#p += v;
  }
}

let t = new TestPrivate(1, 2);
console.log(t.v1, t.v2);
console.log(t.getP());
t.incP(2);
console.log(t.getP());

let t2 = new TestPrivate(1, 2);
console.log(t2.v1, t2.v2);
console.log(t2.getP());


lastMessage = {"blocks":[{"key":"3v2g0","text":"fsdfsd342423","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}};

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

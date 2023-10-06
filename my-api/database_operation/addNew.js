const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/ChatRoom", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: String,
  contacts: [
    {
      _id: false,
      contactUsername: String,
      contactId: mongoose.Schema.Types.ObjectId
    }
  ]
});

const User = mongoose.model("User", userSchema);

async function addNewUsers(newUsers){
  for(const user of newUsers) {
    try{
      const userObj=await User.create({
        username: user.username,
        password: user.password,
        contacts: user.contacts
      });
      console.log(
        "Adding user:",
        user.username,
        " with ID ",
        userObj._id
      );
    } catch (err) {
      console.error("Error create user", err);
    };
  };
};


// 创建好友

async function addUserToContacts(username, userToAdd) {
  try {
    const user = await User.findOne({ username: userToAdd });
    if (!user) {
      console.log('User to add not found!');
      return;
    }

    const user_id = user._id;

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $push: { contacts: { contactUsername: userToAdd, contactId: user_id }}},
      { new: true, useFindAndModify: false }
    );

    console.log('Updated user:', updatedUser);

    // Closing the mongoose connection should probably be handled outside of this function
    // mongoose.connection.close();  
  } catch (err) {
    console.log(err);
  }
}



var newUser1 = {
  'username': 'admin',
  'password': '12345'
};

var newUser2 = {
  'username': 'test1',
  'password': '123456'
};

const newUsers=[newUser1, newUser2];

const username = 'test1';
const userToAdd = 'admin';


(async function initialize() {
  //await addNewUsers(newUsers);
  await addUserToContacts(username, userToAdd);
})();

//使用一对括号包裹一个函数定义（包括箭头函数或传统的函数声明），
//紧接着另一对括号用于立即调用该函数（通常缩写为 IIFE，立即调用的函数表达式），
//是一个在JavaScript中常用的模式。它的主要目的是创建一个新的作用域，避免污染全局作用域，
//并且允许函数立即执行。

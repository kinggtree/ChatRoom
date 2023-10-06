const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/ChatRoom", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require("../schema/user");

var newUser = {
  'username': 'admin',
  'password': '12345',
  'contacts': ['test1','test2','test3']
};

User.create({
  username: newUser.username,
  password: newUser.password,
  contacts: newUser.contacts
})
.then(function (userObj) {
  console.log(
    "Adding user:",
    newUser.username,
    " with ID ",
    userObj._id
  );
})
.catch(function (err) {
  console.error("Error create user", err);
}).finally(() => {
  mongoose.connection.close();
});

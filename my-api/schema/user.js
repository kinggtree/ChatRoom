"use strict";

const mongoose = require("mongoose");

const bcrypt = require('bcrypt');
const saltRounds = 10; // 增加这个数值会使哈希过程更加耗时

/**
 * Define the Mongoose Schema for a Comment.
 */
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


// 在保存用户之前
userSchema.pre('save', function(next) {
  // 如果密码字段有修改（或是新密码）
  if (this.isModified('password')) {
    // 哈希密码
    bcrypt.hash(this.password, saltRounds, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      // 使用哈希密码覆盖明文密码
      this.password = hashedPassword;
      next();
    });
  } else {
    next();
  }
});


/**
 * Create a Mongoose Model for a User using the userSchema.
 */
const User = mongoose.model("User", userSchema);

/**
 * Make this available to our application.
 */
module.exports = User;

"use strict";

const mongoose = require("mongoose");

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

/**
 * Create a Mongoose Model for a User using the userSchema.
 */
const User = mongoose.model("User", userSchema);

/**
 * Make this available to our application.
 */
module.exports = User;

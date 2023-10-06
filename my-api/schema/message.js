"use strict"

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    _id: false,
    senderName: String,
    senderId: mongoose.Schema.Types.ObjectId
  },
  receiver: {
    _id: false,
    receiverName: String,
    receiverId: mongoose.Schema.Types.ObjectId
  },
  message: {
    messageType: String,
    messageContent: String
  },
  date: Date
});

const Message=mongoose.model("Message", messageSchema);

module.exports = Message;
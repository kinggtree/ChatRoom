"use strict"

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    _id: false,
    senderId: mongoose.Schema.Types.ObjectId
  },
  receiver: {
    _id: false,
    receiverId: mongoose.Schema.Types.ObjectId
  },
  message: {
    messageType: String,
    messageContent: String
  },
  date: { type: Date, default: Date.now },
  unread: { type: Boolean, default: true }
}, {
  timestamps: true  // 这将自动添加 createdAt 和 updatedAt 字段
});

const Message=mongoose.model("Message", messageSchema);

module.exports = Message;
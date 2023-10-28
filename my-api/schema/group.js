"use strict";

const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupName: {type: String, default: "New Group"},
  groupOwnerId: mongoose.Schema.Types.ObjectId,
  groupMembers: [
    {
      _id: false,
      userId: mongoose.Schema.Types.ObjectId,
      nickname: String
    }
  ],
  groupProfilePictureName: String,
  group_intro: String,
  group_notice:[
    {
      content: String,
    }
  ]
});

const Group=mongoose.model("Group", groupSchema);

module.exports=Group;
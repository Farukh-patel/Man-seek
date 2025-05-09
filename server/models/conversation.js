const mongoose = require("mongoose");
const conversationModel = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, default: "New Chat" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("conversation", conversationModel);

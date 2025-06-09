const mongoose = require("mongoose");
const conversationSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  title: { type: String, default: "New Chat" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("conversation", conversationSchema);

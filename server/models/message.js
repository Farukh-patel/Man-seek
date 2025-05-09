const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional for AI messages
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "conversation" },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("message", messageSchema);

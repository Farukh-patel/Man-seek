const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  profileImage: String,
  conversations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation", 
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);

const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const isLoggedIn = require("../middlewares/isLoggedIn");

const genAI = new GoogleGenerativeAI("AIzaSyCK-kju2JlmNKfavdohtxpFGm7a1EkswZQ");

router.post("/gemini",isLoggedIn, async (req, res) => {
  const { content, conversationId } = req.body;

  try {
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    } else {
      conversation = new Conversation( {userid:req.user._id });
      await conversation.save();
    }

    const userMsg = new Message({
      sender: "user",
      userId:req.user._id,
      conversationId: conversation._id,
      content,
    });
    await userMsg.save();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(content);
    const aiReply = result.response.text();

    const aiMsg = new Message({
      sender: "ai",
      conversationId: conversation._id,
      content: aiReply,
    });
    await aiMsg.save();

    res.status(200).send({
      message:aiReply,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

router.get("/allconversations", isLoggedIn, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id });
    console.log("Conversations sent to frontend:", conversations);
    res.send({ data: conversations });
  } catch (error) {
    console.log("Error in backend fetch all conversations:", error);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;

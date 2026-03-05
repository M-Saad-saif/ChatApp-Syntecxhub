const Conversation = require("../models/Conversation");

// desc    Get or create a 1-to-1 conversation
// route   POST /api/conversations
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 },
    })
      .populate("participants", "-password")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username avatar" },
      });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
      conversation = await conversation.populate("participants", "-password");
    }

    res.json({ conversation });
  } catch (error) {
    next(error);
  }
};

// desc    Get all conversations for current user
// route   GET /api/conversations
const getUserConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "-password")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username avatar" },
      })
      .sort({ updatedAt: -1 });

    res.json({ conversations });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrCreateConversation, getUserConversations };

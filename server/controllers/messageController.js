const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Group = require("../models/Group");

// desc    Get messages for a conversation
// route   GET /api/messages/conversation/:conversationId
const getConversationMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ conversationId })
      .populate("sender", "username avatar")
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id },
      },
      { $addToSet: { readBy: req.user._id } },
    );

    res.json({ messages });
  } catch (error) {
    next(error);
  }
};

// desc    Get messages for a group
// route   GET /api/messages/group/:groupId
const getGroupMessages = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ groupId })
      .populate("sender", "username avatar")
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ messages });
  } catch (error) {
    next(error);
  }
};

// desc    Send a direct message (REST fallback, main flow uses socket)
// route   POST /api/messages
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, groupId, text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const message = await Message.create({
      conversationId: conversationId || undefined,
      groupId: groupId || undefined,
      sender: req.user._id,
      text: text.trim(),
      readBy: [req.user._id],
    });

    // Update lastMessage on conversation or group
    if (conversationId) {
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
      });
    }
    if (groupId) {
      await Group.findByIdAndUpdate(groupId, { lastMessage: message._id });
    }

    await message.populate("sender", "username avatar");

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

module.exports = { getConversationMessages, getGroupMessages, sendMessage };

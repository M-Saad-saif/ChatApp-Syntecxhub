const express = require("express");
const router = express.Router();
const {
  getConversationMessages,
  getGroupMessages,
  sendMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/conversation/:conversationId", getConversationMessages);
router.get("/group/:groupId", getGroupMessages);
router.post("/", sendMessage);

module.exports = router;

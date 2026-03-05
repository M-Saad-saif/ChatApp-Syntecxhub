const express = require("express");
const router = express.Router();
const {
  getOrCreateConversation,
  getUserConversations,
} = require("../controllers/conversationController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getUserConversations);
router.post("/", getOrCreateConversation);

module.exports = router;

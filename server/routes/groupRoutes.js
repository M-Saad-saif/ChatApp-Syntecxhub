const express = require('express');
const router = express.Router();
const { createGroup, getUserGroups, getGroupById, addMembers } = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getUserGroups);
router.post('/', createGroup);
router.get('/:groupId', getGroupById);
router.put('/:groupId/members', addMembers);

module.exports = router;

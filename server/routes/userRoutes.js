const express = require('express');
const router = express.Router();
const { getAllUsers, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllUsers);
router.get('/search', searchUsers);

module.exports = router;

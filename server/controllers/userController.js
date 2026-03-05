const User = require('../models/User');

// desc    Get all users except current user
// route   GET /api/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')
      .sort({ isOnline: -1, username: 1 });

    res.json({ users });
  } catch (error) {
    next(error);
  }
};

// desc    Search users by username or email
// route   GET /api/users/search?q=query
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) return res.json({ users: [] });

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    })
      .select('-password')
      .limit(10);

    res.json({ users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, searchUsers };

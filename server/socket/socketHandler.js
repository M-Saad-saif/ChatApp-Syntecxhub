const { verifyToken } = require('../config/jwt');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Group = require('../models/Group');

// Maps userId -> socketId for tracking online users
const onlineUsers = new Map();

const initSocket = (io) => {
  // Authenticate socket connections via JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    console.log(`User connected: ${socket.user.username} (${userId})`);

    // Mark user as online
    onlineUsers.set(userId, socket.id);
    await User.findByIdAndUpdate(userId, { isOnline: true });

    // Broadcast updated online users list
    io.emit('users:online', Array.from(onlineUsers.keys()));

    // Join the user's personal room for direct messages
    socket.join(userId);

    // Auto-join all user's group rooms
    const groups = await Group.find({ members: userId }).select('_id');
    groups.forEach((g) => socket.join(`group:${g._id}`));

    // ─── Direct Messages ───────────────────────────────────────────────

    socket.on('message:send', async (data, callback) => {
      try {
        const { conversationId, receiverId, text } = data;

        if (!text?.trim()) return;

        // Get or create conversation
        let convo = conversationId
          ? await Conversation.findById(conversationId)
          : await Conversation.findOneAndUpdate(
              { participants: { $all: [userId, receiverId], $size: 2 } },
              {},
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );

        const message = await Message.create({
          conversationId: convo._id,
          sender: userId,
          text: text.trim(),
          readBy: [userId],
        });

        await message.populate('sender', 'username avatar');

        // Update conversation's lastMessage
        await Conversation.findByIdAndUpdate(convo._id, {
          lastMessage: message._id,
          updatedAt: new Date(),
        });

        const populatedConvo = await Conversation.findById(convo._id)
          .populate('participants', '-password')
          .populate({ path: 'lastMessage', populate: { path: 'sender', select: 'username avatar' } });

        // Emit to both sender and receiver rooms
        const targetUserId = receiverId || convo.participants.find((p) => p.toString() !== userId)?.toString();

        io.to(userId).to(targetUserId).emit('message:new', {
          message,
          conversation: populatedConvo,
        });

        if (callback) callback({ success: true, message });
      } catch (err) {
        console.error('message:send error', err);
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // ─── Group Messages ─────────────────────────────────────────────────

    socket.on('group:message:send', async (data, callback) => {
      try {
        const { groupId, text } = data;

        if (!text?.trim()) return;

        const group = await Group.findById(groupId);
        if (!group) return;

        // Verify sender is a member
        const isMember = group.members.some((m) => m.toString() === userId);
        if (!isMember) return;

        const message = await Message.create({
          groupId,
          sender: userId,
          text: text.trim(),
          readBy: [userId],
        });

        await message.populate('sender', 'username avatar');

        await Group.findByIdAndUpdate(groupId, {
          lastMessage: message._id,
          updatedAt: new Date(),
        });

        // Broadcast to entire group room
        io.to(`group:${groupId}`).emit('group:message:new', { message, groupId });

        if (callback) callback({ success: true, message });
      } catch (err) {
        console.error('group:message:send error', err);
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // ─── Typing Indicators ───────────────────────────────────────────────

    socket.on('typing:start', ({ conversationId, receiverId, groupId }) => {
      if (groupId) {
        socket.to(`group:${groupId}`).emit('typing:start', { userId, groupId });
      } else if (receiverId) {
        socket.to(receiverId).emit('typing:start', { userId, conversationId });
      }
    });

    socket.on('typing:stop', ({ conversationId, receiverId, groupId }) => {
      if (groupId) {
        socket.to(`group:${groupId}`).emit('typing:stop', { userId, groupId });
      } else if (receiverId) {
        socket.to(receiverId).emit('typing:stop', { userId, conversationId });
      }
    });

    // ─── Read Receipts ───────────────────────────────────────────────────

    socket.on('messages:read', async ({ conversationId }) => {
      try {
        await Message.updateMany(
          { conversationId, sender: { $ne: userId }, readBy: { $ne: userId } },
          { $addToSet: { readBy: userId } }
        );

        // Notify the other participant that messages were read
        const convo = await Conversation.findById(conversationId);
        if (convo) {
          const otherUserId = convo.participants.find((p) => p.toString() !== userId)?.toString();
          if (otherUserId) {
            io.to(otherUserId).emit('messages:read', { conversationId, readBy: userId });
          }
        }
      } catch (err) {
        console.error('messages:read error', err);
      }
    });

    // ─── Join New Group Room (after creation) ────────────────────────────

    socket.on('group:join', ({ groupId }) => {
      socket.join(`group:${groupId}`);
    });

    // ─── Disconnect ──────────────────────────────────────────────────────

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.username}`);
      onlineUsers.delete(userId);

      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      io.emit('users:online', Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = { initSocket };

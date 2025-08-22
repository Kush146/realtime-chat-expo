import express from 'express';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const me = req.user.id;
    const users = await User.find({ _id: { $ne: me } }).select('_id username online lastSeen').lean();
    // Attach last message per user (N queries; fine for MVP)
    const withLast = await Promise.all(users.map(async (u) => {
      const last = await Message.findOne({ $or: [{ from: me, to: u._id }, { from: u._id, to: me }] })
        .sort({ createdAt: -1 })
        .select('_id text from to createdAt readAt deliveredAt')
        .lean();
      return { ...u, lastMessage: last || null };
    }));
    res.json(withLast);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

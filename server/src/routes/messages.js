import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const router = express.Router();

async function findOrCreateConversation(userA, userB) {
  let convo = await Conversation.findOne({ participants: { $all: [userA, userB] } });
  if (!convo) {
    convo = await Conversation.create({ participants: [userA, userB] });
  }
  return convo;
}

// GET /conversations/:id/messages  (id = other user id)
router.get('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const me = req.user.id;
    const other = req.params.id;
    const convo = await findOrCreateConversation(me, other);
    const msgs = await Message.find({ conversation: convo._id }).sort({ createdAt: 1 }).lean();
    res.json({ conversationId: convo._id, messages: msgs });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

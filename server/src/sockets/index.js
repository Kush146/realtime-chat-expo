import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const onlineUsers = new Map(); // userId -> Set(socketId)

function addOnline(userId, socketId) {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
}
function removeOnline(userId, socketId) {
  if (!onlineUsers.has(userId)) return;
  const set = onlineUsers.get(userId);
  set.delete(socketId);
  if (set.size === 0) onlineUsers.delete(userId);
}

function emitPresence(io) {
  const presence = Array.from(onlineUsers.keys());
  io.emit('presence:update', { onlineUserIds: presence });
}

async function findOrCreateConversation(userA, userB) {
  let convo = await Conversation.findOne({ participants: { $all: [userA, userB] } });
  if (!convo) convo = await Conversation.create({ participants: [userA, userB] });
  return convo;
}

export default function registerSocketHandlers(io) {
  io.on('connection', async (socket) => {
    const userId = socket.user.id;
    addOnline(userId, socket.id);
    await User.findByIdAndUpdate(userId, { online: true });
    emitPresence(io);

    socket.on('typing:start', ({ to }) => {
      const targets = onlineUsers.get(to);
      if (targets) for (const sid of targets) io.to(sid).emit('typing:start', { from: userId });
    });

    socket.on('typing:stop', ({ to }) => {
      const targets = onlineUsers.get(to);
      if (targets) for (const sid of targets) io.to(sid).emit('typing:stop', { from: userId });
    });

    socket.on('message:send', async ({ to, text, tempId }) => {
      try {
        const convo = await findOrCreateConversation(userId, to);
        const msg = await Message.create({
          conversation: convo._id, from: userId, to, text, deliveredAt: null, readAt: null
        });
        // deliver to receiver
        const payload = { ...msg.toObject(), tempId };
        const targets = onlineUsers.get(to);
        if (targets && targets.size > 0) {
          for (const sid of targets) io.to(sid).emit('message:new', payload);
          // mark delivered
          await Message.findByIdAndUpdate(msg._id, { deliveredAt: new Date() });
          io.to(socket.id).emit('message:delivered', { messageId: msg._id, tempId });
        }
        // echo to sender as confirmation
        io.to(socket.id).emit('message:new', payload);
      } catch (e) {
        io.to(socket.id).emit('message:error', { tempId, error: 'send_failed' });
      }
    });

    socket.on('message:read', async ({ conversationId, from }) => {
      // mark messages from "from" to me as read
      const now = new Date();
      await Message.updateMany({ conversation: conversationId, from, to: userId, readAt: null }, { readAt: now });
      // notify sender(s)
      const targets = onlineUsers.get(from);
      if (targets) for (const sid of targets) io.to(sid).emit('message:read', { conversationId, by: userId, at: now });
    });

    socket.on('disconnect', async () => {
      removeOnline(userId, socket.id);
      const stillOnline = onlineUsers.has(userId);
      if (!stillOnline) {
        await User.findByIdAndUpdate(userId, { online: false, lastSeen: new Date() });
      }
      emitPresence(io);
    });
  });
}

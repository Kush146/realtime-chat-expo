import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import messageRoutes from './src/routes/messages.js';
import { authMiddlewareSocket } from './src/middleware/auth.js';
import registerSocketHandlers from './src/sockets/index.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ ok: true, message: 'Chat API running' }));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/conversations', messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.use(authMiddlewareSocket);
registerSocketHandlers(io);

// DB connect
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Missing MONGO_URI');
  process.exit(1);
}
mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
});

}).catch(err => {
  console.error('Mongo error', err);
  process.exit(1);
});

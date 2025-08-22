import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';

const users = [
  { username: 'alice', password: 'alice123' },
  { username: 'bob', password: 'bob123' },
  { username: 'charlie', password: 'charlie123' },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await User.create({ username: u.username, password: hash });
  }
  console.log('Seeded users:', users.map(u => `${u.username}/${u.password}`).join(', '));
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });

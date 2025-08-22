# Chat MVP — Server

Tech: Node.js, Express, Socket.IO, MongoDB (Mongoose), JWT, bcrypt

## Quick start

1) Install deps
```bash
cd server
npm i
cp .env.example .env
# IMPORTANT: .env already points to your Mongo URI.
# Change JWT_SECRET to a strong random string.
```

2) Seed a few users (optional)
```bash
npm run seed
```

3) Run
```bash
npm run dev
```

Server defaults to `PORT=4000`.

## REST API

- `POST /auth/register` `{ username, password }` -> `{ token, user }`
- `POST /auth/login` `{ username, password }` -> `{ token, user }`
- `GET /users` (auth) -> list of users with `{ _id, username, online, lastSeen, lastMessage }`
- `GET /conversations/:id/messages` (auth) where `id` = other user id -> `{ conversationId, messages[] }`

## Socket events

Authenticate socket by passing the JWT as:
```js
const socket = io(SERVER_URL, { auth: { token } });
```

- `message:send` → `{ to, text, tempId }`
  - Emits back `message:new` to sender (echo) and receiver
  - Emits `message:delivered` to sender if receiver online
- `message:new` ← `{ _id, from, to, text, createdAt, deliveredAt, readAt, tempId? }`
- `message:read` → `{ conversationId, from }` to mark messages from `from` as read
  - Emits `message:read` to the other user `{ conversationId, by, at }`
- `typing:start` → `{ to }`, `typing:stop` → `{ to }`
- `presence:update` ← `{ onlineUserIds: [userId] }`

## Notes
- Delivery is marked when the receiver has an active socket at send-time.
- Read receipts are marked when a client emits `message:read` for the conversation.

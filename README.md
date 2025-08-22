# Realtime 1:1 Chat (MVP)

Monorepo layout:
```
/server  - Node.js + Express + Socket.IO + MongoDB (Mongoose)
/mobile  - React Native (Expo)
```

## Setup

### Server
```
cd server
npm i
cp .env.example .env
npm run seed   # optional sample users
npm run dev
```
- REST: `POST /auth/register`, `POST /auth/login`, `GET /users`, `GET /conversations/:id/messages`
- Socket: `message:send`, `message:new`, `typing:start|stop`, `message:read`
- Presence: `presence:update`

### Mobile
```
cd mobile
npm i
# Edit src/api/client.js -> SERVER_URL
npm run ios
```

### Sample users
Seed creates:
- alice / alice123
- bob / bob123
- charlie / charlie123



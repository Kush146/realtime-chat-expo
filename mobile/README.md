# Chat MVP — Mobile (React Native)

Tech: Expo (React Native), Axios, Socket.IO client, React Navigation

## Quick start (iOS / iPhone 12)

1) Install deps
```bash
cd mobile
npm i
```

2) Point the app to your server
- Open `src/api/client.js` and change `SERVER_URL` to your machine (e.g. `http://192.168.x.x:4000`), or use an ngrok tunnel.

3) Run the app
```bash
npm run ios
# or: npm start, then open in Expo Go
```

### Features
- JWT Auth (Login/Register)
- User list with online status + last message
- Realtime chat (Socket.IO)
- Typing indicator
- Delivery (double tick) & read receipts
- Scrollable chat history persisted in MongoDB

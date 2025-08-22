# Quickstart (one-copy)

# 0 Run this from the repo root (realtime-chat-expo)

# 1 Create the backend env (EDIT MONGO_URI!)
mkdir -p server
cat > server/.env << 'EOF'
PORT=4000
MONGO_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=change_me
CORS_ORIGIN=*
EOF

# 2 Install dependencies
npm --prefix server i
npm --prefix mobile i

# 3 Seed demo users (clears users collection, then adds alice/bob/charlie)
npm --prefix server run seed

# 4 Start the backend (Terminal A – leave running)
npm --prefix server run dev

<<<<<<< HEAD
=======
# 5 Start a public tunnel (Terminal B)
#    On Windows (if ngrok.exe is in C:\ngrok):
#    C:\ngrok\ngrok.exe http 4000
#    On macOS/Linux (if ngrok is on PATH):
#    ngrok http 4000
# Copy the HTTPS forwarding URL, e.g. https://abc123.ngrok-free.app

# 6 Point the mobile app to your tunnel URL
# Open mobile/src/api/client.js and set:
#   export const SERVER_URL = "https://abc123.ngrok-free.app";
# (The app already sends `ngrok-skip-browser-warning` header.)

# 7 Launch the app in Expo Go (Terminal C)
npx --prefix mobile expo login          # sign in with your Expo account
npx --prefix mobile expo start --tunnel -c

# On your iPhone:
# - Open Expo Go -> Projects tab (same account) OR paste the exp:// link
# - Login with seeded users: alice/alice123, bob/bob123, charlie/charlie123

# Seed sample users
cd server && npm run seed

## Screenshots

<p style="text-align: center;">
  <img src="docs/screens/login-ios.png" alt="Login" width="300" />
  <img src="docs/screens/home-ios.png" alt="Home" width="300" />
  <img src="docs/screens/chat-ios.png" alt="Chat" width="300" />
</p>







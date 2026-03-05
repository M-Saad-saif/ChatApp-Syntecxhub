# Relay — Real-Time Chat App

A full-stack, production-ready chat application built with the MERN stack and Socket.io.

## Features

- **Authentication** — JWT login/signup with bcrypt password hashing
- **Real-time 1-to-1 messaging** — instant delivery via WebSocket
- **Group chats** — create groups, add members, real-time messaging
- **Online presence** — live online/offline indicators
- **Typing indicators** — see when others are composing
- **Read receipts** — ✓ sent / ✓✓ seen
- **Message history** — persisted in MongoDB, loaded on chat open
- **Dark mode** — no-gradient dark theme toggle
- **Responsive design** — works on mobile and desktop

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite, React Router v6   |
| Backend  | Node.js, Express.js               |
| Database | MongoDB + Mongoose                |
| Realtime | Socket.io                         |
| Auth     | JWT + bcryptjs                    |
| Styling  | Plain CSS with CSS variables      |

---

## Project Structure

```
relay-chat/
├── server/
│   ├── config/         # JWT utilities
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth + error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── socket/         # Socket.io event handlers
│   └── server.js       # App entry point
│
└── client/
    └── src/
        ├── components/
        │   └── chat/   # All chat UI components
        ├── context/    # React context (Auth + Chat state)
        ├── pages/      # Page-level components
        ├── utils/      # API, socket, helpers
        └── styles/     # Global CSS
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works fine)

### 1. Clone & install dependencies

```bash
# From the project root
npm run install:all
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/chatapp
JWT_SECRET=change_this_to_something_long_and_random
CLIENT_URL=http://localhost:5173
```

### 3. Run in development

```bash
# From project root — starts both server and client
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

## API Reference

### Auth
| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| POST   | /api/auth/signup | Register user      |
| POST   | /api/auth/login  | Login user         |
| GET    | /api/auth/me     | Get current user   |

### Users
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | /api/users            | List all users      |
| GET    | /api/users/search?q=  | Search users        |

### Conversations
| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| GET    | /api/conversations   | User's conversations       |
| POST   | /api/conversations   | Get/create DM conversation |

### Messages
| Method | Endpoint                              | Description          |
|--------|---------------------------------------|----------------------|
| GET    | /api/messages/conversation/:id        | Get DM messages      |
| GET    | /api/messages/group/:id               | Get group messages   |

### Groups
| Method | Endpoint                    | Description        |
|--------|-----------------------------|---------------------|
| GET    | /api/groups                 | User's groups       |
| POST   | /api/groups                 | Create a group      |
| GET    | /api/groups/:id             | Get group details   |
| PUT    | /api/groups/:id/members     | Add members         |

---

## Socket Events

### Client → Server
| Event                | Payload                                  |
|----------------------|------------------------------------------|
| `message:send`       | `{ conversationId?, receiverId, text }`  |
| `group:message:send` | `{ groupId, text }`                      |
| `typing:start`       | `{ conversationId?, receiverId?, groupId? }` |
| `typing:stop`        | same as above                            |
| `messages:read`      | `{ conversationId }`                     |
| `group:join`         | `{ groupId }`                            |

### Server → Client
| Event                | Payload                              |
|----------------------|--------------------------------------|
| `users:online`       | `[userId, ...]`                      |
| `message:new`        | `{ message, conversation }`          |
| `group:message:new`  | `{ message, groupId }`               |
| `typing:start`       | `{ userId, conversationId?, groupId? }` |
| `typing:stop`        | same as above                        |
| `messages:read`      | `{ conversationId, readBy }`         |

---

## Deployment

### Backend → Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your repo, set root to `server/`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables from `.env`

### Frontend → Vercel
1. Import project on [vercel.com](https://vercel.com)
2. Set root to `client/`
3. Add env variable: `VITE_SERVER_URL=https://your-backend.onrender.com`
4. Deploy — Vercel handles the rest

---

## Database Schemas

### User
```
username, email, password (hashed), avatar, isOnline, lastSeen
```

### Conversation
```
participants: [User], lastMessage: Message, unreadCount: Map
```

### Message
```
conversationId?, groupId?, sender, text, fileUrl?, fileType?, readBy: [User]
```

### Group
```
name, description, members: [User], admins: [User], createdBy, lastMessage
```
"# ChatApp-Syntecxhub" 

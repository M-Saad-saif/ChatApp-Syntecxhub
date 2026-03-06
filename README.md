# 💬 ChitChat — Real-Time MERN Chat Application

A **modern real-time chat application** inspired by WhatsApp, built with the **MERN Stack** and **Socket.io** for seamless real-time communication.

This project demonstrates a **full-stack production-style architecture** with authentication, real-time messaging, and scalable backend APIs.

---

# 🚀 Live Demo
https://schitchats.vercel.app/

---

# ✨ Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication
- Protected API routes

### 💬 Real-Time Messaging
- Instant messaging using **Socket.io**
- One-to-one private chats
- Live message updates

### 👥 Group Chats
- Create group conversations
- Add multiple users to groups
- Real-time group messaging

### 📦 Persistent Chat History
- Messages stored in MongoDB
- Conversations saved and loaded dynamically

### 🟢 Online Presence
- Track user connection status
- Real-time socket connections

### ⚡ Modern UI
- Responsive interface
- Clean and minimal chat design
- Optimized for performance

---

# 🛠 Tech Stack

## Frontend
- React / Vite
- Tailwind CSS
- Axios
- Socket.io Client

## Backend
- Node.js
- Express.js
- Socket.io

## Database
- MongoDB

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

# 📂 Project Structure

```
ChatApp-Syntecxhub
│
├── backend
│   ├── routes
│   ├── controllers
│   ├── models
│   ├── middleware
│   ├── socket
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── hooks
│   │   └── main.jsx
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the repository

```bash
git clone https://github.com/M-Saad-saif/ChatApp-Syntecxhub.git
cd ChatApp-Syntecxhub
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

Run backend:

```
npm run dev
```

---

## 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔌 API Routes

| Method | Endpoint | Description |
|------|------|------|
POST | /api/auth/register | Register new user |
POST | /api/auth/login | User login |
GET | /api/users | Get all users |
POST | /api/messages | Send message |
GET | /api/messages/:id | Get conversation messages |
POST | /api/groups | Create group chat |

---

# 🔗 Real-Time Events

Socket.io events used:

```
connection
joinConversation
sendMessage
receiveMessage
disconnect
```

---

# 🧠 System Architecture

Client (React)
⬇
REST API + WebSocket
⬇
Node.js + Express
⬇
MongoDB Atlas

Real-time communication handled by **Socket.io**.

---

# 📈 Future Improvements

- Message read receipts
- Typing indicators
- File and image sharing
- Push notifications
- Voice messages
- End-to-end encryption

---

# 👨‍💻 Author

**Saad Saif**

GitHub  
https://github.com/M-Saad-saif

---

⭐ If you like this project, consider **starring the repository**!

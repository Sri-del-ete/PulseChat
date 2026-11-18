# 💬 QuickChat – Real-Time MERN Chat Application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-quickchat--three--beige.vercel.app-7c3aed?style=for-the-badge&logo=vercel&logoColor=white)](https://quickchat-three-beige.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

**QuickChat** is a full-stack real-time messaging web application built with the **MERN** stack (**MongoDB, Express.js, React.js, Node.js**), **Socket.IO**, **Tailwind CSS**, and **Cloudinary**. It provides instant one-to-one messaging, online/offline presence tracking, read receipts, image sharing, and profile management wrapped in a modern dark purple glassmorphic interface.

### 🌐 Live Application
👉 **[https://quickchat-three-beige.vercel.app](https://quickchat-three-beige.vercel.app)**

---

## ✨ Key Features

- **🔐 Secure User Authentication:** Registration, login, and protected routes powered by **JWT (JSON Web Tokens)** and **bcryptjs** password hashing.
- **💬 Real-Time Messaging:** Instant bi-directional chat via **Socket.IO**, plus automatic serverless sync fallback when deployed on Vercel.
- **🟢 Online / Offline Presence:** Live tracking of connected users with real-time status indicators in the sidebar and chat header.
- **👀 Message Seen Status & Unread Counts:** Read receipts (`Sent` / `Seen` checkmarks) and per-contact unread message counter badges.
- **🖼️ Image Sharing & Media Gallery:** Share images in conversations with **Cloudinary** cloud storage support and browse all shared photos in the right-hand **Media** drawer.
- **👤 Profile Management:** Update display name, biography, and profile picture with live preview.
- **🔍 Contact Search & Persistent History:** Search registered users and retrieve complete previous conversations from **MongoDB Atlas**.
- **🎨 Responsive Glassmorphic Dark UI:** Styled with **Tailwind CSS** and **Lucide Icons**.

---

## 🏗️ System Architecture

```text
User ◄──► React.js Frontend (Vite + Tailwind CSS + Context API)
                 │
       REST APIs (Axios) & Real-Time (Socket.IO)
                 │
                 ▼
       Node.js + Express.js Backend / Vercel Serverless API
          │                               │
          ▼                               ▼
     Mongoose ODM                    Cloudinary CDN
          │                        (Avatars & Media)
          ▼
    MongoDB Atlas
```

---

## 📁 Project Structure

```text
QuickChat/
├── api/
│   └── index.js                   # Vercel serverless function entry (/api/*)
├── client/                        # React + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatContainer.jsx  # Chat messages, timestamps & seen receipts
│   │   │   ├── ChatHeader.jsx     # Active contact header & info toggle
│   │   │   ├── MessageInput.jsx   # Text input, image preview & send button
│   │   │   ├── NoChatSelected.jsx # Welcome placeholder ("Chat anytime, anywhere")
│   │   │   ├── RightSidebar.jsx   # Contact profile details & shared Media grid
│   │   │   └── Sidebar.jsx        # User search, contacts, online status & unread badges
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Authentication state & Socket.IO client
│   │   │   └── ChatContext.jsx    # Messaging state, read receipts & sync
│   │   ├── lib/
│   │   │   ├── axios.js           # Axios client (auto-detects local vs Vercel /api)
│   │   │   └── utils.js           # Time formatting & file-to-DataURL helpers
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # 3-column chat layout
│   │   │   ├── LoginPage.jsx      # User login page
│   │   │   ├── ProfilePage.jsx    # Profile editor (name, bio, avatar)
│   │   │   └── SignUpPage.jsx     # User registration page
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                        # Node.js + Express + Mongoose + Socket.IO backend
│   ├── controllers/
│   │   ├── messageController.js   # Sidebar users, history, send & mark seen
│   │   └── userController.js      # Signup, login, auth check & profile update
│   ├── lib/
│   │   ├── cloudinary.js          # Cloudinary SDK setup
│   │   ├── db.js                  # MongoDB connection (with serverless caching)
│   │   └── utils.js               # JWT token generator
│   ├── middleware/
│   │   └── auth.js                # JWT protectRoute middleware
│   ├── models/
│   │   ├── Message.js             # Mongoose Message schema
│   │   └── User.js                # Mongoose User schema
│   ├── routes/
│   │   ├── messageRoutes.js       # /api/messages endpoints
│   │   └── userRoutes.js          # /api/auth endpoints
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .vercelignore
├── package.json
├── vercel.json                    # Full-stack Vercel build & API rewrites
└── README.md
```

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js** (v18+)
- **MongoDB Atlas** URI (or local MongoDB instance)
- **Cloudinary** account *(optional, for CDN image storage)*

### 1. Clone the Repository
```bash
git clone https://github.com/Sri-del-ete/QuickChat.git
cd QuickChat
```

### 2. Configure Environment Variables
Copy `server/.env.example` to `server/.env` and fill in your credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/quickchat?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### 3. Run the Backend
```bash
cd server
npm install
npm run dev
```
*Backend runs at `http://localhost:5000`.*

### 4. Run the Frontend
In a second terminal:
```bash
cd client
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT | No |
| `GET` | `/api/auth/check` | Verify active user session | Yes |
| `PUT` | `/api/auth/update-profile` | Update name, bio, and profile picture | Yes |

### Messaging (`/api/messages`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/messages/users` | Retrieve contacts and unseen message counts | Yes |
| `GET` | `/api/messages/:id` | Fetch conversation history with a user | Yes |
| `POST` | `/api/messages/send/:id` | Send a text and/or image message | Yes |
| `PUT` | `/api/messages/mark/:id` | Mark incoming messages as seen | Yes |

### Socket.IO Events
| Event | Direction | Description |
| :--- | :--- | :--- |
| `connection` | Client → Server | Registers socket using `query.userId` |
| `getOnlineUsers` | Server → Client | Broadcasts array of currently online user IDs |
| `newMessage` | Server → Client | Pushes incoming messages in real time |
| `messagesSeen` | Server → Client | Updates read-receipt indicators for the sender |
| `disconnect` | Client → Server | Removes user from online list and broadcasts update |

---

## 🚀 Deployment (Vercel)

This project is deployed on **Vercel** at **[https://quickchat-three-beige.vercel.app](https://quickchat-three-beige.vercel.app)** using the root `vercel.json`:
- Builds the Vite React frontend into `client/dist`.
- Routes `/api/*` requests to the Express serverless handler in `api/index.js`.
- Requires `MONGODB_URI` and `JWT_SECRET` (plus optional `CLOUDINARY_*` keys) configured in **Vercel Project Settings → Environment Variables**.

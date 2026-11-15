# ⚡ PulseChat – Real-Time Messaging Platform

**PulseChat** is a high-performance, real-time messaging web platform with a modern **Cyber-Obsidian & Electric Emerald** theme. Built using the **MERN** stack (MongoDB, Express.js, React 18, Node.js), **Socket.IO** bi-directional real-time communication, and **Cloudinary** media storage.

The project is structured and pre-configured for **instant 1-click deployment on Vercel**.

---

## 🚀 Key Highlights & New Features

- **New Brand Identity**: Rebranded from QuickChat to **PulseChat** with active live presence pulses.
- **Redesigned UI**:
  - Deep obsidian dark background (`#070a12`) with frosted glass panels (`backdrop-blur-2xl`).
  - High-impact **Electric Emerald & Cyan** glowing accents.
  - Active user presence dots with pulsing radar rings (`online-pulse-ring`).
  - Fluid chat bubbles, quick emoji selector (`👋`, `👍`, `🔥`, `❤️`, `✨`, `🎉`), and rich image previews.
  - Media drawer displaying all images shared between users.
- **Vercel-Ready Architecture**:
  - Unified root configuration ([vercel.json](file:///C:/Users/srini/.gemini/antigravity/scratch/quickchat/vercel.json)) serving both frontend and serverless API functions under the same domain.
  - Serverless MongoDB connection caching in [db.js](file:///C:/Users/srini/.gemini/antigravity/scratch/quickchat/server/lib/db.js).
  - Built-in real-time fallback polling (every 3.5s) to guarantee instant live messaging even in stateless serverless environments.

---

## 📁 Project Architecture

```
quickchat/
├── api/
│   └── index.js              # Vercel Serverless Function entry point (/api/*)
├── client/                   # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatContainer.jsx   # Message list, timestamps, read receipts
│   │   │   ├── ChatHeader.jsx      # Contact header, online pulse, call actions
│   │   │   ├── MessageInput.jsx    # Text input, emoji bar, media picker
│   │   │   ├── NoChatSelected.jsx  # Hero welcome card with animated pulse
│   │   │   ├── RightSidebar.jsx    # Contact details & shared media gallery
│   │   │   └── Sidebar.jsx         # Contact list, search, active online filters
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # User session & socket lifecycle
│   │   │   └── ChatContext.jsx     # Chat state & real-time sync
│   │   ├── lib/
│   │   │   ├── axios.js            # Auto-detects Vercel production vs local URL
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── SignUpPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                   # Backend (Express + Node + Socket.IO)
│   ├── controllers/
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── lib/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── utils.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Message.js
│   │   └── User.js
│   ├── routes/
│   │   ├── messageRoutes.js
│   │   └── userRoutes.js
│   ├── package.json
│   └── server.js
├── package.json              # Monorepo scripts & dependencies
├── vercel.json               # Fullstack Vercel build & route rewrites
└── README.md
```

---

## ⚡ Deploying to Vercel (Instant Click-to-Run)

### Step 1: Push Project to GitHub
1. Initialize a git repository inside this folder (or your repository):
   ```bash
   git init
   git add .
   git commit -m "feat: PulseChat modern redesign and vercel setup"
   ```
2. Push to your GitHub account:
   ```bash
   git remote add origin https://github.com/<your-username>/pulsechat.git
   git push -u origin main
   ```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** ➔ **"Project"**.
3. Select your `pulsechat` GitHub repository and click **Import**.
4. Leave the **Root Directory** as `./` (the root). Vercel will automatically detect the root `vercel.json`!

### Step 3: Add Environment Variables in Vercel
Under the **Environment Variables** section on Vercel, add:

| Key | Value Description |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection URI (e.g. `mongodb+srv://...`) |
| `JWT_SECRET` | A secure random string (e.g. `pulsechat_jwt_secret_key_2026`) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret |
| `NODE_ENV` | `production` |

*(Optional: If you host a persistent Socket.IO server on Railway or Render, set `VITE_SOCKET_URL` to its URL. Otherwise, PulseChat's built-in intelligent polling automatically keeps chats synced in real time on Vercel).*

### Step 4: Click Deploy!
- Click **Deploy**.
- Within 1–2 minutes, Vercel will build the frontend into `client/dist`, deploy the API routes into serverless functions (`api/index.js`), and provide you with a live URL (e.g. `https://pulsechat-xxx.vercel.app`).
- **You can now click the link and immediately use PulseChat!**

---

## 💻 Local Development Setup

If you wish to run the app locally on your machine:

### 1. Start the Backend API
```bash
cd server
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*

### 2. Start the Frontend
In a new terminal:
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/signup` – Register new user with full name, email, password, and bio.
- `POST /api/auth/login` – Login user and return JWT session token.
- `GET /api/auth/check` – Verify token session.
- `PUT /api/auth/update-profile` – Update full name, bio, and avatar.

### 💬 Messaging (`/api/messages`)
- `GET /api/messages/users` – Retrieve all registered contacts with live unread message counts.
- `GET /api/messages/:id` – Fetch conversation history with a selected user.
- `POST /api/messages/send/:id` – Send text or image message (uploaded to Cloudinary).
- `PUT /api/messages/mark/:id` – Mark messages from user as seen.

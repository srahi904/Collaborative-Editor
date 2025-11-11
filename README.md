# 📝 Collaborative Editor

A **real-time collaborative text editor** built using the **MERN stack (MongoDB, Express, React, Node.js)** with advanced **CRDT-based conflict resolution (Yjs)** and **live sync via WebSockets (Socket.io)**.

Users can collaborate on shared documents, see each other’s cursors and edits instantly, chat in real-time, and manage documents in a nested folder structure — all with offline support and secure JWT authentication.

---

## 🚀 Key Features

### ✍️ Real-Time Collaboration
- Multi-user document editing with **low latency** and **conflict-free merging** using **Yjs CRDT**.

### 👥 Live Cursors & User Presence
- See active collaborators’ cursors and presence information with unique color indicators.

### 💬 Real-Time Chat
- In-room chat system for team communication during live editing sessions.

### 🗂 Document & Folder Management
- Create, rename, and nest folders.
- Create and edit text documents inside folders.

### 💾 Persistent Storage
- **MongoDB** stores all folder hierarchy and document content with versioning support.

### 🔑 Secure Authentication
- **JWT-based** login and **role-based access control** for user security.

### 🌐 Join by Room ID
- Collaborate privately — join or invite others using a **unique room ID or link**.

### ⚡ Offline Support & Recovery
- Seamless syncing: local edits are merged automatically when users reconnect.

### 🧠 Scalable Architecture
- Built with **Socket.io rooms**, efficient broadcasting, and modular design ready for scale.

---

## 🧰 Tech Stack

**Frontend:**
- React (with React Router v6)
- Tailwind CSS
- Socket.io-client
- Yjs (CRDT engine)

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io (WebSockets)

**Authentication:**
- JWT (JSON Web Tokens)

**Version Control:**
- Git + GitHub

---

## ⚙️ Getting Started

### 🔑 Prerequisites
Make sure you have the following installed:
- Node.js (v14+)
- MongoDB (local or cloud)
- Yarn or npm

---

### 🖥️ Installation & Setup

#### Backend Setup
```bash
cd backend
npm install


PORT=4000
MONGO_URI=your_mongo_uri

JWT_SECRET=your_jwt_secret_key

JWT_EXPIRES_IN=1d

npm run dev


cd frontend
npm install

VITE_API_URL=http://localhost:4000/api
VITE_API_WS=http://localhost:4000

npm run dev

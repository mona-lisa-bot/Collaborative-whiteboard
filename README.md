#  Collaborative Whiteboard with Real-Time Drawing

A real-time collaborative whiteboard web application that allows multiple users to draw, write, and interact simultaneously—replicating the experience of a physical whiteboard in the browser.

---

## 🚀 Features

- ✏️ **Drawing Tools**  
  Pen, shapes (rectangle, circle), text tool, eraser, color picker, and selection tool.

- 🔄 **Real-Time Synchronization**  
  Built with **WebSocket** using **Socket.IO** to ensure all users in a room see updates instantly.

- 👥 **Multi-User Collaboration**  
  Share a unique room link (e.g., `/room/:id`) with others for seamless collaboration.

- 🔐 **Access Control**  
  Create **public** or **private** rooms with role-based permissions (Edit/View-only).

- 💾 **Save & Export**  
  Save your whiteboard as an **Image (PNG)** or **PDF**.

- 🧹 **Canvas Management**  
  Undo/Redo actions, and a Clear Canvas button for easy control.

---

## 🧑‍💻 Tech Stack

| Frontend     | Backend            | Hosting         |
|--------------|--------------------|-----------------|
| React.js     | Node.js + Socket.IO| Vercel (Frontend)<br>Render (Backend) |

- **Canvas Rendering**: HTML5 Canvas API  
- **State Management**: Redux + Redux Toolkit  
- **Real-Time**: WebSockets via Socket.IO
- **Bootstrapped With**: [Create React App](https://github.com/facebook/create-react-app)

---
## Created using BoardStorm

 <img width="818" alt="image" src="https://github.com/user-attachments/assets/7cd16664-2bdc-4925-9daa-2e8bfdc46aa8" />
 
---
## 🛠️ Getting Started (Development)

### Prerequisites
Ensure you have Node.js and npm installed.  
Check with:
```bash
node --version
npm -version
```
### 1️⃣ Clone the Repository

To get started with the project on your local machine:

1. Clone the repository from GitHub using the command below.
2. Navigate into the project directory.
```bash
git clone https://github.com/mona-lisa-bot/collaborative-whiteboard.git
cd collaborative-whiteboard
```
### 2️⃣ Backend Setup (Node + Socket.IO)

1. Navigate to the backend directory:
```bash
cd server
```
2. Install dependencies:
```bash
npm install
```
3. Start the backend server:
```bash
node index.js
```
✅ You should see:
Server is running on port 3003

### 3️⃣ Frontend Setup (React App)

1. Open a new terminal window or tab.
2. Navigate to the frontend directory:
```bash
cd my-app
```
3. Install frontend dependencies:
```bash
npm install
```
4. Start the React app:
```bash
npm start
```
✅ The app will open automatically at:
http://localhost:3000


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

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

---

## 🛠️ Getting Started (Development)

### Prerequisites
Ensure you have Node.js and npm installed.  
Check with:
```bash
node --version
npm -version



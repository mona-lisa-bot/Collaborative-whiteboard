const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const server = http.createServer(app);

app.use(cors());
app.use(express.json()); // Needed to parse JSON body in POST

// let elements = [];
const rooms = {};
const roomElements = {};

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


app.post("/api/create-room", (req, res) => {
  const { roomId, owner, isPrivate, allowedUsers, editors } = req.body;

  if (!roomId || !owner) {
    return res.status(400).json({ success: false, message: "Missing roomId or owner" });
  }

  rooms[roomId] = {
    owner,
    isPrivate: !!isPrivate,
    allowedUsers: allowedUsers || [],
    editors: editors || [],
  };

  console.log(`✅ Room created via API: ${roomId}`);
  console.log(rooms[roomId]);

  res.json({ success: true });
});


io.on("connection", (socket) => {
  console.log("user connected:", socket.id);
  // io.to(socket.id).emit("whiteboard-state", elements);

  socket.on("create-room", ({ roomId, isPrivate, allowedUsers, editors }) => {
  rooms[roomId] = {
    isPrivate: !!isPrivate,
    allowedUsers: allowedUsers || [],
    editors: editors || [],
  };
  console.log(`✅ Room created: ${roomId}`);
  console.log(rooms[roomId]);
});

  socket.on("join-room", ({roomId, userId}) => {
    const room = rooms[roomId];
    if (!room) {
      return socket.emit("join-error", "Room does not exist");
    }

    // Validate access
    if (room.isPrivate && !room.allowedUsers.includes(userId) && !room.editors.includes(userId) && room.owner !== userId) {
      return socket.emit("join-error", "Access denied to private room");
    }

    // Assign role
    let role = "viewer";
    if (room.owner === userId || room.editors.includes(userId)) {
      role = "editor";
    }
    socket.join(roomId);
    socket.data.role = role;
    socket.data.userId = userId;
    console.log(`🟢 User joined room: ${roomId} as ${role}`);

    // Send existing elements for the room
    if (!roomElements[roomId]) {
      roomElements[roomId] = [];
    }

    io.to(socket.id).emit("join-success", {
    role,
    whiteboardState: roomElements[roomId],
    });

  });

  socket.on("element-update", ({roomId, elementData}) => {
    // updateElementInElements(elementData);
    const elements = roomElements[roomId];
    if (!elements) return;

    updateElementInElements(elements, elementData);
    socket.to(roomId).emit("remote-element-update", elementData);
  });

  socket.on("whiteboard-clear", (roomId) => {
    roomElements[roomId] = [];

    socket.to(roomId).emit("remote-whiteboard-clear");
  });

  socket.on("cursor-position", ({roomId, cursorData}) => {
    socket.to(roomId).emit("remote-cursor-position", {
      ...cursorData,
      userId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    socket.broadcast.emit("user-disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello server is working");
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log("server is running on port", PORT);
});

const updateElementInElements = (elements, elementData) => {
  const index = elements.findIndex((element) => element.id === elementData.id);

  if (index === -1) return elements.push(elementData);

  elements[index] = elementData;
};
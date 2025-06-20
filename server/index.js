const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const server = http.createServer(app);

app.use(cors());

// let elements = [];
const roomElements = {};

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);
  // io.to(socket.id).emit("whiteboard-state", elements);
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    // Send existing elements for the room
    if (!roomElements[roomId]) {
      roomElements[roomId] = [];
    }

    io.to(socket.id).emit("whiteboard-state", roomElements[roomId]);
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

  socket.on("cursor-position", (roomId, cursorData) => {
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

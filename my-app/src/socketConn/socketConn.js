import { io } from "socket.io-client";
import {
  updateCursorPosition,
  removeCursorPosition,
} from "../CursorOverlay/cursorSlice";
import { store } from "../store/store";
import { setElements, updateElement } from "../Whiteboard/whiteboardSlice";

let socket;



export const connectWithSocketServer = () => {
  socket = io("https://collaborative-whiteboard-tiez.onrender.com/");

  socket.on("connect", () => {
    console.log("connected to socket.io server");
  });

  socket.on("whiteboard-state", (elements) => {
    store.dispatch(setElements(elements));
  });

  socket.on("remote-element-update", (elementData) => {
    store.dispatch(updateElement(elementData));
  });

  socket.on("remote-whiteboard-clear", () => {
    store.dispatch(setElements([]));
  });

  socket.on("remote-cursor-position", (cursorData) => {
    store.dispatch(updateCursorPosition(cursorData));
  });

  socket.on("user-disconnected", (disconnectedUserId) => {
    store.dispatch(removeCursorPosition(disconnectedUserId));
  });
};

export const emitElementUpdate = (elementData, roomId) => {
  socket.emit("element-update", {roomId, elementData});
};

export const emitClearWhiteboard = (roomId) => {
  socket.emit("whiteboard-clear", roomId);
};

export const emitCursorPosition = (cursorData, roomId) => {
  socket.emit("cursor-position", {roomId, cursorData});
};

export const getSocketInstance = () =>socket;

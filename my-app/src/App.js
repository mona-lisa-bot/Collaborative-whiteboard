import React, { useEffect } from "react";
import CursorOverlay from "./CursorOverlay/CursorOverlay";
import { connectWithSocketServer } from "./socketConn/socketConn";
import Whiteboard from "./Whiteboard/Whiteboard";
import {BrowserRouter as Router, Routes, Route, Navigate, useParams,} from "react-router-dom";
import {v4 as uuidv4} from "uuid";

function RoomWrapper() {
  const { roomId } = useParams();

  useEffect(() => {
    connectWithSocketServer(); 
  },[]);

  return (
    <>
      <Whiteboard roomId={roomId} />
      <CursorOverlay />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect to random room if no room specified */}
        <Route path="/" element={<Navigate to={`/room/${uuidv4()}`} />} />
        {/* Room-specific whiteboard */}
        <Route path="/room/:roomId" element={<RoomWrapper />} />
      </Routes>
    </Router>
  );
}


export default App;


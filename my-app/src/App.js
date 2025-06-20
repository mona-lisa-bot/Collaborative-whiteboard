import React, { useEffect } from "react";
import CursorOverlay from "./CursorOverlay/CursorOverlay";
import { connectWithSocketServer } from "./socketConn/socketConn";
import Whiteboard from "./Whiteboard/Whiteboard";

function App() {
  useEffect(() => {
    connectWithSocketServer();
  }, []);

  return (
    <div>
      <Whiteboard />
      <CursorOverlay />
    </div>
  );
}

export default App;

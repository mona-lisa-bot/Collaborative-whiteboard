import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome to the Whiteboard App</h2>
      <Link to="/create">
        <button style={{ marginRight: 10 }}>Create Room</button>
      </Link>
      <Link to="/join">
        <button>Join Room</button>
      </Link>
    </div>
  );
};

export default HomePage;


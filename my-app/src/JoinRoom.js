import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!roomId || !userId) {
      alert("Room ID and User ID are required");
      return;
    }

    localStorage.setItem("userId", userId);
    navigate(`/room/${roomId}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Join a Room</h2>
      <input
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ width: "100%", margin: "5px 0" }}
      />
      <input
        placeholder="Enter Your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{ width: "100%", margin: "5px 0" }}
      />
      <br />
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
};

export default JoinRoom;

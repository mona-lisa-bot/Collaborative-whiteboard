import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPage.css";

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
    <div className="form-wrapper">
        <div className="form-card">
            <h2 >Join a Room</h2>
            <input
                className="input-field"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <input
                className="input-field"
                placeholder="Enter Your User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />

            <button className="button-primary" onClick={handleJoin}>
                Join Room
            </button>
        </div>
    </div>
  );
};

export default JoinRoom;

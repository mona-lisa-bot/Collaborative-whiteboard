// src/CreateRoom.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
const CreateRoom = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowedUsers, setAllowedUsers] = useState("");
  const [editors, setEditors] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const roomId = uuidv4();
    const userId = prompt("Enter your user ID or name");

    const roomData = {
      roomId,
      owner: userId,
      isPrivate,
      allowedUsers: allowedUsers.split(",").map(u => u.trim()).filter(Boolean),
      editors: editors.split(",").map(u => u.trim()).filter(Boolean),
    };

    localStorage.setItem("userId", userId);
    localStorage.setItem("roomMeta", JSON.stringify(roomData));

    // Send room data to backend
  try {
    const res = await fetch("http://localhost:3003/api/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });

    const result = await res.json();
    if (result.success) {
      navigate(`/room/${roomId}`);
    } else {
      alert("Failed to create room: " + result.message);
    }
  } catch (err) {
    console.error("Room creation error:", err);
    alert("Error creating room.");
  }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create a Room</h2>
      <label>
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={() => setIsPrivate(!isPrivate)}
        />{" "}
        Make Room Private
      </label>
      {isPrivate && (
        <>
          <br />
          <input
            placeholder="Allowed Users (comma-separated)"
            value={allowedUsers}
            onChange={(e) => setAllowedUsers(e.target.value)}
            style={{ width: "100%", margin: "5px 0" }}
          />
        </>
      )}
      <br />
      <input
        placeholder="Editor Users (comma-separated)"
        value={editors}
        onChange={(e) => setEditors(e.target.value)}
        style={{ width: "100%", margin: "5px 0" }}
      />
      <br />
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default CreateRoom;

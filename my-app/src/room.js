// src/CreateRoom.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./FormPage.css"; 

const CreateRoom = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowedUsers, setAllowedUsers] = useState("");
  const [editors, setEditors] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const roomId = uuidv4();
    const userId = prompt("Enter your user ID or name");

    const editorList = editors
      .split(",")
      .map((u) => u.trim())
      .filter((u) => u); // remove empty strings

    if (!editorList.includes(userId)) {
      editorList.push(userId); // ✅ Ensure creator is an editor
    }

    const roomData = {
      roomId,
      owner: userId,
      isPrivate,
      allowedUsers: allowedUsers.split(",").map(u => u.trim()).filter(Boolean),
      editors: editorList,
    };

    localStorage.setItem("userId", userId);
    localStorage.setItem("roomMeta", JSON.stringify(roomData));

    // Send room data to backend
  try {
    const res = await fetch("https://collaborative-whiteboard-tiez.onrender.com/api/create-room", {
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
    <div className="form-wrapper" >
      <div className="form-card">
        <h2 >Create a Room</h2>

        <label style={{ display: "block", marginBottom: "10px" }} >
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />{" "}
          Make Room Private
        </label>

        
        {isPrivate && (
            <input
              placeholder="Allowed Users (comma-separated)"
              value={allowedUsers}
              onChange={(e) => setAllowedUsers(e.target.value)}
              className="form-input"
            />
        )}

        <input
          placeholder="Editor Users (comma-separated)"
          value={editors}
          onChange={(e) => setEditors(e.target.value)}
          className="form-input"
        />

        <button className="button-primary" onClick={handleCreateRoom}>
          Create Room
          </button>
        </div>
    </div>
  );
};

export default CreateRoom;

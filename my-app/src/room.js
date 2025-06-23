// src/CreateRoom.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
const CreateRoom = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowedUsers, setAllowedUsers] = useState("");
  const [editors, setEditors] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const roomId = uuidv4();
    const userId = prompt("Enter your user ID or name");

    const roomData = {
      roomId,
      isPrivate,
      allowedUsers: allowedUsers.split(",").map(u => u.trim()),
      editors: editors.split(",").map(u => u.trim()),
    };

    localStorage.setItem("userId", userId);
    localStorage.setItem("roomMeta", JSON.stringify(roomData));

    navigate(`/room/${roomId}`);
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

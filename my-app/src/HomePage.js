import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage-wrapper">
        <div className="homepage-card">
            <h2 className="page-title">Welcome to the Whiteboard App</h2>
            <div className="button-group">
            <Link to="/create">
                <button className="button-primary">Create Room</button>
            </Link>
            <Link to="/join">
                <button className="button-primary">Join Room</button>
            </Link>
            </div>
        </div>
    </div>
  );
};

export default HomePage;


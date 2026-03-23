import React from "react";
import "./Sidebar.css";

const Sidebar = ({
  activeTab,
  setActiveTab,
  setSelectedGame,
  myPlaytests,
}) => {
  return (
    <aside className="sidebar">

      {/* Developer */}
      <div className="sidebar-section">
        <span className="sidebar-label">Developer</span>

        
        <button
          className={`nav-btn ${activeTab === "Create Form" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("Create Form");
            setSelectedGame(null);
          }}
        >
          Create Form
        </button>
      </div>

      {/* Player */}
      <div className="sidebar-section">
        <span className="sidebar-label">Player</span>

        <button
          className={`nav-btn ${activeTab === "Explore" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("Explore");
            setSelectedGame(null);
          }}
        >
          Explore
        </button>
        <button
          className={`nav-btn ${activeTab === "My Playtests" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("My Playtests");
            setSelectedGame(null);
          }}
        >
          My Playtests ({myPlaytests.length})
        </button>
        <button
          className={`nav-btn ${activeTab === "Follow" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("Follow");
            setSelectedGame(null);
          }}
        >
          Follow
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
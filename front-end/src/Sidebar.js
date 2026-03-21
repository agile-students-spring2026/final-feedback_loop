import React from "react";
import "./Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab, setSelectedGame, myPlaytests, }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <span className="sidebar-label">Library</span>

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
          className={`nav-btn ${
            activeTab === "My Playtests" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("My Playtests");
            setSelectedGame(null);
          }}
        >
          My Playtests ({myPlaytests.length})
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
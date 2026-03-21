import React from "react";
import "./Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <span className="sidebar-label">Library</span>

        <button
          className={`nav-btn ${activeTab === "Explore" ? "active" : ""}`}
          onClick={() => setActiveTab("Explore")}
        >
          Explore
        </button>
        <button
          className={`nav-btn ${
            activeTab === "My Playtests" ? "active" : ""
          }`}
          onClick={() => setActiveTab("My Playtests")}
        >
          My Playtests
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
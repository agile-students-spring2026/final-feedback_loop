import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <span className="sidebar-label">Library</span>

        <button className="nav-btn">Explore</button>
        <button className="nav-btn">My Playtests</button>
      </div>
    </aside>
  );
};

export default Sidebar;
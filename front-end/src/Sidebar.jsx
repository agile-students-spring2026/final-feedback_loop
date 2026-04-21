import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ myPlaytests = [], isOpen, close }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNav = (path) => {
    navigate(path);
    close?.();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={close} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-section">
          <span className="sidebar-label">Developer</span>

          <button
            className={`nav-btn ${isActive("/devdash") ? "active" : ""}`}
            onClick={() => handleNav("/devdash")}>
            Dashboard
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Player</span>

          <button
            className={`nav-btn ${isActive("/explore") ? "active" : ""}`}
            onClick={() => handleNav("/explore")}>
            Explore
          </button>

          <button
            className={`nav-btn ${isActive("/following") ? "active" : ""}`}
            onClick={() => handleNav("/following")}>
            Following
          </button>

          <button
            className={`nav-btn ${isActive("/notifications") ? "active" : ""}`}
            onClick={() => handleNav("/notifications")}>
            Notifications
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Account</span>

          <button
            className={`nav-btn ${isActive("/settings") ? "active" : ""}`}
            onClick={() => handleNav("/settings")}>
            Settings
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
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
            className={`nav-btn ${isActive("/create") ? "active" : ""}`}
            onClick={() => handleNav("/createProjectForm")}>
            Create Form
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
            className={`nav-btn ${isActive("/my-playtests") ? "active" : ""}`}
            onClick={() => handleNav("/my-playtests")}>
            My Playtests ({myPlaytests.length})
          </button>

          <button
            className={`nav-btn ${isActive("/follow") ? "active" : ""}`}
            onClick={() => handleNav("/following")}>
            Follow
          </button>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
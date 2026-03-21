import React from "react";
import "./ProjectDetails.css";

const ProjectDetails = ({ game, setActiveTab, handleJoinPlaytest }) => {
  if (!game) return null;

  return (
    <div className="project-wrapper">
      {/* Header */}
      <div className="launcher-header">
        <button
          className="back-btn"
          onClick={() => setActiveTab("Explore")}
        >
          Back
        </button>

        <span className="launcher-title">Game Launcher</span>

        <div className="header-spacer" />
      </div>

      {/* Content */}
      <div className="content-area">
        <div className="top-grid">

          <div className="left-col">
            <div className="section-box">
              LEFT CONTENT
            </div>
          </div>
          
          <div className="right-col">
            <div className="config-block">
              CONFIG
            </div>

            <div className="action-box">
              ACTIONS
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
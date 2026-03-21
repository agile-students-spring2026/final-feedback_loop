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
    </div>
  );
};

export default ProjectDetails;
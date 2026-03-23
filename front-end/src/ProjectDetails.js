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

      <div className="content-area">
        <div className="top-grid">

          <div className="left-col">
            <div className="section-box">
              <span className="label">
                PROJECT NAME: {game.title}
              </span>

              <div className="project-img">
                PROJECT IMG
              </div>
            </div>
          </div>

          <div className="right-col">
            <div className="config-block">
              <span className="label">Configuration</span>

              <div className="dropdown">
                VERSION: {game.version}
              </div>

              <div className="dropdown">
                STATUS: ACTIVE
              </div>
            </div>

            <div className="action-box">
              <span className="label">Launch Options</span>

              <button
                className="action-btn"
                onClick={() => handleJoinPlaytest(game)}
              >
                Playtest Link
              </button>

              <button className="action-btn secondary">
                Download Client
              </button>
            </div>
          </div>

        </div>

        {/* Patch Notes */}
        <div className="patch-box">

          <div className="patch-header">
            <div className="patch-tag">
              BUILD {game.version}
            </div>

            <h3>Patch Notes</h3>
          </div>

          <p className="patch-text">
            {game.description}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;
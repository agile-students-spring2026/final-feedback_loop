import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "./AppLayout";
import "./ProjectDetails.css";
import { games } from "./mockData";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const game = games.find((g) => String(g.id) === String(id));

  if (!game) {
    return (
      <AppLayout>
        <div style={{ padding: "40px" }}>Game not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout myPlaytests={[]}>
      <div className="project-wrapper">
        <div className="launcher-header">
          <button className="back-btn" onClick={() => navigate("/explore")}>Back</button>
          <span className="launcher-title">Game Launcher</span>
          <div className="header-spacer" />
        </div>
        <div className="content-area">
          <div className="top-grid">

            <div className="left-col">
              <div className="section-box">
                <span className="label">PROJECT NAME: {game.title}</span>
                {/* <div className="project-img">PROJECT IMG</div> */}
                <img
                  src="https://picsum.photos/seed/alpha/600/400"
                  alt={game.title}
                  className="project-img"
                />
              </div>
            </div>

            <div className="right-col">
              <div className="config-block">
                <span className="label">Configuration</span>
                <div className="dropdown">VERSION: {game.version}</div>
                <div className="dropdown">STATUS: ACTIVE</div>
              </div>

              <div className="action-box">
                <span className="label">Launch Options</span>
                <button className="action-btn"onClick={() => alert("Launching playtest...")}>Playtest Link</button>
                <button className="action-btn secondary">Download Client</button>
              </div>
            </div>

          </div>

          <div className="patch-box">
            <div className="patch-header">
              <div className="patch-tag">BUILD {game.version}</div>
              <h3>Patch Notes</h3>
            </div>
            <p className="patch-text">
              {game.description}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "./AppLayout";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/games/${id}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setGame(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (notFound) {
    return (
      <AppLayout>
        <div style={{ padding: "40px" }}>Game not found.</div>
      </AppLayout>
    );
  }

  if (!game) {
    return (
      <AppLayout>
        <div style={{ padding: "40px" }}>Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout myPlaytests={[]}>
      <div className="project-wrapper">
        <div className="launcher-header">
          <button
            className="back-btn"
            onClick={() => navigate("/explore")}
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
                <span className="label">PROJECT NAME: {game.title}</span>
                <img
                  src={game.image}
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
                <button
                  className="action-btn"
                  onClick={() => alert("Launching playtest...")}
                >
                  Playtest Link
                </button>
                <button className="action-btn secondary">
                  Download Client
                </button>
              </div>
            </div>

          </div>

          <div className="patch-box">
            <div className="patch-header">
              <div className="patch-tag">BUILD {game.version}</div>
              <h3>Patch Notes</h3>
            </div>
            <p className="patch-text">
              {game.description}. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;

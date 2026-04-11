import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "./AppLayout";
import "./ProjectDetails.css";

const API = "http://localhost:7002";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API}/explore/projects/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error("Failed to load project:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <AppLayout><div style={{ padding: 40 }}>Loading...</div></AppLayout>;
  if (notFound || !game) return <AppLayout><div style={{ padding: 40 }}>Game not found.</div></AppLayout>;

  return (
    <AppLayout>
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
                <span className="label">PROJECT NAME: {game.name}</span>
                <img
                  src="https://picsum.photos/seed/alpha/600/400"
                  alt={game.name}
                  className="project-img"
                />
              </div>
            </div>
            <div className="right-col">
              <div className="config-block">
                <span className="label">Configuration</span>
                <div className="dropdown">VERSION: v0.1</div>
                <div className="dropdown">STATUS: {game.status}</div>
              </div>
              <div className="action-box">
                <span className="label">Launch Options</span>
                <button className="action-btn" onClick={() => alert("Launching playtest...")}>
                  Playtest Link
                </button>
                <button className="action-btn secondary">Download Client</button>
              </div>
            </div>
          </div>
          <div className="patch-box">
            <div className="patch-header">
              <div className="patch-tag">BUILD v0.1</div>
              <h3>Patch Notes</h3>
            </div>
            <p className="patch-text">
              {game.description}. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;
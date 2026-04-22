import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "./AppLayout";
import "./ProjectDetails.css";
import { apiFetch } from "./api";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await apiFetch(`/explore/projects/${id}`);
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
                <span className="label">PROJECT NAME: {game.title}</span>
                <img
                  src={game.coverPreview || "https://picsum.photos/seed/alpha/600/400"}
                  alt={game.title}
                  className="project-img"
                />
              </div>
            </div>
            <div className="right-col">
              <div className="config-block">
                <span className="label">Configuration</span>
                <div className="dropdown">VERSION: {game.version || "v0.1"}</div>
                <div className="dropdown">STATUS: {game.visibility}</div>
              </div>
              <div className="action-box">
                <span className="label">Launch Options</span>

                {game.uploadType === "url" && game.uploadUrl ? (
                  <a
                    href={game.uploadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn"
                    style={{ textDecoration: "none", textAlign: "center" }}
                  >
                    Playtest Link
                  </a>
                ) : (
                  <button
                    className="action-btn"
                    disabled
                    style={{ opacity: 0.4, cursor: "not-allowed" }}
                  >
                    Playtest Link
                  </button>
                )}

                {game.uploadType === "download" && game.uploadFile ? (
                  <a
                    href={game.uploadFile}
                    download
                    className="action-btn secondary"
                    style={{ textDecoration: "none", textAlign: "center" }}
                  >
                    Download Client
                  </a>
                ) : (
                  <button
                    className="action-btn secondary"
                    disabled
                    style={{ opacity: 0.4, cursor: "not-allowed" }}
                  >
                    Download Client
                  </button>
                )}

              </div>
            </div>
          </div>
          <div className="patch-box">
            <div className="patch-header">
              <div className="patch-tag">BUILD {game.version || "v0.1"}</div>
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
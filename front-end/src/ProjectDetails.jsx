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

  if (loading)
    return (
      <AppLayout>
        <div style={{ padding: 40 }}>Loading...</div>
      </AppLayout>
    );
  if (notFound || !game)
    return (
      <AppLayout>
        <div style={{ padding: 40 }}>Game not found.</div>
      </AppLayout>
    );

  return (
    <AppLayout>
      <div className="project-wrapper">
        <div className="launcher-header">
          <button className="back-btn" onClick={() => navigate("/explore")}>
            Back
          </button>
          <span className="launcher-title">{game.title}</span>
          <div className="header-spacer" />
        </div>
        <div className="content-area">
          <div className="hero-box">
            <img
              src={
                game.coverImage ||
                `https://picsum.photos/seed/${game.id}/1200/500`
              }
              alt={game.title}
              className="hero-img"
            />
          </div>
          <div className="top-grid">
            <div className="left-col">
              <div className="config-block">
                <span className="label">About</span>
                <p className="game-description">
                  {game.description || "No description provided."}
                </p>

                <div className="meta-row">
                  {game.genre?.label && (
                    <span className="meta-tag">{game.genre.label}</span>
                  )}
                  {Array.isArray(game.tags) &&
                    game.tags.map((tag) => (
                      <span key={tag.value} className="meta-tag">
                        {tag.label}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="right-col">
              <div className="config-block">
                <span className="label">Configuration</span>
                <div className="dropdown">VERSION: {game.version}</div>
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
                    Playtest Now
                  </a>
                ) : (
                  <button
                    className="action-btn"
                    disabled
                    style={{ opacity: 0.4, cursor: "not-allowed" }}
                  >
                    Playtest Now
                  </button>
                )}

                {game.uploadType === "download" && game.uploadFile ? (
                  <a
                    href={game.uploadFile}
                    download
                    className="action-btn secondary"
                    style={{ textDecoration: "none", textAlign: "center" }}
                  >
                    Download
                  </a>
                ) : (
                  <button
                    className="action-btn secondary"
                    disabled
                    style={{ opacity: 0.4, cursor: "not-allowed" }}
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;

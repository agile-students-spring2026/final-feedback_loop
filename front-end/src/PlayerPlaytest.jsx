import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PlayerPlaytest.css";
import AppLayout from "./AppLayout";
import { apiFetch } from "./api";

const PlayerPlaytest = () => {
  const navigate = useNavigate();
  const [playtests, setPlaytests] = useState([]);
  const [formsByProject, setFormsByProject] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playtestRes = await apiFetch(`/playtests`);
        const playtestData = await playtestRes.json();
        setPlaytests(Array.isArray(playtestData) ? playtestData : []);

        const entries = await Promise.all(
          (Array.isArray(playtestData) ? playtestData : []).map(async (p) => {
            const res = await apiFetch(`/feedback/${p.projectId}`);
            const data = res.ok ? await res.json() : [];
            return [p.projectId, data.filter((f) => f.status === "Active")];
          })
        );
        setFormsByProject(Object.fromEntries(entries));
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLeave = async (projectId) => {
    await apiFetch(`/playtests/${projectId}`, { method: "DELETE" });
    setPlaytests((prev) => prev.filter((p) => p.projectId !== projectId));
  };

  if (loading)
    return (
      <AppLayout>
        <p style={{ padding: 40 }}>Loading...</p>
      </AppLayout>
    );

  return (
    <AppLayout>
      <header className="header">
        <h1 className="h1">My Playtests</h1>
      </header>

      {playtests.length === 0 ? (
        <div className="empty">
          <p className="emptyText">
            No playtests yet. Join one from Explore!
          </p>
        </div>
      ) : (
        <div className="libraryGrid">
          {playtests.map((game) => {
            const activeForms = formsByProject[game.projectId] || [];
            return (
              <div key={game.id} className="libraryCard">
                <img
                  src={
                    game.coverPreview ||
                    "https://picsum.photos/seed/alpha/300/200"
                  }
                  alt={game.title}
                  className="thumbBox"
                />
                <div className="libraryBody">
                  <div>
                    <div className="libraryTop">
                      <span>{game.title}</span>
                      <span className="versionBox">{game.version}</span>
                    </div>
                    <div className="statusBox">
                      <span className="statusText">
                        {activeForms.length === 0
                          ? "No active forms"
                          : `${activeForms.length} active form${activeForms.length === 1 ? "" : "s"}`}
                      </span>
                    </div>
                  </div>

                  {activeForms.length > 0 && (
                    <div className="btnGroup">
                      {activeForms.map((f) => (
                        <button
                          key={f.formId}
                          className="btn btnPrimary"
                          onClick={() =>
                            navigate(`/feedback-form/${f.formId}`)
                          }
                        >
                          Submit: {f.title}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="btnGroup">
                    <button
                      className="btn btnPrimary"
                      onClick={() => navigate(`/playtest/${game.projectId}`)}
                    >
                      Launch
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleLeave(game.projectId)}
                    >
                      Leave
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default PlayerPlaytest;

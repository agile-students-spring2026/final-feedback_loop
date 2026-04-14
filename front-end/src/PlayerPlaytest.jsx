import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PlayerPlaytest.css";
import AppLayout from "./AppLayout";

const API = "http://localhost:7002";

const PlayerPlaytest = () => {
  const navigate = useNavigate();
  const [playtests, setPlaytests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeForms, setActiveForms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playtestRes = await fetch(`${API}/playtests`);
        const playtestData = await playtestRes.json();
        setPlaytests(playtestData);

        const feedbackResults = await Promise.all(
          playtestData.map((p) =>
            fetch(`${API}/feedback/${p.projectId}`).then((r) => r.json()),
          ),
        );

        const allFeedbacks = feedbackResults.flat();
        setActiveForms(allFeedbacks.filter((f) => f.status === "Active"));
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLeave = async (projectId) => {
    try {
      await fetch(`${API}/playtests/${projectId}`, { method: "DELETE" });
      setPlaytests((prev) => prev.filter((p) => p.projectId !== projectId));
    } catch (err) {
      console.error("Failed to leave playtest:", err);
    }
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
          <p className="emptyText">No active playtests found.</p>
        </div>
      ) : (
        <div className="libraryGrid">
          {playtests.map((game) => {
            const activeForm = activeForms.find(
              (f) => f.projectId == game.projectId,
            );
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
                      <span className="statusText">Registered</span>
                    </div>
                  </div>
                  <div className="btnGroup">
                    <button className="btn btnPrimary">Launch</button>
                    {activeForm && (
                      <button
                        className="btn"
                        onClick={() =>
                          navigate(`/feedback-form/${activeForm.formId}`)
                        }
                      >
                        Leave Feedback
                      </button>
                    )}
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

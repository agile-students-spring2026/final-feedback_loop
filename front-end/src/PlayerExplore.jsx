import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import "./PlayerExplore.css";

const API = "http://localhost:7002";

const PlayerExplore = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [joinedIds, setJoinedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, playtestsRes] = await Promise.all([
          fetch(`${API}/explore/projects`),
          fetch(`${API}/playtests`),
        ]);
        const gamesData = await gamesRes.json();
        const playtestsData = await playtestsRes.json();

        setGames(gamesData);
        setJoinedIds(new Set(playtestsData.map((p) => String(p.projectId))));
      } catch (err) {
        console.error("Failed to load explore data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJoinPlaytest = async (game) => {
    try {
      const res = await fetch(`${API}/playtests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: game.id }),
      });

      if (res.ok || res.status === 409) {
        setJoinedIds((prev) => new Set([...prev, String(game.id)]));
        navigate("/my-playtests");
      }
    } catch (err) {
      console.error("Failed to join playtest:", err);
    }
  };

  if (loading) return <AppLayout><p style={{ padding: 40 }}>Loading...</p></AppLayout>;

  return (
    <AppLayout>
      <header className="header">
        <h1 className="h1">Explore Projects</h1>
      </header>

      <div className="grid">
        {games.map((game) => {
          const isJoined = joinedIds.has(String(game.id));

          return (
            <div
              key={game.id}
              className="card"
              onClick={() => navigate(`/playtest/${game.id}`)}
            >
              <img
                src={game.coverPreview || "https://picsum.photos/seed/alpha/300/200"}
                alt="preview"
                className="cardThumb"
              />
              <div className="cardBody">
                <div className="cardTitleRow">
                  <h3 className="cardTitle">{game.title}</h3>
                  {isJoined && <span className="versionBox">ACTIVE</span>}
                </div>
                <p className="cardDesc">{game.description}</p>
                <div className="btnGroup">
                  <button
                    className={`btn ${isJoined ? "btnPrimary" : ""}`}
                    disabled={isJoined}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinPlaytest(game);
                    }}
                  >
                    {isJoined ? "Joined" : "Join Test"}
                  </button>
                  <button
                    className="btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/playtest/${game.id}`);
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default PlayerExplore;
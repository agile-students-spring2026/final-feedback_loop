import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import "./PlayerExplore.css";
import { apiFetch } from "./api";
import { loadFollows, toggleFollow } from "./follows";

const PlayerExplore = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [joinedIds, setJoinedIds] = useState(new Set());
  const [followedIds, setFollowedIds] = useState(loadFollows());
  const [loading, setLoading] = useState(true);

  const handleToggleFollow = (projectId) => {
    setFollowedIds(toggleFollow(projectId));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, playtestsRes] = await Promise.all([
          apiFetch(`/explore/projects`),
          apiFetch(`/playtests`),
        ]);
        const gamesData = await gamesRes.json();
        const playtestsData = await playtestsRes.json();
        setGames(Array.isArray(gamesData) ? gamesData : []);
        setJoinedIds(
          new Set(
            (Array.isArray(playtestsData) ? playtestsData : []).map((p) =>
              String(p.projectId)
            )
          )
        );
      } catch (err) {
        console.error("Failed to load explore data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoinPlaytest = async (game) => {
    const res = await apiFetch(`/playtests`, {
      method: "POST",
      body: JSON.stringify({ projectId: game.id }),
    });
    if (res.ok || res.status === 409) {
      setJoinedIds((prev) => new Set([...prev, String(game.id)]));
      navigate("/my-playtests");
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
        <h1 className="h1">Explore Projects</h1>
      </header>

      <div className="grid">
        {games.map((game) => {
          const isJoined = joinedIds.has(String(game.id));
          const isFollowing = followedIds.includes(game.id);
          return (
            <div key={game.id} className="card">
              <img
                src={
                  game.coverPreview ||
                  "https://picsum.photos/seed/alpha/300/200"
                }
                alt="preview"
                className="cardThumb"
              />
              <div className="cardBody">
                <div className="cardTitleRow">
                  <h3 className="cardTitle">{game.title}</h3>
                  {isJoined && <span className="versionBox">JOINED</span>}
                </div>
                <p className="cardDesc">{game.description}</p>
                <div className="btnGroup">
                  <button
                    className={`btn ${isJoined ? "btnPrimary" : ""}`}
                    disabled={isJoined}
                    onClick={() => handleJoinPlaytest(game)}
                  >
                    {isJoined ? "Joined" : "Join Test"}
                  </button>
                  <button
                    className={`btn ${isFollowing ? "btnPrimary" : ""}`}
                    onClick={() => handleToggleFollow(game.id)}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <button
                    className="btn"
                    onClick={() => navigate(`/playtest/${game.id}`)}
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

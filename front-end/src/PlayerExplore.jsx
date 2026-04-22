import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import "./PlayerExplore.css";
import { apiFetch } from "./api";
import { loadFollows, toggleFollow } from "./follows";

const PlayerExplore = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [followedIds, setFollowedIds] = useState(loadFollows());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [genreOption, setGenreOption] = useState([]);

  const handleToggleFollow = (projectId) => {
    setFollowedIds(toggleFollow(projectId));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesRes = await apiFetch(`/explore/projects`);
        const gamesData = await gamesRes.json();
        const optionsRes = await apiFetch("/options");
        const optionsData = await optionsRes.json();

        setGenreOption(optionsData.genreOption || []);
        setGames(Array.isArray(gamesData) ? gamesData : []);
      } catch (err) {
        console.error("Failed to load explore data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <AppLayout>
        <p style={{ padding: 40 }}>Loading...</p>
      </AppLayout>
    );

  const filteredGames = games
    .filter((game) => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre =
          selectedGenre === "All" ||
          (game.genre && game.genre.value === selectedGenre);
        return matchesSearch && matchesGenre;
      })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


  return (
    <AppLayout>
      <header className="headerExplore">
        <h1 className="h1">Explore Projects</h1>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by project name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchInput"
        />
         <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="dropdown"
        >
          <option value="All">All</option>
          {genreOption.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.label}
            </option>
          ))}
        </select> 

      </div>

      <div className="grid">
        {filteredGames.length === 0 ? (
          <p> No projects currently posted in this genre.</p>
        ) : (
        filteredGames.map((game) => {
          const isFollowing = followedIds.includes(game.id);
          return (
            <div key={game.id} className="card">
              <img
                src={game.coverPreview || "https://picsum.photos/seed/alpha/300/200"}
                alt="preview"
                className="cardThumb"
              />
              <div className="cardBody">
                <div className="cardTitleRow">
                  <h3 className="cardTitle">{game.title}</h3>
                </div>
                <p className="cardDesc">{game.description}</p>
                <div className="btnGroup">
                  <button
                    className={`btn ${isFollowing ? "btnFollowing" : ""}`}
                    onClick={() => handleToggleFollow(game.id)}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <button
                    className="btn"
                    onClick={() => navigate(`/project/${game.id}`)}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
      </div>
    </AppLayout>
  );
};

export default PlayerExplore;
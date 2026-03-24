import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import "./PlayerExplore.css";

const PlayerExplore = () => {
  const navigate = useNavigate();

  const [myPlaytests, setMyPlaytests] = useState([]);

  const [games] = useState([
    { id: 1, title: "Pixel Quest", description: "Retro puzzle adventure", genre: "Adventure" },
    { id: 2, title: "Rogue Galaxy", description: "Roguelike RPG", genre: "RPG" },
    { id: 3, title: "Puzzle Mania", description: "Brain teasers", genre: "Puzzle" },
    { id: 4, title: "Cyber Drift", description: "Neon racing", genre: "Racing" },
    { id: 5, title: "Mystic Isle", description: "Survival mystery", genre: "Survival" },
  ]);

  const handleJoinPlaytest = (game) => {
    if (!myPlaytests.find((p) => p.id === game.id)) {
      setMyPlaytests([...myPlaytests, { ...game, version: "v0.1", joined: true }]);
    }

    navigate("/my-playtests");
  };

  return (
    <AppLayout>
      <header className="header">
        <h1 className="h1">Explore Projects</h1>
      </header>

      <div className="grid">
        {games.map((game) => {
          const isJoined = myPlaytests.some((p) => p.id === game.id);

          return (
            <div
              key={game.id}
              className="card"
              onClick={() => navigate(`/playtest/${game.id}`)}
            >
              <img
                src="https://picsum.photos/seed/alpha/300/200"
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import "./PlayerExplore.css";

const PlayerExplore = () => {
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [myPlaytests, setMyPlaytests] = useState([]);

  useEffect(() => {
    fetch("/games")
      .then((res) => res.json())
      .then(setGames)
      .catch((err) => console.error(err));
  }, []);

  const handleJoinPlaytest = (game) => {
    if (myPlaytests.find((p) => p.id === game.id)) {
      navigate("/my-playtests");
      return;
    }

    fetch("/playtests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(game),
    })
      .then((res) => res.json())
      .then((data) => {
        setMyPlaytests([...myPlaytests, { ...game, ...data }]);
        navigate("/my-playtests");
      })
      .catch((err) => console.error(err));
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
                src={game.image}
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

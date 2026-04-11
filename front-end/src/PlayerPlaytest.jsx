import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlayerPlaytest.css";
import AppLayout from "./AppLayout";

const PlayerPlaytest = () => {
  const navigate = useNavigate();
  const [playtests, setPlaytests] = useState([]);

  useEffect(() => {
    fetch("/playtests")
      .then((res) => res.json())
      .then(setPlaytests)
      .catch((err) => console.error(err));
  }, []);

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
          {playtests.map((game) => (
            <div key={game.id} className="libraryCard">

              <img
                src={game.image}
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
                  <button className="btn btnPrimary">
                    Launch
                  </button>

                  <button
                    className="btn"
                    onClick={() => navigate("/feedback-form")}
                  >
                    Leave Feedback
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </AppLayout>
  );
};

export default PlayerPlaytest;

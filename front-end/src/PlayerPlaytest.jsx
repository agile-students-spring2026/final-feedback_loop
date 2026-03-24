import React from "react";
import { useNavigate } from "react-router-dom";
import "./PlayerPlaytest.css";
import AppLayout from "./AppLayout";

const PlayerPlaytest = () => {
  const navigate = useNavigate();
  const myPlaytests = [
    { id: 101, title: "Neon Drift Test Build", description: "Early racing prototype", version: "v0.1" },
    { id: 102, title: "Puzzle Alpha", description: "Logic puzzle system test", version: "v0.2" },
    { id: 103, title: "Survival Island Build", description: "Core survival mechanics", version: "v0.3" }
  ];

  return (
    <AppLayout>

      <header className="header">
        <h1 className="h1">My Playtests</h1>
      </header>

      {myPlaytests.length === 0 ? (
        <div className="empty">
          <p className="emptyText">No active playtests found.</p>
        </div>
      ) : (
        <div className="libraryGrid">
          {myPlaytests.map((game) => (
            <div key={game.id} className="libraryCard">

              {/* <div className="thumbBox">
                <span className="thumbText">Thumb</span>
              </div> */}

              <img
                src="https://picsum.photos/seed/alpha/300/200"
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

                  <button className="btn" onClick={() => navigate("/feedback-form")}>
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
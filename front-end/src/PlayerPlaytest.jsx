import React from "react";
import "./PlayerPlaytest.css";
import AppLayout from "./AppLayout";

const PlayerPlaytest = () => {
  const myPlaytests = [
    { id: 101, title: "Neon Drift Test Build", description: "Early racing prototype", version: "v0.1" },
    { id: 102, title: "Puzzle Alpha", description: "Logic puzzle system test", version: "v0.2" },
    { id: 103, title: "Survival Island Build", description: "Core survival mechanics", version: "v0.3" }
  ];

  return (
    <AppLayout myPlaytests={myPlaytests}>

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

              <div className="thumbBox">
                <span className="thumbText">Thumb</span>
              </div>

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

                  <button className="btn">
                    Feedback
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
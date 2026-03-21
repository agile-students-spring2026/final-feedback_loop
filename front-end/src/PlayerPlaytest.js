import React from "react";
import "./PlayerPlaytest.css";

const PlayerPlaytest = ({ activeTab, setActiveTab, setSelectedGame, games, handleJoinPlaytest, myPlaytests, }) => {
  if (activeTab === "My Playtests") {
    return (
      <div>
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
                    <button className="btn btnPrimary">Launch</button>
                    <button className="btn">Feedback</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div>
      <header className="header">
        <h1 className="h1">Explore Projects</h1>
      </header>

      <div className="grid">
        {games.map((game) => {
          const isJoined = myPlaytests.find((p) => p.id === game.id);

          return (
            <div
              key={game.id}
              className="card"
              onClick={() => {
                setSelectedGame(game);
                setActiveTab("Playtest Detail");
              }}
            >
              <div className="cardThumb">
                <span className="thumbText">Preview</span>
              </div>

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

                  <button className="btn" onClick={(e) => e.stopPropagation()}>
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default PlayerPlaytest;
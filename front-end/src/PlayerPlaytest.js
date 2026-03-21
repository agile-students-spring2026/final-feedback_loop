import React from "react";

const PlayerPlaytest = ({ activeTab, games, handleJoinPlaytest, myPlaytests, }) => {
  if (activeTab === "My Playtests") {
    return (
      <div>
        <h1>My Playtests</h1>

        {myPlaytests.length === 0 ? (
          <p>No active playtests found.</p>
        ) : (
          myPlaytests.map((game) => (
            <div key={game.id}>
              <h3>{game.title}</h3>
              <button>Launch</button>
              <button>Feedback</button>
            </div>
          ))
        )}
      </div>
    );
  }
  return (
    <div>
      <h1>Explore Projects</h1>
        {games.map((game) => (
          <div key={game.id}>
            <h3>{game.title}</h3>

            <button onClick={() => handleJoinPlaytest(game)}>
              Join Test
            </button>
          </div>
        ))}
      </div>
  );
};


export default PlayerPlaytest;
import React from "react";

const PlayerPlaytest = ({ games, handleJoinPlaytest }) => {
  return (
    <div>
      <h1>Explore Projects</h1>
      <div>
        {games.map((game) => (
          <div key={game.id}>
            <h3>{game.title}</h3>
            <p>{game.description}</p>

            <button onClick={() => handleJoinPlaytest(game)}>
              Join Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerPlaytest;
import React from "react";

const PlayerPlaytest = ({ games }) => {
  return (
    <div>
      <h1>Explore Projects</h1>
      <div>
        {games.map((game) => (
          <div key={game.id}>
            <h3>{game.title}</h3>
            <p>{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerPlaytest;
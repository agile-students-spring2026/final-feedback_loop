import React, { useState } from "react";
import PlayerPlaytest from "./PlayerPlaytest";
import ProjectDetails from "./ProjectDetails";
import Sidebar from "./Sidebar";

const PlayerExplore = () => {
  const [activeTab, setActiveTab] = useState("Explore");
  const [selectedGame, setSelectedGame] = useState(null);
  const [myPlaytests, setMyPlaytests] = useState([]);

  const [games] = useState([
    { id: 1, title: "Pixel Quest" },
    { id: 2, title: "Rogue Galaxy" },
    { id: 3, title: "Puzzle Mania" }
  ]);

  const handleJoinPlaytest = (game) => {
    setMyPlaytests([...myPlaytests, game]);
    setActiveTab("My Playtests");
  };

  return (
    <div>
      <nav>[ LOGO ]</nav>

      <div style={{ display: "flex" }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedGame={setSelectedGame}
          myPlaytests={myPlaytests}
        />

        <main>
          {activeTab === "Playtest Detail" && selectedGame ? (
            <ProjectDetails game={selectedGame} />
          ) : (
            <PlayerPlaytest
              games={games}
              myPlaytests={myPlaytests}
              handleJoinPlaytest={handleJoinPlaytest}
            />
          )}
        </main>
      </div>

      <footer>Footer</footer>
    </div>
  );
};

export default PlayerExplore;
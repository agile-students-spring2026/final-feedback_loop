import React, { useState } from "react";
import PlayerPlaytest from "./PlayerPlaytest";
import ProjectDetails from "./ProjectDetails";
import Sidebar from "./Sidebar";
import "./PlayerExplore.css";

const PlayerExplore = () => {
  const [activeTab, setActiveTab] = useState("Explore");
  const [selectedGame, setSelectedGame] = useState(null);
  const [myPlaytests, setMyPlaytests] = useState([]);

  const [games] = useState([
    { id: 1, title: "Pixel Quest", description: "Retro puzzle adventure", genre: "Adventure" },
    { id: 2, title: "Rogue Galaxy", description: "Roguelike RPG", genre: "RPG" },
    { id: 3, title: "Puzzle Mania", description: "Brain teasers", genre: "Puzzle" },
    { id: 4, title: "Cyber Drift", description: "Neon racing", genre: "Racing" },
    { id: 5, title: "Mystic Isle", description: "Survival mystery", genre: "Survival" },
  ]);

  const handleJoinPlaytest = (game) => {
    if (!myPlaytests.find(p => p.id === game.id)) {
      setMyPlaytests([...myPlaytests, { ...game, joined: true }]);
    }
    setActiveTab("My Playtests");
  };

  return (
    <div className="container">
      <nav className="nav">
        <div className="logo">[ LOGO ]</div>
      </nav>

      <div className="layout">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedGame={setSelectedGame}
          myPlaytests={myPlaytests}
        />

        <main className="main">
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

      <footer className="footer">
        <span className="footer-text">Footer</span>
      </footer>
    </div>
  );
};

export default PlayerExplore;
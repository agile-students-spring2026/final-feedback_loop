import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FollowingPage.css";
import AppLayout from "./AppLayout";

const FollowingPage = () => {
  const navigate = useNavigate();

  const [games, setGames] = useState([
    {
      id: 1,
      title: "Project Alpha",
      developer: "Studio 1",
      image: "https://picsum.photos/seed/alpha/300/200",
      isNew: true,
      description: "Puzzle game. New level added.",
      time: "2 hours ago",
      following: true,
    },
    {
      id: 2,
      title: "Project Beta",
      developer: "Studio 2",
      image: "https://picsum.photos/seed/beta/300/200",
      isNew: true,
      description: "Dungeon crawler. Kill stuff and get loot.",
      time: "5 hours ago",
      following: true,
    },
    {
      id: 3,
      title: "Project Gamma",
      developer: "Studio 3",
      image: "https://picsum.photos/seed/gamma/300/200",
      isNew: false,
      description: "Platformer. Still in early alpha.",
      time: "1 day ago",
      following: true,
    },
    {
      id: 4,
      title: "Project Delta",
      developer: "Studio 4",
      image: "https://picsum.photos/seed/delta/300/200",
      isNew: false,
      description: "PvP action game.",
      time: "3 days ago",
      following: true,
    },
  ]);

  const handleFollow = (id) => {
    setGames(
      games.map((game) => {
        if (game.id === id) {
          return { ...game, following: !game.following };
        }
        return game;
      })
    );
  };

  return (
    <AppLayout>
      <div className="followPage">
        <header className="followHeader">
          <h1 className="followH1">Latest Activity</h1>
        </header>

        <div className="followList">
          {games.map((game) => (
            <div key={game.id} className="followCard">
              <div className="followCardTop">
                <img src={game.image} alt={game.title} className="followCardImg" />
                <div className="followCardInfo">
                  <div className="followCardTitleRow">
                    <span
                      className="followCardTitle"
                      onClick={() => navigate("/game-feedback")}
                    >
                      {game.title}
                    </span>
                  </div>
                  {game.isNew && <span className="followNewTag">NEW</span>}
                  <span className="followCardDev">{game.developer}</span>
                  <span className="followCardTime">{game.time}</span>
                </div>
              </div>

              <p className="followCardDesc">{game.description}</p>

              <div className="followBtnGroup">
                <button
                  className={`followBtn ${game.following ? "followBtnActive" : ""}`}
                  onClick={() => handleFollow(game.id)}
                >
                  {game.following ? "Following" : "Follow"}
                </button>
                <button
                  className="followBtn followBtnPrimary"
                  onClick={() => navigate("/feedback-form")}
                >
                  Leave Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default FollowingPage;

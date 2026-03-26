import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FollowingPage.css";
import AppLayout from "./AppLayout";
import { followedGames } from "./mockData";

const FollowingPage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState(followedGames);

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

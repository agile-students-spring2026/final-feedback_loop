import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FollowingPage.css";
import AppLayout from "./AppLayout";

const FollowingPage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("/following")
      .then((res) => res.json())
      .then(setGames)
      .catch((err) => console.error(err));
  }, []);

  const handleFollow = (id) => {
    const game = games.find((g) => g.id === id);
    if (!game) return;

    const updated = { ...game, following: !game.following };

    fetch(`/following/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch((err) => console.error(err));

    setGames(games.map((g) => (g.id === id ? updated : g)));
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
                <img
                  src={game.image}
                  alt={game.title}
                  className="followCardImg"
                />
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

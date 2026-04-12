import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationCenter.css";
import AppLayout from "./AppLayout";

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [projectUpdates, setProjectUpdates] = useState([]);

  useEffect(() => {
    fetch("/notifications")
      .then((res) => res.json())
      .then(setNotifications)
      .catch((err) => console.error(err));

    fetch("/updates")
      .then((res) => res.json())
      .then(setProjectUpdates)
      .catch((err) => console.error(err));
  }, []);

  const handleDismiss = (id) => {
    fetch(`/notifications/${id}`, { method: "DELETE" })
      .catch((err) => console.error(err));
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <AppLayout>
    <div className="notifPage">
      <header className="header">
          <h1 className="h1">Notification Center</h1>
        </header>

      <div className="notifBody">
        {notifications.map((notification) => (
          <div key={notification.id} className="notifRow">
            <span className="notifMessage">{notification.message}</span>
            <div className="notifActions">
              {notification.type === "feedback" && (
                <button
                  className="notifBtn notifBtnPrimary"
                  onClick={() => navigate("/game-feedback")}
                >
                  Reply
                </button>
              )}
              <button
                className="notifBtn notifBtnPrimary"
                onClick={() => handleDismiss(notification.id)}
              >
                {notification.type === "feedback" ? "Like" : "Dismiss"}
              </button>
            </div>
          </div>
        ))}

        <div className="notifSectionHeader">
          <h2 className="notifSectionTitle">Followed Project Updates</h2>
          <button
            className="notifBtn notifBtnPrimary"
            onClick={() => navigate("/following")}
          >
            SEE ALL
          </button>
        </div>

        {projectUpdates.map((project) => (
          <div key={project.id} className="notifCard">
            <div className="notifCardTop">
              <img
                src={project.image}
                alt={project.title}
                className="notifCardImg"
              />
              <div className="notifCardInfo">
                <div className="notifCardTitleRow">
                  <span
                    className="notifCardTitle"
                    onClick={() => navigate("/game-feedback")}
                  >
                    {project.title}
                  </span>
                </div>
              </div>
            </div>
            <span className="notifCardDev">{project.developer}</span>
            <span className="notifCardTime">{project.time}</span>
            <p className="notifCardDesc">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
    </AppLayout>
  );
};

export default NotificationCenter;

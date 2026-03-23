import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationCenter.css";

const NotificationCenter = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Player #1 started following your project",
      type: "follow",
    },
    {
      id: 2,
      message: "Player #2 submitted feedback on your project",
      type: "feedback",
    },
    {
      id: 3,
      message: "Player #3 started following your project",
      type: "follow",
    },
  ]);

  const [projectUpdates] = useState([
    {
      id: 1,
      title: "Project Alpha",
      developer: "Studio 1",
      image: "https://picsum.photos/seed/alpha/300/200",
      time: "Updated at 2:30 PM",
      description: "Added level 4. Fixed a bug.",
    },
    {
      id: 2,
      title: "Project Beta",
      developer: "Studio 2",
      image: "https://picsum.photos/seed/beta/300/200",
      time: "Updated at 11:00 AM",
      description: "Changed enemy spawns. Added new weapons.",
    },
  ]);

  const handleDismiss = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="notifPage">
      <div className="notifHeaderBar">Notification Center</div>

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
          <button className="notifBtn notifBtnPrimary">SEE ALL</button>
        </div>

        {projectUpdates.map((project) => (
          <div key={project.id} className="notifCard">
            <div className="notifCardTop">
              <img src={project.image} alt={project.title} className="notifCardImg" />
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
  );
};

export default NotificationCenter;

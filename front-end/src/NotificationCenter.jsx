import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationCenter.css";
import AppLayout from "./AppLayout";
import { apiFetch } from "./api";
import { loadFollows } from "./follows";

const NotificationCenter = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [projectUpdates, setProjectUpdates] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [loadingUpdates, setLoadingUpdates] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await apiFetch("/notifications");
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const loadProjectUpdates = async () => {
    try {
      const projectsRes = await apiFetch("/explore/projects");
      const projectsData = await projectsRes.json();

      const followedIds = new Set(loadFollows());

      const followedProjects = (Array.isArray(projectsData) ? projectsData : []).filter(
        (p) => followedIds.has(p.id)
      );

      const updateEntries = await Promise.all(
        followedProjects.map(async (project) => {
          const logsRes = await apiFetch(`/devlogs/${project.id}`);
          const logsData = logsRes.ok ? await logsRes.json() : [];
          const logs = Array.isArray(logsData) ? logsData : [];

          if (logs.length === 0) return null;

          const latestLog = logs.sort(
            (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
          )[0];

          return {
            id: project.id,
            projectId: project.id,
            title: project.title,
            image:
              project.coverPreview ||
              `https://picsum.photos/seed/${project.id}/300/200`,
            developer: project.ownerUsername || "Developer",
            time: latestLog.date || "",
            description: latestLog.notes || "New devlog posted",
          };
        })
      );

      setProjectUpdates(updateEntries.filter(Boolean));
    } catch (err) {
      console.error("Failed to load project updates:", err);
    } finally {
      setLoadingUpdates(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    loadProjectUpdates();
  }, []);

  useEffect(() => {
    const handler = () => {
      loadProjectUpdates();
    };

    window.addEventListener("followsUpdated", handler);
    return () => window.removeEventListener("followsUpdated", handler);
  }, []);

  const handleDismiss = async (id) => {
    try {
      const res = await apiFetch(`/notifications/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error("Failed to dismiss notification:", err);
    }
  };


  return (
    <AppLayout>
      <div className="notifPage">
        <header className="header">
          <h1 className="h1">Notification Center</h1>
        </header>

        <div className="notifBody">
          
          {!loadingNotifications && notifications.length === 0 && (
            <p>No active notifications.</p>
          )}

          {loadingNotifications && <p>Loading notifications...</p>}

          {notifications.map((notification) => (
            <div key={notification.id} className="notifRow">
              <span className="notifMessage">{notification.message}</span>

              <div className="notifActions">
                {notification.type === "feedback" && (
                  <button
                    className="notifBtn notifBtnPrimary"
                    onClick={() =>
                      navigate(`/game-feedback/${notification.projectId}`)
                    }
                  >
                    View
                  </button>
                )}

                <button
                  className="notifBtn notifBtnPrimary"
                  onClick={() => handleDismiss(notification.id)}
                >
                  Dismiss
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
              Follow more projects
            </button>
          </div>

          {loadingUpdates && <p>Loading project updates...</p>}

          {!loadingUpdates && projectUpdates.length === 0 && (
            <p>No updates yet. Follow more projects to see developer updates.</p>
          )}

          {projectUpdates.map((project) => (
            
              <div className="notifDevlogs">
                  <h4 className="notifDevlogsTitle">{project.title}'s Dev Log Entry  </h4>
                      <span className="notifCardDev">{project.developer}</span>
                      <span className="notifCardTime">{project.time}</span>
                      <p className="notifDevlogNotes">{project.description}</p>
                      
                </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default NotificationCenter;
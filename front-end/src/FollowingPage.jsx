import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FollowingPage.css";
import AppLayout from "./AppLayout";
import { apiFetch } from "./api";
import { loadFollows, toggleFollow as toggleFollowFn } from "./follows";
import formIcon from "../src/assets/form.svg";

const FollowingPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [followedIds, setFollowedIds] = useState(loadFollows());
  const [logsByProject, setLogsByProject] = useState({});
  const [formsByProject, setFormsByProject] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const projRes = await apiFetch(`/explore/projects`);
        const projData = await projRes.json();
        if (cancelled) return;
        const all = Array.isArray(projData) ? projData : [];
        setProjects(all);

        const followed = all.filter((p) => loadFollows().includes(p.id));

        const [logEntries, formEntries] = await Promise.all([
          Promise.all(
            followed.map(async (p) => {
              const res = await apiFetch(`/devlogs/${p.id}`);
              const data = res.ok ? await res.json() : [];
              return [p.id, Array.isArray(data) ? data : []];
            })
          ),
          Promise.all(
            followed.map(async (p) => {
              const res = await apiFetch(`/feedback/${p.id}`);
              const data = res.ok ? await res.json() : [];
              return [p.id, data.filter((f) => f.status === "Active")];
            })
          ),
        ]);

        if (cancelled) return;
        setLogsByProject(Object.fromEntries(logEntries));
        setFormsByProject(Object.fromEntries(formEntries));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const toggleFollow = (id) => setFollowedIds(toggleFollowFn(id));

  const followedProjects = projects.filter((p) => followedIds.includes(p.id));

  return (
    <AppLayout>
      <div className="followPage">
        <header className="followHeader">
          <h1 className="followH1">Following</h1>
        </header>

        {loading && <p>Loading…</p>}
        {!loading && followedProjects.length === 0 && (
          <p>You're not following any projects yet. Head to Explore to find some!</p>
        )}

        <div className="followList">
          {followedProjects.map((game) => {
            const logs = logsByProject[game.id] || [];
            const activeForms = formsByProject[game.id] || [];
            return (
              <div key={game.id} className="followCard">
                <div className="followCardTop">
                  <img
                    src={game.coverPreview || `https://picsum.photos/seed/${game.id}/300/200`}
                    alt={game.title}
                    className="followCardImg"
                  />
                  <div className="followCardInfo">
                    <div className="followCardTitleRow">
                      <span
                        className="followCardTitle"
                        onClick={() => navigate(`/game-feedback/${game.id}`)}
                      >
                        {game.title}
                      </span>

                      {activeForms.length === 1 && (
                        <button
                          className="formBadge"
                          onClick={() => navigate(`/feedback-form/${activeForms[0].formId}`)}
                          title="Submit feedback form"
                        >
                          <span className="formIconBox">
                            <img src={formIcon} alt="" className="formIcon" />
                          </span>
                          Form
                        </button>
                      )}
                      {activeForms.length > 1 && (
                        <div className="formBadgeGroup">
                          {activeForms.map((f, i) => (
                            <button
                              key={f.formId}
                              className="formBadge"
                              onClick={() => navigate(`/feedback-form/${f.formId}`)}
                              title={f.title}
                            >
                              <span className="formIconBox">
                                <img src={formIcon} alt="" className="formIcon" />
                              </span>
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="followCardDev">{game.genre?.label || ""}</span>
                    <span className="followCardTime">{game.lastUpdated}</span>
                  </div>
                </div>

                <p className="followCardDesc">{game.description}</p>

                <div className="followDevlogs">
                  <h4 className="followDevlogsTitle">Dev Logs</h4>
                  {logs.length === 0 ? (
                    <p className="followEmpty">No dev logs yet.</p>
                  ) : (
                    logs.slice(0, 3).map((log) => (
                      <div key={log.id} className="followDevlog">
                        <p className="followDevlogMeta">
                          <strong>{log.teamMember}</strong>
                          {log.date ? ` · ${log.date}` : ""}
                        </p>
                        <p className="followDevlogNotes">{log.notes}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="followBtnGroup">
                  <button
                    className="followBtn followBtnPrimary"
                    onClick={() => navigate(`/game-feedback/${game.id}`)}
                  >
                    View Comments
                  </button>
                  <button
                    className="followBtn followBtnActive"
                    onClick={() => toggleFollow(game.id)}
                  >
                    Unfollow
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default FollowingPage;
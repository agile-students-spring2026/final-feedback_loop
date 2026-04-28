import "./ProjectInfo.css";
import projectImg from "./assets/projectIcon.png";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "./api";
import DevLog from "./DevLog";

function ProjectInfo() {
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();

  const [project, setProject] = useState({});
  const [devLogs, setDevLogs] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "info");
  const [showLogForm, setShowLogForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleActivate = (formId) => {
    const hasActive = feedback.some((f) => f.status === "Active");
    if (hasActive) {
      alert(
        "There is already an active feedback form for this project. Please close it first.",
      );
      return;
    }

    apiFetch(`/createfeedback/${formId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Active" }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setFeedback((prev) => prev.map((f) => (f.id === formId ? updated : f)));
      });
  };

  const handleClose = (formId) => {
    apiFetch(`/createfeedback/${formId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Closed" }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setFeedback((prev) => prev.map((f) => (f.id === formId ? updated : f)));
      });
  };

  const handleDelete = async () => {
    await apiFetch(`/projects/${id}`, { method: "DELETE" });
    setShowDeleteConfirm(false);
    setDeleteSuccess(true);
  };

  useEffect(() => {
    apiFetch(`/projects/${id}`)
      .then((res) => res.json())
      .then(setProject);

    apiFetch(`/devlogs/${id}`)
      .then((res) => res.json())
      .then(setDevLogs);

    apiFetch(`/feedback/${id}`)
      .then((res) => res.json())
      .then(setFeedback);
  }, [id]);

  return (
    <div className="container">
      <nav className="nav">
        <div className="logo">[ LOGO ]</div>
      </nav>

      <div className="layout">
        <main className="projMain">
          <div className="projectPage">
            <button className="backButton" onClick={() => navigate(`/devdash`)}>
              Back
            </button>

            <div className="projHeader">
              <div className="headerText">
                <p className="welcome">Welcome to</p>
                <h1>{project.title}</h1>
                <p className="lastUpdated">
                  Last updated: {project.lastUpdated}
                </p>
              </div>

              <img src={projectImg} alt="Project Icon" className="projIcon" />
            </div>

            <div className="tabBar">
              <button
                className={`tabBtn ${activeTab === "info" ? "tabActive" : ""}`}
                onClick={() => setActiveTab("info")}
              >
                Project Info
              </button>
              <button
                className={`tabBtn ${activeTab === "logs" ? "tabActive" : ""}`}
                onClick={() => setActiveTab("logs")}
              >
                Developer Logs
              </button>
              <button
                className={`tabBtn ${activeTab === "feedback" ? "tabActive" : ""}`}
                onClick={() => setActiveTab("feedback")}
              >
                Feedback
              </button>
            </div>

            {activeTab === "info" && (
              <section className="projectSection">
                <p>
                  <strong>Description:</strong> {project.description}
                </p>

                <p>
                  <strong>Genre:</strong> {project.genre?.label}
                </p>

                <p>
                  <strong>Tag:</strong>{" "}
                  {project.tags?.map((t) => t.label).join(", ")}
                </p>

                <p>
                  <strong>Visibility:</strong> {project.visibility}
                </p>

                <p>
                  <strong>Version:</strong> {project.version || "v0.1"}
                </p>

                <button
                  className="plainButton"
                  onClick={() => navigate(`/editProjectInfo/${id}`)}
                >
                  Edit project info
                </button>
                <button
                  className="plainButton"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Project
                </button>
              </section>
            )}

            {activeTab === "logs" && (
              <section className="projectSection">
                {devLogs.map((log) => (
                  <div key={log.id} className="logSection">
                    <p className="logNum">
                      <strong>Submission Date:</strong> {log.date}
                    </p>
                    <p className="logAuthor">
                      <strong>Submitted by:</strong> {log.teamMember}
                    </p>
                    <p>{log.notes}</p>
                  </div>
                ))}

                <button
                  className="plainButton"
                  onClick={() => setShowLogForm((prev) => !prev)}
                >
                  {showLogForm ? "Cancel" : "Create New Developer Log"}
                </button>

                {showLogForm && (
                  <DevLog
                    projectId={id}
                    onSuccess={(newLog) => {
                      setDevLogs((prev) => [...prev, newLog]);
                      setShowLogForm(false);
                    }}
                  />
                )}
              </section>
            )}

            {activeTab === "feedback" && (
              <section className="projectSection">
                {["Active", "Draft", "Closed"].map((status) => {
                  const filtered = feedback.filter((f) => f.status === status);
                  if (filtered.length === 0) return null;
                  return (
                    <div key={status} className="feedbackGroup">
                      <h3 className="feedbackGroupTitle">{status}</h3>

                      {filtered.map((f) => (
                        <div className="feedbackSection" key={f.id}>
                          <div className="feedbackHeader">
                            <div className="formTitle">{f.title}</div>
                            <div className="formStats">
                              Responses: {f.responseCount}
                            </div>
                          </div>
                          <div className="feedbackActions">
                            {f.status === "Draft" && (
                              <button onClick={() => handleActivate(f.id)}>
                                Activate
                              </button>
                            )}
                            {f.status === "Active" && (
                              <button onClick={() => handleClose(f.id)}>
                                Close
                              </button>
                            )}
                            {f.status === "Closed" && (
                              <button onClick={() => handleActivate(f.id)}>
                                Reactivate
                              </button>
                            )}
                            <button
                              onClick={() =>
                                navigate(`/feedback-results/${f.id}`)
                              }
                            >
                              View Responses
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}

                <button
                  className="plainButton"
                  onClick={() => navigate(`/createNewFeedback/${id}`)}
                >
                  Create New Form
                </button>
              </section>
            )}
          </div>
        </main>
      </div>


      {showDeleteConfirm && (
        <div className="cnf-discard-overlay">
          <div className="cnf-discard-box">
            <p className="cnf-discard-msg">Are you sure you want to delete this project? This cannot be undone.</p>
            <div className="cnf-discard-actions">
              <button className="plainButton" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="plainButton cnf-discard-confirm" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteSuccess && (
        <div className="cnf-discard-overlay">
          <div className="cnf-discard-box">
            <p className="cnf-discard-msg">Your project has been deleted.</p>
            <div className="cnf-discard-actions">
              <button className="plainButton" onClick={() => navigate("/devdash")}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectInfo;
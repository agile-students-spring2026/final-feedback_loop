import "./ProjectInfo.css";
import projectImg from "./assets/projectIcon.png";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProjectInfo() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [project, setProject] = useState({});
  const [devLogs, setDevLogs] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    // project
    fetch(`http://localhost:7002/projects/${id}`)
      .then((res) => res.json())
      .then(setProject);

    // dev logs
    fetch(`http://localhost:7002/devlogs/${id}`)
      .then((res) => res.json())
      .then(setDevLogs);

    // feedback
    fetch(`http://localhost:7002/feedback/${id}`)
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

            <section className="projectSection">
              <h2>Project Info</h2>
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
                <strong>Status:</strong> {project.status}
              </p>

              <button
                className="plainButton"
                onClick={() => navigate(`/editProjectInfo/${id}`)}
              >
                Edit project info
              </button>
              <button
                className="plainButton"
                onClick={() => {
                  fetch(`http://localhost:7002/projects/${id}`, {
                    method: "DELETE",
                  }).then(() => navigate(`/devdash`));
                }}
              >
                Delete Project
              </button>
            </section>

            <section className="projectSection">
              <h2>Developer Logs</h2>
              {devLogs.map((log) => (
                <div key={log.id} className="logSection">
                  <p className="logNum">
                    <strong>Dev Log</strong> #{log.id}
                  </p>
                  <p className="logAuthor">
                    <strong>Submitted by:</strong> {log.teamMember}
                  </p>
                  <p>{log.notes}</p>
                </div>
              ))}

              <button
                className="plainButton"
                onClick={() => navigate(`/devlog/${id}`)}
              >
                Create New Developer Log
              </button>
            </section>

            <section className="projectSection">
              <h2>Feedback</h2>

              {feedback.map((f) => (
                <div className="feedbackSection" key={f.id}>
                  <div className="formTitle">{f.title}</div>

                  <div className="formStats">
                    <span>Status: {f.status}</span>
                    <span>Responses: {f.responseCount}</span>
                  </div>

                  <div className="feedbackActions">
                    <button>Close</button>
                    <button>View Responses</button>
                  </div>
                </div>
              ))}

              <button
                className="plainButton"
                onClick={() => navigate(`/createNewFeedback/${id}`)}
              >
                Create New Form
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProjectInfo;

import "./ProjectInfo.css";
import projectImg from "./assets/projectIcon.png";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProjectInfo() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState({});
  const [devLogs, setDevLogs] = useState([]);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    fetch(`/projects/${id}`)
      .then((res) => res.json())
      .then(setProject)
      .catch((err) => console.error(err));

    fetch(`/devlogs/${id}`)
      .then((res) => res.json())
      .then(setDevLogs)
      .catch((err) => console.error(err));

    fetch(`/feedback/${id}`)
      .then((res) => res.json())
      .then(setFeedback)
      .catch((err) => console.error(err));
  }, [id]);

  const handleDelete = () => {
    fetch(`/projects/${id}`, { method: "DELETE" })
      .then(() => navigate("/devdash"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="container">
      <nav className="nav">
        <div className="logo">[ LOGO ]</div>
      </nav>

      <div className="layout">
        <main className="projMain">
          <div className="projectPage">
            <button
              className="backButton"
              onClick={() => navigate("/devdash")}
            >
              Back
            </button>

            <div className="projHeader">
              <div className="headerText">
                <p className="welcome">Welcome to</p>
                <h1>{project.name}</h1>
                <p className="lastUpdated">
                  Last updated: {project.lastUpdated}
                </p>
              </div>

              <img
                src={projectImg}
                alt="Project Icon"
                className="projIcon"
              />
            </div>

            <section className="projectSection">
              <h2>Project Info</h2>
              <p>
                <strong>Description:</strong> {project.description}
              </p>

              <p>
                <strong>Genre:</strong> {project.genre}
              </p>

              <p>
                <strong>Tag:</strong>{" "}
                {project.tags ? project.tags.join(", ") : ""}
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
              <button className="plainButton" onClick={handleDelete}>
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
                    <strong>Submitted by:</strong> {log.author}
                  </p>
                  <p>{log.content}</p>
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
              <div className="feedbackSection">
                <div className="formTitle">{feedback.title}</div>

                <div className="formStats">
                  <span>Status: {feedback.status}</span>
                  <span>Responses: {feedback.responses}</span>
                </div>

                <div className="feedbackActions">
                  <button>Close</button>
                  <button>View Responses</button>
                </div>
              </div>

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

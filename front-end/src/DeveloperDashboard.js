import "./DeveloperDashboard.css";
import projectImg from "./assets/projectIcon.png";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";

function DeveloperDashboard() {
  const navigate = useNavigate();

  const projects = [
    { id: 1, name: "Project #1", status: "PUBLISHED" },
    { id: 2, name: "Project #2", status: "DRAFT" },
    { id: 3, name: "Project #3", status: "PUBLISHED" },
  ];

  return (
    <AppLayout>
      <div className="dashboard">
        <header className="header">
          <h1 className="h1">Explore Projects</h1>
        </header>
        {projects.map((project) => (
          <div key={project.id} className="projectContainer">
            <div className="entry">
              <img src={projectImg} alt="Project Icon" className="mainIcon" />

              <div className="details">
                <button className="name" onClick={() => navigate("/project")}>
                  {project.name}
                </button>
                <span className="status">{project.status}</span>
              </div>
            </div>

            <div className="actions">
              <button onClick={() => navigate("/editProjectInfo")}>Edit</button>
              <button onClick={() => navigate("/game-feedback")}>
                Feedback
              </button>
              <button onClick={() => navigate("/devlog")}>DevLog</button>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate("/createProjectForm")}
          className="basic-button"
          type="button"
        >
          Create New Project
        </button>
      </div>
    </AppLayout>
  );
}

export default DeveloperDashboard;

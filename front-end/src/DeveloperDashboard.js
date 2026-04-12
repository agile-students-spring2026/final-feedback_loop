import { useEffect, useState } from "react";
import "./DeveloperDashboard.css";
import projectImg from "./assets/projectIcon.png";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";


function DeveloperDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  useEffect(() => {
  fetch("http://localhost:7002/projects")
    .then(res => res.json())
    .then(data => {
      console.log("PROJECTS:", data); // debug
      setProjects(data);
    })
    .catch(err => console.error("FETCH ERROR:", err));
}, []);

  return (
    <AppLayout>
      {/* <div className="dashboard"> */}
      <div>
        <header className="header">
          <h1 className="h1">Explore Projects</h1>
        </header>
        {projects.map((project) => (
          <div key={project.id} className="projectContainer">
            <div className="entry">
              <img 
                src={project.coverPreview || projectImg} 
                alt="Project Icon" 
                className="mainIcon" 
              />

              <div className="details">
                <button className="name" onClick={() => navigate(`/devproject/${project.id}`)}>
                  {project.title}
                </button>
                <span className="status">{project.visibility}</span>
              </div>
            </div>

            <div className="actions">
              <button onClick={() => navigate(`/editProjectInfo/${project.id}`)}>Edit</button>
              <button onClick={() => navigate("/game-feedback")}>
                Feedback
              </button>
              <button onClick={() => navigate(`/devlog/${project.id}`)}>DevLog</button>
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

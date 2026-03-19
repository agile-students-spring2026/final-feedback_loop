import { useState } from "react";
import "./DeveloperDashboard.css";
import projectImg from "./assets/projectIcon.png";
import { useNavigate } from "react-router-dom";

function DeveloperDashboard() {
  const [selectedView, setSelectedView] = useState("developer");
  const navigate = useNavigate();
  const projects = [
    { id: 1, name: "Project #1", status: "PUBLISHED" },
    { id: 2, name: "Project #2", status: "DRAFT" },
    { id: 3, name: "Project #3", status: "PUBLISHED" },
  ];
  return (
    <div className="dashboard">
      <div className="profileToggle">
        <button
          className={selectedView === "developer" ? "toggleOption active" : "toggleOption"}
          onClick={() => setSelectedView("developer")}
        >
          Developer
        </button>
        <button
          className={selectedView === "player" ? "toggleOption active" : "toggleOption"}
          onClick={() => setSelectedView("player")}
        >
          Player
        </button>
      </div>

      {projects.map((project) => (
        <div key={project.id} className="projectContainer">
          <div className="entry">
            <img src={projectImg} alt="Project Icon" className="mainIcon" />

            <div className="details">
              <button className="name" onClick={() => navigate("/project")} > {project.name} </button>
              <span className="status">{project.status}</span>
            </div>
          </div>

          <div className="actions">
            <button>Edit</button>
            <button>Feedback</button>
            <button onClick={() => navigate("/devlog")}>DevLog</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DeveloperDashboard;
import { useEffect, useState } from "react";
import "./DeveloperDashboard.css";
import projectImg from "./assets/projectIcon.png";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import { apiFetch } from "./api";


function DeveloperDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
  apiFetch("/projects")
    .then(res => res.json())
    .then(data => {
      console.log("PROJECTS:", data); // debug
      setProjects(data);
    })
    .catch(err => console.error("FETCH ERROR:", err));
}, []);

  const sortedProjects = [...projects].sort((a, b) => {
  if (sortOption === "newest") {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }
  if (sortOption === "oldest") {
    return new Date(a.createdAt) - new Date(b.createdAt);
  }
  if (sortOption === "az") {
    return a.title.localeCompare(b.title);
  } 
  return 0;
});
  
  return (
    <AppLayout>
      {/* <div className="dashboard"> */}
      <div>
        <header className="headerDev">
          <h1 className="h1">Your Projects</h1>
        </header>

        <div className="controls">
        <input
          type="text"
          placeholder="Search by project name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchInput"
        />
         <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="dropdown"
        >
          <option value="newest">Newest → Oldest</option>
          <option value="oldest">Oldest → Newest</option>
          <option value="az">A → Z</option>
        </select>

      </div>

        {sortedProjects.map((project) => (
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
              <button onClick={() => navigate(`/devproject/${project.id}`, { state: { tab: "info" } })}>Info</button>
              <button onClick={() => navigate(`/devproject/${project.id}`, { state: { tab: "logs" } })}>DevLog</button>
              <button onClick={() => navigate(`/devproject/${project.id}`, { state: { tab: "feedback" } })}>Feedback</button>
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

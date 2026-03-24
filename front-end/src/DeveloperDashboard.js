import { useState } from "react";
import "./DeveloperDashboard.css";
import "./Sidebar.css";
import projectImg from "./assets/projectIcon.png";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function DeveloperDashboard() {
  const [selectedView, setSelectedView] = useState("developer");
  const [activeTab, setActiveTab] = useState("Create Form");
  const [selectedGame, setSelectedGame] = useState(null);
  const [myPlaytests] = useState([]);
  const navigate = useNavigate();

  const projects = [
    { id: 1, name: "Project #1", status: "PUBLISHED" },
    { id: 2, name: "Project #2", status: "DRAFT" },
    { id: 3, name: "Project #3", status: "PUBLISHED" },
  ];

  return (
    <div className="container">


      <nav className="nav">
        <div className="logo">[ LOGO ]</div>
      </nav>

      <div className="layout">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedGame={setSelectedGame}
          myPlaytests={myPlaytests}
        />

        <main className="main">
          <div className="dashboard">
             <header className="header">
              <h1 className="h1">Explore Projects</h1>
            </header>
            {projects.map((project) => (
              <div key={project.id} className="projectContainer">
                <div className="entry">
                  <img
                    src={projectImg}
                    alt="Project Icon"
                    className="mainIcon"
                  />

                  <div className="details">
                    <button
                      className="name"
                      onClick={() => navigate("/project")}
                    >
                      {project.name}
                    </button>
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
        </main>
      </div>

    </div>
  );
}

export default DeveloperDashboard;
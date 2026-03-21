import "./ProjectInfo.css";
import projectImg from "./assets/projectIcon.png";
import { useNavigate } from "react-router-dom";

function ProjectInfo() {
  const navigate = useNavigate();
  return (
    
    <div className="projectPage">
      <button className="backButton" onClick={() => navigate("/")}> Back </button>

      <div className="header">
        <div className="headerText">
          <p className="welcome">Welcome to</p>
          <h1>My Project</h1>
          <p className="lastUpdated">Last updated: mm/dd/yyyy</p>
        </div>

        <img src={projectImg} alt="Project Icon" className="projIcon" />
      </div>

      <section className="projectSection">
        <h2>Project Info</h2>
        <p><strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum euismod non lacus vel congue. Lorem ipsum dolor sit amet, consectetur.</p>
        <p><strong>Genre:</strong> Action</p>
        <p><strong>Tag:</strong> Horror, 2D</p>
        <p><strong>Status:</strong> PUBLISHED</p>
        
        <button className="plainButton">Edit project info</button>
        <button className="plainButton">Delete Project</button>
      </section>

      <section className="projectSection">
        <h2>Developer Logs</h2>
        <div className="logSection">
          <p className="logNum"><strong>Dev Log</strong> #23413</p>
          <p className="logAuthor"><strong>Submitted by:</strong> @teammember</p>
          <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum euismod non lacus vel congue. Lorem ipsum dolor sit amet, consectetur. </p>
        </div>

        <button 
            className="plainButton"
            onClick={() => navigate("/devlog")}
            >Create New Developer Log</button>
      </section>

      <section className="projectSection">
        <h2>Feedback</h2>
        <div className="feedbackSection">
          <div className="formTitle">Form Title</div>
          
          <div className="formStats">
            <span>Status: Ongoing</span>
            <span>Responses: 45</span>
          </div>

          <div className="feedbackActions">
            <button>Close</button>
            <button>View Responses</button>
          </div>
        </div>

        <button className="plainButton">Create New Form</button>
      </section>
    </div>
  );
}

export default ProjectInfo;
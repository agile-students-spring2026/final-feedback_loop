import { useNavigate } from "react-router-dom";
import projectImg from "./assets/projectIcon.png";
import "./DevLog.css";
import AppLayout from "./AppLayout";

function DevLog() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="devlog">
        <button className="backButton" onClick={() => navigate("/project")}>
          Back
        </button>

        <div className="devHeader">
          <div className="headerText">
            <p className="welcome">Welcome to</p>
            <h1>My Project</h1>
            <p className="lastUpdated">Last updated: mm/dd/yyyy</p>
          </div>

          <img src={projectImg} alt="Project Icon" className="projIcon" />
        </div>

        <div className="devlogSection">
          <h2>Submit Dev Log</h2>

          <label>Team member</label>
          <input type="text" placeholder="@Margot" />

          <label>Submission Date</label>
          <input type="text" placeholder="mm/dd/yyyy" />

          <label>Developer Notes</label>
          <textarea placeholder="Enter notes here..." />

          <button className="plainButton">Save Changes</button>
        </div>
      </div>
    </AppLayout>
  );
}

export default DevLog;

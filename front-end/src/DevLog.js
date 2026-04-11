import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import projectImg from "./assets/projectIcon.png";
import "./DevLog.css";
import AppLayout from "./AppLayout";

function DevLog() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    fetch("/devlogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: id,
        author,
        date,
        content,
      }),
    })
      .then((res) => res.json())
      .then(() => navigate(`/devproject/${id}`))
      .catch((err) => console.error(err));
  };

  return (
    <AppLayout>
      <div className="devlog">
        <button
          className="backButton"
          onClick={() => navigate(`/devproject/${id}`)}
        >
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
          <input
            type="text"
            placeholder="@Margot"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <label>Submission Date</label>
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Developer Notes</label>
          <textarea
            placeholder="Enter notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button className="plainButton" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

export default DevLog;

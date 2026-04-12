import { useState } from "react";
import { useNavigate } from "react-router-dom";
import projectImg from "./assets/projectIcon.png";
import "./DevLog.css";
import AppLayout from "./AppLayout";
import { useParams } from "react-router-dom";

function DevLog() {
  const navigate = useNavigate();

  const [teamMember, setTeamMember] = useState("");

  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const { id } = useParams();

  const handleSubmit = () => {
  // 🔹 1. Username must start with @
  if (!teamMember.startsWith("@")) {
    alert("Username must start with '@'");
    return;
  }

  // 🔹 2. Date must be valid
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    alert("Please enter a valid date (mm/dd/yyyy)");
    return;
  }

  // 🔹 3. Notes cannot be empty
  if (!notes.trim()) {
    alert("Developer notes cannot be empty");
    return;
  }

  // ✅ If all checks pass → submit
  fetch("http://localhost:7002/devlogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      projectId: id,
      teamMember,
      date,
      notes
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Saved:", data);
      alert("Dev log saved successfully!");
      navigate(`/devproject/${id}`);
    })
    .catch(err => console.error(err));
};

  return (
    <AppLayout>
      <div className="devlog">
        <button className="backButton" onClick={() => navigate(`/devproject/${id}`)}>
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
            value={teamMember}
            onChange={(e) => setTeamMember(e.target.value)}
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button className="plainButton" onClick={handleSubmit}>
            Submit Dev Log
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

export default DevLog;

import { useState } from "react";
import { apiFetch } from "./api";
import "./DevLog.css"

function DevLogForm({ projectId, onSuccess }) {
  const [teamMember, setTeamMember] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!teamMember.startsWith("@")) {
      alert("Username must start with '@'");
      return;
    }
    if (!notes.trim()) {
      alert("Developer notes cannot be empty");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    apiFetch("/devlogs", {
      method: "POST",
      body: JSON.stringify({ projectId, teamMember, date: today, notes }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTeamMember("");
        setNotes("");
        onSuccess(data); // 通知父组件提交成功，把新 log 传回去
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="devlogSection">
      <label>Team Member</label>
      <input
        type="text"
        placeholder="@developer"
        value={teamMember}
        onChange={(e) => setTeamMember(e.target.value)}
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
  );
}

export default DevLogForm;
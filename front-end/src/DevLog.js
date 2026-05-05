import { useState } from "react";
import { apiFetch } from "./api";
import "./DevLog.css";

function DevLogForm({ projectId, onSuccess, onCancel }) {
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!notes.trim()) {
      alert("Developer notes cannot be empty");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    apiFetch("/devlogs", {
      method: "POST",
      body: JSON.stringify({ projectId, date: today, notes }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes("");
        onSuccess(data);

      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="devlogSection">
      <label>Developer Notes</label>
      <textarea
        placeholder="Enter notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button className="plainButton" onClick={handleSubmit}>
        Submit Dev Log
      </button>

      <button className="plainButton" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

export default DevLogForm;
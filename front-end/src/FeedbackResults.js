import "./ProjectInfo.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "./api";

function FeedbackResults() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("stats"); // "stats" | "byUser"

  useEffect(() => {
    Promise.all([
      apiFetch(`/createfeedback/${id}`).then(r => r.json()),
      apiFetch(`/feedback-result/${id}`).then(r => r.json()),
    ]).then(([formData, resultsData]) => {
      setForm(formData);
      setResults(resultsData);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p>Loading...</p>;

  const submissions = results.submissions;
  const total = submissions.length;

  const getAnswers = (qid) => submissions.map((s) => s.answers[qid]);

  const formatAnswer = (q, value) => {
    if (value === undefined || value === null || value === "") return "—";
    return String(value);
  };

  return (
    <div className="container">
      <nav className="nav">
        <div className="logo">Feedback Loop</div>
      </nav>

      <div className="layout">
        <main className="projMain">
          <div className="projectPage">

            <button className="backButton" onClick={() => navigate(`/devproject/${form.projectId}`)}>
              Back
            </button>

            <div className="projHeader">
              <div className="headerText">
                <p className="welcome">Feedback Results for</p>
                <h1>{form.title}</h1>
                <p className="lastUpdated">{total} responses collected</p>
              </div>
            </div>

            <div className="tabRow" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button
                className="plainButton"
                onClick={() => setView("stats")}
                style={{ fontWeight: view === "stats" ? "bold" : "normal" }}
              >
                Stats
              </button>
              <button
                className="plainButton"
                onClick={() => setView("byUser")}
                style={{ fontWeight: view === "byUser" ? "bold" : "normal" }}
              >
                By User
              </button>
            </div>

            {view === "stats" && form.questions.map((q) => {
              const answers = getAnswers(q.id);

              return (
                <section key={q.id} className="projectSection">
                  <h2>{q.title}</h2>

                  {q.type === "multiple_choice" &&
                    q.options.map((opt) => {
                      const count = answers.filter((a) => a === opt).length;
                      const percent = total ? ((count / total) * 100).toFixed(1) : "0.0";
                      return (
                        <p key={opt}>
                          <strong>{opt}:</strong> {percent}% ({count})
                        </p>
                      );
                    })}

                  {q.type === "rating_scale" && (() => {
                    const nums = answers.filter((a) => typeof a === "number");
                    const avg = nums.length
                      ? (nums.reduce((s, n) => s + n, 0) / nums.length).toFixed(2)
                      : "—";
                    const lo = nums.length ? Math.min(...nums) : "—";
                    const hi = nums.length ? Math.max(...nums) : "—";
                    return (
                      <p>
                        Range: {q.min}–{q.max} · <strong>Average:</strong> {avg} ·{" "}
                        <strong>Min:</strong> {lo} · <strong>Max:</strong> {hi} ·{" "}
                        <strong>Responses:</strong> {nums.length}
                      </p>
                    );
                  })()}

                  {q.type === "short_answer" &&
                    submissions.map((s, i) => (
                      <div key={i} className="logSection">
                        <p>"{s.answers?.[q.id]}"</p>
                        <p className="logAuthor">
                          — {s.username}, {new Date(s.date).toLocaleString()}
                        </p>
                      </div>
                    ))}
                </section>
              );
            })}

            {view === "byUser" && (
              submissions.length === 0 ? (
                <p>No responses yet.</p>
              ) : (
                submissions.map((s, i) => (
                  <section key={i} className="projectSection">
                    <h2>{s.username || "Anonymous"}</h2>
                    <p className="lastUpdated">
                      Submitted {new Date(s.date).toLocaleString()}
                    </p>
                    {form.questions.map((q) => (
                      <div key={q.id} className="logSection">
                        <p><strong>{q.title}</strong></p>
                        <p>{formatAnswer(q, s.answers?.[q.id])}</p>
                      </div>
                    ))}
                  </section>
                ))
              )
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default FeedbackResults;

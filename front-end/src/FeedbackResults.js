import "./ProjectInfo.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "./api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function FeedbackResults() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("stats"); // "stats" | "byUser"

  useEffect(() => {
    Promise.all([
      apiFetch(`/createfeedback/${id}`).then((r) => r.json()),
      apiFetch(`/feedback-result/${id}`).then((r) => r.json()),
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
            <button
              className="backButton"
              onClick={() =>
                navigate(`/devproject/${form.projectId}`, {
                  state: { tab: "feedback" },
                })
              }
            >
              Back
            </button>

            <div className="projHeader">
              <div className="headerText">
                <p className="welcome">Feedback Results for</p>
                <h1>{form.title}</h1>
                <p className="lastUpdated">{total} responses collected</p>
              </div>
            </div>

            <div className="tabBar">
              <button
                className={`tabBtn ${view === "stats" ? "tabActive" : ""}`}
                onClick={() => setView("stats")}
              >
                Stats
              </button>
              <button
                className={`tabBtn ${view === "byUser" ? "tabActive" : ""}`}
                onClick={() => setView("byUser")}
              >
                By User
              </button>
            </div>

            {view === "stats" && (
              <section className="projectSection">
                {form.questions.map((q) => {
                  const answers = getAnswers(q.id);
                  return (
                    <div key={q.id} className="questionSection">
                      <h3>{q.title}</h3>

                      {q.type === "multiple_choice" &&
                        (() => {
                          const data = q.options.map((opt) => {
                            const count = answers.filter(
                              (a) => a === opt,
                            ).length;
                            const percent = total
                              ? parseFloat(((count / total) * 100).toFixed(1))
                              : 0;
                            return { name: opt, percent, count };
                          });

                          return (
                            <div>
                              <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                  data={data}
                                  margin={{
                                    top: 30,
                                    right: 20,
                                    bottom: 10,
                                    left: 0,
                                  }}
                                >
                                  <XAxis dataKey="name" fontSize={12} />
                                  <YAxis allowDecimals={false} fontSize={12} />
                                  <Tooltip
                                    formatter={(value, name, props) => [
                                      `${value}`,
                                    ]}
                                  />
                                  <Bar dataKey="count" radius={0}>
                                    {data.map((_, i) => (
                                      <Cell
                                        key={i}
                                        fill={
                                          i % 2 === 0 ? "#1e141d" : "#682d70"
                                        }
                                      />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>

                              <div className="chartSummary">
                                {data.map((d) => (
                                  <p key={d.name}>
                                    <strong>{d.name}:</strong> {d.count}{" "}
                                    responses ({d.percent}%)
                                  </p>
                                ))}
                                <p className="logAuthor">
                                  Total responses: {total}
                                </p>
                              </div>
                            </div>
                          );
                        })()}

                      {q.type === "rating_scale" &&
                        (() => {
                          const nums = answers.filter(
                            (a) => typeof a === "number",
                          );
                          const avg = nums.length
                            ? (
                                nums.reduce((s, n) => s + n, 0) / nums.length
                              ).toFixed(2)
                            : "—";
                          const lo = nums.length ? Math.min(...nums) : "—";
                          const hi = nums.length ? Math.max(...nums) : "—";

                          const data = [];
                          for (let v = q.min; v <= q.max; v++) {
                            const count = nums.filter((n) => n === v).length;
                            data.push({ name: String(v), count });
                          }
                          return (
                            <div>
                              <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                  data={data}
                                  margin={{
                                    top: 30,
                                    right: 20,
                                    bottom: 10,
                                    left: 0,
                                  }}
                                >
                                  <XAxis dataKey="name" fontSize={12} />
                                  <YAxis allowDecimals={false} fontSize={12} />
                                  <Tooltip />
                                  <Bar dataKey="count" radius={0}>
                                    {data.map((_, i) => (
                                      <Cell
                                        key={i}
                                        fill={
                                          i % 2 === 0 ? "#1e141d" : "#682d70"
                                        }
                                      />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                              <p>
                                Range: {q.min}-{q.max} ·{" "}
                                <strong>Average:</strong> {avg} ·{" "}
                                <strong>Min:</strong> {lo} ·{" "}
                                <strong>Max:</strong> {hi} ·{" "}
                                <strong>Responses:</strong> {nums.length}
                              </p>
                            </div>
                          );
                        })()}

                      {q.type === "short_answer" &&
                        submissions.map((s, i) => (
                          <div key={i} className="logSection">
                            <p>"{s.answers?.[q.id]}"</p>
                            <p className="logAuthor">
                              — {s.username},{" "}
                              {new Date(s.date).toLocaleString()}
                            </p>
                          </div>
                        ))}
                    </div>
                  );
                })}
              </section>
            )}

            {view === "byUser" && (
              <section className="projectSection">
                {submissions.length === 0 ? (
                  <p>No responses yet.</p>
                ) : (
                  submissions.map((s, i) => (
                    <div key={i} className="submissionSection">
                      <h3>{s.username || "Anonymous"}</h3>
                      <p className="lastUpdated">
                        Submitted {new Date(s.date).toLocaleString()}
                      </p>
                      {form.questions.map((q) => (
                        <div key={q.id} className="logSection">
                          <p>
                            <strong>{q.title}</strong>
                          </p>
                          <p>{formatAnswer(q, s.answers?.[q.id])}</p>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default FeedbackResults;

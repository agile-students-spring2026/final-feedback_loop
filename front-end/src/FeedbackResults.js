import "./ProjectInfo.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function FeedbackResults() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(null);       // questions
  const [results, setResults] = useState(null); // submissions
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:7002/createfeedback/${id}`).then(r => r.json()),
      fetch(`http://localhost:7002/feedback-result/${id}`).then(r => r.json()),
    ]).then(([formData, resultsData]) => {
      setForm(formData);
      setResults(resultsData);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p>Loading...</p>;

  const submissions = results.submissions;
  const total = submissions.length;

  const getAnswers = (id) =>
    submissions.map((s) => s.answers[id]);

  return (
    <div className="container">
      {/* TOP NAV */}
      <nav className="nav">
        <div className="logo">[ LOGO ]</div>
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
                <p className="lastUpdated">
                  {total} responses collected
                </p>
              </div>
            </div>

            {form.questions.map((q, index) => {
              const answers = getAnswers(index + 1);

              return (
                <section key={q.id} className="projectSection">
                  <h2>{q.title}</h2>

                  {q.type === "multiple_choice" &&
                    q.options.map((opt) => {
                      const count = answers.filter((a) => a === opt).length;
                      const percent = ((count / total) * 100).toFixed(1);

                      return (
                        <p key={opt}>
                          <strong>{opt}:</strong> {percent}% ({count})
                        </p>
                      );
                    })}

                  {q.type === "rating_scale" &&
                    [...Array(q.max - q.min + 1)].map((_, i) => {
                      const val = q.min + i;
                      const count = answers.filter((a) => a === val).length;
                      const percent = ((count / total) * 100).toFixed(1);

                      return (
                        <p key={val}>
                          <strong>{val}:</strong> {percent}% ({count})
                        </p>
                      );
                    })}

                  {q.type === "short_answer" &&
                    submissions.map((s, i) => (
                      <div key={i} className="logSection">
                        <p>"{answers}"</p>
                        <p className="logAuthor">
                          — {s.username}, {s.date}
                        </p>
                      </div>
                    ))}
                </section>
              );
            })}

          </div>
        </main>
      </div>
    </div>
  );
}

export default FeedbackResults;
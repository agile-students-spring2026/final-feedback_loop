import "./ProjectInfo.css";
import { useNavigate } from "react-router-dom";
import feedback from "./FeedbackResults.json";

function FeedbackResults() {
  const navigate = useNavigate();

  const total = feedback.submissions.length;

  const getAnswers = (id) =>
    feedback.submissions.map((s) => s.answers[id]);

  return (
    <div className="container">
      {/* TOP NAV */}
      <nav className="nav">
        <div className="logo">[ LOGO ]</div>
      </nav>

      <div className="layout">
        <main className="projMain">
          <div className="projectPage">

            {/* BACK BUTTON */}
            <button className="backButton" onClick={() => navigate(-1)}>
              Back
            </button>

            {/* HEADER */}
            <div className="projHeader">
              <div className="headerText">
                <p className="welcome">Feedback Results for</p>
                <h1>{feedback.title}</h1>
                <p className="lastUpdated">
                  {total} responses collected
                </p>
              </div>
            </div>

            {/* QUESTIONS */}
            {feedback.questions.map((q) => {
              const answers = getAnswers(q.id);

              return (
                <section key={q.id} className="projectSection">
                  <h2>{q.question}</h2>

                  {/* MCQ */}
                  {q.type === "mcq" &&
                    q.options.map((opt) => {
                      const count = answers.filter((a) => a === opt).length;
                      const percent = ((count / total) * 100).toFixed(1);

                      return (
                        <p key={opt}>
                          <strong>{opt}:</strong> {percent}% ({count})
                        </p>
                      );
                    })}

                  {/* RATING */}
                  {q.type === "rating" &&
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

                  {/* TEXT */}
                  {q.type === "text" &&
                    feedback.submissions.map((s, i) => (
                      <div key={i} className="logSection">
                        <p>"{s.answers[q.id]}"</p>
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
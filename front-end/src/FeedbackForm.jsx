import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./FeedbackForm.css";
import AppLayout from "./AppLayout";
import { apiFetch } from "./api";

const FeedbackForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    apiFetch(`/createfeedback/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        const initial = {};
        data.questions.forEach((q) => {
          initial[q.id] = q.type === "rating_scale" ? (q.value ?? 3) : "";
        });
        setAnswers(initial);
      });
  }, [id]);

  const updateAnswer = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  const handleSubmit = async () => {
    if (!form) return;
    try {
      const res = await apiFetch(`/feedback-result/${id}`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to submit. Please try again.");
        return;
      }
      alert("Thanks for your feedback!");
      navigate(`/game-feedback/${form.projectId}`);
    } catch (e) {
      alert("Network error. Is the backend running?");
    }
  };

  return (
    <AppLayout>
      <div className="formPage">
        <header className="header">
          <h1 className="h1">{form ? form.title : "Loading..."}</h1>
        </header>

        <div className="formBody">
          {form ? (
            <>
              {form.questions.map((q, index) => (
                <div key={q.id} className="formGroup">
                  <p className="formLabel">Question {index + 1}</p>
                  <p className="formSublabel">{q.title}</p>

                  {q.type === "multiple_choice" && (
                    <div className="formChoiceList">
                      {q.options.map((option) => (
                        <div
                          key={option}
                          className={`formChoice ${answers[q.id] === option ? "formChoiceSelected" : ""}`}
                          onClick={() => updateAnswer(q.id, option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === "rating_scale" && (
                    <>
                      <input
                        type="range"
                        min={q.min ?? 1}
                        max={q.max ?? 5}
                        value={answers[q.id] ?? 3}
                        onChange={(e) =>
                          updateAnswer(q.id, Number(e.target.value))
                        }
                        className="formSlider"
                      />
                      <div className="formSliderLabels">
                        <span>{q.min}</span>
                        <span>{q.max}</span>
                      </div>
                      <p className="formSliderValue">
                        Selected: {answers[q.id] ?? q.value ?? q.min}
                      </p>
                    </>
                  )}

                  {q.type === "short_answer" && (
                    <input
                      type="text"
                      className="formInput"
                      placeholder={q.placeholder || "Enter your answer..."}
                      value={answers[q.id] ?? ""}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <button className="formSubmitBtn" onClick={handleSubmit}>
                Submit
              </button>
            </>
          ) : (
            <p style={{ padding: 40 }}>Loading...</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default FeedbackForm;

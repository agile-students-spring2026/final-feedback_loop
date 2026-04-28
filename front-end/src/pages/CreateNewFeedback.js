import React, { useState } from "react";
import "./CreateNewFeedback.css";
import MultipleChoiceEditor from "../components/MultipleChoiceEditor";
import RatingScaleEditor from "../components/RatingScaleEditor";
import ShortAnswerEditor from "../components/ShortAnswerEditor";
import QuestionTypeSelector from "../components/QuestionTypeSelector";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";

function CreateNewFeedback() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  function generateId() {
    return Date.now();
  }

  function createQuestion(type) {
    if (type === "multiple_choice") {
      return {
        id: generateId(),
        type: type,
        question: "",
        options: ["", ""],
      };
    }

    if (type === "rating_scale") {
      return {
        id: generateId(),
        type: type,
        question: "",
        min: 1,
        max: 5,
        value: 3,
      };
    }

    if (type === "short_answer") {
      return {
        id: generateId(),
        type: type,
        question: "",
        placeholder: "",
      };
    }

    return null;
  }

  function addQuestion(type) {
    setQuestions((prev) => [...prev, createQuestion(type)]);
    setShowSelector(false);
  }

  function updateQuestion(id, newData) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...newData } : q)),
    );
  }

  function deleteQuestion(id) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  async function handleSaveAndView() {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.type === "multiple_choice") {
        const hasBlank = !q.options || q.options.some((opt) => !opt || !opt.trim());
        if (hasBlank) {
          alert(`Question ${i + 1}: multiple choice options cannot be blank.`);
          return;
        }
      }
    }

    try {
      const response = await apiFetch("/createfeedback", {
        method: "POST",
        body: JSON.stringify({
          projectId: id,
          title: title,
          questions: questions,
        }),
      });

      const newFeedback = await response.json();
      console.log("Created feedback form:", newFeedback);
      navigate(`/devproject/${id}`, { state: { tab: "feedback" } });
    } catch (error) {
      console.error("Error creating feedback:", error);
      alert("Failed to save feedback form. Is the backend running?");
    }
  }

  function confirmDiscard() {
    setTitle("");
    setQuestions([]);
    setShowSelector(false);
    setShowDiscardConfirm(false);
    navigate(`/devproject/${id}`, { state: { tab: "feedback" } });
  }

  return (
    <div className="page-container">
      <nav className="nav">
        <div className="logo">Feedback Loop</div>
      </nav>

      <main className="main">
        <div className="dashboard">
          <button className="backButton" onClick={() => navigate(`/devproject/${id}`, { state: { tab: "feedback" } })}>
            Back
          </button>
          <div className="create-peoject-container">
            <div className="create-peoject-form">
              <div className="info-container">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="single-line-input"
                />
              </div>

              <div className="questions">
                {questions.map((q, index) => {
                  return (
                    <div key={q.id}>
                      <div className="info-container">
                        <div className="question-header">
                          <label>Question {index + 1}</label>
                          <button
                            onClick={function () {
                              deleteQuestion(q.id);
                            }}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </div>

                        {q.type === "multiple_choice" && (
                          <MultipleChoiceEditor
                            question={q}
                            onChange={updateQuestion}
                          />
                        )}

                        {q.type === "rating_scale" && (
                          <RatingScaleEditor
                            question={q}
                            onChange={updateQuestion}
                          />
                        )}

                        {q.type === "short_answer" && (
                          <ShortAnswerEditor
                            question={q}
                            onChange={updateQuestion}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="all-button">
                <button
                  onClick={() => setShowSelector(true)}
                  className="basic-button"
                >
                  Add Question
                </button>

                <button onClick={handleSaveAndView} className="basic-button">
                  Save & View
                </button>

                <button
                  onClick={() => setShowDiscardConfirm(true)}
                  className="basic-button"
                  type="button"
                >
                  Discard
                </button>
              </div>
            </div>

            {showSelector && (
              <QuestionTypeSelector
                onSelect={addQuestion}
                onClose={function () {
                  setShowSelector(false);
                }}
              />
            )}

            {showDiscardConfirm && (
              <div className="cnf-discard-overlay">
                <div className="cnf-discard-box">
                  <p className="cnf-discard-msg">Are you sure you want to discard all changes?</p>
                  <div className="cnf-discard-actions">
                    <button className="basic-button" onClick={() => setShowDiscardConfirm(false)}>
                      Cancel
                    </button>
                    <button className="basic-button cnf-discard-confirm" onClick={confirmDiscard}>
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateNewFeedback;
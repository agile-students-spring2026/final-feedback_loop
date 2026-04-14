import React, { useState } from "react";
import "./CreateNewFeedback.css";
import MultipleChoiceEditor from "../components/MultipleChoiceEditor";
import RatingScaleEditor from "../components/RatingScaleEditor";
import ShortAnswerEditor from "../components/ShortAnswerEditor";
import QuestionTypeSelector from "../components/QuestionTypeSelector";
import { useNavigate, useParams } from "react-router-dom";

function CreateNewFeedback() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showSelector, setShowSelector] = useState(false);

  function generateId() {
    return Date.now();
  }

  function createQuestion(type) {
    if (type === "multiple_choice") {
      return {
        id: generateId(),
        type: type,
        question: "",
        options: ["Choice 1", "Choice 2"],
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

  function handleSaveAndView() {
    fetch("/createfeedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: id,
        title: title,
        questions: questions,
      }),
    })
      .then((res) => res.json())
      .then((data) => navigate(`/feedback-form/${data.id}`))
      .catch((err) => console.error(err));
  }

  function handleDiscard() {
    const confirmDiscard = window.confirm(
      "Are you sure you want to discard all changes?",
    );

    if (!confirmDiscard) return;

    setTitle("");
    setQuestions([]);
    setShowSelector(false);
    navigate(`/devproject/${id}`);
  }

  return (
    <div className="page-container">
      <nav className="nav">
        <div className="logo">[ LOGO ]</div>
      </nav>

      <main className="main">
        <div className="dashboard">
          <header className="header">
            <h1 className="h1">Create a New Feedback Form</h1>
          </header>
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
                  onClick={handleDiscard}
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateNewFeedback;

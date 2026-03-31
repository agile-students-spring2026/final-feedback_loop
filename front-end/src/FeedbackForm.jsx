import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeedbackForm.css";
import AppLayout from "./AppLayout";


const FeedbackForm = () => {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({
    q1: "",
    q2: 3,
    q3: "",
  });

  const updateAnswer = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  const handleSubmit = () => {
    navigate("/game-feedback");
  };

  const handleDiscard = () => {
    if (!window.confirm("Discard all answers?")) return;
    setAnswers({ q1: "", q2: 3, q3: "" });
  };

  return (
    <AppLayout>
    <div className="formPage">
      <header className="header">
          <h1 className="h1">Feedback Form</h1>
        </header>

      <div className="formBody">
        <div className="formGroup">
          <p className="formLabel">Question 1</p>
          <p className="formSublabel">How would you rate the overall gameplay?</p>
          <div className="formChoiceList">
            {["Excellent", "Good", "Average", "Poor"].map((choice) => (
              <div
                key={choice}
                className={`formChoice ${answers.q1 === choice ? "formChoiceSelected" : ""}`}
                onClick={() => updateAnswer("q1", choice)}
              >
                {choice}
              </div>
            ))}
          </div>
        </div>

        <div className="formGroup">
          <p className="formLabel">Question 2</p>
          <p className="formSublabel">Rate the difficulty level (1-5)</p>
          <input
            type="range"
            min="1"
            max="5"
            value={answers.q2}
            onChange={(e) => updateAnswer("q2", Number(e.target.value))}
            className="formSlider"
          />
          <div className="formSliderLabels">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>

        <div className="formGroup">
          <p className="formLabel">Question 3</p>
          <p className="formSublabel">Any additional comments or suggestions?</p>
          <input
            type="text"
            className="formInput"
            placeholder="Enter your answer..."
            value={answers.q3}
            onChange={(e) => updateAnswer("q3", e.target.value)}
          />
        </div>

        <button className="formSubmitBtn" onClick={handleSubmit}>
          Submit
        </button>
        <button className="formDiscardBtn" onClick={handleDiscard}>
          Discard
        </button>
      </div>
    </div>
    </AppLayout>
  );
};

export default FeedbackForm;

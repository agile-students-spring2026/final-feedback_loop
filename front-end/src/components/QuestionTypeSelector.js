import React from "react";
import "./QuestionTypeSelector.css";

function QuestionTypeSelector(props) {
  return (
    <div
      className="qts-container"
      onClick={function () {
        props.onClose();
      }}
    >
      <div
        className="qts-window"
        onClick={function (e) {
          e.stopPropagation();
        }}
      >
        <h2 className="qts-title">Select Question Type</h2>

        <div className="qts-options">
          <button
            className="qts-option-btn"
            onClick={function () {
              props.onSelect("multiple_choice");
            }}
          >
            Multiple Choice
          </button>

          <button
            className="qts-option-btn"
            onClick={function () {
              props.onSelect("rating_scale");
            }}
          >
            Rating Scale
          </button>

          <button
            className="qts-option-btn"
            onClick={function () {
              props.onSelect("short_answer");
            }}
          >
            Short Answer
          </button>

          <button
            className="qts-close-btn"
            onClick={function () {
              props.onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionTypeSelector;

import React from "react";
import "./RatingScaleEditor.css";

function RatingScaleEditor(props) {
  const q = props.question;

  function update(key, value) {
    props.onChange(q.id, { [key]: value });
  }

  return (
    <div>
      <input
        className="single-line-input"
        type="text"
        placeholder="Enter your question..."
        value={q.title}
        onChange={(e) => {
          update("title", e.target.value);
        }}
      />

      <input
        type="range"
        min={q.min}
        max={q.max}
        value={q.value || q.min}
        onChange={(e) => update("value", Number(e.target.value))}
        className="slider"
      />

      <div className="row">
        <div className="num-row">
          <label className="rse-label">Min</label>
          <input
            type="number"
            value={q.min}
            onChange={(e) => {
              update("min", Number(e.target.value));
            }}
            className="num-input"
          />
        </div>

        <div className="num-row">
          <label className="rse-label">Max</label>
          <input
            type="number"
            value={q.max}
            onChange={(e) => {
              update("max", Number(e.target.value));
            }}
            className="num-input"
          />
        </div>
      </div>
    </div>
  );
}

export default RatingScaleEditor;

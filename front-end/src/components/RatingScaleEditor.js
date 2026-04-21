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
            min={0}
            max={100}
            value={q.min}
            onChange={(e) => {
              const n = Math.max(0, Math.min(100, Number(e.target.value)));
              update("min", n);
            }}
            className="num-input"
          />
        </div>

        <div className="num-row">
          <label className="rse-label">Max</label>
          <input
            type="number"
            min={1}
            max={100}
            value={q.max}
            onChange={(e) => {
              const n = Math.max(1, Math.min(100, Number(e.target.value)));
              update("max", n);
            }}
            className="num-input"
          />
        </div>
      </div>
    </div>
  );
}

export default RatingScaleEditor;

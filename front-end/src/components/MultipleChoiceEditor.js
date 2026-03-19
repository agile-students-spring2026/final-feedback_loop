import React from "react";

function MultipleChoiceEditor(props) {
  const q = props.question;

  function updateTitle(value) {
    props.onChange(q.id, { title: value });
  }

  function addOption() {
    const newOptions = [...q.options, ""];
    props.onChange(q.id, { options: newOptions });
  }

  function deleteOption(index) {
    if (q.options.length === 1) return;
    const newOptions = q.options.filter((o, i) => i !== index);
    props.onChange(q.id, { options: newOptions });
  }

  function updateOption(index, value) {
    const newOptions = q.options.map((o, i) => {
      if (i === index) return value;
      return o;
    });

    props.onChange(q.id, { options: newOptions });
  }

  return (
    <div>
      <input
        className="single-line-input"
        type="text"
        placeholder="Enter your question..."
        value={q.title}
        onChange={(e) => {
          updateTitle(e.target.value);
        }}
      />

      <div className="option-list">
        {q.options.map((opt, index) => {
          return (
            <div key={index} className="option">
              <input
                className="single-line-input"
                type="text"
                value={opt}
                placeholder={"Choice " + (index + 1)}
                onChange={function (e) {
                  updateOption(index, e.target.value);
                }}
              />

              <button
                className="delete-button"
                type="button"
                onClick={function () {
                  deleteOption(index);
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={addOption}>
        + Add Option
      </button>
    </div>
  );
}

export default MultipleChoiceEditor;

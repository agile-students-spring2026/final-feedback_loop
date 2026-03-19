import React from "react";

function ShortAnswerEditor(props) {
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
    </div>
  );
}

export default ShortAnswerEditor;

import { useState } from "react";

function CreateProjectForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");

  return (
    <div className="container">
      <div className="header">Create a New Project!</div>

      <form>
        <div className="infoContainer">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="infoContainer">
          <label>Short description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="infoContainer">
            <label> Genre </label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="">Select Genre</option>
                <option value="Action">Action</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Adventure">Adventure</option>
                <option value="RPG">RPG</option>
            </select>
        </div>

        
      </form>
    </div>
  );
}

export default CreateProjectForm;

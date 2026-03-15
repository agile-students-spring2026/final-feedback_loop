import { useState } from "react";
import TagSelector from "./TagSelector";
import "./CreateProjectForm.css";

const tagOption = [
  { value: "pixel-art", label: "pixel-art" },
  { value: "adventure", label: "adventure" },
  { value: "2D", label: "2D" },
  { value: "RPG", label: "RPG" },
  { value: "visual-novel", label: "visual-novel" },
  { value: "puzzle", label: "puzzle" },
  { value: "rouguelike", label: "rouguelike" },
];

const generOption = [
  { value: "Action", label: "Action" },
  { value: "Adventure", label: "Adventure" },
  { value: "Card Game", label: "Card Game" },
  { value: "Educational", label: "Educational" },
  { value: "Platformer", label: "Platformer" },
  { value: "Sport", label: "Sport" },
  { value: "Straregy", label: "Straregy" },
];

function CreateProjectForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState([]);

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const handleCoverUpload = (out) => {
    const file = out.target.files[0];
    if (!file) return;

    setCoverImage(file);

    const imageUrl = URL.createObjectURL(file);
    setCoverPreview(imageUrl);
  };

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
          <TagSelector
            value={genre}
            onChange={setGenre}
            options={generOption}
            isMulti={false}
          />
        </div>

        <div className="infoContainer">
          <label> Tag </label>
          <TagSelector
            value={tags}
            onChange={setTags}
            options={tagOption}
            isMulti={true}
          />
        </div>

        <div className="infoContainer">
          <label>Cover Image</label>

          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            style={{ display: "none" }}
          />

          <label htmlFor="cover-upload" className="cover-upload-area">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="cover-preview-image"
              />
            ) : (
              <div className="cover-upload-placeholder">
                <span className="upload-main-text">
                  Click to upload cover image
                </span>
                <span className="upload-sub-text">PNG, JPG, JPEG</span>
              </div>
            )}
          </label>

        </div>
      </form>
    </div>
  );
}

export default CreateProjectForm;

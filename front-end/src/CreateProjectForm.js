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

function UploadSection({
  uploadType,
  setUploadType,
  uploadFile,
  setUploadFile,
  uploadUrl,
  setUploadUrl,
}) {
  const handleUploadFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadFile(file);
  };

  let content;

  if (uploadType === "download") {
    content = (
      <div className="upload-mode-content">
        <label htmlFor="project-upload-file" className="upload-file-button">
          Choose File
        </label>

        <input
          id="project-upload-file"
          type="file"
          onChange={handleUploadFileChange}
          style={{ display: "none" }}
        />

        {uploadFile && (
          <p className="upload-file-name">Selected: {uploadFile.name}</p>
        )}
      </div>
    );
  } else {
    content = (
      <div className="upload-mode-content">
        <input
          type="text"
          placeholder="Enter project URL"
          value={uploadUrl}
          onChange={(e) => setUploadUrl(e.target.value)}
          className="single-line-input"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="upload-tabs">
        <button
          type="button"
          className={
            uploadType === "download" ? "upload-tab active" : "upload-tab"
          }
          onClick={() => setUploadType("download")}
        >
          Downloadable
        </button>

        <button
          type="button"
          className={uploadType === "url" ? "upload-tab active" : "upload-tab"}
          onClick={() => setUploadType("url")}
        >
          URL
        </button>
      </div>

      <div>{content}</div>
    </div>
  );
}

function CreateProjectForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState([]);

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [uploadType, setUploadType] = useState("download");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");

  const [visibility, setVisibility] = useState("");

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverImage(file);

    const imageUrl = URL.createObjectURL(file);
    setCoverPreview(imageUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title,
      description,
      genre,
      tags,
      visibility,
      uploadType,
      coverImage,
      uploadFile,
      uploadUrl,
    };
    console.log("Submitted Data:", formData);
    alert("Form submitted then nacigate to project info page");
    //navigate("/project", { state: formData });
  };

  const handleDiscard = () => {
    const confirmClear = window.confirm("Discard all changes?");
    if (!confirmClear) return;

    setTitle("");
    setDescription("");
    setGenre("");
    setTags("");
    setVisibility("");
    setUploadType("download");
    setCoverImage(null);
    setCoverPreview("");
    setUploadFile(null);
    setUploadUrl("");
  };

  return (
    <div className="container">
      <div className="top-nav">
        <span className="nav-link"> Dashboard</span>
      </div>
      <div className="header">Create a New Project!</div>

      <form onSubmit={handleSubmit}>
        <div className="info-container">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="single-line-input"
          />
        </div>

        <div className="info-container">
          <label>Short description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="info-container">
          <label> Genre </label>
          <TagSelector
            value={genre}
            onChange={setGenre}
            options={generOption}
            isMulti={false}
          />
        </div>

        <div className="info-container">
          <label> Tag </label>
          <TagSelector
            value={tags}
            onChange={setTags}
            options={tagOption}
            isMulti={true}
          />
        </div>

        <div className="info-container">
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

        <div className="form-section">
          <h3>Uploads</h3>
          <UploadSection
            uploadType={uploadType}
            setUploadType={setUploadType}
            uploadFile={uploadFile}
            setUploadFile={setUploadFile}
            uploadUrl={uploadUrl}
            setUploadUrl={setUploadUrl}
          />
        </div>

        <div className="form-section">
          <h3>Visibility & access</h3>
          <label className="radio-label">
            <input
              type="radio"
              name="visibility"
              value="draft"
              checked={visibility === "draft"}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <span>
              <strong>Draft</strong> - Only those who can edit the project can
              view the page
            </span>
          </label>
          <br/>
          <label className="radio-label">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === "public"}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <span>
              <strong>Public</strong> - Anyone can view the page
            </span>
          </label>
        </div>

        <div>
          <button type="submit" className="basic-button">
            Save and View Pages
          </button>
        </div>

        <div>
          <button
            type="button"
            className="basic-button"
            onClick={handleDiscard}
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProjectForm;

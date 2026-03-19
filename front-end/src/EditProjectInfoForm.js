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

const genreOption = [
  { value: "Action", label: "Action" },
  { value: "Adventure", label: "Adventure" },
  { value: "Card Game", label: "Card Game" },
  { value: "Educational", label: "Educational" },
  { value: "Platformer", label: "Platformer" },
  { value: "Sport", label: "Sport" },
  { value: "Strategy", label: "Strategy" },
];

//hard code data (temp)
const projectData = {
  title: "Dreamwalker",
  description:
    "A narrative puzzle game ...",
  genre: { value: "Adventure", label: "Adventure" },
  tags: [
    { value: "puzzle", label: "puzzle" },
    { value: "2D", label: "2D" },
    { value: "visual-novel", label: "visual-novel" },
  ],
  coverImage: null,
  coverPreview:
    "https://sm.pcmag.com/pcmag_me/review/g/google-pla/google-play-games_w6hm.jpg",
  uploadType: "url",
  uploadFile: null,
  uploadUrl: "https://example.com/my-project-build",
  visibility: "draft",
};

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

function EditProjectInfo() {
  const [title, setTitle] = useState(projectData.title);
  const [description, setDescription] = useState(projectData.description);
  const [genre, setGenre] = useState(projectData.genre);
  const [tags, setTags] = useState(projectData.tags);

  const [coverImage, setCoverImage] = useState(projectData.coverImage);
  const [coverPreview, setCoverPreview] = useState(
    projectData.coverPreview
  );

  const [uploadType, setUploadType] = useState(projectData.uploadType);
  const [uploadFile, setUploadFile] = useState(projectData.uploadFile);
  const [uploadUrl, setUploadUrl] = useState(projectData.uploadUrl);

  const [visibility, setVisibility] = useState(projectData.visibility);

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
    console.log("Updated Project Data:", formData);
    alert("Project info updated. Then navigate to project info page.");
    //navigate("/project", { state: formData });
  };

  const handleDiscard = () => {
    const confirmReset = window.confirm(
      "Discard all changes and restore original project info?"
    );
    if (!confirmReset) return;

    setTitle(projectData.title);
    setDescription(projectData.description);
    setGenre(projectData.genre);
    setTags(projectData.tags);
    setVisibility(projectData.visibility);
    setUploadType(projectData.uploadType);
    setCoverImage(projectData.coverImage);
    setCoverPreview(projectData.coverPreview);
    setUploadFile(projectData.uploadFile);
    setUploadUrl(projectData.uploadUrl);
  };

  return (
    <div className="container">
      <div className="top-nav">
        <span className="nav-link">Project Name</span>
      </div>
      <div className="header">Edit Project Information</div>

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
            options={genreOption}
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

export default EditProjectInfo;

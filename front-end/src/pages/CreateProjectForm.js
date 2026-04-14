import { useState } from "react";
import TagSelector from "../components/TagSelector";
import "./CreateProjectForm.css";
import { useNavigate } from "react-router-dom";
import { tagOption, genreOption } from "../mockData";

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
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState([]);

  const [coverPreview, setCoverPreview] = useState("");

  const [uploadType, setUploadType] = useState("download");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");

  const [visibility, setVisibility] = useState("");

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      uploadUrl,
    };

    fetch("/createprojects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => navigate(`/devproject/${data.id}`))
      .catch((err) => console.error(err));
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
    setCoverPreview("");
    setUploadFile(null);
    setUploadUrl("");
    navigate("/devdash");
  };

  return (
    <div className="page-container">
      <nav className="nav">
        <div className="logo">[ LOGO ]</div>
      </nav>

      <main class="main">
        <div class="dashboard">
          <header class="header">
            <h1 class="h1">CREATE A NEW PROJECT!</h1>
          </header>

          <div className="create-peoject-container">
            <form onSubmit={handleSubmit} className="create-peoject-form">
              <div className="info-container">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="single-line-input"
                  required
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
                    <strong>Draft</strong> - Only those who can edit the project
                    can view the page
                  </span>
                </label>
                <br />
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
        </div>
      </main>
    </div>
  );
}

export default CreateProjectForm;

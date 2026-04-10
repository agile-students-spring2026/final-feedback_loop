import { useState, useEffect } from "react";
import TagSelector from "../components/TagSelector";
import "./CreateProjectForm.css";
import { useNavigate, useParams } from "react-router-dom";

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
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [originalProject, setOriginalProject] = useState(null);

  const [tagOption, setTagOption] = useState([]);
  const [genreOption, setGenreOption] = useState([]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch("http://localhost:7002/options");
        const data = await response.json();
        setTagOption(data.tagOption);
        setGenreOption(data.genreOption);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }
    fetchOptions();
  }, []);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`http://localhost:7002/projects/${id}`);
        const project = await response.json();

        setTitle(project.title);
        setDescription(project.description);
        setGenre(project.genre);
        setTags(project.tags);
        setCoverImage(project.coverImage);
        setCoverPreview(project.coverPreview);
        setUploadType(project.uploadType);
        setUploadFile(project.uploadFile);
        setUploadUrl(project.uploadUrl);
        setVisibility(project.visibility);

        setOriginalProject(project);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    }

    fetchProject();
  }, [id]);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverImage(file);

    const imageUrl = URL.createObjectURL(file);
    setCoverPreview(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:7002/createprojects/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            genre,
            tags,
            visibility,
            uploadType,
            uploadUrl,
          }),
        },
      );

      navigate(`/devproject/${originalProject.id}`);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Is the backend running?");
    }
  };

  const handleDiscard = () => {
    const confirmReset = window.confirm(
      "Discard all changes and restore original project info?",
    );
    if (!confirmReset) return;

    if (originalProject) {
      setTitle(originalProject.title);
      setDescription(originalProject.description);
      setGenre(originalProject.genre);
      setTags(originalProject.tags);
      setVisibility(originalProject.visibility);
      setUploadType(originalProject.uploadType);
      setCoverImage(originalProject.coverImage);
      setCoverPreview(originalProject.coverPreview);
      setUploadFile(originalProject.uploadFile);
      setUploadUrl(originalProject.uploadUrl);
    }
    navigate(`/devproject/${originalProject.id}`);
  };

  return (
    <div className="page-container">
      <nav className="nav">
        <div className="logo">[ LOGO ]</div>
      </nav>

      <main class="main">
        <div class="dashboard">
          {/* <div className="top-nav-standalone">
          <span
            className="nav-link"
            onClick={() => navigate("/project")}
            style={{ cursor: "pointer" }}
          >
            Project_Name
          </span>
        </div> */}
          <header class="header">
            <h1 class="h1">EDIT PROJECT INFORMATION</h1>
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

export default EditProjectInfo;

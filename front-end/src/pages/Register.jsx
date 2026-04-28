import { useState } from "react";
import Outline from "../components/Outline/Outline";
import styles from "./loginPages.module.css";
import styles2 from "./register.module.css";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, setToken, setUser } from "../api";

const DEFAULT_PFP =
  "https://res.cloudinary.com/dpdidryxs/image/upload/v1776738351/blank-pfp_yk8bl5.png";

function Register() {
  const [error, setError] = useState("");
  const [profilePic, setProfilePic] = useState(DEFAULT_PFP);
  const navigate = useNavigate();

  const openPfpWidget = () => {
    if (!window.cloudinary) return;
    window.cloudinary.openUploadWidget(
      {
        cloudName: "dpdidryxs",
        uploadPreset: "preset_123",
        sources: ["local", "camera", "url"],
        multiple: false,
        cropping: true,
      },
      (err, result) => {
        if (!err && result && result.event === "success") {
          setProfilePic(result.info.secure_url);
        }
      }
    );
  };

  const checkInfo = async (e) => {
    e.preventDefault();
    setError("");
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password, profilePic }),
      });

      const data = await response.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        navigate("/explore");
      } else {
        setError(data.message || "Username taken");
      }
    } catch (err) {
      setError("Try again");
    }
  };

  return (
    <div className={styles.body}>
      <section className="registerPage">
        <Outline variant="test">
          <form onSubmit={checkInfo}>
            <p className={styles.signHead}>Register</p>
            <Link to="/signin" className={styles.switchPage}>
              or Sign in?
            </Link>
            <div
              className={styles2.pfpPicker}
              onClick={openPfpWidget}
              role="button"
              tabIndex={0}
            >
              <img
                src={profilePic}
                alt="Profile"
                className={styles2.pfpImg}
              />
              <span className={styles2.pfpLabel}>Choose profile picture</span>
            </div>
            <div className={styles.usernameDiv}>
              <InfoInput
                name="username"
                type="text"
                variant="test"
                placeholderText="Username"
                autoComplete="username"
                required
              />
            </div>
            <div className={styles.passwordDiv}>
              <InfoInput
                name="password"
                type="password"
                variant="test"
                placeholderText="Password"
                required
              />
            </div>
            <div className={styles2.confirmPass}>
              <InfoInput
                name="confirm"
                type="password"
                variant="test"
                placeholderText="Confirm Password"
                required
                autoComplete="new-password"
              />
            </div>
            {error && <p className={styles.errorMsg}>{error}</p>}
            <div className={styles.buttonWrapper}>
              <Button type="submit" variant="settings">
                Join Us!
              </Button>
            </div>
          </form>
        </Outline>
      </section>
    </div>
  );
}

export default Register;

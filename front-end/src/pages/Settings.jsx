import Outline from "../components/Outline/Outline";
import styles from "./settings.module.css";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import AppLayout from "../AppLayout";
import { logout } from "../api";
import { apiFetch } from "../api";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function SettingsPage() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    profilePic:
      "https://res.cloudinary.com/dpdidryxs/image/upload/v1776738351/blank-pfp_yk8bl5.png",
  });
  const [accButtonText, setAccButtonText] = useState("Account Code");
  const [clicked, setClicked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  const nav = useNavigate();
  const handleReport = () => nav("/report");
  const handleLogout = () => {
    logout();
    nav("/signin");
  };

  const handleAccCode = async () => {
    const min = 1000000000;
    const max = 9999999999;
    const accCode = Math.floor(Math.random() * (max - min + 1)) + min;
    setAccButtonText(accCode);
    setClicked(true);
    try {
      await navigator.clipboard.writeText(accCode);
    } catch {
      console.log("Failed to copy code");
    }
  };


  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await apiFetch(`/auth/users/${currentUser.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        localStorage.removeItem("currentUser");
        nav("/register");
      } else {
        setModalMessage("Can't delete account.");
        setShowMessageModal(true);
      }
    } catch (err) {
      console.error(err);
      setModalMessage("Something went wrong.");
      setShowMessageModal(true);
    }

    setShowDeleteConfirm(false);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUsername = formData.get("usernameField");
    const newPassword = formData.get("passwordField");

    const response = await apiFetch("/data/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.id,
        username: newUsername,
        password: newPassword,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      setModalMessage(data.message);
      setShowMessageModal(true);

      if (newUsername) {
        const updated = { ...currentUser, username: newUsername };
        localStorage.setItem("currentUser", JSON.stringify(updated));
        setUser((prev) => ({ ...prev, username: newUsername }));
      }
    }
  };

  const openWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: "dpdidryxs",
        uploadPreset: "preset_123",
        sources: ["local", "camera", "url"],
        multiple: false,
        cropping: true,
      },
      async (error, result) => {
        if (!error && result?.event === "success") {
          const info = result.info;
          const coords = info.coordinates?.custom?.[0];
          let imageUrl;

          if (coords) {
            const [x, y, width, height] = coords;
            imageUrl = info.secure_url.replace(
              "/upload/",
              `/upload/c_crop,x_${x},y_${y},w_${width},h_${height}/c_fill,w_200,h_200,g_center/`
            );
          } else {
            imageUrl = info.secure_url.replace(
              "/upload/",
              `/upload/c_fill,w_200,h_200,g_center/`
            );
          }

          const res = await apiFetch("/data/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUser.id,
              profilePic: imageUrl,
            }),
          });

          if (res.ok) {
            setUser((prev) => ({ ...prev, profilePic: imageUrl }));
            const updated = { ...currentUser, profilePic: imageUrl };
            localStorage.setItem("authUser", JSON.stringify(updated));
            window.dispatchEvent(new Event("storage"));

            setModalMessage("Profile picture updated!");
            setShowMessageModal(true);
          }
        }
      }
    );
  };

  useEffect(() => {
    const loadData = async () => {
      const res = await apiFetch(`/data/settings`);
      const data = await res.json();

      const finalPfp =
        !data.profilePic || data.profilePic === "/blank-pfp.png"
          ? "https://res.cloudinary.com/dpdidryxs/image/upload/v1776738351/blank-pfp_yk8bl5.png"
          : data.profilePic;

      setUser({
        username: data.username || "",
        password: "",
        profilePic: finalPfp,
      });
    };
    loadData();
  }, []);

  return (
    <AppLayout>
      <div className={styles.body}>
        <header className={styles.followHeader}>
          <h1 className={styles.followH1}>Settings</h1>
        </header>

        <div className={styles.settingsWrapper}>
          <Outline variant="pfp">
            <div onClick={openWidget} style={{ cursor: "pointer" }}>
              <img className={styles.img} src={user.profilePic} alt="Avatar" />
            </div>
            <p className={styles.user}>{user.username}</p>
          </Outline>

          <Outline variant="settings">
            <form onSubmit={handleInfoSubmit}>
              <Outline variant="info" legendText="Account Info">
                <div className={styles.info}>
                  <p className={styles.p}>Change Username:</p>
                  <InfoInput name="usernameField" variant="single" placeholderText="Enter new username" />
                </div>

                <div className={styles.info}>
                  <p className={styles.p}>Change Password:</p>
                  <InfoInput name="passwordField" variant="single" placeholderText="Enter new password" />
                </div>

                <div className={styles.buttonWrapper}>
                  <Button type="submit" variant="settings">Submit</Button>
                </div>
              </Outline>

              <Outline variant="acc" legendText="Utilities">
                <Button variant="settings" onClick={handleAccCode} disabled={clicked}>
                  {accButtonText}
                </Button>
                <Button variant="settings" onClick={handleReport}>Report</Button>
                <Button variant="settings" onClick={handleLogout}>Log Out</Button>

                <div className={styles.deleteWrapper}>
                  <Button variant="settings" onClick={handleDelete}>
                    Delete Account
                  </Button>
                </div>
              </Outline>
            </form>
          </Outline>
        </div>
      </div>


      {showDeleteConfirm && (
        <div className="cnf-discard-overlay">
          <div className="cnf-discard-box">
            <p className="cnf-discard-msg">
              Are you sure you want to permanently delete your account?
            </p>
            <div className="cnf-discard-actions">
              <button className="basic-button" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="basic-button cnf-discard-confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showMessageModal && (
        <div className="cnf-discard-overlay">
          <div className="cnf-discard-box">
            <p className="cnf-discard-msg">{modalMessage}</p>
            <div className="cnf-discard-actions">
              <button className="basic-button" onClick={() => setShowMessageModal(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default SettingsPage;
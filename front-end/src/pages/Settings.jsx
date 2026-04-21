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
  const [confirm, setConfirm] = useState(false);
  const [tempPfp, setTempPfp] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("authUser") || "{}");

  const nav = useNavigate();
  const handleReport = () => {
    nav("/report");
  };
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
    } catch (err) {
      console.log("Failed to copy code");
    }
  };

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
    } else {
      try {
        const res = await apiFetch(`/auth/users/${currentUser.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setConfirm(false);
          nav("/register");
          localStorage.removeItem("currentUser");
        } else {
          alert("Cant delete account");
        }
      } catch (err) {
        console.error("Error while deleting", err);
      }
    }
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
      alert(data.message);
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
        if (!error && result && result.event === "success") {
          const imageUrl = result.info.secure_url;

          try {
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
              alert("Profile picture updated!");
            }
          } catch (err) {
            console.error("Database save failed", err);
          }
        }
      }
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await apiFetch(`/data/settings`);
        const data = await res.json();
        if (res.ok) {
          const finalPfp =
            !data.profilePic || data.profilePic === "/blank-pfp.png"
              ? "https://res.cloudinary.com/dpdidryxs/image/upload/v1776738351/blank-pfp_yk8bl5.png"
              : data.profilePic;
          setUser({
            username: data.username || "",
            password: "",
            profilePic: finalPfp,
          });
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
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
            <div
              className="pfpWrapper"
              onClick={openWidget}
              style={{ cursor: "pointer" }}
            >
              <img className={styles.img} src={user.profilePic} alt="Avatar" />
            </div>
            <p className={styles.user}>{user.username}</p>
          </Outline>
          <Outline variant="settings">
            <form onSubmit={handleInfoSubmit}>
              <Outline variant="info" legendText="Account Info">
                <div className={styles.info}>
                  <p className={styles.p}>Change Username:</p>
                  <InfoInput
                    name="usernameField"
                    variant="single"
                    placeholderText="Enter new username"
                  />
                </div>
                <div className={styles.info}>
                  <p className={styles.p}>Change Password:</p>
                  <InfoInput
                    name="passwordField"
                    variant="single"
                    placeholderText="Enter new password"
                  />
                </div>
                <div className={styles.buttonWrapper}>
                  <Button type="submit" variant="settings">
                    Submit
                  </Button>
                </div>
              </Outline>
              <Outline variant="acc" legendText="Utilities">
                <Button
                  variant="settings"
                  onClick={handleAccCode}
                  disabled={clicked}
                >
                  {accButtonText}
                </Button>
                <Button variant="settings" onClick={handleReport}>
                  Report
                </Button>
                <Button variant="settings" onClick={handleLogout}>
                  Log Out
                </Button>
                <div className={styles.deleteWrapper}>
                  <Button variant="settings" onClick={handleDelete}>
                    {confirm ? "Are you sure?" : "Delete Account"}
                  </Button>
                </div>
              </Outline>
            </form>
          </Outline>
        </div>
      </div>
    </AppLayout>
  );
}

export default SettingsPage;

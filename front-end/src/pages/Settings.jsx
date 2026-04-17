import Outline from "../components/Outline/Outline";
import styles from "./settings.module.css";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import AppLayout from "../AppLayout";
import { logout } from "../api";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const MOCK_PICSUM = [
  { id: 1, url: "https://picsum.photos/200" },
  { id: 2, url: "https://picsum.photos/200" },
  { id: 3, url: "https://picsum.photos/200" },
  { id: 4, url: "https://picsum.photos/200" },
  { id: 5, url: "https://picsum.photos/200" },
  { id: 6, url: "https://picsum.photos/200" },
];

function SettingsPage() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    profilePic: "/blank-pfp.png",
  });
  const [accButtonText, setAccButtonText] = useState("Account Code");
  const [clicked, setClicked] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [tempPfp, setTempPfp] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

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
        const res = await fetch(`/auth/users/${currentUser.id}`, {
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

  const handlePfp = async () => {
    if (tempPfp) {
      await fetch("/data/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePic: tempPfp }),
      });
      setUser((prev) => ({ ...prev, profilePic: tempPfp }));
    }
    setIsSelect(false);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUsername = formData.get("usernameField");
    const newPassword = formData.get("passwordField");

    const response = await fetch("/data/settings", {
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

  useEffect(() => {
    const loadData = async () => {
      const userRes = await fetch(`/data/settings?userId=${currentUser.id}`);
      const userData = await userRes.json();

      const settingsRes = await fetch("/data/settingsdata");
      const settingsData = await settingsRes.json();

      setUser({
        username: userData.username || "",
        password: "",
        profilePic: settingsData.profilePic || "/blank-pfp.png",
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
            <div className="pfpWrapper" onClick={() => setIsSelect(true)}>
              <img
                className={styles.img}
                src={isSelect ? tempPfp || user.profilePic : user.profilePic}
                alt="Avatar"
              />
            </div>
            {isSelect ? (
              <Button variant="settings" onClick={handlePfp}>
                Confirm
              </Button>
            ) : (
              <p className={styles.user}>{user.username}</p>
            )}
          </Outline>
          <Outline variant="settings">
            {!isSelect ? (
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
            ) : (
              <div className={styles.gallery}>
                {MOCK_PICSUM.map((photo) => (
                  <div
                    key={photo.id}
                    className={`${styles.galleryItem} ${
                      tempPfp === photo.url ? styles.activePhoto : ""
                    }`}
                    onClick={() => setTempPfp(photo.url)}
                  >
                    <img
                      src={photo.url}
                      alt="Option"
                      className={styles.galleryImg}
                    />
                  </div>
                ))}
              </div>
            )}
          </Outline>
        </div>
      </div>
    </AppLayout>
  );
}

export default SettingsPage;

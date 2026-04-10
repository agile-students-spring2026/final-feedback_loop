import Outline from "../components/Outline/Outline";
import styles from "./settings.module.css";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import AppLayout from "../AppLayout";

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
  fetch("/data/settings");
  const [username, setUsername] = useState("Username");
  const [accButtonText, setAccButtonText] = useState("Account Code");
  const [clicked, setClicked] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [currPfp, setCurrPfp] = useState("/blank-pfp.png");
  const [tempPfp, setTempPfp] = useState(false);

  const nav = useNavigate();
  const handleReport = () => {
    nav("/report");
  };
  const handleLogout = () => {
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

  const handleDelete = () => {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
    } else {
      setConfirm(false);
      nav("/register");
    }
  };

  const handlePfp = async () => {
    if (tempPfp) {
      setCurrPfp(tempPfp);
      await fetch("/data/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePic: tempPfp }),
      });
    }
    setIsSelect(false);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    const newUsername = e.target.elements.usernameField.value;
    const newPassword = e.target.elements.passwordField.value;

    try {
      const response = await fetch("/data/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      if (response.ok) {
        setUsername(newUsername);
        alert("Settings saved!");
      }
    } catch (err) {
      console.error("Failed to save settings");
    }
  };

  useEffect(() => {
    fetch("/data/settings")
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        if (data.profilePic) {
          setCurrPfp(data.profilePic);
        } else {
          setCurrPfp("/blank-pfp.png");
        }
      })
      .catch((err) => console.error("Error fetching settings:", err));
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
                src={isSelect ? tempPfp || currPfp : currPfp}
                alt="Avatar"
              />
            </div>
            {isSelect ? (
              <Button variant="settings" onClick={handlePfp}>
                Confirm
              </Button>
            ) : (
              <p className={styles.user}>{username}</p>
            )}
          </Outline>
          <Outline variant="settings">
            {!isSelect ? (
              <form action="/signin" method="POST" onSubmit={handleInfoSubmit}>
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

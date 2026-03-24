import Outline from "../components/Outline/Outline";
import styles from "./settings.module.css";
import blankPfp from "../assets/blank-pfp.png";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import AppLayout from "../AppLayout";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SettingsPage() {
  const nav = useNavigate();
  const handleReport = () => {
    nav("/report");
  };
  const handleLogout = () => {
    nav("/signin");
  };

  const [buttonText, setButtonText] = useState("Account Code");
  const [clicked, setClicked] = useState(false);
  const handleAccCode = async () => {
    const min = 1000000000;
    const max = 9999999999;
    const accCode = Math.floor(Math.random() * (max - min + 1)) + min;
    setButtonText(accCode);
    setClicked(true);
    try {
      await navigator.clipboard.writeText(accCode);
    } catch (err) {
      console.log("Failed to copy code");
    }
  };

  const [confirm, setConfirm] = useState(false);
  const handleDelete = () => {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
    } else {
      setConfirm(false);
      nav("/register");
    }
  };

  return (
    <AppLayout>
      <div className={styles.body}>
        <header className={styles.followHeader}>
          <h1 className={styles.followH1}>Settings</h1>
        </header>

        <div className={styles.settingsWrapper}>
          <Outline variant="pfp">
            <div className="pfpWrapper">
              <img className={styles.img} src={blankPfp} alt="Avatar" />
            </div>
            <p className={styles.user}>Username</p>
          </Outline>
          <Outline variant="settings">
            <form action="/signin" method="POST">
              <Outline variant="info" legendText="Account Info">
                <div className={styles.info}>
                  <p className={styles.p}>Change Username:</p>
                  <InfoInput
                    variant="single"
                    placeholderText="Enter new username"
                  />
                </div>
                <div className={styles.info}>
                  <p className={styles.p}>Change Password:</p>
                  <InfoInput
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
                  {buttonText}
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

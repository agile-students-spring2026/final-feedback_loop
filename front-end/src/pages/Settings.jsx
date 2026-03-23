import Outline from "../components/Outline/Outline";
import styles from "./settings.module.css";
import blankPfp from "../assets/blank-pfp.png";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const nav = useNavigate();
  const handleReport = () => {
    nav("/report");
  };
  const handleLogout = () => {
    nav("/login");
  };

  return (
    <div className={styles.body}>
      <Outline variant="pfp">
        <div className="pfpWrapper">
          <img className={styles.img} src={blankPfp} alt="Profile Picture" />
        </div>
        <p className={styles.user}>Username</p>
      </Outline>
      <Outline>
        <form action="/login" method="POST">
          <Outline variant="info" legendText="Account Info">
            <div className={styles.info}>
              <p className={styles.p}>Change Username:</p>
              <InfoInput placeholderText="Enter new username" />
            </div>
            <div className={styles.info}>
              <p className={styles.p}>Change Password:</p>
              <InfoInput placeholderText="Enter new password" />
            </div>
            <div className={styles.buttonWrapper}>
              <Button type="submit" variant="submit">
                Submit
              </Button>
            </div>
          </Outline>
          <Outline variant="acc" legendText="Utilities">
            <Button variant="accCode">Account Code</Button>
            <Button variant="report" onClick={handleReport}>
              Report
            </Button>
            <Button variant="logout" onClick={handleLogout}>
              Log Out
            </Button>
            <Button variant="delete">Delete Account</Button>
          </Outline>
        </form>
      </Outline>
    </div>
  );
}

export default SettingsPage;

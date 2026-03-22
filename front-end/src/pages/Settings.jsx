import Outline from "../components/Outline/Outline";
import styles from "./settings.module.css";
import blankPfp from "../assets/blank-pfp.png";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";

function SettingsPage() {
  return (
    <div className={styles.body}>
      <Outline variant="pfp">
        <div className="pfpWrapper">
          <img className={styles.img} src={blankPfp} alt="Profile Picture" />
        </div>
      </Outline>
      <Outline>
        <Outline variant="info" legendText="Account Info">
          <div className={styles.info}>
            <p className={styles.p}>Change Username:</p>
            <InfoInput placeholderText="Enter new username" />
          </div>
          <div className={styles.info}>
            <p className={styles.p}>Change Password:</p>
            <InfoInput placeholderText="Enter new password" />
          </div>
        </Outline>
        <Outline variant="acc" legendText="Utilities">
          <Button variant="accCode">Account Code</Button>
          <Button variant="report">Report</Button>
          <Button variant="logout">Log Out</Button>
          <Button variant="delete">Delete Account</Button>
        </Outline>
      </Outline>
    </div>
  );
}

export default SettingsPage;

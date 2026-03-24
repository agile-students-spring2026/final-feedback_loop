import styles from "./reportForm.module.css";
import Outline from "../components/Outline/Outline";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import AppLayout from "../AppLayout";

import { useNavigate } from "react-router-dom";

function ReportForm() {
  const nav = useNavigate();
  const handleClick = () => {
    nav("/settings");
  };
  return (
    <AppLayout>
      <div className={styles.body}>
        <header className={styles.followHeader}>
          <h1 className={styles.followH1}>Report</h1>
        </header>
        <div className={styles.reportWrapper}>
          <Outline variant="report">
            <InfoInput
              variant="single"
              placeholderText="Offender's account code"
            />
            <InfoInput variant="single" placeholderText="Your account code" />
            <div className={styles.inputWrapper}>
              <textarea
                className={styles.textarea}
                placeholder="State your reasoning"
              />
            </div>
            <div className={styles.buttonWrapper}>
              <Button variant="settings" type="submit" onClick={handleClick}>
                Submit
              </Button>
            </div>
          </Outline>
        </div>
      </div>
    </AppLayout>
  );
}

export default ReportForm;

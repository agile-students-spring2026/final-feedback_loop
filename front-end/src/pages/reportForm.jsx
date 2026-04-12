import styles from "./reportForm.module.css";
import Outline from "../components/Outline/Outline";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import AppLayout from "../AppLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReportForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [offender, setOffender] = useState("");
  const [reporter, setReporter] = useState("");
  const [reason, setReason] = useState("");
  const nav = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offender, reporter, reason }),
    })
      .then((res) => res.json())
      .then(() => setIsSubmitted(true))
      .catch((err) => console.error(err));
  };
  const handleClose = () => {
    setIsSubmitted(false);
    nav("/settings");
  };
  return (
    <>
      <AppLayout>
        <div className={styles.body}>
          <header className="header">
            <h1 className="h1">Report</h1>
          </header>
          
          <div className={styles.reportWrapper}>
            <Outline variant="report">
              <InfoInput
                variant="single"
                placeholderText="Offender's account code"
                value={offender}
                onChange={(e) => setOffender(e.target.value)}
              />
              <InfoInput
                variant="single"
                placeholderText="Your account code"
                value={reporter}
                onChange={(e) => setReporter(e.target.value)}
              />
              <div className={styles.inputWrapper}>
                <textarea
                  className={styles.textarea}
                  placeholder="State your reasoning"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div className={styles.buttonWrapper}>
                <Button variant="settings" type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </Outline>
          </div>
        </div>
      </AppLayout>
      {isSubmitted && (
        <div className={styles.confirmWindow}>
          <div className={styles.confirmContent}>
            <h2>Report Submitted</h2>
            <p>Thank you for your report.</p>
            <Button variant="settings" onClick={handleClose}>
              Return to Settings
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportForm;

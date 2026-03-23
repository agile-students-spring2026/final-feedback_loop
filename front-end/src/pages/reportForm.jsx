import styles from "./reportForm.module.css";
import Outline from "../components/Outline/Outline";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";

function ReportForm() {
  const nav = useNavigate();
  const handleClick = () => {
    nav("/login");
  };
  return (
    <div className={styles.body}>
      <p className={styles.p}>Report</p>
      <Outline variant="report">
        <InfoInput placeholderText="Username of offender" />
        <InfoInput placeholderText="Offender's account code" />
        <InfoInput placeholderText="Your account code" />
        <div className={styles.inputWrapper}>
          <textarea
            className={styles.textarea}
            placeholder="State your reasoning"
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button variant="submit" type="submit" onClick={handleClick}>
            Submit
          </Button>
        </div>
      </Outline>
    </div>
  );
}

export default ReportForm;

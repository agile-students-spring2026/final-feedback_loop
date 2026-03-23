import { useState } from "react";
import Outline from "../components/Outline/Outline";
import styles from "./loginPages.module.css";
import styles2 from "./register.module.css";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import { Link } from "react-router-dom";

function Register() {
  const [error, setError] = useState("");

  const checkPasses = (e) => {
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      e.preventDefault();
      setError("Passwords do not match!");
    }
  };

  return (
    <div className={styles.body}>
      <section className="registerPage">
        <Outline variant="register">
          <form action="/login" method="POST" onSubmit={checkPasses}>
            <p className={styles.signHead}>Register</p>
            <Link to="/signin" className={styles.switchPage}>
              or Sign in?
            </Link>
            <div className={styles.usernameDiv}>
              <InfoInput
                type="email"
                variant="username"
                placeholderText="Email Address"
                autoComplete="new-password"
                required
              />
            </div>
            <div className={styles.passwordDiv}>
              <InfoInput
                name="password"
                type="password"
                variant="password"
                placeholderText="Password"
                required
              />
            </div>
            <div className={styles2.confirmPass}>
              <InfoInput
                name="confirm"
                type="password"
                variant="password"
                placeholderText="Confirm Password"
                required
                autoComplete="new-password"
              />
            </div>
            {error && <p className={styles2.errorMsg}>{error}</p>}
            <Button type="submit" variant="submit">
              <p>Join Us!</p>
            </Button>
          </form>
        </Outline>
      </section>
    </div>
  );
}

export default Register;

import Outline from "../components/Outline/Outline";
import styles from "./loginPages.module.css";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        navigate("/explore");
      } else {
        setError("Invalid sign in");
      }
    } catch (err) {
      setError("Try again");
    }
  };

  return (
    <div className={styles.body}>
      <section className="sign-in">
        <Outline variant="test">
          <form onSubmit={handleSubmit}>
            <p className={styles.signHead}>Sign in</p>
            <Link to="/register" className={styles.switchPage}>
              or Register?
            </Link>
            <div className={styles.usernameDiv}>
              <InfoInput
                name="email"
                variant="test"
                placeholderText="Email"
                required
              />
            </div>
            <div className={styles.passwordDiv}>
              <InfoInput
                name="password"
                type="password"
                variant="test"
                placeholderText="Password"
                required
              />
            </div>{" "}
            {error && <p className={styles.errorMsg}>{error}</p>}
            <div className={styles.buttonWrapper}>
              <Button type="submit" variant="settings">
                Jump in!
              </Button>
            </div>
          </form>
        </Outline>
      </section>
    </div>
  );
}

export default SignIn;

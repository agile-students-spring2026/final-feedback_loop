import Outline from "../components/Outline/Outline";
import styles from "./loginPages.module.css";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import { Link } from "react-router-dom";

function SignIn() {
  return (
    <div className={styles.body}>
      <section className="sign-in">
        <Outline variant="sign">
          <form action="/login" method="POST">
            <p className={styles.signHead}>Sign in</p>
            <Link to="/register" className={styles.switchPage}>
              or Register?
            </Link>
            <div className={styles.usernameDiv}>
              <InfoInput
                variant="username"
                placeholderText="Email/Username"
                required
              />
            </div>
            <div className={styles.passwordDiv}>
              <InfoInput
                type="password"
                variant="password"
                placeholderText="Password"
                required
              />
            </div>
            <Button type="submit" variant="submit">
              <p>Jump in!</p>
            </Button>
          </form>
        </Outline>
      </section>
    </div>
  );
}

export default SignIn;

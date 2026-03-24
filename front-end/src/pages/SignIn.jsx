import Outline from "../components/Outline/Outline";
import styles from "./loginPages.module.css";
import InfoInput from "../components/InfoInput/InfoInput";
import Button from "../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/explore");
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
                variant="test"
                placeholderText="Email/Username"
                required
              />
            </div>
            <div className={styles.passwordDiv}>
              <InfoInput
                type="password"
                variant="test"
                placeholderText="Password"
                required
              />
            </div>
            <Button type="submit" variant="test">
              <p>Jump in!</p>
            </Button>
          </form>
        </Outline>
      </section>
    </div>
  );
}

export default SignIn;

import styles from "./button.module.css";

function Button({ variant = "accCode", children, type = "button", onClick }) {
  let className = styles.accCode;

  if (variant === "report") {
    className = styles.report;
  } else if (variant === "logout") {
    className = styles.logout;
  } else if (variant === "delete") {
    className = styles.delete;
  } else if (variant === "submit") {
    className = styles.submit;
  }

  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;

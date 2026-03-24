import styles from "./infoInput.module.css";

function InfoInput({
  type = "text",
  placeholderText,
  variant = "main",
  ...props
}) {
  let className = styles.mainInput;

  if (variant === "username") {
    className = styles.username;
  } else if (variant === "password") {
    className = styles.password;
  } else if (variant === "single") {
    className = styles.single;
  }

  return (
    <input
      className={className}
      type={type}
      placeholder={placeholderText}
      {...props}
    ></input>
  );
}

export default InfoInput;

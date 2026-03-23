import styles from "./outline.module.css";

function Outline({ children, variant = "main", legendText }) {
  let Element = "div";
  let className = styles.mainOutline;
  let legend = null;

  // switches type of outline and element type based on inputs
  if (variant === "info") {
    className = styles.infoOutline;
    Element = "fieldset";
  } else if (variant === "acc") {
    className = styles.accOutline;
    Element = "fieldset";
  } else if (variant === "pfp") {
    className = styles.pfpOutline;
  } else if (variant === "sign") {
    className = styles.signOutline;
  } else if (variant === "register") {
    className = styles.regisOutline;
  } else if (variant === "report") {
    className = styles.reportOutline;
  }

  if (Element === "fieldset" && legendText) {
    legend = <legend className={styles.legend}>{legendText}</legend>;
  }

  return (
    <Element className={className}>
      {legend}
      {children}
    </Element>
  );
}

export default Outline;

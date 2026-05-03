export default function PlaceholderImage({ name }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(var(--dark-indigo), var(--eggplant))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.3rem",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="9" cy="12" r="2" />
        <path d="M15 9l2 2-2 2" />
      </svg>
      <span
        style={{
          fontSize: "0.6rem",
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "1px",
          textTransform: "uppercase",
          maxWidth: "90%",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import listIcon from "./assets/list.svg";
import { getUser } from "./api";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onBurgerClick }) => {
  const user = getUser();
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(
    () => JSON.parse(localStorage.getItem("authUser") || "{}").profilePic
  );

  useEffect(() => {
    const handleStorage = () => {
      const stored = JSON.parse(localStorage.getItem("authUser") || "{}");
      setProfilePic(stored.profilePic);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <nav className="nav">
      <button className="burger" onClick={onBurgerClick}>
        <img src={listIcon} alt="menu" className="burger-icon" />
      </button>
      <div className="appLogo">
        <img
          src="https://res.cloudinary.com/dpdidryxs/image/upload/v1776740679/b53003b87e9aa0e57c4b63bd5d18db06_phrqp9.png"
          alt="Logo"
          style={{ height: "40px", width: "auto" }}
        />
      </div>
      {user && (
        <button
          onClick={() => navigate("/settings")}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {profilePic ? (
            <img
              src={profilePic}
              alt={user.username}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "2px solid #000",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "2px solid #000",
                background: "var(--dark-eggplant)",
                color: "var(--pale-lavender)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {user.username?.[0]?.toUpperCase()}
            </div>
          )}
        </button>
      )}
    </nav>
  );
};

export default Navbar;
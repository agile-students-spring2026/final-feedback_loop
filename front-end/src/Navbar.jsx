import React from "react";
import listIcon from "./assets/list.svg"
import { getUser } from "./api";

const Navbar = ({ onBurgerClick }) => {
  const user = getUser();
  return (
    <nav className="nav">
      <button className="burger" onClick={onBurgerClick}>
        <img src={listIcon} alt="menu" className="burger-icon" />
      </button>
      <div className="logo">Feedback Loop</div>
      {user?.username && (
        <span style={{ marginLeft: "auto", fontSize: "0.75rem", opacity: 0.8 }}>
          @{user.username}
        </span>
      )}
    </nav>
  );
};

export default Navbar;
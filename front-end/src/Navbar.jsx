import React from "react";
import listIcon from "./assets/list.svg";
import { getUser } from "./api";

const Navbar = ({ onBurgerClick }) => {
  const user = getUser();
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
      {user?.username && (
        <span style={{ marginLeft: "auto", fontSize: "0.75rem", opacity: 0.8 }}>
          @{user.username}
        </span>
      )}
    </nav>
  );
};

export default Navbar;

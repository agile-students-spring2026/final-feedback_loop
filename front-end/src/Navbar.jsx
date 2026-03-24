import React from "react";
import listIcon from "./assets/list.svg"

const Navbar = ({ onBurgerClick }) => {
  return (
    <nav className="nav">
      <button className="burger" onClick={onBurgerClick}>
        <img src={listIcon} alt="menu" className="burger-icon" />
      </button>
      <div className="logo">[ LOGO ]</div>
    </nav>
  );
};

export default Navbar;
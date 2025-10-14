import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🎥 Streamia</div>
      <ul className="navbar-links">
        <li>Inicio</li>
        <li>Series</li>
        <li>Películas</li>
        <li>Mi lista</li>
      </ul>
      <div className="navbar-profile">
        <img
          src="https://via.placeholder.com/32"
          alt="Perfil"
          className="profile-avatar"
        />
      </div>
    </nav>
  );
}

export default Navbar;

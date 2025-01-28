import React from "react";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="/" className="nav-link">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/about" className="nav-link">
              About
            </a>
          </li>
          <li className="nav-item">
            <a href="/services" className="nav-link">
              Daily
            </a>
          </li>
          <li className="nav-item">
            <a href="/services" className="nav-link">
              Events
            </a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-link">
              Contact Us
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

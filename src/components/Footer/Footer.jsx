import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Footer.scss";

import instaLogo from "../../assets/icons/social-instagram.png";
import twitterLogo from "../../assets/icons/social-twitter.png";
import facebookLogo from "../../assets/icons/social-facebook.png";
import whatsappLogo from "../../assets/icons/social-whatsapp.png";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  return (
    <div className="footer-container">
      <footer>
        <div className="logo">
          <h2>The Works</h2>
        </div>
        <nav className="navbar">
          <ul className="nav-menu">
            <li className="nav-item"><a href="/" className="nav-link">Home</a></li>
            <li className="nav-item"><a href="/about" className="nav-link">About</a></li>
            <li className="nav-item"><a href="/services" className="nav-link">Daily</a></li>
            <li className="nav-item"><a href="/services" className="nav-link">Events</a></li>
            <li className="nav-item"><a href="/contact" className="nav-link">Contact Us</a></li>
          </ul>
        </nav>
        <div className="socials">
          <a href="https://twitter.com" target="_blank" rel="noreferrer"><img src={twitterLogo} alt="Twitter" /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer"><img src={instaLogo} alt="Instagram" /></a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer"><img src={facebookLogo} alt="Facebook" /></a>
          <a href="https://whatsapp.com" target="_blank" rel="noreferrer"><img src={whatsappLogo} alt="WhatsApp" /></a>
        </div>
        <hr />
        <div className="copyrights">
          <p>@2025 The Works. All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

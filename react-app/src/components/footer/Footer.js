import React from "react";
import "./footer.css";
function Footer() {
  return (
    <div className="footer-div">
      <div className="footer-wrapper">
        <h1 className="footer-logo" href="/">
          Dronest
        </h1>
        <ul className="footer-ul">
          <li>
            <i className="fas fa-home icon2"></i>
            <a href="/" className="footer-a">
              Home
            </a>
          </li>
          <li>
            <i className="fab fa-github icon2"></i>
            <a
              href="https://github.com/tonyngophd/dronest"
              className="footer-a"
            >
              Github
            </a>
          </li>
          <li>
            <i className="fab fa-linkedin icon2"></i>
            <a
              href="https://www.linkedin.com/in/adam-faidy-bb8784105/"
              className="footer-a"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;

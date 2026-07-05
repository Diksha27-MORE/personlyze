import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow"></div>

      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-left">
            <p className="footer-tag">
              PERSONLYZE AI
            </p>

            <h2 className="footer-title">
              Ready to Create <br />
              Personalized Customer Experiences?
            </h2>

            <p className="footer-text">
              Transform every customer interaction into a unique,
              AI-powered personalized experience that increases
              engagement, conversions, and loyalty.
            </p>

            <button className="footer-btn">
              Book a Demo
            </button>
          </div>

          <div className="footer-links">
            <div>
              <h4>Company</h4>

              <a href="/">Home</a>
              <a href="/">About</a>
              <a href="/">Contact</a>
              <a href="/">Careers</a>
            </div>

            <div>
              <h4>Solutions</h4>

              <a href="/">Retail</a>
              <a href="/">Automotive</a>
              <a href="/">Healthcare</a>
              <a href="/">Travel</a>
            </div>

            <div>
              <h4>Resources</h4>

              <a href="/">Blog</a>
              <a href="/">Case Studies</a>
              <a href="/">Privacy</a>
              <a href="/">Terms</a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>© 2026 Personlyze AI. All rights reserved.</p>

          <button
            className="footer-top-btn"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
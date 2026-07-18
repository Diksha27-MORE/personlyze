import React from "react";
import "./Footer.css";

export default function Footer() {
  const handleBookDemo = () => {
    const phone = "919819104471";

    const message = encodeURIComponent(` Hi, I'd like to book a demo of Personlyze AI for my business. 
Details below.

Name:
Company:
Website:
Email`);

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <footer className="footer">
      <div className="footer-glow"></div>

      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-left">
            <h2 className="footer-title">
              Ready to Create <br />
              Personalized Customer Experiences?
            </h2>

            <p className="footer-text">
              Transform every customer interaction into a unique,
              AI-powered personalized experience that increases
              engagement, conversions, and loyalty.
            </p>

            <button
              className="footer-btn"
              onClick={handleBookDemo}
            >
              Book a Demo
            </button>
          </div>

          <div className="footer-links">
            <div>
              <h4>Company</h4>

              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </div>

            <div>
              <h4>Solutions</h4>

              <a href="/industries/real-estate">Real Estate</a>
              <a href="/industries/bfsi">BFSI</a>
              <a href="/industries/travel">Travel</a>
              <a href="/industries/healthcare">Healthcare</a>
              <a href="/industries/retail">Retail</a>
              <a href="/industries/automotive">Automotive</a>
              <a href="/industries/b2b-saas">B2B & SaaS</a>
              <a href="/industries/tech-startups">Tech & Startups</a>
              <a href="/industries/fashion">Fashion</a>
            </div>

            <div>
              <h4>Contact</h4>

              <a href="mailto:nitin@personlyze.ai">
                nitin@personlyze.ai
              </a>

              <a href="tel:+919819104471">
                +91 98191 04471
              </a>
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
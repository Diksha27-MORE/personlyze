import { useState, useEffect } from "react";
import "./Hero.css";
import backgroundVideo from "../assets/hero-video.mp4";
import mobileHeroVideo from "../assets/hero-mobile.mp4";
import LogoAnimation from "../assets/Logo animation new.webm";

const NAV_ITEMS = [
  { label: "Who We Are", id: "who-we-are" },
  { label: "Why Personlyze AI", id: "why-personlyze" },
  { label: "What We Do", id: "what-we-do" },
  { label: "Solutions", id: "solutions" },
  { label: "Connect With Us", id: "contact" },
];

function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll while the menu is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.dataset.scrollY = String(scrollY);
    } else {
      const scrollY = document.body.dataset.scrollY || "0";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY, 10));
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (id) => {
    setIsOpen(false);
    // Wait for the panel to start closing before scrolling so the
    // transition feels smooth rather than an abrupt cut.
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  };

  return (
    <>
      {/* Hamburger trigger button */}
      <button
        className={`nav-hamburger-btn ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span className="nav-hamburger-line" />
        <span className="nav-hamburger-line" />
        <span className="nav-hamburger-line" />
      </button>

      {/* Dark overlay */}
      <div
        className={`nav-overlay ${isOpen ? "is-visible" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      {/* Slide-in panel */}
      <nav
        className={`nav-panel ${isOpen ? "is-open" : ""}`}
        aria-hidden={!isOpen}
      >
        <button
          className="nav-panel-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          &times;
        </button>

        <ul className="nav-panel-list">
          {NAV_ITEMS.map((item, index) => (
            <li
              key={item.id}
              className="nav-panel-item"
              style={{ transitionDelay: isOpen ? `${0.08 * index + 0.15}s` : "0s" }}
            >
              <button
                className="nav-panel-link"
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-panel-link__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="nav-panel-link__label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-panel-footer">
          <span className="nav-panel-footer__brand">personlyze.ai</span>
        </div>
      </nav>
    </>
  );
}

function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkScreen(); // Run once on page load

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    mediaQuery.addEventListener("change", checkScreen);

    return () => {
      mediaQuery.removeEventListener("change", checkScreen);
    };
  }, []);

  const handleBookDemo = () => {
    const section = document.getElementById("who-we-are");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="hero">

      {/* Background Video */}
      <video
        key={isMobile ? "mobile" : "desktop"}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src={isMobile ? mobileHeroVideo : backgroundVideo}
          type="video/mp4"
        />
      </video>

      <div className="overlay"></div>

      {/* Premium hamburger nav — floats above all Hero content */}
      <NavMenu />

      {/* Headline — sits above the personlyze.ai logo, left aligned, one line */}
      <div className="hero-headline">
        <span className="hero-headline__line" aria-hidden="true" />
        <span className="hero-headline__text">
          The future of marketing is not loud. Its human.
        </span>
      </div>

      <div className="hero-center">

        {/* Logo */}
        <div className="hero-left">
          <video
            className="hero-logo-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={LogoAnimation} type="video/webm" />
          </video>
        </div>

        {/* Text */}
        
        <div className="hero-right">
          <h1 className="hero-brand">
            <span className="brand-name">personlyze</span>
            <span className="brand-dot">.</span>
            <span className="brand-ai">ai</span>
          </h1>

          <div className="hero-tagline">
            <span className="strategy">strategy-first</span>
            <span className="personalization">personalization</span>
          </div>
        </div>
          

        {/* Button */}
        <button
          className="hero-demo-btn"
          onClick={handleBookDemo}
        >
          <span className="hero-demo-btn__label">Know More</span>
          <span className="hero-demo-btn__arrow">↓</span>
        </button>

      </div>
    </section>
  );
}

export default Hero;
import { useState, useEffect, useRef } from "react";
import "./Hero.desktop.css";
import "./Hero.mobile.css";
import backgroundVideo from "../assets/hero-video.mp4";
//import mobileHeroVideo from "../assets/hero-mobile.mp4";
import LogoAnimation from "../assets/Logo animation new.webm";
import logoStatic from "../assets/logo.png";

const mobileHeroVideo =
 "https://res.cloudinary.com/t4s8m2hn/video/upload/w_720,q_auto,f_auto,fl_faststart/hero-mobile_ewaryl.mp4"

const NAV_ITEMS = [
  { label: "Who We Are", id: "who-we-are" },
  { label: "Why Personlyze AI", id: "why-personlyze" },
  { label: "What We Do", id: "what-we-do" },
  { label: "Solutions", id: "solutions" },
  { label: "Connect With Us", id: "contact" },
];

function getIsMobile() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

function NavMenu({ revealed }) {
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
        className={`nav-hamburger-btn reveal-item ${revealed ? "is-revealed" : ""} ${isOpen ? "is-open" : ""}`}
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
  // Resolve synchronously so the correct source is picked before first paint —
  // avoids ever mounting the desktop video on a mobile device.
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0); // 0 hidden, 1 first line, 2 both, 3 fading out
  const [revealed, setRevealed] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const checkScreen = () => setIsMobile(mediaQuery.matches);
    checkScreen();
    mediaQuery.addEventListener("change", checkScreen);
    return () => mediaQuery.removeEventListener("change", checkScreen);
  }, []);

  // Ensure the <video> element actually reloads when the source changes
  // (mobile <-> desktop), since updating a <source> src alone won't do it.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [isMobile]);

  // Intro cinematic sequence
  // 1) "The future of marketing is not loud." holds ~3s
  // 2) "It's human." appears, both lines hold together ~1.5s
  // 3) Smooth fade out
  // 4) Hero content reveals only after the fade completes
  useEffect(() => {
    const LINE1_APPEAR = 100;     // line 1 fades in
    const LINE1_HOLD = 3000;      // line 1 holds alone for ~3s
    const BOTH_HOLD = 1500;       // both lines hold together for ~1.5s
    const FADE_OUT = 800;         // smooth fade out duration

    const t1 = setTimeout(() => setIntroStep(1), LINE1_APPEAR);
    const t2 = setTimeout(() => setIntroStep(2), LINE1_APPEAR + LINE1_HOLD);
    const t3 = setTimeout(
      () => setIntroStep(3),
      LINE1_APPEAR + LINE1_HOLD + BOTH_HOLD
    );
    const t4 = setTimeout(() => {
      setShowIntro(false);
      setRevealed(true);
    }, LINE1_APPEAR + LINE1_HOLD + BOTH_HOLD + FADE_OUT);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  const handleBookDemo = () => {
    const section = document.getElementById("who-we-are");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className={`hero ${revealed ? "is-revealed" : "is-intro"}`}>
      {/* Background Video — mobile gets hero-mobile.mp4 only, desktop gets hero-video.mp4 only */}
      <video
        ref={videoRef}
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

      {/* Cinematic intro overlay */}
      {showIntro && (
        <div className={`hero-intro step-${introStep}`}>
          <div className="hero-intro__inner">
            <p className="hero-intro__line hero-intro__line--1">
              The future of marketing<br />is not loud.
            </p>
            <p className="hero-intro__line hero-intro__line--2">
              It's human.
            </p>
          </div>
        </div>
      )}

      {/* Premium hamburger nav */}
      <NavMenu revealed={revealed} />

      <div className="hero-center">
        {/* Logo — static image on mobile, animated webm on desktop only */}
        <div className={`hero-left reveal-item ${revealed ? "is-revealed" : ""}`}>
          {isMobile ? (
            <img
              className="hero-logo-image"
              src={logoStatic}
              alt="personlyze.ai logo"
            />
          ) : (
            <video
              className="hero-logo-video"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={LogoAnimation} type="video/webm" />
            </video>
          )}
        </div>
        {/* Text */}
        <div className={`hero-right reveal-item ${revealed ? "is-revealed" : ""}`}>
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
          className={`hero-demo-btn reveal-item ${revealed ? "is-revealed" : ""}`}
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
import { useState, useEffect, useRef } from "react";
import "./Hero.desktop.css";
import "./Hero.mobile.css";
import backgroundVideo from "../assets/hero-video.mp4";
import LogoAnimation from "../assets/Logo animation new.webm";
import logoStatic from "../assets/logo.png";

const mobileHeroVideo =
  "https://res.cloudinary.com/t4s8m2hn/video/upload/v1784388112/hero-mobile_ewaryl.mp4";

const INTRO_PLAYED_KEY = "personlyze:heroIntroPlayed";

function hasIntroPlayed() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(INTRO_PLAYED_KEY) === "1";
  } catch {
    return false;
  }
}
function markIntroPlayed() {
  try {
    window.sessionStorage.setItem(INTRO_PLAYED_KEY, "1");
  } catch {}
}

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

      <div
        className={`nav-overlay ${isOpen ? "is-visible" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

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
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const isMobileRef = useRef(isMobile);

  // If the intro already played this session, skip it entirely on mount.
  const alreadyPlayed = hasIntroPlayed();

  // Desktop cinematic intro (UNCHANGED behavior on first load)
  const [showIntro, setShowIntro] = useState(!alreadyPlayed);
  const [introStep, setIntroStep] = useState(0);

  // Mobile split-screen intro
  const [showMobileIntro, setShowMobileIntro] = useState(!alreadyPlayed);
  const [mobileIntroStep, setMobileIntroStep] = useState(0);

  const [revealed, setRevealed] = useState(alreadyPlayed);
  const videoRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const checkScreen = () => setIsMobile(mediaQuery.matches);
    checkScreen();
    mediaQuery.addEventListener("change", checkScreen);
    return () => mediaQuery.removeEventListener("change", checkScreen);
  }, []);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [isMobile]);

  // Desktop intro cinematic sequence (UNCHANGED)
  useEffect(() => {
    if (isMobileRef.current) return;
    if (alreadyPlayed) return; // skip on remount

    const LINE1_APPEAR = 100;
    const LINE1_HOLD = 3000;
    const BOTH_HOLD = 1500;
    const FADE_OUT = 800;

    const t1 = setTimeout(() => setIntroStep(1), LINE1_APPEAR);
    const t2 = setTimeout(() => setIntroStep(2), LINE1_APPEAR + LINE1_HOLD);
    const t3 = setTimeout(
      () => setIntroStep(3),
      LINE1_APPEAR + LINE1_HOLD + BOTH_HOLD
    );
    const t4 = setTimeout(() => {
      setShowIntro(false);
      setRevealed(true);
      markIntroPlayed();
    }, LINE1_APPEAR + LINE1_HOLD + BOTH_HOLD + FADE_OUT);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, [alreadyPlayed]);

  // Mobile split-screen intro sequence
  useEffect(() => {
    if (!isMobileRef.current) return;
    if (alreadyPlayed) return; // skip on remount

    const TOP_APPEAR = 100;
    const TOP_HOLD = 3000;
    const BOTTOM_HOLD = 2000;
    const FADE_OUT = 900;

    const t1 = setTimeout(() => setMobileIntroStep(1), TOP_APPEAR);
    const t2 = setTimeout(() => setMobileIntroStep(2), TOP_APPEAR + TOP_HOLD);
    const t3 = setTimeout(
      () => setMobileIntroStep(3),
      TOP_APPEAR + TOP_HOLD + BOTTOM_HOLD
    );
    const t4 = setTimeout(() => {
      setShowMobileIntro(false);
      setRevealed(true);
      markIntroPlayed();
    }, TOP_APPEAR + TOP_HOLD + BOTTOM_HOLD + FADE_OUT);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, [alreadyPlayed]);

  const handleBookDemo = () => {
    const section = document.getElementById("who-we-are");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const videoHiddenForMobileIntro = isMobile && !revealed;

  return (
    <section className={`hero ${revealed ? "is-revealed" : "is-intro"}`}>
      <video
        ref={videoRef}
        className={`hero-video ${videoHiddenForMobileIntro ? "is-preloading" : "is-ready"}`}
        autoPlay muted loop playsInline preload="auto"
      >
        <source src={isMobile ? mobileHeroVideo : backgroundVideo} type="video/mp4" />
      </video>
      <div className="overlay"></div>

      {!isMobile && showIntro && (
        <div className={`hero-intro step-${introStep}`}>
          <div className="hero-intro__inner">
            <p className="hero-intro__line hero-intro__line--1">
              The future of marketing<br />is not loud.
            </p>
            <p className="hero-intro__line hero-intro__line--2">It's human.</p>
          </div>
        </div>
      )}

      {isMobile && showMobileIntro && (
        <div className={`mobile-split-intro step-${mobileIntroStep}`}>
          <div className="mobile-split-intro__half mobile-split-intro__half--top">
            <p className="mobile-split-intro__top-text">
              THE FUTURE OF MARKETING IS NOT LOUD.
            </p>
          </div>
          <div className="mobile-split-intro__half mobile-split-intro__half--bottom">
            <p className="mobile-split-intro__bottom-word">it's human.</p>
          </div>
        </div>
      )}

      <NavMenu revealed={revealed} />

      {isMobile ? (
        <div className="hero-center hero-center--mobile">
          <div className={`hero-mobile-stack reveal-item ${revealed ? "is-revealed" : ""}`}>
            <h1 className="hero-brand">
              <span className="brand-name">personlyze</span>
              <span className="brand-dot">.</span>
              <span className="brand-ai">ai</span>
            </h1>
            <div className="hero-tagline">
              <span className="strategy">Strategy First</span>
              <span className="tagline-sep" aria-hidden="true">|</span>
              <span className="personalization">Personalization</span>
            </div>
            <div className="hero-logo-wrap">
              <video className="hero-logo-video" autoPlay loop muted playsInline preload="auto">
                <source src={LogoAnimation} type="video/webm" />
              </video>
            </div>
            <button className="hero-demo-btn" onClick={handleBookDemo}>
              <span className="hero-demo-btn__label">Know More</span>
              <span className="hero-demo-btn__arrow">↓</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="hero-center">
          <div className={`hero-left reveal-item ${revealed ? "is-revealed" : ""}`}>
            <video className="hero-logo-video" autoPlay loop muted playsInline>
              <source src={LogoAnimation} type="video/webm" />
            </video>
          </div>
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
          <button
            className={`hero-demo-btn reveal-item ${revealed ? "is-revealed" : ""}`}
            onClick={handleBookDemo}
          >
            <span className="hero-demo-btn__label">Know More</span>
            <span className="hero-demo-btn__arrow">↓</span>
          </button>
        </div>
      )}
    </section>
  );
}

export default Hero;

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
  if (typeof window === "undefined") return;
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
  // --- Device detection (deterministic on mount) ---------------------------
  // Initial render: assume desktop on SSR, correct value on CSR.
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const isMobileRef = useRef(isMobile);

  // --- Intro state ---------------------------------------------------------
  // IMPORTANT: do NOT read sessionStorage during initial state.
  // That produces SSR/CSR mismatches and race conditions with the intro
  // effects. We initialize to "playing" and correct it in a mount effect
  // BEFORE any timer effect runs (both are useEffect so ordering is stable).
  const [introDecided, setIntroDecided] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showMobileIntro, setShowMobileIntro] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [mobileIntroStep, setMobileIntroStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  // Guards against StrictMode double-invoke and cross-branch double start.
  const didStartRef = useRef(false);
  const videoRef = useRef(null);
  const currentVideoSrcRef = useRef(null);

  // Keep isMobile ref in sync (used only by non-timer callbacks).
  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  // Track viewport changes.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const checkScreen = () => setIsMobile(mediaQuery.matches);
    checkScreen();
    mediaQuery.addEventListener("change", checkScreen);
    return () => mediaQuery.removeEventListener("change", checkScreen);
  }, []);

  // Decide, exactly once on mount, whether the intro should play this session.
  // Runs before the timer effects observe `introDecided`, so timers won't
  // start with the wrong intent.
  useEffect(() => {
    const played = hasIntroPlayed();
    if (played) {
      setShowIntro(false);
      setShowMobileIntro(false);
      setRevealed(true);
    } else {
      // Show the correct branch for the current viewport ONLY.
      const mobile = getIsMobile();
      setShowIntro(!mobile);
      setShowMobileIntro(mobile);
      setRevealed(false);
    }
    setIntroDecided(true);
  }, []);

  // Video (re)load — only when the source actually changes, and never while
  // the intro is running (prevents re-render churn during the intro).
  useEffect(() => {
    if (!introDecided) return;
    if (!revealed) return; // wait until intro is done to touch the video
    const el = videoRef.current;
    if (!el) return;
    const nextSrc = isMobile ? mobileHeroVideo : backgroundVideo;
    if (currentVideoSrcRef.current === nextSrc) return;
    currentVideoSrcRef.current = nextSrc;
    try {
      el.load();
      el.play().catch(() => {});
    } catch {}
  }, [isMobile, introDecided, revealed]);

  // Desktop intro sequence.
  useEffect(() => {
    if (!introDecided) return;
    if (!showIntro) return;
    if (didStartRef.current) return;
    didStartRef.current = true;

    // Mark as played immediately so a route change mid-intro still
    // suppresses replay on return.
    markIntroPlayed();

    const LINE1_APPEAR = 100;
    const LINE1_HOLD = 3000;
    const BOTH_HOLD = 1500;
    const FADE_OUT = 800;

    const timers = [
      setTimeout(() => setIntroStep(1), LINE1_APPEAR),
      setTimeout(() => setIntroStep(2), LINE1_APPEAR + LINE1_HOLD),
      setTimeout(
        () => setIntroStep(3),
        LINE1_APPEAR + LINE1_HOLD + BOTH_HOLD,
      ),
      setTimeout(() => {
        setShowIntro(false);
        setRevealed(true);
      }, LINE1_APPEAR + LINE1_HOLD + BOTH_HOLD + FADE_OUT),
    ];

    return () => {
      timers.forEach(clearTimeout);
      // Do NOT reset didStartRef — StrictMode remount must not restart.
    };
  }, [introDecided, showIntro]);

  // Mobile intro sequence.
  useEffect(() => {
    if (!introDecided) return;
    if (!showMobileIntro) return;
    if (didStartRef.current) return;
    didStartRef.current = true;

    markIntroPlayed();

    const TOP_APPEAR = 100;
    const TOP_HOLD = 3000;
    const BOTTOM_HOLD = 2000;
    const FADE_OUT = 900;

    const timers = [
      setTimeout(() => setMobileIntroStep(1), TOP_APPEAR),
      setTimeout(() => setMobileIntroStep(2), TOP_APPEAR + TOP_HOLD),
      setTimeout(
        () => setMobileIntroStep(3),
        TOP_APPEAR + TOP_HOLD + BOTTOM_HOLD,
      ),
      setTimeout(() => {
        setShowMobileIntro(false);
        setRevealed(true);
      }, TOP_APPEAR + TOP_HOLD + BOTTOM_HOLD + FADE_OUT),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [introDecided, showMobileIntro]);

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
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
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

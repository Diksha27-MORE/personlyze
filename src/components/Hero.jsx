import { useState, useEffect, useRef } from "react";
import "./Hero.desktop.css";
import "./Hero.mobile.css";
import backgroundVideo from "../assets/hero-video.mp4";
import LogoAnimation from "../assets/Logo animation new.webm";
import { hasIntroPlayed, markIntroPlayed } from "./introSession";

// Cloudinary delivery transformation: f_auto (best format for the
// requesting browser), q_auto (adaptive quality), w_800 (never ship more
// pixels than a mobile hero needs).
const mobileHeroVideo =
  "https://res.cloudinary.com/t4s8m2hn/video/upload/f_auto,q_auto,w_800/v1784388112/hero-mobile_ewaryl.mp4";

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
      {/*
        Hamburger button only mounts while the menu is closed. When
        isOpen becomes true, this block returns null and React
        unmounts the hamburger from the DOM entirely (not hidden,
        genuinely removed), so it can never overlap the close (✕)
        button rendered inside the nav panel below.
      */}
      {!isOpen && (
        <button
          className={`nav-hamburger-btn reveal-item ${revealed ? "is-revealed" : ""}`}
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          aria-expanded={false}
        >
          <span className="nav-hamburger-line" />
          <span className="nav-hamburger-line" />
          <span className="nav-hamburger-line" />
        </button>
      )}

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

/**
 * Always mounts the <video> immediately (not conditionally on `revealed`).
 * The decode clock starts at MOUNT time, quietly hidden behind the
 * ancestor's opacity:0 during the intro, so by the time the Hero reveals,
 * real frames are already buffered and playback is instant — no flash.
 *
 * `fetchPriority="low"` deprioritizes this small file relative to the
 * larger background hero video for mobile decode-session contention.
 *
 * `logo.png` is used ONLY as a genuine error fallback (video failed to
 * load/decode), via onError — never as a loading placeholder.
 */
function LogoMedia() {
  const [videoFailed, setVideoFailed] = useState(false);

  if (videoFailed) {
    return <img src={logoStatic} alt="" aria-hidden="true" className="hero-logo-video" />;
  }

  return (
    <video
      className="hero-logo-video"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      fetchPriority="low"
      onError={() => setVideoFailed(true)}
    >
      <source src={LogoAnimation} type="video/webm" />
    </video>
  );
}

function Hero() {
  // --- Device detection (deterministic on mount) ---------------------------
  const [isMobile, setIsMobile] = useState(getIsMobile);

  // --- Intro state ---------------------------------------------------------
  const [introDecided, setIntroDecided] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showMobileIntro, setShowMobileIntro] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [mobileIntroStep, setMobileIntroStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const didStartRef = useRef(false);
  const videoRef = useRef(null);
  const videoEffectRanOnceRef = useRef(false);
  const prevIsMobileRef = useRef(isMobile);

  // Track viewport changes — only re-render on an actual change.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const checkScreen = () => {
      setIsMobile((prev) => (prev === mediaQuery.matches ? prev : mediaQuery.matches));
    };
    checkScreen();
    mediaQuery.addEventListener("change", checkScreen);
    return () => mediaQuery.removeEventListener("change", checkScreen);
  }, []);

  // Decide, exactly once on mount, whether the intro should play.
  useEffect(() => {
    const alreadyPlayed = hasIntroPlayed();

    if (alreadyPlayed) {
      setShowIntro(false);
      setShowMobileIntro(false);
      setRevealed(true);
    } else {
      if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }

      const mobile = getIsMobile();
      setShowIntro(!mobile);
      setShowMobileIntro(mobile);
      setRevealed(false);
    }
    setIntroDecided(true);
  }, []);

  // Background video lifecycle - independent of intro/reveal state.
  // Only forces a real reload when the device category genuinely changes
  // (mobile <-> desktop) after mount. Never runs in response to `revealed`.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (!videoEffectRanOnceRef.current) {
      videoEffectRanOnceRef.current = true;
      prevIsMobileRef.current = isMobile;
      return;
    }

    if (prevIsMobileRef.current === isMobile) return;

    prevIsMobileRef.current = isMobile;
    try {
      el.load();
      el.play().catch(() => {});
    } catch {}
  }, [isMobile]);

  // Desktop intro sequence.
  useEffect(() => {
    if (!introDecided) return;
    if (!showIntro) return;
    if (didStartRef.current) return;
    didStartRef.current = true;

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
        fetchPriority="high"
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
              <LogoMedia />
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
            <LogoMedia />
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
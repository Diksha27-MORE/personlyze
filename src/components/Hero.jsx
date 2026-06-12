import "./Hero.css";
import backgroundVideo from "../assets/hero-video.mp4";
import logo from "../assets/logo.png";
import logoVideo from "../assets/logo_video_transparent.mp4";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

function Hero() {
  return (
    <section className="hero">

      {/* ── Background Video ── */}
      <video autoPlay muted loop playsInline className="hero-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* ── Overlay + Vignette ── */}
      <div className="overlay" />

      {/* ── Navbar ── */}
      <nav className="hero-navbar">
        {/* Brand */}
        <a href="/" className="nav-brand">
          <img src={logo} alt="Personlyze logo" />
          <span className="nav-brand-name">personlyze</span>
        </a>

        {/* Center Links */}
        <ul className="nav-links">
          {["Product", "Solutions", "Pricing", "Resources", "Company"].map((item) => (
            <li key={item}>
              <a href={`/${item.toLowerCase()}`}>{item}</a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a href="/demo" className="nav-demo-btn">
          Book a Demo
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </nav>

{/* ── Center Content ── */}
<div className="hero-center">

  {/* Personlyze.ai Logo */}
  <div className="hero-logo">
    <img src={logo} alt="Personlyze Logo" className="hero-logo-img" />

    <div className="hero-title">
      <span className="white-text">personlyze</span>
      <span className="orange-text">.ai</span>
    </div>
  </div>

  {/* Subtitle */}
  <p className="hero-tagline">
    AI-Powered Personalization.<br />
    Built for the Future.
  </p>

  {/* CTA Buttons */}
  <div className="hero-cta">
    <a href="/demo" className="cta-primary">
      Book a Demo
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>

    <a href="/video" className="cta-secondary">
      Watch Video
      <span className="play-icon" aria-hidden="true">
        <svg viewBox="0 0 10 12">
          <polygon points="0,0 10,6 0,12" />
        </svg>
      </span>
    </a>
  </div>

</div>
      {/* ── Scroll Indicator ── */}
      <div className="hero-scroll" aria-hidden="true">
        <div className="scroll-mouse">
          <div className="scroll-dot" />
        </div>
        <span className="scroll-label">Scroll to Explore</span>
      </div>

      {/* ── Bottom Left: Email ── */}
      <a href="mailto:hello@personlyze.ai" className="hero-email">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        hello@personlyze.ai
      </a>

      {/* ── Bottom Right: Socials ── */}
      <div className="hero-social">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-btn">
          <FaInstagram />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-btn">
          <FaLinkedinIn />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="social-btn">
          <FaYoutube />
        </a>
      </div>

    </section>
  );
}

export default Hero;

import "./Hero.css";
import backgroundVideo from "../assets/hero-video.mp4";
import logo from "../assets/logo.png";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import LogoAnimation from "../assets/Logo animation new.webm";
function Hero() {
  return (
    <section className="hero">

      {/* Background Video */}
      <video autoPlay muted loop playsInline className="hero-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      <div className="overlay" />

      {/* Navbar */}
      <nav className="hero-navbar">

        <div className="nav-left">
          <img src={logo} alt="logo" />
          <span>personlyze.ai</span>
        </div>

        <ul className="nav-links">
          <li><a href="#platform">Platform</a></li>
          <li><a href="#results">Results</a></li>
          <li><a href="#industries">Industries</a></li>
        </ul>

        <a href="#demo" className="nav-demo-btn">
          Book a Demo →
        </a>

      </nav>

{/* Center Content */}
{/* Center Content */}
<div className="hero-center">
  <video
    className="hero-logo-video"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src={LogoAnimation} type="video/webm" />
    Your browser does not support the video tag.
  </video>

  <h1 className="hero-title">
    <span className="white-text">personlyze</span>
    <span className="orange-text">.ai</span>
  </h1>

  <p className="hero-tagline">
    AI-Powered Personalization <br />
    Built for the Future
  </p>

</div>

      {/* Email */}
      <a href="mailto:hello@personlyze.ai" className="hero-email">
        hello@personlyze.ai
      </a>

      {/* Socials */}
      <div className="hero-social">
        <a href="#" className="social-btn"><FaInstagram /></a>
        <a href="#" className="social-btn"><FaLinkedinIn /></a>
        <a href="#" className="social-btn"><FaYoutube /></a>
      </div>

    </section>
  );
}

export default Hero;
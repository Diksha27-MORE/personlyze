import { useState, useEffect } from "react";
import "./Hero.css";
import backgroundVideo from "../assets/hero-video.mp4";
import mobileHeroVideo from "../assets/hero-mobile.mp4";
import LogoAnimation from "../assets/Logo animation new.webm";

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
    const section = document.getElementById("demo");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
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
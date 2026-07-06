import "./Hero.css";
import backgroundVideo from "../assets/hero-video.mp4";
import LogoAnimation from "../assets/Logo animation new.webm";
import personlyzePng from "../assets/personlyzepng.png";

function Hero() {
  const handleBookDemo = () => {
    const section = document.getElementById("demo");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="hero-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Hero Content */}
      <div className="hero-center">
        {/* Left Side - Animation */}
        <div className="hero-left">
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
        </div>

        {/* Right Side */}
        <div className="hero-right">
          <img
            src={personlyzePng}
            alt="Personlyze"
            className="hero-right-image"
          />
        </div>

        {/* Centered CTA */}
        <button
          className="hero-demo-btn"
          onClick={handleBookDemo}
        >
          <span className="hero-demo-btn__label">Book a Demo</span>
        </button>
      </div>
    </section>
  );
}

export default Hero;
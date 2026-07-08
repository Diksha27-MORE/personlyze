import "./Hero.css";
import backgroundVideo from "../assets/hero-video.mp4";
import LogoAnimation from "../assets/Logo animation new.webm";


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
        {/* Centered CTA */}
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
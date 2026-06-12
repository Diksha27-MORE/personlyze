
import { useState, useEffect } from "react";
import "./Stats.css";

const stats = [
  {
    number: "150%",
    title: "Higher Conversions",
    badge: "RESULT #1",
    desc:
      "Turn more visitors into customers with AI-powered personalization and optimized customer journeys.",
  },
  {
    number: "50%",
    title: "Lower CPA",
    badge: "RESULT #2",
    desc:
      "Reduce customer acquisition costs by targeting the right audience with precision.",
  },
  {
    number: "2×",
    title: "Higher CTR",
    badge: "RESULT #3",
    desc:
      "Increase engagement through personalized messaging and dynamic creative optimization.",
  },
  {
    number: "12×",
    title: "ROAS",
    badge: "RESULT #4",
    desc:
      "Maximize return on ad spend using real-time optimization and behavioral intelligence.",
  },
];

export default function Stats() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % stats.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + stats.length) % stats.length);
  };

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % stats.length);
  };

  const getCardClass = (index) => {
    if (index === active) return "stats-card stats-card--center";

    if (index === (active - 1 + stats.length) % stats.length)
      return "stats-card stats-card--left";

    if (index === (active + 1) % stats.length)
      return "stats-card stats-card--right";

    return "stats-card stats-card--hidden";
  };

  return (
    <section className="stats-section">
      <div className="stats-heading">
        <span className="stats-eyebrow">PROVEN RESULTS</span>

        <h2 className="stats-title">ROI is Beautiful</h2>

        <p className="stats-subtitle">
          Performance metrics powered by AI-driven personalization.
        </p>
      </div>

      <div className="stats-layout">
        <div className="stats-pills">
          {stats.map((item, index) => (
            <button
              key={index}
              className={`stats-pill ${
                active === index ? "stats-pill--active" : ""
              }`}
              onClick={() => setActive(index)}
            >
              <span className="pill-number">{item.number}</span>

              <span className="pill-label">{item.title}</span>
            </button>
          ))}
        </div>

        <div className="stats-carousel-wrap">
          <div className="stats-carousel">
            <button
              className="carousel-nav carousel-nav--prev"
              onClick={prevSlide}
              aria-label="Previous"
            >
              &#10094;
            </button>

            {stats.map((item, index) => (
              <div
                key={index}
                className={getCardClass(index)}
                onClick={() => setActive(index)}
              >
                <div className="card-inner">
                  <div className="card-glow"></div>

                  <span className="card-badge">{item.badge}</span>

                  <div className="card-number">{item.number}</div>

                  <div className="card-title">{item.title}</div>

                  <p className="card-desc">{item.desc}</p>
                </div>
              </div>
            ))}

            <button
              className="carousel-nav carousel-nav--next"
              onClick={nextSlide}
              aria-label="Next"
            >
              &#10095;
            </button>
          </div>

          <div className="carousel-dots">
            {stats.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${
                  active === index ? "carousel-dot--active" : ""
                }`}
                onClick={() => setActive(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

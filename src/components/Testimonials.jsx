import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Testimonials.css";

const testimonials = [
  {
    quote: "When I need a gorgeous app, I come to Studio Swell first.",
    name: "Jordan Gray",
    position: "CEO",
    company: "Dunkr",
    initials: "JG",
  },
  {
    quote: "They turned a rough sketch into a product our users can't stop talking about.",
    name: "Maya Okonkwo",
    position: "Founder",
    company: "Lumio",
    initials: "MO",
  },
  {
    quote: "Every screen feels considered. Nothing in our app feels like a default choice.",
    name: "Elliot Wren",
    position: "Head of Product",
    company: "Northfield",
    initials: "EW",
  },
  {
    quote: "Studio Swell is the rare partner that ships fast without ever cutting a corner.",
    name: "Priya Anand",
    position: "COO",
    company: "Handloom",
    initials: "PA",
  },
  {
    quote: "Our conversion rate doubled the month we shipped the redesign. Same product, better craft.",
    name: "Sam Delacroix",
    position: "CMO",
    company: "Arva",
    initials: "SD",
  },
];

const AUTOPLAY_DELAY = 5000;
const SWIPE_THRESHOLD = 50;

export default function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonials.length;

  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const autoplayRef = useRef(null);

  const goTo = useCallback(
    (index) => {
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused) return undefined;
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, AUTOPLAY_DELAY);
    return () => clearInterval(autoplayRef.current);
  }, [isPaused, total]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      goPrev();
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      goNext();
    }
    touchDeltaX.current = 0;
    setTimeout(() => setIsPaused(false), 300);
  };

  const secondIndex = (activeIndex + 1) % total;
  const current = testimonials[activeIndex];
  const secondary = testimonials[secondIndex];

  return (
    <section
      className="testimonial-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="testimonial-inner">
        <div className="testimonial-intro">
          <span className="testimonial-eyebrow">TESTIMONIALS</span>
          <h2 className="testimonial-heading">Testimonial</h2>
          <p className="testimonial-subtext">
            From early-stage founders to product leads at growing companies,
            here&rsquo;s how teams describe working with Studio Swell.
          </p>

          <div className="testimonial-controls">
            <button
              type="button"
              className="testimonial-nav-btn"
              onClick={goPrev}
              aria-label="Previous testimonial"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="testimonial-nav-btn"
              onClick={goNext}
              aria-label="Next testimonial"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="testimonial-count">
              {String(activeIndex + 1).padStart(2, "0")}
              <span className="testimonial-count-divider" />
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="testimonial-stage">
          <div
            className="testimonial-phones"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="phone-slot phone-slot-secondary" aria-hidden="true">
              <PhoneCard item={secondary} index={secondIndex} total={total} />
            </div>

            <div className="phone-slot phone-slot-primary">
              <PhoneCard item={current} index={activeIndex} total={total} />
            </div>
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`testimonial-dot ${i === activeIndex ? "is-active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneCard({ item, index, total }) {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <span className="phone-quote-mark" aria-hidden="true">
          &ldquo;
        </span>

        <div className="phone-content">
          <p className="phone-quote">{item.quote}</p>

          <div className="phone-author">
            <div className="phone-avatar">{item.initials}</div>
            <div className="phone-author-text">
              <span className="phone-author-name">{item.name.toUpperCase()}</span>
              <span className="phone-author-role">
                {item.position}, {item.company}
              </span>
            </div>
          </div>
        </div>

        <div className="phone-pagination">
          <span className="phone-page-current">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="phone-page-line" />
          <span className="phone-page-total">
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
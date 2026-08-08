
// Testimonials.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Testimonials.css";

const testimonials = [
  {
    quote:
      "Everyone buys MarTech stacks, but Personlyze AI gets the order right: strategy first, technology second.",
    title: "Strategy before technology.",
    name: "CMO",
    position: "CMO",
    company: "[Company]",
    initials: "C",
    tag: "Strategy Lead",
  },
  {
    quote:
      "Unlike black-box algorithmic firms, Personlyze AI keeps a strategist, creators and techies in the room at every step.",
    title: "Humans in the room, always.",
    name: "VP Marketing",
    position: "VP Marketing",
    company: "[Company]",
    initials: "V",
    tag: "Marketing",
  },
  {
    quote:
      "They prioritize the person - personas, journeys, and mapping—before applying any targeting rules.",
    title: "The person comes first.",
    name: "Head of Brand",
    position: "Head of Brand",
    company: "[Company]",
    initials: "H",
    tag: "Brand",
  },
  {
    quote:
      "Finally, an agency that treats personalization as a strategic discipline rather than a tech feature.",
    title: "Personalization as a discipline.",
    name: "[Title]",
    position: "[Title]",
    company: "[Company]",
    initials: "P",
    tag: "Leadership",
  },
  {
    quote:
      "Personlyze AI avoids outsourcing judgment to algorithms; they offer rigorous, human-led strategies that start with the customer, not the campaign.",
    title: "Human-led, never automated judgment.",
    name: "CXO",
    position: "CXO",
    company: "[Company]",
    initials: "C",
    tag: "Executive",
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

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

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
    touchDeltaX.current =
      e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      goPrev();
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      goNext();
    }

    touchDeltaX.current = 0;

    setTimeout(() => {
      setIsPaused(false);
    }, 300);
  };

  const current = testimonials[activeIndex];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <span className="testimonials-eyebrow">TESTIMONIALS</span>

        <h2 className="testimonials-heading">
          What leaders say
        </h2>

        <p className="testimonials-description">
          From CMOs to brand heads, here’s how teams describe
          working with Personlyze AI.
        </p>
      </div>

      <div className="testimonial-stage">
        <div
          className="testimonial-phones"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className="testimonial-nav-btn testimonial-nav-prev"
            onClick={goPrev}
            aria-label="Previous testimonial"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            className="phone-slot phone-slot-primary"
            key={activeIndex}
          >
            <PhoneCard item={current} />
          </div>

          <button
            type="button"
            className="testimonial-nav-btn testimonial-nav-next"
            onClick={goNext}
            aria-label="Next testimonial"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="testimonial-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`testimonial-dot ${
                i === activeIndex ? "is-active" : ""
              }`}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PhoneCard({ item }) {
  return (
    <article className="phone-card">
      <div className="phone-card-content">
        <span className="phone-card-title">
          {item.title}
        </span>

        <p className="phone-card-quote">
          “{item.quote}”
        </p>
      </div>

      <div className="phone-divider" />

      <div className="phone-author">
        <div className="phone-avatar">
          {item.initials}
        </div>

        <div className="phone-author-text">
          <span className="phone-author-name">
            {item.position}
          </span>

          <span className="phone-author-role">
            {item.company}
          </span>
        </div>

        <span className="phone-tag">
          {item.tag}
        </span>
      </div>
    </article>
  );
}


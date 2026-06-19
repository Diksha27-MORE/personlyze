import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Results.css";

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
  {
    index: "METRIC 01 / 04",
    number: "150%",
    label: "Higher Conversions",
    footnote: "VS. INDUSTRY BENCHMARK",
    theme: "dark",
  },
  {
    index: "METRIC 02 / 04",
    number: "50%",
    label: "Lower CPA",
    footnote: "ACROSS ALL FUNNELS",
    theme: "orange",
  },
  {
    index: "METRIC 03 / 04",
    number: "2×",
    label: "Higher CTR",
    footnote: "VS. CONTROL CREATIVE",
    theme: "light",
  },
  {
    index: "METRIC 04 / 04",
    number: "3.8×",
    label: "ROAS Improvement",
    footnote: "90-DAY PARTNER AVERAGE",
    theme: "purple",
  },
];

export default function Results() {
  const sectionRef    = useRef(null);
  const cardsStripRef = useRef(null);
  const cardsAreaRef  = useRef(null);
  const cardsPinRef   = useRef(null);

useEffect(() => {
  const ctx = gsap.context(() => {
    const strip = cardsStripRef.current;
    const cardsPin = cardsPinRef.current;
    const cardsArea = cardsAreaRef.current;

    if (!strip || !cardsPin || !cardsArea) return;

    const GAP = 24;

    const viewportWidth = cardsArea.clientWidth;

   const isMobile = window.innerWidth <= 768;

const cardW = isMobile
  ? viewportWidth * 0.85
  : (viewportWidth - 2 * GAP) / 2.5;
    strip.querySelectorAll(".metric-card").forEach((card) => {
      card.style.width = `${cardW}px`;
      card.style.flexShrink = "0";
    });

    // actual rendered width
    const stripWidth = strip.scrollWidth;

    // extra distance after last card
   const TRAIL_PX = isMobile
  ? cardW * 0.5
  : cardW * 1.5;

    const totalTravel =
      stripWidth -
      viewportWidth +
      TRAIL_PX;

    const SCROLL_BUDGET = isMobile
  ? totalTravel * 2
  : totalTravel * 4;

    gsap.set(strip, { x: 0 });

    gsap.to(strip, {
      x: -totalTravel,
      ease: "none",
      scrollTrigger: {
        trigger: cardsPin,
        start: "top top",
        end: `+=${SCROLL_BUDGET}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    ScrollTrigger.refresh();
  }, sectionRef);

  return () => ctx.revert();
}, []);

  return (
    <section className="results-section" ref={sectionRef}>

      <div className="results-eyebrow">
        <div className="results-eyebrow-rule" />
        <span className="results-eyebrow-label">[ 003 – Proven Results ]</span>
      </div>

      <div className="results-heading-block">
        <h2 className="results-heading">
          ROI is <em>Beautiful.</em>
        </h2>
        <p className="results-subtitle">
          Numbers that compound. Outcomes our partners felt within their
          first 90 days on Personlyze.
        </p>
      </div>

      <div className="results-meta-row">
        <span className="results-scroll-hint">[ SCROLL → ]</span>
        <span className="results-meta-tag">
          Real Numbers · Real Cohorts · 2026 YTD
        </span>
      </div>

      <div className="results-cards-pin" ref={cardsPinRef}>
        <div className="results-cards-viewport" ref={cardsAreaRef}>
          <div className="results-cards-strip" ref={cardsStripRef}>
            {METRICS.map((m) => (
              <div
                key={m.index}
                className={`metric-card metric-card--${m.theme}`}
              >
                <div className="metric-card-index">{m.index}</div>
                <div>
                  <div className="metric-card-number">{m.number}</div>
                  <div className="metric-card-label">{m.label}</div>
                </div>
                <div className="metric-card-footnote">{m.footnote}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
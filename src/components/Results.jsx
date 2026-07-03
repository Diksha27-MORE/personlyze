import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Results.css";

// Update these import paths to match wherever the images live in your project
import bgConversions from "../assets/Higher Conversions.jpg";
import bgCPA from "../assets/Lower CPA.jpg";
import bgCTR from "../assets/marketing performance.jpg";
import bgROAS from "../assets/ROAS Improvement.png";

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
  {
    number: "150%",
    label: "Higher Conversions",
    footnote: "VS. INDUSTRY BENCHMARK",
    image: bgConversions,
  },
  {
    number: "50%",
    label: "Lower CPA",
    footnote: "ACROSS ALL FUNNELS",
    image: bgCPA,
  },
  {
    number: "2×",
    label: "Higher CTR",
    footnote: "VS. CONTROL CREATIVE",
    image: bgCTR,
  },
  {
    number: "3.8×",
    label: "ROAS Improvement",
    footnote: "90-DAY PARTNER AVERAGE",
    image: bgROAS,
  },
];

export default function Results() {
  const sectionRef    = useRef(null);
  const cardsStripRef = useRef(null);
  const cardsAreaRef  = useRef(null);
  const cardsPinRef   = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ── Desktop / tablet-landscape: pinned horizontal scroll ──
    // Below 769px this block never runs — cards become a plain vertical
    // stack handled entirely by CSS (flex-direction: column).
    mm.add("(min-width: 769px)", () => {
      const strip     = cardsStripRef.current;
      const cardsPin  = cardsPinRef.current;
      const cardsArea = cardsAreaRef.current;

      if (!strip || !cardsPin || !cardsArea) return;

      const GAP = 24; // keep in sync with CSS gap on .results-cards-strip
      const viewportWidth = cardsArea.clientWidth;
      const cardW = (viewportWidth - 2 * GAP) / 2.5;

      strip.querySelectorAll(".metric-card").forEach((card) => {
        card.style.width = `${cardW}px`;
        card.style.flexShrink = "0";
      });

      const stripWidth = strip.scrollWidth;
      const TRAIL_PX = cardW * 1.5;
      const totalTravel = stripWidth - viewportWidth + TRAIL_PX;

      // Scroll budget reduced from the previous 4x multiplier so the
      // animation resolves in noticeably fewer wheel-scrolls, while
      // scrub: 1 keeps the motion smooth rather than snappy/jumpy.
      const SCROLL_BUDGET = totalTravel * 1.8;

      gsap.set(strip, { x: 0 });

      const tween = gsap.to(strip, {
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

      // gsap.matchMedia cleans up automatically on context revert / breakpoint
      // change, but we also reset inline widths so nothing leaks into mobile.
      return () => {
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
        strip.querySelectorAll(".metric-card").forEach((card) => {
          card.style.width = "";
        });
        gsap.set(strip, { clearProps: "x" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="results-section" ref={sectionRef}>

      <div className="results-eyebrow">
        <div className="results-eyebrow-rule" />
        <span className="results-eyebrow-label">[ 003 – Proven Results ]</span>
      </div>

      <div className="results-heading-block">
        <h2 className="results-heading">Why Personlyze AI?</h2>
      </div>

      <div className="results-cards-pin" ref={cardsPinRef}>
        <div className="results-cards-viewport" ref={cardsAreaRef}>
          <div className="results-cards-strip" ref={cardsStripRef}>
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="metric-card"
                style={{ backgroundImage: `url(${m.image})` }}
              >
                <div className="metric-card-overlay" />
                <div className="metric-card-content">
                  <div>
                    <div className="metric-card-number">{m.number}</div>
                    <div className="metric-card-label">{m.label}</div>
                  </div>
                  <div className="metric-card-footnote">{m.footnote}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="results-disclaimer">
        As established by industry data from personalized video campaigns
        across categories and markets across the world.
      </p>

    </section>
  );
}
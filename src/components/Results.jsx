import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Results.css";

// Update these import paths to match wherever the images live in your project
import bgConversions from "../assets/Higher Conversions.png";
import bgCPA from "../assets/Lower CPA.jpg";
import bgCTR from "../assets/marketing performance.jpg";
import bgROAS from "../assets/ROAS Improvement.jpg";

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
  {
    number: "150%",
    label: "Higher Conversions",
    footnote: "vs industry benchmark",
    image: bgConversions,
  },
  {
    number: "2×",
    label: "Higher CTR",
    footnote: "vs control creative",
    image: bgCTR,
  },
 {

    number: "50%",

    label: "Lower CPA",

    footnote: "across all funnels",

    image: bgCPA,

  }, 
  {
    number: "12×",
    label: "ROAS Improvement",
    footnote: "average across cohorts",
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

const GAP = 24;

// Read the ACTUAL left padding on the viewport instead of assuming 0.
// This is the piece that was missing — the strip starts inside the
// padding box, but clientWidth includes the padding, so the last
// `paddingLeft` pixels of the strip were being pushed offscreen right.
const cs = getComputedStyle(cardsArea);
const padLeft  = parseFloat(cs.paddingLeft)  || 0;
const padRight = parseFloat(cs.paddingRight) || 0;

const viewportWidth  = cardsArea.clientWidth;
const effectiveWidth = viewportWidth - padLeft - padRight;

const cardW = (effectiveWidth - 2 * GAP) / 2.5;

strip.querySelectorAll(".metric-card").forEach((card) => {
  card.style.width = `${cardW}px`;
  card.style.flexShrink = "0";
});

const stripWidth  = strip.scrollWidth;
// Travel must land the strip's right edge at the viewport's right edge
// INSIDE the padding box, not at the padding edge.
const totalTravel = stripWidth - effectiveWidth;


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

<div className="results-heading-block">
  <h2 className="results-heading">
    Why <span className="results-brand">personlyze</span><span className="results-ai">.ai</span>
  </h2>
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
                  <div className="metric-card-number">{m.number}</div>
                  <div className="metric-card-label">{m.label}</div>
                  <div className="metric-card-footnote">{m.footnote}</div>
                  <div className="metric-card-disclaimer">
                    As established by industry data from personalized video campaigns
                    across categories and markets across the world.
                  </div>
                </div>
              </div>
            ))}
            {/* Invisible spacer — creates one final `gap` after the last
                card, identical in size to the gaps between cards, so the
                pin doesn't release until that trailing gap has scrolled by. */}
            <div className="results-cards-spacer" aria-hidden="true" />
          </div>
        </div>
      </div>

    </section>
  );
}
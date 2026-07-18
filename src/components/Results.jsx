import { useEffect, useRef, useState } from "react";
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
    label: "More Conversions",
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

  // Tracks which card is centered in the mobile carousel, drives the dots.
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ── Desktop / tablet-landscape: pinned horizontal scroll ──
    // Below 769px this block never runs — cards become the Instagram-style
    // native scroll-snap carousel handled entirely by CSS + the effect below.
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
      const SCROLL_BUDGET = totalTravel  * 1.2;

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

  // ── Mobile carousel: track which card is centered so the dots stay in
  // sync while the user swipes. Native scroll-snap does the actual paging;
  // this just observes scrollLeft and reports the nearest card's index.
  // Harmless on desktop — that viewport never scrolls horizontally there,
  // so this listener simply never fires.
  useEffect(() => {
    const viewport = cardsAreaRef.current;
    if (!viewport) return;

    let ticking = false;

    const updateActiveFromScroll = () => {
      const cards = viewport.querySelectorAll(".metric-card");
      if (!cards.length) return;

      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActiveFromScroll();
        ticking = false;
      });
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveFromScroll);
    };
  }, []);

  const scrollToCard = (index) => {
    const viewport = cardsAreaRef.current;
    if (!viewport) return;
    const card = viewport.querySelectorAll(".metric-card")[index];
    if (!card) return;

    const target =
      card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;

    viewport.scrollTo({ left: target, behavior: "smooth" });
  };

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

                  {/* Mobile-only floating badge (glass pill). Hidden on
                      desktop via display:none — reuses the footnote text
                      so no new copy is introduced. */}
                  <div className="metric-card-badge">{m.footnote}</div>

                  {/* Mobile-only glass panel wrapping the stat + heading +
                      description. On desktop this is display:contents, so
                      its children (.metric-card-top + .metric-card-description)
                      behave as plain flex children exactly like before. */}
                  <div className="metric-card-mobile-panel">
                    <div className="metric-card-top">
                      <div className="metric-card-number">{m.number}</div>
                      <div className="metric-card-label">{m.label}</div>
                    </div>
                    <div className="metric-card-description">
                      As established by industry data from personalized video campaigns
                      across categories and markets across the world.
                    </div>
                  </div>

                  {/* Group 2: footnote + disclaimer — this is the ORIGINAL
                      desktop layout, unchanged. Hidden on mobile, where the
                      badge + description above take over that same content. */}
                  <div className="metric-card-bottom">
                    <div className="metric-card-footnote">{m.footnote}</div>
                    <div className="metric-card-disclaimer">
                      As established by industry data from personalized video campaigns
                      across categories and markets across the world.
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Invisible spacer — creates one final `gap` after the last
                card, identical in size to the gaps between cards, so the
                pin doesn't release until that trailing gap has scrolled by.
                On mobile this is hidden — scroll-snap needs the last real
                card to be the final snap point, not an empty spacer. */}
            <div className="results-cards-spacer" aria-hidden="true" />
          </div>
        </div>

        {/* Instagram-style pagination dots — mobile only (display:none on
            desktop). Tapping a dot jumps to that card. */}
        <div className="results-dots" role="tablist" aria-label="Results carousel pagination">
          {METRICS.map((m, i) => (
            <button
              key={m.label}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Show result ${i + 1} of ${METRICS.length}`}
              className={`results-dot${i === activeIndex ? " is-active" : ""}`}
              onClick={() => scrollToCard(i)}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
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

// ── Fixed card aspect ratio ────────────────────────────────────────────────
// Reference design: 460px wide × 700px tall = 0.657 ratio
// We preserve this ratio exactly regardless of viewport.
const CARD_ASPECT = 460 / 700; // width / height ≈ 0.657

// ── Gap between cards ──────────────────────────────────────────────────────
const GAP = 24;

export default function Results() {
  const sectionRef    = useRef(null);
  const cardsStripRef = useRef(null);
  const cardsAreaRef  = useRef(null);
  const cardsPinRef   = useRef(null);

  useEffect(() => {
    const section   = sectionRef.current;
    const strip     = cardsStripRef.current;
    const cardsPin  = cardsPinRef.current;
    const cardsArea = cardsAreaRef.current;

    if (!strip || !cardsPin || !cardsArea || !section) return;

    let scrollTriggerInstance = null;
    let ctx = null;

    // ── Browser-safe measurement ─────────────────────────────────────────
    // We use getBoundingClientRect() on the viewport container instead of
    // window.innerWidth/clientWidth. getBoundingClientRect() is layout-safe:
    // it returns the element's actual rendered size, which is identical in
    // every browser regardless of scrollbar treatment.
    //
    // WHY this matters:
    //   Chrome:  window.innerWidth INCLUDES the scrollbar width (~17px)
    //   Firefox: window.innerWidth EXCLUDES the scrollbar width
    //   This 17px difference shifts card widths and the pin height.
    //
    // getBoundingClientRect().width on a block element always returns the
    // element's CSS layout width, which never includes scrollbar gutter.
    // ─────────────────────────────────────────────────────────────────────
    function measure() {
      // clientWidth = content area width, no scrollbar, same in all browsers
      const viewportWidth = cardsArea.clientWidth;

      // ── Card width calculation ─────────────────────────────────────────
      // Reference: show ~2.5 cards at a time on desktop.
      // On mobile (≤768): show ~1 card at 85% of viewport width.
      // We use clientWidth of the container (not window.innerWidth) so
      // Chrome's scrollbar doesn't inflate the measurement.
      const isMobile = viewportWidth <= 768;
      const cardW = isMobile
        ? Math.round(viewportWidth * 0.85)
        : Math.round((viewportWidth - 2 * GAP) / 2.5);

      // ── Card height — fixed aspect ratio, never viewport-dependent ────
      // This is the key fix for the vertical stretching bug:
      // Previously `min-height: 700px` in CSS let the card grow when the
      // browser calculated a larger flex container height from 100vh.
      // Now height is always exactly cardW / CARD_ASPECT.
      const cardH = Math.round(cardW / CARD_ASPECT);

      // ── Pin wrapper height — matches card height + symmetric padding ──
      // We write this as a CSS custom property on the pin element.
      // This replaces `height: 100vh` which is browser-inconsistent.
      const CARD_VERTICAL_PADDING = 48; // px above and below cards
      const pinH = cardH + CARD_VERTICAL_PADDING * 2;

      return { viewportWidth, cardW, cardH, pinH, isMobile };
    }

    function applyLayout() {
      const { viewportWidth, cardW, cardH, pinH, isMobile } = measure();

      // Apply fixed card dimensions via inline style
      strip.querySelectorAll(".metric-card").forEach((card) => {
        card.style.width  = `${cardW}px`;
        card.style.height = `${cardH}px`;
      });

      // Set pin wrapper height via CSS custom property
      // (avoids 100vh, which Chrome and Firefox disagree on)
      cardsPin.style.setProperty("--cards-pin-h", `${pinH}px`);
      cardsPin.style.height = `${pinH}px`;

      return { viewportWidth, cardW, pinH, isMobile };
    }

    function buildScrollAnimation() {
      // Kill previous animation if rebuilding
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
        scrollTriggerInstance = null;
      }
      if (ctx) {
        ctx.revert();
        ctx = null;
      }

      const { viewportWidth, cardW, isMobile } = applyLayout();

      ctx = gsap.context(() => {
        // Re-measure after layout is applied to get accurate scrollWidth
        // scrollWidth is reliable here because we've already set card
        // dimensions via inline style — no browser inference required.
        const stripWidth = strip.scrollWidth;

        // How far to scroll: strip width minus visible viewport width
        // plus a trailing gap so the last card doesn't slam against the edge
        const TRAIL_PX = isMobile ? cardW * 0.5 : cardW * 1.5;
        const totalTravel = stripWidth - viewportWidth + TRAIL_PX;

        // Scroll budget: how many pixels of page scroll map to the animation
        const SCROLL_BUDGET = isMobile ? totalTravel * 2 : totalTravel * 4;

        gsap.set(strip, { x: 0 });

        scrollTriggerInstance = ScrollTrigger.create({
          trigger: cardsPin,
          start: "top top",
          end: `+=${SCROLL_BUDGET}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          // invalidateOnRefresh recalculates the animation on resize.
          // Combined with our ResizeObserver below, this guarantees
          // the animation resets to correct values after any resize.
          invalidateOnRefresh: true,
          animation: gsap.to(strip, {
            x: -totalTravel,
            ease: "none",
          }),
        });
      }, section);
    }

    // ── Initial build ────────────────────────────────────────────────────
    buildScrollAnimation();

    // ── ResizeObserver — rebuild on container size change ───────────────
    // We observe the cardsArea container (not window resize event) because:
    //   1. ResizeObserver fires with the element's actual new clientRect
    //   2. It fires AFTER layout is complete, so clientWidth is final
    //   3. It avoids the window.resize timing issues that cause
    //      intermediate states in Chrome's two-pass resize handling
    //
    // We debounce with requestAnimationFrame to skip mid-resize frames.
    let rafId = null;
    const ro = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        buildScrollAnimation();
        ScrollTrigger.refresh();
        rafId = null;
      });
    });

    ro.observe(cardsArea);

    return () => {
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      if (ctx) ctx.revert();
    };
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
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CardTransitionSection.css";

gsap.registerPlugin(ScrollTrigger);

// ── Fixed card geometry ─────────────────────────────────────────────────────
// These are FIXED pixel values for the cards themselves.
// They do NOT depend on the viewport — they are the reference design dimensions.
const HERO_W  = 780;
const HERO_H  = 830;
const HERO_BR = 20;

const SMALL_W  = 158;
const SMALL_H  = Math.round(SMALL_W / (HERO_W / HERO_H)); // ≈ 168px
const SMALL_BR = 20;

const THUMB_W  = 58;
const THUMB_H  = Math.round(THUMB_W / (HERO_W / HERO_H)); // ≈ 62px
const THUMB_BR = 12;

// ── Section scroll height ───────────────────────────────────────────────────
const SECTION_HEIGHT = "300vh";

const CARDS = [
  {
    num: "01",
    title: ["Strategic", "Immersion"],
    desc: "Deep research and discovery to understand\nyour goals, audience and brand vision.",
    cta: "Discover the Experience",
  },
  {
    num: "02",
    title: ["Creative", "Exploration"],
    desc: "Generating bold concepts, visual directions\nand unique experiences that resonate.",
    cta: "Discover the Experience",
  },
  {
    num: "03",
    title: ["AI ", "SCALE-UP"],
    desc: "Refining every detail to deliver\na tailored experience crafted for you.",
    cta: "Discover the Experience",
  },
];

export default function CardTransitionSection() {
  const sectionRef  = useRef(null);
  const stickyRef   = useRef(null);
  const headlineRef = useRef(null);

  const cardRefs = [useRef(null), useRef(null), useRef(null)];
  const descRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const section = sectionRef.current;
    const sticky  = stickyRef.current;

    const E_OUT   = "power3.out";
    const E_IN    = "power2.in";
    const E_INOUT = "power3.inOut";

    // ── Browser-safe position calculation ──────────────────────────────────
    //
    // ROOT CAUSE OF THE CHROME BUG:
    //   The original code used window.innerWidth and window.innerHeight inside
    //   arrow functions (heroX, heroY, etc.) that were called during GSAP set().
    //
    //   In Chrome:
    //     window.innerWidth  = layout viewport width INCLUDING scrollbar (~17px wide)
    //     window.innerHeight = layout viewport height INCLUDING browser chrome
    //
    //   In Firefox / Edge / Brave:
    //     These values may differ by 0–20px depending on OS, zoom level, and
    //     whether a scrollbar is currently visible.
    //
    //   This means heroX() and heroY() returned DIFFERENT numbers in different
    //   browsers, causing the card to appear in different absolute positions.
    //
    // THE FIX:
    //   We measure the sticky container using getBoundingClientRect().
    //   getBoundingClientRect() returns the element's rendered CSS size,
    //   which is the same in every browser. It does not include scrollbar gutter.
    //   The sticky element fills 100% width and 100vh height (set by CSS),
    //   but its clientWidth/clientHeight reflect the actual layout box.
    //
    //   By deriving all positions from the sticky container's measured size,
    //   every browser calculates identical coordinates.
    // ────────────────────────────────────────────────────────────────────────
    function getContainerSize() {
      // clientWidth / clientHeight — always excludes scrollbar, same in all browsers
      return {
        W: sticky.clientWidth,
        H: sticky.clientHeight,
      };
    }

    function calcPositions() {
      const { W, H } = getContainerSize();

      // Hero card: centered in container
      const heroX = Math.round((W - HERO_W) / 2);
      const heroY = Math.round((H - HERO_H) / 2);

      // Thumbnail: horizontally centered, at 72% down the container
      const thumbX = Math.round((W - THUMB_W) / 2);
      const thumbY = Math.round(H * 0.72);

      // Small card TL (top-left): fixed offset from container top-left
      const TL_X = 250;
      const TL_Y = 40;

      // Description block: right of hero card, with a gap
      const DESC_GAP = 18;
      const DESC_X = heroX + HERO_W + DESC_GAP;
      // Vertically: aligned to 30% down from hero card top
      const DESC_Y = heroY + Math.round(HERO_H * 0.30);

      // BR teaser card: below description column
      const BR_X = DESC_X + 35;
      const BR_Y = DESC_Y + 450;

      return { heroX, heroY, thumbX, thumbY, TL_X, TL_Y, DESC_X, DESC_Y, BR_X, BR_Y };
    }

    // ── INITIAL STATES ──────────────────────────────────────────────────────
    const pos = calcPositions();

    gsap.set(headlineRef.current, { opacity: 1, y: 0 });

    gsap.set(cardRefs[0].current, {
      x: pos.thumbX,
      y: pos.thumbY,
      width:  THUMB_W,
      height: THUMB_H,
      opacity: 1,
      zIndex: 10,
      borderRadius: THUMB_BR,
    });

    gsap.set(cardRefs[1].current, {
      x: pos.BR_X,
      y: pos.BR_Y + 80,
      width:  SMALL_W,
      height: SMALL_H,
      opacity: 0,
      zIndex: 6,
      borderRadius: SMALL_BR,
    });

    gsap.set(cardRefs[2].current, {
      x: pos.BR_X,
      y: pos.BR_Y + 80,
      width:  SMALL_W,
      height: SMALL_H,
      opacity: 0,
      zIndex: 4,
      borderRadius: SMALL_BR,
    });

    descRefs.forEach((r) => {
      gsap.set(r.current, {
        x: pos.DESC_X,
        y: pos.DESC_Y,
        opacity: 0,
      });
    });

    // ── TIMELINE ────────────────────────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end:   "bottom bottom",
        scrub: 2,
        pin:   stickyRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        // invalidateOnRefresh: true tells GSAP to re-read all "from" values
        // when the page is resized or ScrollTrigger.refresh() is called.
        // Combined with our ResizeObserver below, this keeps the layout
        // correct after any window resize.
        invalidateOnRefresh: true,
      },
    });

    // ── PHASE 0 (t=0 → 1.5): Hold ──────────────────────────────────────────
    tl.addLabel("hold0", 0);
    tl.to({}, { duration: 1.5 });

    // ── PHASE 1 (t=1.5 → 3.0): Headline exits UP; card-01 grows to hero ────
    tl.addLabel("growCard1", 1.5);

    tl.to(headlineRef.current, {
      y: "-120%",
      opacity: 1,
      ease: E_INOUT,
      duration: 1.2,
    }, "growCard1");

    tl.to(cardRefs[0].current, {
      x: pos.heroX,
      y: pos.heroY,
      width:  HERO_W,
      height: HERO_H,
      borderRadius: HERO_BR,
      ease: E_INOUT,
      duration: 1.5,
    }, "growCard1");

    // ── PHASE 2 (t=3.0 → 4.5): Hero-01 hold + desc + card-02 teaser ────────
    tl.addLabel("heroHold1", 3.0);

    tl.to(descRefs[0].current, {
      opacity: 1,
      ease: E_OUT,
      duration: 0.5,
    }, "heroHold1");

    tl.to(cardRefs[1].current, {
      y: pos.BR_Y,
      opacity: 1,
      ease: E_OUT,
      duration: 0.65,
    }, "heroHold1+=0.25");

    tl.to({}, { duration: 0.6 }, "heroHold1+=0.9");

    // ── PHASE 3 (t=4.5 → 6.0): 01 → 02 transition ──────────────────────────
    tl.addLabel("transition12", 4.5);

    tl.to(cardRefs[0].current, {
      x: pos.TL_X,
      y: pos.TL_Y,
      width:  SMALL_W,
      height: SMALL_H,
      borderRadius: SMALL_BR,
      ease: E_INOUT,
      duration: 1.5,
    }, "transition12");

    tl.to(cardRefs[1].current, {
      x: pos.heroX,
      y: pos.heroY,
      width:  HERO_W,
      height: HERO_H,
      borderRadius: HERO_BR,
      zIndex: 10,
      ease: E_INOUT,
      duration: 1.5,
    }, "transition12");

    tl.to(descRefs[0].current, {
      opacity: 0,
      ease: E_IN,
      duration: 0.4,
    }, "transition12");

    tl.to(descRefs[1].current, {
      opacity: 1,
      ease: E_OUT,
      duration: 0.5,
    }, "transition12+=0.55");

    tl.to(cardRefs[2].current, {
      y: pos.BR_Y,
      opacity: 1,
      ease: E_OUT,
      duration: 0.65,
    }, "transition12+=0.85");

    // ── PHASE 4 (t=6.0 → 7.5): Hero-02 hold ────────────────────────────────
    tl.addLabel("heroHold2", 6.0);
    tl.to({}, { duration: 1.5 }, "heroHold2");

    // ── PHASE 5 (t=7.5 → 9.0): 02 → 03 transition ──────────────────────────
    tl.addLabel("transition23", 7.5);

    tl.to(cardRefs[0].current, {
      x: pos.TL_X - 24,
      opacity: 0,
      ease: E_IN,
      duration: 0.4,
    }, "transition23");

    tl.to(cardRefs[1].current, {
      x: pos.TL_X,
      y: pos.TL_Y,
      width:  SMALL_W,
      height: SMALL_H,
      borderRadius: SMALL_BR,
      zIndex: 6,
      ease: E_INOUT,
      duration: 1.5,
    }, "transition23");

    tl.to(cardRefs[2].current, {
      x: pos.heroX,
      y: pos.heroY,
      width:  HERO_W,
      height: HERO_H,
      borderRadius: HERO_BR,
      zIndex: 10,
      ease: E_INOUT,
      duration: 1.5,
    }, "transition23");

    tl.to(descRefs[1].current, {
      opacity: 0,
      ease: E_IN,
      duration: 0.4,
    }, "transition23");

    tl.to(descRefs[2].current, {
      opacity: 1,
      ease: E_OUT,
      duration: 0.5,
    }, "transition23+=0.55");

    // ── PHASE 6 (t=9.0 → 10.0): Hero-03 hold — end ─────────────────────────
    tl.addLabel("heroHold3", 9.0);
    tl.to({}, { duration: 1.0 }, "heroHold3");

    // ── ResizeObserver — recalculate positions on container resize ──────────
    //
    // WHY ResizeObserver instead of ScrollTrigger's refreshInit event:
    //   ScrollTrigger's refreshInit fires at an imprecise moment and can
    //   read intermediate layout states. ResizeObserver fires after the
    //   browser has completed a full layout pass on the observed element,
    //   so clientWidth/clientHeight are final and correct.
    //
    // We observe the sticky container. When it resizes, we:
    //   1. Recalculate all positions from the container's new measured size
    //   2. Re-apply GSAP initial states (gsap.set) with new coordinates
    //   3. Call ScrollTrigger.refresh() to rebuild the scroll timeline
    //
    // requestAnimationFrame defers the update to the next paint cycle,
    // ensuring the browser has finished its layout before we measure.
    let rafId = null;

    const ro = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const newPos = calcPositions();

        // Update all desc starting positions
        descRefs.forEach((r) => {
          gsap.set(r.current, { x: newPos.DESC_X, y: newPos.DESC_Y });
        });

        // Update thumbnail starting position
        gsap.set(cardRefs[0].current, {
          x: newPos.thumbX,
          y: newPos.thumbY,
        });

        // Refresh ScrollTrigger so it recalculates pin heights / start-end
        ScrollTrigger.refresh();
        rafId = null;
      });
    });

    ro.observe(sticky);

    return () => {
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cts-section"
      style={{ height: SECTION_HEIGHT }}
    >
      <div ref={stickyRef} className="cts-sticky">

        {/* ── Ambient corner labels ── */}
        <span className="cts-ambient cts-ambient--tl">Experience Highlights</span>
        <span className="cts-ambient cts-ambient--br">Skip town, let&apos;s fly</span>

        {/* ── Editorial headline — physically exits viewport upward ── */}
        <h1 ref={headlineRef} className="cts-headline">
          Strategic<br />Immersion
        </h1>

        {/* ── Cards ── */}
        {CARDS.map((card, i) => (
          <div
            key={card.num}
            ref={cardRefs[i]}
            className={`cts-card cts-card--${i + 1}`}
          >
            <span className="cts-card__num">{card.num}</span>
            <h2 className="cts-card__title">
              {card.title.map((line, li) => (
                <span key={li} className="cts-card__title-line">{line}</span>
              ))}
            </h2>
          </div>
        ))}

        {/* ── Descriptions (right column, outside cards) ── */}
        {CARDS.map((card, i) => (
          <div
            key={`desc-${card.num}`}
            ref={descRefs[i]}
            className="cts-desc"
          >
            <p className="cts-desc__body">{card.desc}</p>
            <a className="cts-desc__cta" href="#">{card.cta}</a>
          </div>
        ))}

      </div>
    </section>
  );
}
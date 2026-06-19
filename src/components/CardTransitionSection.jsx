import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CardTransitionSection.css";

gsap.registerPlugin(ScrollTrigger);

// ── Layout constants ────────────────────────────────────────────────────────

// HERO card: exactly 800 × 950px (aspect ratio 0.842:1)
const HERO_W = 780;
const HERO_H = 830;
const HERO_BR = 20; // border-radius at hero size

// SMALL card: same aspect ratio as hero (0.842:1)
// Reference thumbnail size: ~158px wide
const SMALL_W = 158;
const SMALL_H = Math.round(SMALL_W / (HERO_W / HERO_H)); // ≈ 188px
const SMALL_BR = 20;

// THUMBNAIL — tiny teaser card (State 1, before hero grow)
const THUMB_W = 58;
const THUMB_H = Math.round(THUMB_W / (HERO_W / HERO_H)); // ≈ 69px
const THUMB_BR = 12;


// At 1512px: hero right edge ≈ 1040, leaving ~472px for desc column
const heroX = () => Math.round((window.innerWidth - HERO_W) / 2) - Math.round(window.innerWidth * 0.00);
const heroY = () => Math.round((window.innerHeight - HERO_H) / 2);

// Thumbnail: bottom-center, slightly below middle
const thumbX = () => Math.round((window.innerWidth - THUMB_W) / 2);
const thumbY = () => Math.round(window.innerHeight * 0.72);

// Small card TL: top-left corner, matching hero's left edge
const TL_X = () => 250;
const TL_Y = () => 40;

// Description block: right of hero card
// Gap between hero right edge and desc left = 48px
const DESC_GAP = 18;
const DESC_X = () => heroX() + HERO_W + DESC_GAP;
// Description top: vertically centered relative to hero card
const DESC_Y = () => heroY() + Math.round(HERO_H * 0.30);

// Small card BR (teaser): positioned to the right, below description
const BR_X = () => DESC_X() +35;
const BR_Y = () => DESC_Y() + 450;

// ── Section scroll height ───────────────────────────────────────────────────
// 520vh total — same phases as before
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

    const E_OUT   = "power3.out";
    const E_IN    = "power2.in";
    const E_INOUT = "power3.inOut";

    // ── INITIAL STATES ──────────────────────────────────────────────────────

    // Headline: dominant, fully visible, positioned at top-left
    gsap.set(headlineRef.current, { opacity: 1, y: 0 });

    // Card 01 — tiny thumbnail, vertically centered-ish
    gsap.set(cardRefs[0].current, {
      x: thumbX(),
      y: thumbY(),
      width:  THUMB_W,
      height: THUMB_H,
      opacity: 1,
      zIndex: 10,
      borderRadius: THUMB_BR,
    });

    // Card 02 — small, starts off-screen below BR rest position
    gsap.set(cardRefs[1].current, {
      x: BR_X(),
      y: BR_Y() + 80,
      width:  SMALL_W,
      height: SMALL_H,
      opacity: 0,
      zIndex: 6,
      borderRadius: SMALL_BR,
    });

    // Card 03 — small, starts off-screen below BR rest position
    gsap.set(cardRefs[2].current, {
      x: BR_X(),
      y: BR_Y() + 80,
      width:  SMALL_W,
      height: SMALL_H,
      opacity: 0,
      zIndex: 4,
      borderRadius: SMALL_BR,
    });

    // All descriptions hidden
    descRefs.forEach((r) => {
      gsap.set(r.current, {
        x: DESC_X(),
        y: DESC_Y(),
        opacity: 0,
      });
    });

    // ── TIMELINE ────────────────────────────────────────────────────────────
    //
    // t= 0.0 – 1.5  [PHASE 0] Hold — headline dominates, card-01 thumb visible
    // t= 1.5 – 3.0  [PHASE 1] Headline slides UP off viewport; card-01 grows to hero
    // t= 3.0 – 4.5  [PHASE 2] Hero-01 hold; desc-01 fades in; card-02 teaser slides in
    // t= 4.5 – 6.0  [PHASE 3] Card-01 hero → small TL; Card-02 BR → hero
    // t= 6.0 – 7.5  [PHASE 4] Hero-02 hold; desc-02 active; card-03 teaser slides in
    // t= 7.5 – 9.0  [PHASE 5] Card-02 hero → small TL; Card-03 → hero
    // t= 9.0 – 10.0 [PHASE 6] Hero-03 hold; desc-03 active; end

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end:   "bottom bottom",
        scrub: 2,
        pin:   stickyRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // ── PHASE 0 (t=0 → 1.5): Hold ──────────────────────────────────────────
    tl.addLabel("hold0", 0);
    tl.to({}, { duration: 1.5 });

    // ── PHASE 1 (t=1.5 → 3.0): Headline exits UP; card-01 grows to hero ────
    tl.addLabel("growCard1", 1.5);

    // Headline physically moves UP and exits the viewport — does NOT fade
    tl.to(headlineRef.current, {
      y: "-120%",      // slide completely off the top
      opacity: 1,      // stays fully opaque while moving
      ease: E_INOUT,
      duration: 1.2,
    }, "growCard1");

    // Card-01 grows from thumbnail to hero
    tl.to(cardRefs[0].current, {
      x: heroX(),
      y: heroY(),
      width:  HERO_W,
      height: HERO_H,
      borderRadius: HERO_BR,
      ease: E_INOUT,
      duration: 1.5,
    }, "growCard1");

    // ── PHASE 2 (t=3.0 → 4.5): Hero-01 hold + desc + card-02 teaser ────────
    tl.addLabel("heroHold1", 3.0);

    // Desc-01 fades in
    tl.to(descRefs[0].current, {
      opacity: 1,
      ease: E_OUT,
      duration: 0.5,
    }, "heroHold1");

    // Card-02 slides up into BR teaser position
    tl.to(cardRefs[1].current, {
      y: BR_Y(),
      opacity: 1,
      ease: E_OUT,
      duration: 0.65,
    }, "heroHold1+=0.25");

    // Hold
    tl.to({}, { duration: 0.6 }, "heroHold1+=0.9");

    // ── PHASE 3 (t=4.5 → 6.0): 01 → 02 transition ──────────────────────────
    tl.addLabel("transition12", 4.5);

    // Card-01: hero → small top-left (same aspect ratio)
    tl.to(cardRefs[0].current, {
      x: TL_X(),
      y: TL_Y(),
      width:  SMALL_W,
      height: SMALL_H,
      borderRadius: SMALL_BR,
      ease: E_INOUT,
      duration: 1.5,
    }, "transition12");

    // Card-02: BR small → hero center
    tl.to(cardRefs[1].current, {
      x: heroX(),
      y: heroY(),
      width:  HERO_W,
      height: HERO_H,
      borderRadius: HERO_BR,
      zIndex: 10,
      ease: E_INOUT,
      duration: 1.5,
    }, "transition12");

    // Desc-01 fades out
    tl.to(descRefs[0].current, {
      opacity: 0,
      ease: E_IN,
      duration: 0.4,
    }, "transition12");

    // Desc-02 fades in
    tl.to(descRefs[1].current, {
      opacity: 1,
      ease: E_OUT,
      duration: 0.5,
    }, "transition12+=0.55");

    // Card-03 slides up into BR teaser
    tl.to(cardRefs[2].current, {
      y: BR_Y(),
      opacity: 1,
      ease: E_OUT,
      duration: 0.65,
    }, "transition12+=0.85");

    // ── PHASE 4 (t=6.0 → 7.5): Hero-02 hold ────────────────────────────────
    tl.addLabel("heroHold2", 6.0);
    tl.to({}, { duration: 1.5 }, "heroHold2");

    // ── PHASE 5 (t=7.5 → 9.0): 02 → 03 transition ──────────────────────────
    tl.addLabel("transition23", 7.5);

    // Card-01 (small TL) fades out
    tl.to(cardRefs[0].current, {
      x: TL_X() - 24,
      opacity: 0,
      ease: E_IN,
      duration: 0.4,
    }, "transition23");

    // Card-02: hero → small top-left
    tl.to(cardRefs[1].current, {
      x: TL_X(),
      y: TL_Y(),
      width:  SMALL_W,
      height: SMALL_H,
      borderRadius: SMALL_BR,
      zIndex: 6,
      ease: E_INOUT,
      duration: 1.5,
    }, "transition23");

    // Card-03: BR small → hero center
    tl.to(cardRefs[2].current, {
      x: heroX(),
      y: heroY(),
      width:  HERO_W,
      height: HERO_H,
      borderRadius: HERO_BR,
      zIndex: 10,
      ease: E_INOUT,
      duration: 1.5,
    }, "transition23");

    // Desc-02 fades out
    tl.to(descRefs[1].current, {
      opacity: 0,
      ease: E_IN,
      duration: 0.4,
    }, "transition23");

    // Desc-03 fades in
    tl.to(descRefs[2].current, {
      opacity: 1,
      ease: E_OUT,
      duration: 0.5,
    }, "transition23+=0.55");

    // ── PHASE 6 (t=9.0 → 10.0): Hero-03 hold — end ─────────────────────────
    tl.addLabel("heroHold3", 9.0);
    tl.to({}, { duration: 1.0 }, "heroHold3");

    // ── Keep layouts correct on resize ──────────────────────────────────────
    ScrollTrigger.addEventListener("refreshInit", () => {
      descRefs.forEach((r) => {
        gsap.set(r.current, { x: DESC_X(), y: DESC_Y() });
      });
    });

    return () => {
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
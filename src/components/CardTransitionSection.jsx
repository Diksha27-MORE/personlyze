import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CardTransitionSection.css";

gsap.registerPlugin(ScrollTrigger);

// ── Layout constants ────────────────────────────────────────────────────────
const HERO_W = 780;
const HERO_H = 830;
const HERO_BR = 20;

const SMALL_W = 158;
const SMALL_H = Math.round(SMALL_W / (HERO_W / HERO_H));
const SMALL_BR = 20;

const THUMB_W = 58;
const THUMB_H = Math.round(THUMB_W / (HERO_W / HERO_H));
const THUMB_BR = 12;

const heroX = () => Math.round((window.innerWidth - HERO_W) / 2) + 40;
const heroY = () => Math.round((window.innerHeight - HERO_H) / 2);

const thumbX = () => Math.round((window.innerWidth - THUMB_W) / 2);
const thumbY = () => Math.round(window.innerHeight * 0.72);

const TL_X = () => heroX() - 200;
const TL_Y = () => 40;

const DESC_GAP = 18;
const DESC_X = () => heroX() + HERO_W + DESC_GAP;
const DESC_Y = () => heroY() + Math.round(HERO_H * 0.30);

const BR_X = () => DESC_X() + 35;
const BR_Y = () => DESC_Y() + 450;

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

    const ctx = gsap.context(() => {
      // ── INITIAL STATES (re-applied on every refresh) ──────────────────────
      const applyInitialState = () => {
        gsap.set(headlineRef.current, { opacity: 1, y: 0 });

        gsap.set(cardRefs[0].current, {
          x: thumbX(),
          y: thumbY(),
          width:  THUMB_W,
          height: THUMB_H,
          opacity: 1,
          zIndex: 10,
          borderRadius: THUMB_BR,
        });

        gsap.set(cardRefs[1].current, {
          x: BR_X(),
          y: BR_Y() + 80,
          width:  SMALL_W,
          height: SMALL_H,
          opacity: 0,
          zIndex: 6,
          borderRadius: SMALL_BR,
        });

        gsap.set(cardRefs[2].current, {
          x: BR_X(),
          y: BR_Y() + 80,
          width:  SMALL_W,
          height: SMALL_H,
          opacity: 0,
          zIndex: 4,
          borderRadius: SMALL_BR,
        });

        descRefs.forEach((r) => {
          gsap.set(r.current, {
            x: DESC_X(),
            y: DESC_Y(),
            opacity: 0,
          });
        });
      };

      applyInitialState();

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
          invalidateOnRefresh: true, // recomputes function-based values on refresh/zoom
        },
      });

      // ── PHASE 0 ─────────────────────────────────────────────────────────────
      tl.addLabel("hold0", 0);
      tl.to({}, { duration: 1.5 });

      // ── PHASE 1: Headline exits; card-01 grows to hero ──────────────────────
      tl.addLabel("growCard1", 1.5);

      tl.to(headlineRef.current, {
        y: "-120%",
        opacity: 1,
        ease: E_INOUT,
        duration: 1.2,
      }, "growCard1");

      tl.to(cardRefs[0].current, {
        x: () => heroX(),
        y: () => heroY(),
        width:  HERO_W,
        height: HERO_H,
        borderRadius: HERO_BR,
        ease: E_INOUT,
        duration: 1.5,
      }, "growCard1");

      // ── PHASE 2: Hero-01 hold ───────────────────────────────────────────────
      tl.addLabel("heroHold1", 3.0);

      tl.to(descRefs[0].current, {
        x: () => DESC_X(),
        y: () => DESC_Y(),
        opacity: 1,
        ease: E_OUT,
        duration: 0.5,
      }, "heroHold1");

      tl.to(cardRefs[1].current, {
        x: () => BR_X(),
        y: () => BR_Y(),
        opacity: 1,
        ease: E_OUT,
        duration: 0.65,
      }, "heroHold1+=0.25");

      tl.to({}, { duration: 0.6 }, "heroHold1+=0.9");

      // ── PHASE 3: 01 → 02 transition ─────────────────────────────────────────
      tl.addLabel("transition12", 4.5);

      tl.to(cardRefs[0].current, {
        x: () => TL_X(),
        y: () => TL_Y(),
        width:  SMALL_W,
        height: SMALL_H,
        borderRadius: SMALL_BR,
        ease: E_INOUT,
        duration: 1.5,
      }, "transition12");

      tl.to(cardRefs[1].current, {
        x: () => heroX(),
        y: () => heroY(),
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
        x: () => DESC_X(),
        y: () => DESC_Y(),
        opacity: 1,
        ease: E_OUT,
        duration: 0.5,
      }, "transition12+=0.55");

      tl.to(cardRefs[2].current, {
        x: () => BR_X(),
        y: () => BR_Y(),
        opacity: 1,
        ease: E_OUT,
        duration: 0.65,
      }, "transition12+=0.85");

      // ── PHASE 4: Hero-02 hold ───────────────────────────────────────────────
      tl.addLabel("heroHold2", 6.0);
      tl.to({}, { duration: 1.5 }, "heroHold2");

      // ── PHASE 5: 02 → 03 transition ─────────────────────────────────────────
      tl.addLabel("transition23", 7.5);

      tl.to(cardRefs[0].current, {
        x: () => TL_X() - 24,
        opacity: 0,
        ease: E_IN,
        duration: 0.4,
      }, "transition23");

      tl.to(cardRefs[1].current, {
        x: () => TL_X(),
        y: () => TL_Y(),
        width:  SMALL_W,
        height: SMALL_H,
        borderRadius: SMALL_BR,
        zIndex: 6,
        ease: E_INOUT,
        duration: 1.5,
      }, "transition23");

      tl.to(cardRefs[2].current, {
        x: () => heroX(),
        y: () => heroY(),
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
        x: () => DESC_X(),
        y: () => DESC_Y(),
        opacity: 1,
        ease: E_OUT,
        duration: 0.5,
      }, "transition23+=0.55");

      // ── PHASE 6: Hero-03 hold ───────────────────────────────────────────────
      tl.addLabel("heroHold3", 9.0);
      tl.to({}, { duration: 1.0 }, "heroHold3");

      // Re-apply non-animated initial card positions on refresh (zoom/resize)
      ScrollTrigger.addEventListener("refreshInit", applyInitialState);

      // Force a refresh when the browser zoom changes the visual viewport
      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);

      // Cleanup listeners with the gsap.context revert
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", applyInitialState);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cts-section"
      style={{ height: SECTION_HEIGHT }}
    >
      <div ref={stickyRef} className="cts-sticky">

        <span className="cts-ambient cts-ambient--tl">Experience Highlights</span>
        <span className="cts-ambient cts-ambient--br">Skip town, let&apos;s fly</span>

        <h1 ref={headlineRef} className="cts-headline">
          Strategic<br />Immersion
        </h1>

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

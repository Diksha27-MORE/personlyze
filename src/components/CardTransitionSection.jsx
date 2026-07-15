import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CardTransitionSection.css";

// ── Card background images ──
import strategicImg from "../assets/Strategic.png";
import creativeImg from "../assets/Creative.png";
import aiImg from "../assets/AI.png";

const CARD_IMAGES = [strategicImg, creativeImg, aiImg];

gsap.registerPlugin(ScrollTrigger);

// ── Live viewport metrics ─────────────────────────────────────────
// FIX: every layout constant below used to read window.innerWidth /
// window.innerHeight directly. That's the root cause of the empty gap in
// Screenshot 2: on many mobile browsers window.innerHeight does NOT match
// the CSS `100svh` box that `.cts-sticky` (and therefore the fullscreen
// hero card) is actually sized to — it depends on things like whether the
// address bar is currently shown/collapsed, and that can differ device to
// device even at the same CSS width. `vp` is kept in sync with the
// *actual rendered size* of `.cts-sticky` (see `syncViewportMetrics`
// inside the component), so HERO_H() etc. always match the real on-screen
// box, on every device — not just the one the design was built on.
const vp = {
  w: typeof window !== "undefined" ? window.innerWidth  : 390,
  h: typeof window !== "undefined" ? window.innerHeight : 700,
};

// ── Layout constants (responsive) ───────────────────────────────
const isMobile = () => vp.w <= 640;

// CHANGED: on mobile the hero card is now fullscreen (100vw x 100svh).
// vp.h/vp.w (synced to the real `.cts-sticky` box, see above) are used as
// the JS-side proxy for 100svh/100vw since GSAP needs a concrete pixel
// value (the CSS side still uses `100svh` for the sticky wrapper itself,
// see .cts-sticky in the CSS file).
const HERO_W  = () => isMobile() ? vp.w : 780;
const HERO_H  = () => isMobile() ? vp.h : 830;
// CHANGED: mobile hero border radius reduced to ~0 ("almost all radius removed").
// Kept at 2px instead of a hard 0 to avoid a hairline aliasing edge on the image.
const HERO_BR = () => isMobile() ? 2 : 20;

const SMALL_W  = () => isMobile() ? 96 : 158;
const SMALL_H  = () => Math.round(SMALL_W() / (780 / 830));
const SMALL_BR = () => isMobile() ? 14 : 20;

const THUMB_W  = () => isMobile() ? 46 : 58;
const THUMB_H  = () => Math.round(THUMB_W() / (780 / 830));
const THUMB_BR = () => isMobile() ? 10 : 12;

const heroX = () => Math.round((vp.w - HERO_W()) / 2)
// CHANGED: mobile hero now starts flush at the very top (0) instead of an
// 8vh offset, since it fills the whole screen edge-to-edge.
const heroY = () => isMobile()
  ? 0
  : Math.round((vp.h - HERO_H()) / 2);

const thumbX = () => Math.round((vp.w - THUMB_W()) / 2);
const thumbY = () => Math.round(vp.h * (isMobile() ? 0.82 : 0.72));

const TL_X = () => isMobile() ? 16 : heroX() - 200;
const TL_Y = () => isMobile() ? 16 : 40;

const DESC_GAP = 60;

// CHANGED: these two are only used by the desktop DESC_X/DESC_Y branches now.
// Mobile has its own dedicated bottom-anchored constants below.
const MOBILE_DESC_GAP = () =>
  Math.max(72, Math.round(vp.h * 0.09));

const DESC_W_DESKTOP = 320;

// NEW: mobile description panel now lives INSIDE the fullscreen card, near
// the bottom, over a dark gradient — not below the hero like before.
const MOBILE_DESC_SIDE_PAD   = 24;  // left/right inset, matches card's premium margin
const MOBILE_DESC_BLOCK_H    = 180; // approx reserved height for one description block
                                     // (keep in sync with .cts-desc__sections min-height in CSS)
const MOBILE_DESC_BOTTOM_PAD = 56;  // gap from the bottom safe area

const DESC_X_LEFT = () => {
  if (isMobile()) {
    // CHANGED: left-aligned, flush with the card's own padding — no longer
    // centered in a narrow floating box.
    return MOBILE_DESC_SIDE_PAD;
  }
  return heroX() - (DESC_W_DESKTOP + DESC_GAP);
};

const DESC_X_RIGHT = () => {
  if (isMobile()) {
    // CHANGED: left and right panels collapse to the exact same inset on
    // mobile, since only one description panel is ever shown at a time.
    return MOBILE_DESC_SIDE_PAD;
  }
  return heroX() + HERO_W() + DESC_GAP;
};

// CHANGED: on mobile, description now anchors near the BOTTOM of the
// fullscreen hero card (over the gradient) instead of below the hero.
const DESC_Y = () => isMobile()
  ? vp.h - MOBILE_DESC_BLOCK_H - MOBILE_DESC_BOTTOM_PAD
  : heroY() + Math.round(HERO_H() * 0.30);

const BR_X = () => isMobile()
  ? vp.w - SMALL_W() - 16
  : heroX() + HERO_W() + DESC_GAP + 35;
const BR_Y = () => isMobile()
  ? vp.h - SMALL_H() - 24
  : DESC_Y() + 450;

// NOTE: previewOpacity() is already 0 on mobile, so the top-left "history"
// thumbnail and the bottom-right "up next" thumbnail are already invisible
// on mobile today. That's what makes the fullscreen hero swap feel clean —
// nothing unrelated is left floating on screen. Left untouched.
const previewOpacity = () => (isMobile() ? 0 : 1);

// ── Timeline pacing constants — tune these to change the scroll feel ──────
// UNCHANGED — none of the animation timing changed, only WHERE things move to.
const HOLD0_DUR            = 1.5;
const HEADLINE_EXIT_DUR    = 0.8;
const CARD_GROW_DUR        = 1.5;
const LABEL_IN_DELAY       = 0.9;
const LABEL_IN_DUR         = 0.6;
const LABEL_OUT_DUR        = 0.3;
const TYPE_START_DELAY     = 1.5;
const TYPE_DURS            = [1.2, 1.4, 1.4];
const POST_TYPE_PAUSE      = 0.3;
const DESC_FADE_IN_DUR     = 0.5;
const DESC_FADE_OUT_DUR    = 0.4;
const SECTION_IN_DUR       = 0.6;
const SECTION_OUT_DUR      = 0.5;
const SECTION_HOLD_DUR     = 1.8;
const HOLD_AFTER_SECTIONS  = 0.6;
const NEXT_PREVIEW_DELAY   = 0.6;
const NEXT_PREVIEW_DUR     = 0.65;
const TL_SHRINK_DUR        = 1.5;
const GRANDPARENT_FADE_DUR = 0.4;
const FINAL_HOLD_DUR       = 1.0;
const FINAL_PAUSE_DUR      = 1.2;

const SECTION_HEIGHT = "700vh";
// CHANGED: each card now carries an extra `mobileTitle` field — a short,
// premium-feeling title shown only on mobile ("01 / Strategic Immersion")
// in place of the huge desktop-style all-caps label ("01 / STRATEGY").
// Desktop still renders `label` exactly as before — nothing removed.
const CARDS = [
  {
    num: "01",
    label: "STRATEGY",
    mobileTitle:"STRATEGY",
    bottom:
      "Because everything in business must begin with strategy.\nAnd everything in strategy must begin with the consumer.",
    desc: [
      { heading: "Build Consumer Personas", body: "Bringing the customer alive through rich customer profiles that go beyond demographics—capturing motivations, behaviours, anxieties and aspirations." },
      { heading: "Craft Consumer Decision Journeys", body: "Mapping every touchpoint, trigger and barrier from discovery to purchase, so you know exactly what to say, when to say it and where it matters most." },
      { heading: "Identify High-Impact Personalization Opportunities", body: "Finding the moments where personalization creates the biggest impact on conversion, loyalty and advocacy, helping prioritize creative, budget and technology investments." },
    ],
  },
  {
    num: "02",
    label: "DESIGN",
    mobileTitle:  "DESIGN",
    bottom:
      "Strategy tells us what to say. Creative shows us how to say it.\nSo that it's relevant, grabs attention, and makes us do something..",
    desc: [
      { heading: "Create Content Frameworks", body: "Design the narrative, script, tone of voice, visual language and storytelling structure that makes every personalized video feel authentic and memorable." },
      { heading: "Produce Video Assets", body: "End-to-end production—from planning and filming to editing—creating premium video assets that are both brand-ready and AI-ready for personalization." },
    ],
  },
  {
    num: "03",
    label: "ARTIFICIAL\nINTELLIGENCE",
    mobileTitle:"ARTIFICIAL\nINTELLIGENCE",
    bottom:
      "Personalized videos, at a scale no human team could achieve alone.\nTo get you millions of conversations, happening simultaneously.",
    desc: [
      { heading: "Create Hyper-Personalized Videos", body: "Using customer data, our AI creates a unique video for every individual while keeping your brand story consistent across every interaction." },
      { heading: "Deploy to Marketing Channels", body: "Automatically deliver personalized videos across your existing marketing platforms, ensuring every customer receives the right message at the right moment." },
      { heading: "Measure, Review & Calibrate", body: "Continuously monitor performance, optimize campaigns and improve results in real time, making every future interaction smarter than the last." },
    ],
  },
];

const CARD_LINES = CARDS.map((c) => c.bottom.split("\n"));

// Point 1 → LEFT, Point 2 → RIGHT, Point 3 → LEFT ...
// NOTE: this still drives desktop's left/right alternation. On mobile both
// "sides" render at the same inset (see DESC_X_LEFT/RIGHT above), so the
// left/right distinction is purely a desktop concern now.
const sideForIndex = (si) => (si % 2 === 0 ? "left" : "right");

export default function CardTransitionSection() {
  const sectionRef  = useRef(null);
  const stickyRef   = useRef(null);
  const headlineRef = useRef(null);

  const cardRefs  = [useRef(null), useRef(null), useRef(null)];
  const descLeftRefs  = [useRef(null), useRef(null), useRef(null)];
  const descRightRefs = [useRef(null), useRef(null), useRef(null)];
  const titleRefs = [useRef(null), useRef(null), useRef(null)];
  const labelRefs = [useRef(null), useRef(null), useRef(null)];

  const lineRefs = [
    [useRef(null), useRef(null)],
    [useRef(null), useRef(null)],
    [useRef(null), useRef(null)],
  ];

  const descSectionRefs = useRef([[], [], []]);
  const setDescSectionRef = (cardIdx, secIdx) => (el) => {
    descSectionRefs.current[cardIdx][secIdx] = el;
  };

  useEffect(() => {
    const section = sectionRef.current;

    const E_OUT   = "power3.out";
    const E_IN    = "power2.in";
    const E_INOUT = "power3.inOut";

    const ctx = gsap.context(() => {
      // FIX: reads the ACTUAL rendered size of `.cts-sticky` (which is
      // always 100vw x 100svh via CSS) and syncs it into `vp` (module
      // scope, above). Every layout constant then derives from this real
      // box instead of window.innerWidth/innerHeight, which is what
      // eliminates the device-dependent empty space.
      const syncViewportMetrics = () => {
        const rect = stickyRef.current?.getBoundingClientRect();
        vp.w = rect && rect.width  > 0 ? rect.width  : window.innerWidth;
        vp.h = rect && rect.height > 0 ? rect.height : window.innerHeight;
      };

      const renderTyped = (cardIdx, p) => {
        const [l0, l1] = lineRefs[cardIdx];
        if (!l0.current || !l1.current) return;
        const [t0, t1] = CARD_LINES[cardIdx];
        const total = t0.length + t1.length;
        const shown = Math.round(gsap.utils.clamp(0, 1, p) * total);
        l0.current.textContent = t0.slice(0, Math.min(shown, t0.length));
        l1.current.textContent = shown > t0.length ? t1.slice(0, shown - t0.length) : "";
      };

      const applyInitialState = () => {
        syncViewportMetrics();

        gsap.set(headlineRef.current, { opacity: 1, y: 0 });

        gsap.set(cardRefs[0].current, {
          x: thumbX(), y: thumbY(),
          width: THUMB_W(), height: THUMB_H(),
          opacity: isMobile() ? 0 : 1,
          zIndex: 10, borderRadius: THUMB_BR(),
        });

        gsap.set(cardRefs[1].current, {
          x: BR_X(), y: BR_Y() + 80,
          width: SMALL_W(), height: SMALL_H(),
          opacity: 0, zIndex: 6, borderRadius: SMALL_BR(),
        });

        gsap.set(cardRefs[2].current, {
          x: BR_X(), y: BR_Y() + 80,
          width: SMALL_W(), height: SMALL_H(),
          opacity: 0, zIndex: 4, borderRadius: SMALL_BR(),
        });

        descLeftRefs.forEach((r) => {
          if (r.current) gsap.set(r.current, { x: DESC_X_LEFT(), y: DESC_Y(), opacity: 0 });
        });
        descRightRefs.forEach((r) => {
          if (r.current) gsap.set(r.current, { x: DESC_X_RIGHT(), y: DESC_Y(), opacity: 0 });
        });

        descSectionRefs.current.forEach((cardSections) => {
          cardSections.forEach((el, si) => {
            if (!el) return;
            // CHANGED: on mobile every section stacks in the exact same spot
            // (see CSS: .cts-desc__section becomes position:absolute on
            // mobile), so the slide-in offset there is a small vertical
            // nudge instead of desktop's left/right nudge — the CSS handles
            // the stacking, this just keeps the "slide" feel on entry.
            const fromX = isMobile() ? 0 : (sideForIndex(si) === "left" ? -30 : 30);
            const fromY = isMobile() ? 14 : 0;
            gsap.set(el, { opacity: 0, x: fromX, y: fromY });
          });
        });

        gsap.set(titleRefs.map((r) => r.current), { opacity: 0 });
        gsap.set(labelRefs.map((r) => r.current), { opacity: 0 });

        CARDS.forEach((_, i) => renderTyped(i, 0));
      };

      applyInitialState();

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

      const typeText = (cardIdx, atTime, dur) => {
        const proxy = { p: 0 };
        tl.to(
          proxy,
          {
            p: 1,
            duration: dur,
            ease: "none",
            onUpdate: () => renderTyped(cardIdx, proxy.p),
          },
          atTime,
        );
      };

      // UNCHANGED: still reveals one description point at a time, holding
      // for SECTION_HOLD_DUR before the next one fades in/out. On mobile the
      // CSS makes all sections occupy the same box, so this same "fade one,
      // fade the next" logic now visually reads as an in-place crossfade.
      const cycleSubSections = (cardIdx, startTime, perSectionDur) => {
        const sections = descSectionRefs.current[cardIdx]
          .map((el, si) => ({ el, si }))
          .filter((x) => x.el);
        if (sections.length === 0) return 0;

        sections.forEach(({ el, si }, i) => {
          const slotStart = startTime + i * perSectionDur;
          tl.to(el, { opacity: 1, x: 0, y: 0, ease: E_OUT, duration: SECTION_IN_DUR }, slotStart);

          if (i < sections.length - 1) {
            const outX = isMobile() ? 0 : (sideForIndex(si) === "left" ? -20 : 20);
            const outY = isMobile() ? -14 : 0;
            const outAt = slotStart + perSectionDur - SECTION_OUT_DUR;
            tl.to(el, { opacity: 0, x: outX, y: outY, ease: E_IN, duration: SECTION_OUT_DUR }, outAt);
          }
        });

        return sections.length * perSectionDur;
      };

      const descPair = (i) => [descLeftRefs[i].current, descRightRefs[i].current].filter(Boolean);

      // ── Build the timeline card-by-card ─────────────────────────────────
      // UNCHANGED: timeline structure, ordering, and durations are identical
      // to before. Only the x/y/width/height/borderRadius VALUES fed into it
      // (via the constants above) differ on mobile.
      let t = 0;
      tl.addLabel("hold0", t);
      t += HOLD0_DUR;

      CARDS.forEach((card, i) => {
        const growAt = t;
        tl.addLabel(`grow${i}`, growAt);

        if (i === 0) {
          tl.to(headlineRef.current, {
            y: "-120%", opacity: 0, ease: E_INOUT, duration: HEADLINE_EXIT_DUR,
          }, growAt);
        } else {
          tl.to(cardRefs[i - 1].current, {
            x: () => TL_X(), y: () => TL_Y(),
            width: () => SMALL_W(), height: () => SMALL_H(),
            borderRadius: () => SMALL_BR(),
            opacity: () => previewOpacity(),
            ease: E_INOUT, duration: TL_SHRINK_DUR,
          }, growAt);

          if (i - 2 >= 0) {
            tl.to(cardRefs[i - 2].current, {
              x: () => TL_X() - 24, opacity: 0, ease: E_IN, duration: GRANDPARENT_FADE_DUR,
            }, growAt);
          }

          tl.to(descPair(i - 1), { opacity: 0, ease: E_IN, duration: DESC_FADE_OUT_DUR }, growAt);
          tl.to(labelRefs[i - 1].current, { opacity: 0, ease: E_IN, duration: LABEL_OUT_DUR }, growAt);
          tl.to(titleRefs[i - 1].current, { opacity: 0, ease: E_IN, duration: LABEL_OUT_DUR }, growAt);
          tl.call(() => renderTyped(i - 1, 0), null, growAt + 0.3);
        }

        tl.to(cardRefs[i].current, {
          x: () => heroX(), y: () => heroY(),
          width: () => HERO_W(), height: () => HERO_H(),
          borderRadius: () => HERO_BR(),
          opacity: 1, zIndex: 10,
          ease: E_INOUT, duration: CARD_GROW_DUR,
        }, growAt);

        tl.to(labelRefs[i].current, { opacity: 1, ease: E_OUT, duration: LABEL_IN_DUR }, growAt + LABEL_IN_DELAY);
        tl.to(titleRefs[i].current, { opacity: 1, ease: E_OUT, duration: LABEL_IN_DUR }, growAt + LABEL_IN_DELAY);

        const typeStart = growAt + TYPE_START_DELAY;
        const typeDur = TYPE_DURS[i];
        typeText(i, typeStart, typeDur);

        const sectionsStart = typeStart + typeDur + POST_TYPE_PAUSE;
        tl.to(descPair(i), { opacity: 1, ease: E_OUT, duration: DESC_FADE_IN_DUR }, sectionsStart);
        const sectionsDuration = cycleSubSections(i, sectionsStart, SECTION_HOLD_DUR);

        if (i + 1 < CARDS.length) {
          tl.to(cardRefs[i + 1].current, {
            x: () => BR_X(), y: () => BR_Y(),
            width: () => SMALL_W(), height: () => SMALL_H(),
            borderRadius: () => SMALL_BR(),
            opacity: () => previewOpacity(),
            ease: E_OUT, duration: NEXT_PREVIEW_DUR,
          }, sectionsStart + NEXT_PREVIEW_DELAY);
        }

        const holdEnd = sectionsStart + sectionsDuration + HOLD_AFTER_SECTIONS;

        if (i === CARDS.length - 1) {
          tl.to({}, { duration: FINAL_HOLD_DUR }, holdEnd);
          tl.to(descPair(i), { opacity: 0, ease: E_IN, duration: DESC_FADE_OUT_DUR }, holdEnd + FINAL_HOLD_DUR);
          tl.to({}, { duration: FINAL_PAUSE_DUR }, holdEnd + FINAL_HOLD_DUR);
          t = holdEnd + FINAL_HOLD_DUR + FINAL_PAUSE_DUR;
        } else {
          t = holdEnd;
        }
      });

      ScrollTrigger.addEventListener("refreshInit", applyInitialState);

      // FIX: previously this only re-checked window.innerWidth, so on
      // mobile browsers where the address bar shows/hides — which changes
      // window.innerHeight but not the width — this never fired, and the
      // hero card's JS-computed height went stale relative to the actual
      // `.cts-sticky` (100svh) box. That drift is what produced the
      // leftover empty space in Screenshot 2. Now both dimensions of the
      // ACTUAL rendered box are compared, and visualViewport is also
      // watched (iOS Safari fires viewport changes there without always
      // firing a window `resize`).
      let lastW = vp.w;
      let lastH = vp.h;
      const handleResize = () => {
        syncViewportMetrics();
        if (vp.w === lastW && vp.h === lastH) return;
        lastW = vp.w;
        lastH = vp.h;
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);
      window.visualViewport?.addEventListener("resize", handleResize);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", applyInitialState);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        window.visualViewport?.removeEventListener("resize", handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="cts-section" style={{ height: SECTION_HEIGHT }}>
      <div ref={stickyRef} className="cts-sticky">
        <h1 ref={headlineRef} className="cts-headline">
          What we do
        </h1>

        {CARDS.map((card, i) => (
          <div
            key={card.num}
            ref={cardRefs[i]}
            className={`cts-card cts-card--${i + 1}`}
            style={{
              backgroundImage: `url(${CARD_IMAGES[i]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="cts-card__topleft">
              <span className="cts-card__num">{card.num}</span>
              <div ref={labelRefs[i]} className="cts-card__label">
                {/* Desktop label — UNCHANGED, still the big all-caps title.
                    Hidden on mobile via CSS (.cts-card__label-line). */}
                {card.label.split("\n").map((line, li) => (
                  <span key={li} className="cts-card__label-line">{line}</span>
                ))}
                {/* NEW: mobile-only premium title ("01 / Strategic Immersion").
                    Lives inside the same ref'd container as the desktop label
                    so it inherits the exact same GSAP fade-in/out timing —
                    no new animation code needed. Hidden on desktop via CSS. */}
                <span className="cts-card__mobile-title">{card.mobileTitle}</span>
              </div>
            </div>

            {/* Bottom typewriter paragraph — UNCHANGED on desktop.
                Hidden on mobile via CSS (display:none on .cts-card__title). */}
            <h2 ref={titleRefs[i]} className="cts-card__title">
              {card.bottom.split("\n").map((line, li) => (
                <span
                  key={li}
                  ref={lineRefs[i][li]}
                  className="cts-card__title-line"
                >
                  {line}
                </span>
              ))}
            </h2>
          </div>
        ))}

        {CARDS.map((card, i) => {
          const leftItems  = card.desc
            .map((s, si) => ({ s, si }))
            .filter(({ si }) => sideForIndex(si) === "left");
          const rightItems = card.desc
            .map((s, si) => ({ s, si }))
            .filter(({ si }) => sideForIndex(si) === "right");

          return (
            <div key={`desc-${card.num}`} className="cts-desc-group">
              <div ref={descLeftRefs[i]} className="cts-desc cts-desc--left">
                <div className="cts-desc__sections">
                  {leftItems.map(({ s, si }) => (
                    <div
                      key={si}
                      ref={setDescSectionRef(i, si)}
                      className="cts-desc__section cts-desc__section--left"
                    >
                      <h3 className="cts-desc__heading">{s.heading}</h3>
                      <p className="cts-desc__body">{s.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div ref={descRightRefs[i]} className="cts-desc cts-desc--right">
                <div className="cts-desc__sections">
                  {rightItems.map(({ s, si }) => (
                    <div
                      key={si}
                      ref={setDescSectionRef(i, si)}
                      className="cts-desc__section cts-desc__section--right"
                    >
                      <h3 className="cts-desc__heading">{s.heading}</h3>
                      <p className="cts-desc__body">{s.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
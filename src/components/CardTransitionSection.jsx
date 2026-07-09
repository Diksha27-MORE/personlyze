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

// ── Layout constants (responsive) — UNCHANGED ───────────────────────────────
const isMobile = () => window.innerWidth <= 640;

const HERO_W  = () => isMobile() ? Math.round(window.innerWidth * 0.72) : 780;
const HERO_H  = () => isMobile() ? Math.round(HERO_W() * (720 / 780))   : 830;
const HERO_BR = () => isMobile() ? 22 : 20;

const SMALL_W  = () => isMobile() ? 96 : 158;
const SMALL_H  = () => Math.round(SMALL_W() / (780 / 830));
const SMALL_BR = () => isMobile() ? 14 : 20;

const THUMB_W  = () => isMobile() ? 46 : 58;
const THUMB_H  = () => Math.round(THUMB_W() / (780 / 830));
const THUMB_BR = () => isMobile() ? 10 : 12;

const heroX = () => Math.round((window.innerWidth - HERO_W()) / 2)
const heroY = () => isMobile()
  ? Math.round(window.innerHeight * 0.08)
  : Math.round((window.innerHeight - HERO_H()) / 2);

const thumbX = () => Math.round((window.innerWidth - THUMB_W()) / 2);
const thumbY = () => Math.round(window.innerHeight * (isMobile() ? 0.82 : 0.72));

const TL_X = () => isMobile() ? 16 : heroX() - 200;
const TL_Y = () => isMobile() ? 16 : 40;

const DESC_GAP = 60;

const MOBILE_DESC_GAP = () =>
  Math.max(72, Math.round(window.innerHeight * 0.09));

const MOBILE_DESC_W = () =>
  Math.min(Math.round(window.innerWidth * 0.86), 360);

const DESC_W_DESKTOP = 320;

const DESC_X_LEFT = () => {
  if (isMobile()) {
    return Math.round((window.innerWidth - MOBILE_DESC_W()) / 2);
  }
  return heroX() - (DESC_W_DESKTOP + DESC_GAP);
};

const DESC_X_RIGHT = () => {
  if (isMobile()) {
    return Math.round((window.innerWidth - MOBILE_DESC_W()) / 2);
  }
  return heroX() + HERO_W() + DESC_GAP;
};
const DESC_Y = () => isMobile()
  ? heroY() + HERO_H() + MOBILE_DESC_GAP()
  : heroY() + Math.round(HERO_H() * 0.30);

const BR_X = () => isMobile()
  ? window.innerWidth - SMALL_W() - 16
  : heroX() + HERO_W() + DESC_GAP + 35;
const BR_Y = () => isMobile()
  ? window.innerHeight - SMALL_H() - 24
  : DESC_Y() + 450;

const previewOpacity = () => (isMobile() ? 0 : 1);

// ── Timeline pacing constants — tune these to change the scroll feel ──────
// These are the knobs. Everything else below is computed from them, so
// there are no more "magic number" labels to get out of sync.
const HOLD0_DUR            = 1.5;  // initial hold before headline exits
const HEADLINE_EXIT_DUR    = 0.8;
const CARD_GROW_DUR        = 1.5;  // thumbnail/preview -> hero
const LABEL_IN_DELAY       = 0.9;  // when the in-card label/title fade in, relative to grow start
const LABEL_IN_DUR         = 0.6;
const LABEL_OUT_DUR        = 0.3;
const TYPE_START_DELAY     = 1.5;  // gap after grow starts before the typewriter begins
const TYPE_DURS            = [1.2, 1.4, 1.4]; // UNCHANGED — typing speed per card
const POST_TYPE_PAUSE      = 0.3;  // beat after typing finishes, before side panel appears
const DESC_FADE_IN_DUR     = 0.5;
const DESC_FADE_OUT_DUR    = 0.4;
const SECTION_IN_DUR       = 0.6;
const SECTION_OUT_DUR      = 0.5;
const SECTION_HOLD_DUR     = 1.8;  // ← THE FIX: dedicated scroll-time per side-section
const HOLD_AFTER_SECTIONS  = 0.6;  // beat after the last section before the next transition
const NEXT_PREVIEW_DELAY   = 0.6;  // when the upcoming card's small preview appears
const NEXT_PREVIEW_DUR     = 0.65;
const TL_SHRINK_DUR        = 1.5;  // hero -> top-left "history" thumbnail
const GRANDPARENT_FADE_DUR = 0.4;  // the older TL thumbnail fading away completely
const FINAL_HOLD_DUR       = 1.0;
const FINAL_PAUSE_DUR      = 1.2;

// Section height scales with the total timeline length above. If you change
// SECTION_HOLD_DUR a lot, bump this proportionally (it was tuned for ~1.8s/section).
const SECTION_HEIGHT = "900vh";

const CARDS = [
  {
    num: "01",
    label: "STRATEGY",
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
    label: "CREATIVE",
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
            const fromX = sideForIndex(si) === "left" ? -30 : 30;
            gsap.set(el, { opacity: 0, x: fromX, y: 0 });
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

      // Reveal side-sections ONE AT A TIME. Each section gets `perSectionDur`
      // of dedicated scroll-scrubbed timeline — not a shared leftover window.
      // Section 1 shows and holds → fades out as Section 2 fades in → holds →
      // fades out as Section 3 fades in → holds until the next transition.
      const cycleSubSections = (cardIdx, startTime, perSectionDur) => {
        const sections = descSectionRefs.current[cardIdx]
          .map((el, si) => ({ el, si }))
          .filter((x) => x.el);
        if (sections.length === 0) return 0;

        sections.forEach(({ el, si }, i) => {
          const slotStart = startTime + i * perSectionDur;
          tl.to(el, { opacity: 1, x: 0, ease: E_OUT, duration: SECTION_IN_DUR }, slotStart);

          if (i < sections.length - 1) {
            const outX = sideForIndex(si) === "left" ? -20 : 20;
            const outAt = slotStart + perSectionDur - SECTION_OUT_DUR;
            tl.to(el, { opacity: 0, x: outX, ease: E_IN, duration: SECTION_OUT_DUR }, outAt);
          }
        });

        return sections.length * perSectionDur;
      };

      const descPair = (i) => [descLeftRefs[i].current, descRightRefs[i].current].filter(Boolean);

      // ── Build the timeline card-by-card ─────────────────────────────────
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
          // Previous hero shrinks into the top-left "history" thumbnail
          tl.to(cardRefs[i - 1].current, {
            x: () => TL_X(), y: () => TL_Y(),
            width: () => SMALL_W(), height: () => SMALL_H(),
            borderRadius: () => SMALL_BR(),
            opacity: () => previewOpacity(),
            ease: E_INOUT, duration: TL_SHRINK_DUR,
          }, growAt);

          // The card before THAT (if any) fades away entirely
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

        // Current card grows to hero size/position
        tl.to(cardRefs[i].current, {
          x: () => heroX(), y: () => heroY(),
          width: () => HERO_W(), height: () => HERO_H(),
          borderRadius: () => HERO_BR(),
          opacity: 1, zIndex: 10,
          ease: E_INOUT, duration: CARD_GROW_DUR,
        }, growAt);

        // In-card label + bottom title reveal
        tl.to(labelRefs[i].current, { opacity: 1, ease: E_OUT, duration: LABEL_IN_DUR }, growAt + LABEL_IN_DELAY);
        tl.to(titleRefs[i].current, { opacity: 1, ease: E_OUT, duration: LABEL_IN_DUR }, growAt + LABEL_IN_DELAY);

        // Typewriter — duration UNCHANGED
        const typeStart = growAt + TYPE_START_DELAY;
        const typeDur = TYPE_DURS[i];
        typeText(i, typeStart, typeDur);

        // Only once typing is fully done does the side-panel sequence begin
        const sectionsStart = typeStart + typeDur + POST_TYPE_PAUSE;
        tl.to(descPair(i), { opacity: 1, ease: E_OUT, duration: DESC_FADE_IN_DUR }, sectionsStart);
        const sectionsDuration = cycleSubSections(i, sectionsStart, SECTION_HOLD_DUR);

        // Upcoming card's small preview appears partway through this hold
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
          // Last card: hold on Section 3, then fade its panel and settle
          tl.to({}, { duration: FINAL_HOLD_DUR }, holdEnd);
          tl.to(descPair(i), { opacity: 0, ease: E_IN, duration: DESC_FADE_OUT_DUR }, holdEnd + FINAL_HOLD_DUR);
          tl.to({}, { duration: FINAL_PAUSE_DUR }, holdEnd + FINAL_HOLD_DUR);
          t = holdEnd + FINAL_HOLD_DUR + FINAL_PAUSE_DUR;
        } else {
          t = holdEnd;
        }
      });

      ScrollTrigger.addEventListener("refreshInit", applyInitialState);

      let lastWidth = window.innerWidth;
      const handleResize = () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", applyInitialState);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
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
                {card.label.split("\n").map((line, li) => (
                  <span key={li} className="cts-card__label-line">{line}</span>
                ))}
              </div>
            </div>

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
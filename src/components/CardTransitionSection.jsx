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

const DESC_GAP = 60; // gap from card (change 80 to 60/100 as needed)

const MOBILE_DESC_GAP = () =>
  Math.max(72, Math.round(window.innerHeight * 0.09));

const MOBILE_DESC_W = () =>
  Math.min(Math.round(window.innerWidth * 0.86), 360);

const DESC_W_DESKTOP = 320;

// ── Left/right panel positions ───────────────────────────
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

const SECTION_HEIGHT = "450vh";

// EXACT line breaks per requirement
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

// Point 1 → LEFT, Point 2 → RIGHT, Point 3 → LEFT ...
const sideForIndex = (si) => (si % 2 === 0 ? "left" : "right");

export default function CardTransitionSection() {
  const sectionRef  = useRef(null);
  const stickyRef   = useRef(null);
  const headlineRef = useRef(null);

  const cardRefs  = [useRef(null), useRef(null), useRef(null)];
  const descLeftRefs  = [useRef(null), useRef(null), useRef(null)];
  const descRightRefs = [useRef(null), useRef(null), useRef(null)];
  const titleRefs = [useRef(null), useRef(null), useRef(null)]; // bottom description text
  const labelRefs = [useRef(null), useRef(null), useRef(null)]; // big in-card title

  // Flat per-card section refs keyed by ORIGINAL section index (0..n)
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

        // Section enter offset: left slides in from -x, right slides in from +x
        descSectionRefs.current.forEach((cardSections) => {
          cardSections.forEach((el, si) => {
            if (!el) return;
            const fromX = sideForIndex(si) === "left" ? -30 : 30;
            gsap.set(el, { opacity: 0, x: fromX, y: 0 });
          });
        });

        gsap.set(titleRefs.map((r) => r.current), { opacity: 0 });
        gsap.set(labelRefs.map((r) => r.current), { opacity: 0 });
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

      const cycleSubSections = (cardIdx, startLabel, windowDur) => {
        const sections = descSectionRefs.current[cardIdx]
          .map((el, si) => ({ el, si }))
          .filter((x) => x.el);
        if (sections.length === 0) return;

        const inDur   = 0.5;
        const outDur  = 0.4;
        const step = windowDur / sections.length;

        sections.forEach(({ el, si }, i) => {
          const inAt  = `${startLabel}+=${(i * step).toFixed(3)}`;
          tl.to(el, { opacity: 1, x: 0, ease: E_OUT, duration: inDur }, inAt);

          if (i < sections.length - 1) {
            const outAt = `${startLabel}+=${((i + 1) * step - 0.1).toFixed(3)}`;
            const outX  = sideForIndex(si) === "left" ? -20 : 20;
            tl.to(el, { opacity: 0, x: outX, ease: E_IN, duration: outDur }, outAt);
          }
        });
      };

      // Helper: both side panels for a card
      const descPair = (i) => [descLeftRefs[i].current, descRightRefs[i].current].filter(Boolean);

      // PHASE 0
      tl.addLabel("hold0", 0);
      tl.to({}, { duration: 1.5 });

      // PHASE 1: headline exits; card-01 grows
      tl.addLabel("growCard1", 1.5);

      tl.to(headlineRef.current, {
        y: "-120%", opacity: 0, ease: E_INOUT, duration: 0.8,
      }, "growCard1");

      tl.to(cardRefs[0].current, {
        x: () => heroX(), y: () => heroY(),
        width : () => HERO_W(), height: () => HERO_H(),
        borderRadius: () => HERO_BR(),
        opacity: 1,
        ease: E_INOUT, duration: 1.5,
      }, "growCard1");

      tl.to(labelRefs[0].current, { opacity: 1, ease: E_OUT, duration: 0.6 }, "growCard1+=0.9");
      tl.to(titleRefs[0].current, { opacity: 1, ease: E_OUT, duration: 0.6 }, "growCard1+=0.9");

      // PHASE 2: hero-01 hold + sub-section cycle
      tl.addLabel("heroHold1", 3.0);

      tl.to(descPair(0), { opacity: 1, ease: E_OUT, duration: 0.5 }, "heroHold1");

      tl.to(cardRefs[1].current, {
        x: () => BR_X(), y: () => BR_Y(),
        width: () => SMALL_W(), height: () => SMALL_H(),
        borderRadius: () => SMALL_BR(),
        opacity: () => previewOpacity(),
        ease: E_OUT, duration: 0.65,
      }, isMobile() ? "transition12" : "heroHold1+=0.25");

      cycleSubSections(0, "heroHold1", 3.4);

      // PHASE 3: 01 → 02
      tl.addLabel("transition12", 6.6);

      tl.to(cardRefs[0].current, {
        x: () => TL_X(), y: () => TL_Y(),
        width: () => SMALL_W(), height: () => SMALL_H(),
        borderRadius: () => SMALL_BR(),
        opacity: () => previewOpacity(),
        ease: E_INOUT, duration: 1.5,
      }, "transition12");

      tl.to(cardRefs[1].current, {
        x: () => heroX(), y: () => heroY(),
        width: () => HERO_W(), height: () => HERO_H(),
        borderRadius: () => HERO_BR(),
        opacity: 1,
        zIndex: 10, ease: E_INOUT, duration: 1.5,
      }, "transition12");

      tl.to(descPair(0), { opacity: 0, ease: E_IN, duration: 0.4 }, "transition12");

      tl.to(labelRefs[0].current, { opacity: 0, ease: E_IN, duration: 0.3 }, "transition12");
      tl.to(titleRefs[0].current, { opacity: 0, ease: E_IN, duration: 0.3 }, "transition12");
      tl.to(labelRefs[1].current, { opacity: 1, ease: E_OUT, duration: 0.6 }, "transition12+=0.9");
      tl.to(titleRefs[1].current, { opacity: 1, ease: E_OUT, duration: 0.6 }, "transition12+=0.9");

      tl.to(descPair(1), { opacity: 1, ease: E_OUT, duration: 0.5 }, "transition12+=0.55");

      tl.to(cardRefs[2].current, {
        x: () => BR_X(), y: () => BR_Y(),
        width: () => SMALL_W(), height: () => SMALL_H(),
        borderRadius: () => SMALL_BR(),
        opacity: () => previewOpacity(),
        ease: E_OUT, duration: 0.65,
      }, isMobile() ? "transition23" : "transition12+=0.85");

      // PHASE 4: hero-02 hold
      tl.addLabel("heroHold2", 8.1);
      tl.to({}, { duration: 1.5 }, "heroHold2");

      cycleSubSections(1, "heroHold2", 2.4);

      // PHASE 5: 02 → 03
      tl.addLabel("transition23", 10.5);

      tl.to(cardRefs[0].current, {
        x: () => TL_X() - 24, opacity: 0, ease: E_IN, duration: 0.4,
      }, "transition23");

      tl.to(cardRefs[1].current, {
        x: () => TL_X(), y: () => TL_Y(),
        width: () => SMALL_W(), height: () => SMALL_H(),
        borderRadius: () => SMALL_BR(),
        opacity: () => previewOpacity(),
        zIndex: 6, ease: E_INOUT, duration: 1.5,
      }, "transition23");

      tl.to(cardRefs[2].current, {
        x: () => heroX(), y: () => heroY(),
        width : () => HERO_W(), height: () => HERO_H(),
        borderRadius: () => HERO_BR(),
        opacity: 1,
        zIndex: 10, ease: E_INOUT, duration: 1.5,
      }, "transition23");

      tl.to(descPair(1), { opacity: 0, ease: E_IN, duration: 0.4 }, "transition23");

      tl.to(labelRefs[1].current, { opacity: 0, ease: E_IN, duration: 0.3 }, "transition23");
      tl.to(titleRefs[1].current, { opacity: 0, ease: E_IN, duration: 0.3 }, "transition23");
      tl.to(labelRefs[2].current, { opacity: 1, ease: E_OUT, duration: 0.6 }, "transition23+=0.9");
      tl.to(titleRefs[2].current, { opacity: 1, ease: E_OUT, duration: 0.6 }, "transition23+=0.9");

      tl.to(descPair(2), { opacity: 1, ease: E_OUT, duration: 0.5 }, "transition23+=0.55");

      // PHASE 6: hero-03 hold
      tl.addLabel("heroHold3", 12.0);
      tl.to({}, { duration: 1.0 }, "heroHold3");

      cycleSubSections(2, "heroHold3", 3.4);

      tl.to(descPair(2), { opacity: 0, ease: E_IN, duration: 0.5 }, "heroHold3+=3.5");

      tl.to({}, { duration: 1.2 }, "heroHold3+=3.4");

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
            {/* Top-left stack: number, then label directly below */}
            <div className="cts-card__topleft">
              <span className="cts-card__num">{card.num}</span>
              <div ref={labelRefs[i]} className="cts-card__label">
                {card.label.split("\n").map((line, li) => (
                  <span key={li} className="cts-card__label-line">{line}</span>
                ))}
              </div>
            </div>

            {/* Bottom description text */}
            <h2 ref={titleRefs[i]} className="cts-card__title">
              {card.bottom.split("\n").map((line, li) => (
                <span key={li} className="cts-card__title-line">{line}</span>
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

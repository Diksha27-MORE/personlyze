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

// ── Layout constants (responsive) ───────────────────────────────────────────
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

const heroX = () => Math.round((window.innerWidth - HERO_W()) / 2) + (isMobile() ? 0 : 40);
const heroY = () => isMobile()
  ? Math.round(window.innerHeight * 0.08)
  : Math.round((window.innerHeight - HERO_H()) / 2);

const thumbX = () => Math.round((window.innerWidth - THUMB_W()) / 2);
const thumbY = () => Math.round(window.innerHeight * (isMobile() ? 0.82 : 0.72));

const TL_X = () => isMobile() ? 16 : heroX() - 200;
const TL_Y = () => isMobile() ? 16 : 40;

const DESC_GAP = 18;
const MOBILE_DESC_GAP = () => Math.max(72, Math.round(window.innerHeight * 0.09));

// MOBILE FIX #1: center the description block horizontally beneath the hero
const MOBILE_DESC_W = () => Math.min(Math.round(window.innerWidth * 0.86), 360);

const DESC_X = () => isMobile()
  ? Math.round((window.innerWidth - MOBILE_DESC_W()) / 2)
  : heroX() + HERO_W() + DESC_GAP;
const DESC_Y = () => isMobile()
  ? heroY() + HERO_H() + MOBILE_DESC_GAP()
  : heroY() + Math.round(HERO_H() * 0.30);

const BR_X = () => isMobile()
  ? window.innerWidth - SMALL_W() - 16
  : DESC_X() + 35;
const BR_Y = () => isMobile()
  ? window.innerHeight - SMALL_H() - 24
  : DESC_Y() + 450;

// MOBILE FIX #3: hide non-active preview cards on mobile
const previewOpacity = () => (isMobile() ? 0 : 1);

const SECTION_HEIGHT = "300vh";

const CARDS = [
  {
    num: "01",
    title: [
      "Because everything in business must begin with strategy.\nAnd everything in strategy must begin with the consumer."
    ],
    desc: [
      { heading: "Build Consumer Personas", body: "Bringing the customer alive through rich customer profiles that go beyond demographics—capturing motivations, behaviours, anxieties and aspirations." },
      { heading: "Craft Consumer Decision Journeys", body: "Mapping every touchpoint, trigger and barrier from discovery to purchase, so you know exactly what to say, when to say it and where it matters most." },
      { heading: "Identify High-Impact Personalization Opportunities", body: "Finding the moments where personalization creates the biggest impact on conversion, loyalty and advocacy, helping prioritize creative, budget and technology investments." },
    ],
    cta: "Discover the Experience",
  },
  {
    num: "02",
    title: ["Strategy tells us what to say.\nCreative tells us how to say it."],
    desc: [
      { heading: "Create Content Frameworks", body: "Design the narrative, script, tone of voice, visual language and storytelling structure that makes every personalized video feel authentic and memorable." },
      { heading: "Produce Video Assets", body: "End-to-end production—from planning and filming to editing—creating premium video assets that are both brand-ready and AI-ready for personalization." },
    ],
    cta: "Discover the Experience",
  },
  {
    num: "03",
    title: ["The personalization in Personlyze AI.\nMillions of conversations. One intelligent system."],
    desc: [
      { heading: "Create Hyper-Personalized Videos", body: "Using customer data, our AI creates a unique video for every individual while keeping your brand story consistent across every interaction." },
      { heading: "Deploy to Marketing Channels", body: "Automatically deliver personalized videos across your existing marketing platforms, ensuring every customer receives the right message at the right moment." },
      { heading: "Measure, Review & Calibrate", body: "Continuously monitor performance, optimize campaigns and improve results in real time, making every future interaction smarter than the last." },
    ],
    cta: "Discover the Experience",
  },
];

export default function CardTransitionSection() {
  const sectionRef  = useRef(null);
  const stickyRef   = useRef(null);
  const headlineRef = useRef(null);

  const cardRefs  = [useRef(null), useRef(null), useRef(null)];
  const descRefs  = [useRef(null), useRef(null), useRef(null)];
  const titleRefs = [useRef(null), useRef(null), useRef(null)];

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
          opacity: isMobile() ? 0 : 1, // hidden on mobile until it becomes hero
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

        descRefs.forEach((r) => {
          gsap.set(r.current, { x: DESC_X(), y: DESC_Y(), opacity: 0 });
        });

        gsap.set(titleRefs.map((r) => r.current), { opacity: 0 });
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

      // ── PHASE 0 ──
      tl.addLabel("hold0", 0);
      tl.to({}, { duration: 1.5 });

      // ── PHASE 1: headline exits; card-01 grows to hero ──
      tl.addLabel("growCard1", 1.5);

      tl.to(headlineRef.current, {
        y: "-120%", opacity: 0, ease: E_INOUT, duration: 0.8,
      }, "growCard1");

      tl.to(cardRefs[0].current, {
        x: () => heroX(), y: () => heroY(),
        width : () => HERO_W(), height: () => HERO_H(),
        borderRadius: () => HERO_BR(),
        opacity: 1, // ensure visible on mobile once it becomes hero
        ease: E_INOUT, duration: 1.5,
      }, "growCard1");

      tl.to(titleRefs[0].current, {
        opacity: 1, ease: E_OUT, duration: 0.6,
      }, "growCard1+=0.9");

      // ── PHASE 2: hero-01 hold ──
      tl.addLabel("heroHold1", 3.0);

      tl.to(descRefs[0].current, {
        x: () => DESC_X(), y: () => DESC_Y(),
        opacity: 1, ease: E_OUT, duration: 0.5,
      }, "heroHold1");

      // MOBILE FIX #3: opacity respects previewOpacity() → hidden on mobile
      tl.to(cardRefs[1].current, {
        x: () => BR_X(), y: () => BR_Y(),
        width: () => SMALL_W(), height: () => SMALL_H(),
        borderRadius: () => SMALL_BR(),
        opacity: () => previewOpacity(),
        ease: E_OUT, duration: 0.65,
      }, isMobile() ? "transition12" : "heroHold1+=0.25");

      tl.to({}, { duration: 0.6 }, "heroHold1+=0.9");

      // ── PHASE 3: 01 → 02 transition ──
      tl.addLabel("transition12", 4.5);

      tl.to(cardRefs[0].current, {
        x: () => TL_X(), y: () => TL_Y(),
        width: () => SMALL_W(), height: () => SMALL_H(),
        borderRadius: () => SMALL_BR(),
        opacity: () => previewOpacity(), // hide shrunken card on mobile
        ease: E_INOUT, duration: 1.5,
      }, "transition12");

      tl.to(cardRefs[1].current, {
        x: () => heroX(), y: () => heroY(),
        width: () => HERO_W(), height: () => HERO_H(),
        borderRadius: () => HERO_BR(),
        opacity: 1, // hero always fully visible
        zIndex: 10, ease: E_INOUT, duration: 1.5,
      }, "transition12");

      tl.to(descRefs[0].current, { opacity: 0, ease: E_IN, duration: 0.4 }, "transition12");

      tl.to(titleRefs[0].current, { opacity: 0, ease: E_IN, duration: 0.3 }, "transition12");
      tl.to(titleRefs[1].current, { opacity: 1, ease: E_OUT, duration: 0.6 }, "transition12+=0.9");

      tl.to(descRefs[1].current, {
        x: () => DESC_X(), y: () => DESC_Y(),
        opacity: 1, ease: E_OUT, duration: 0.5,
      }, "transition12+=0.55");

      tl.to(cardRefs[2].current, {
        x: () => BR_X(), y: () => BR_Y(),
        width: () => SMALL_W(), height: () => SMALL_H(),
        borderRadius: () => SMALL_BR(),
        opacity: () => previewOpacity(),
        ease: E_OUT, duration: 0.65,
      }, isMobile() ? "transition23" : "transition12+=0.85");

      // ── PHASE 4: hero-02 hold ──
      tl.addLabel("heroHold2", 6.0);
      tl.to({}, { duration: 1.5 }, "heroHold2");

      // ── PHASE 5: 02 → 03 transition ──
      tl.addLabel("transition23", 7.5);

      tl.to(cardRefs[0].current, {
        x: () => TL_X() - 24, opacity: 0, ease: E_IN, duration: 0.4,
      }, "transition23");

      tl.to(cardRefs[1].current, {
        x: () => TL_X(), y: () => TL_Y(),
        width: () => SMALL_W(), height: () => SMALL_H(),
        borderRadius: () => SMALL_BR(),
        opacity: () => previewOpacity(), // hide on mobile once it stops being hero
        zIndex: 6, ease: E_INOUT, duration: 1.5,
      }, "transition23");

      tl.to(cardRefs[2].current, {
        x: () => heroX(), y: () => heroY(),
        width : () => HERO_W(), height: () => HERO_H(),
        borderRadius: () => HERO_BR(),
        opacity: 1,
        zIndex: 10, ease: E_INOUT, duration: 1.5,
      }, "transition23");

      tl.to(descRefs[1].current, { opacity: 0, ease: E_IN, duration: 0.4 }, "transition23");

      tl.to(titleRefs[1].current, { opacity: 0, ease: E_IN, duration: 0.3 }, "transition23");
      tl.to(titleRefs[2].current, { opacity: 1, ease: E_OUT, duration: 0.6 }, "transition23+=0.9");

      tl.to(descRefs[2].current, {
        x: () => DESC_X(), y: () => DESC_Y(),
        opacity: 1, ease: E_OUT, duration: 0.5,
      }, "transition23+=0.55");

      // ── PHASE 6: hero-03 hold ──
      tl.addLabel("heroHold3", 9.0);
      tl.to({}, { duration: 1.0 }, "heroHold3");

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
        <span className="cts-ambient cts-ambient--tl">Experience Highlights</span>
        <span className="cts-ambient cts-ambient--br">Skip town, let&apos;s fly</span>

        <h1 ref={headlineRef} className="cts-headline">
          What we do<br />
        </h1>

        {CARDS.map((card, i) => (
          <div
            key={card.num}
            ref={cardRefs[i]}
            className={`cts-card cts-card--${i + 1}`}
            style={{
              backgroundImage: `url(${CARD_IMAGES[i]})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <span className="cts-card__num">{card.num}</span>
            <h2 ref={titleRefs[i]} className="cts-card__title">
              {card.title.map((line, li) => (
                <span key={li} className="cts-card__title-line">{line}</span>
              ))}
            </h2>
          </div>
        ))}

        {CARDS.map((card, i) => (
          <div key={`desc-${card.num}`} ref={descRefs[i]} className="cts-desc">
            <div className="cts-desc__sections">
              {card.desc.map((section, si) => (
                <div key={si} className="cts-desc__section">
                  <h3 className="cts-desc__heading">{section.heading}</h3>
                  <p className="cts-desc__body">{section.body}</p>
                </div>
              ))}
            </div>
            <a className="cts-desc__cta" href="#">{card.cta}</a>
          </div>
        ))}
      </div>
    </section>
  );
}

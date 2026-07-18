import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./MobileCardTransitionSection.css";

import strategicImg from "../assets/Strategic.png";
import creativeImg from "../assets/Creative.png";
import aiImg from "../assets/AI.png";

const CARD_IMAGES = [strategicImg, creativeImg, aiImg];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CARDS = [
  {
    num: "01",
    title: "STRATEGY",
    desc: [
      {
        heading: "Build Consumer Personas",
        body: "Bringing the customer alive through rich profiles that go beyond demographics by capturing motivations, behaviours, anxieties and aspirations.",
      },
      {
        heading: "Craft Consumer Decision Journeys",
        body: "Mapping every touchpoint, trigger and barrier from discovery to purchase so that you know exactly what to say, when to say it and where it matters the most.",
      },
      {
        heading: "Identify High-Impact Personalization Opportunities",
        body: "Finding the moments where personalization creates the biggest impact on conversion, loyalty and advocacy and helps in prioritizing creative, budget and technology investments.",
      },
    ],
  },

  {
    num: "02",
    title: "DESIGN",
    desc: [
      {
        heading: "Create Content Frameworks",
        body: "Design the narrative, script, tone of voice, visual language and storytelling structure that makes every personalized video feel authentic and memorable.",
      },
      {
        heading: "Produce Video Assets",
        body: "End-to-end production from planning and filming to editing in order to create premium video assets that are both brand-ready and AI-ready for personalization.",
      },
    ],
  },

  {
    num: "03",
    title: "ARTIFICIAL\nINTELLIGENCE",
    desc: [
      {
        heading: "Create Hyper-Personalized Videos",
        body: "Using customer data, our AI creates a unique video for every individual while keeping your brand story consistent across every interaction.",
      },
      {
        heading: "Deploy to Marketing Channels",
        body: "Automatically deliver personalized videos across your existing marketing platforms, ensuring every customer receives the right message at the right moment.",
      },
      {
        heading: "Measure, Review & Calibrate",
        body: "Continuously monitor performance, optimize campaigns and improve results in real time - making every future interaction smarter than the last.",
      },
    ],
  },
];

// Compact scroll length. The heading sits at the top of the section from
// frame zero (no fullscreen intro state) and exits after only a tiny sliver
// of scroll — just enough (~10-20px) to read as a deliberate transition
// rather than a jump cut. Roughly: near-instant heading exit, then per card
// ~ (1 hero-in + N * section + out)
const perCardScroll = (c) => 0.45 + c.desc.length * 0.35 + 0.2;// in "screens"
// Kept tiny on purpose: this fraction of the total scroll track is what the
// user has to scroll before the first card is fully in. At ~0.02 "screens"
// (≈2% of one viewport height), that's roughly 15px on an 800px-tall
// viewport — a quick, smooth nudge, not a dedicated intro screen.
const HEADLINE_EXIT_SCREENS = 0.01;
// Small bottom preview shown for the first card before any scrolling
// happens — a rounded square peeking up from the bottom, image only, no
// text. These are the only new visual values introduced; everything else
// (typography, spacing, other cards) is untouched.
const PREVIEW_SIZE = 96; // px, square
const PREVIEW_BOTTOM = 160; // px from the bottom edge — raised closer to the heading
const PREVIEW_RADIUS = 20; // px corner rounding
const totalScreens =
  HEADLINE_EXIT_SCREENS + CARDS.reduce((a, c) => a + perCardScroll(c), 0);
const SECTION_HEIGHT = `${Math.round(totalScreens * 100)}vh`;

export default function MobileCardTransitionSection() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const headlineRef = useRef(null);

  // Proper ref-array patterns instead of calling useRef() inside map()/loops.
  const cardRefs = useRef([]);
  const descWrapRefs = useRef([]);
  const descSectionRefs = useRef([]);

  cardRefs.current = [];
  descWrapRefs.current = [];
  if (descSectionRefs.current.length !== CARDS.length) {
    descSectionRefs.current = CARDS.map(() => []);
  }

  const setCardRef = (i) => (el) => {
    cardRefs.current[i] = el;
  };
  const setDescWrapRef = (i) => (el) => {
    descWrapRefs.current[i] = el;
  };
  const setDescSectionRef = (ci, si) => (el) => {
    if (!descSectionRefs.current[ci]) descSectionRefs.current[ci] = [];
    descSectionRefs.current[ci][si] = el;
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const E_OUT = "power2.out";
    const E_IN = "power2.in";
    const E_INOUT = "power2.inOut";

    const ctx = gsap.context(() => {
      const applyInitial = () => {
        gsap.set(headlineRef.current, { opacity: 1, y: 0 });

        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i === 0) {
            // First card starts as a small rounded-square preview of just
            // the background image, sitting near the bottom of the screen
            // — no text/number visible yet. top stays 'auto' throughout so
            // it never fights with the explicit bottom/height values.
            gsap.set(el, {
              opacity: 1,
              top: "auto",
              right: "auto",
              left: "50%",
              xPercent: -50,
              bottom: PREVIEW_BOTTOM,
              width: PREVIEW_SIZE,
              height: PREVIEW_SIZE,
              borderRadius: PREVIEW_RADIUS,
              zIndex: 10 + i,
            });
            const topEl = el.querySelector(".mcts-card__top");
            if (topEl) gsap.set(topEl, { opacity: 0 });
          } else {
            gsap.set(el, {
              opacity: 0,
              y: 40,
              zIndex: 10 + i,
            });
          }
        });

        descWrapRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 0 });
        });

        descSectionRefs.current.forEach((secs) => {
          (secs || []).forEach((el) => {
            if (el) gsap.set(el, { opacity: 0, y: 16 });
          });
        });
      };

      applyInitial();

      const tl = gsap.timeline({
        defaults: { ease: E_OUT },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.25,
          pin: stickyRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      let t = 0;

      // Heading is already in place (top-left, on the white section background)
      // from the very start of the section — it just drifts up and fades out
      // as the first card enters, with no separate fullscreen intro state.
      // This is a very short exit: the first card is essentially fully
      // resolved within the first ~15-20px of scroll.
      tl.to(
        headlineRef.current,
        { opacity: 0, y: -60, duration: HEADLINE_EXIT_SCREENS, ease: E_INOUT },
        t
      );
      t += HEADLINE_EXIT_SCREENS;

      CARDS.forEach((card, i) => {
        const cardEl = cardRefs.current[i];
        const descWrap = descWrapRefs.current[i];
        const sections = descSectionRefs.current[i] || [];

        // The first card starts already visible as a small preview (set in
        // applyInitial above), so there's nothing to fade in from blank —
        // it just needs to scale up to fullscreen within the first ~20-30px
        // of scroll. Later cards keep their original fade-in pace
        // (unchanged).
        const heroInDuration = i === 0 ? 0.06 : 0.55;
        const descInDelay = i === 0 ? 0.02 : 0.2;

        // Hero card in
        if (cardEl) {
          if (i === 0) {
            // Expand the small square preview into the fullscreen card.
            tl.to(
              cardEl,
              {
                left: 0,
                xPercent: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                borderRadius: 0,
                duration: heroInDuration,
                ease: E_OUT,
              },
              t
            );
            // Reveal the number/title only once the card is basically
            // fullscreen — showing it at thumbnail size would be
            // unreadable, and the reference image shows the preview as
            // image-only with no text.
            const topEl = cardEl.querySelector(".mcts-card__top");
            if (topEl) {
              tl.to(
                topEl,
                { opacity: 1, duration: 0.2, ease: E_OUT },
                t + heroInDuration * 0.6
              );
            }
          } else {
            tl.to(
              cardEl,
              { opacity: 1, y: 0, duration: heroInDuration, ease: E_OUT },
              t
            );
          }
        }
        if (descWrap) {
          tl.to(descWrap, { opacity: 1, duration: 0.4 }, t + descInDelay);
        }

        // For card 0 this now tracks the actual (short) entrance duration
        // instead of a fixed 0.6 — that fixed offset was the source of the
        // dead scroll: the card would finish popping in almost instantly,
        // then the timeline would idle until the old 0.6 mark before the
        // description text was allowed to start. Other cards are untouched.
        const heroInEnd = i === 0 ? t + heroInDuration + 0.03 : t + 0.6;

        // Cycle description sections (crossfade in place)
        const perSec = 0.8;
        sections.forEach((el, si) => {
          if (!el) return;
          const slot = heroInEnd + si * perSec;
          tl.to(el, { opacity: 1, y: 0, duration: 0.35, ease: E_OUT }, slot);
          if (si < sections.length - 1) {
            tl.to(
              el,
              { opacity: 0, y: -12, duration: 0.3, ease: E_IN },
              slot + perSec - 0.3
            );
          }
        });

        const sectionsEnd = heroInEnd + sections.length * perSec;

        // Fade out current card unless it's the last
        if (i < CARDS.length - 1) {
          if (cardEl && descWrap) {
            tl.to(
              [cardEl, descWrap],
              { opacity: 0, duration: 0.4, ease: E_IN },
              sectionsEnd
            );
          }
          if (cardEl) {
            tl.to(cardEl, { y: -30, duration: 0.4, ease: E_IN }, sectionsEnd);
          }
          t = sectionsEnd + 0.35;
        } else {
          tl.to({}, { duration: 0.5 }, sectionsEnd);
          t = sectionsEnd + 0.5;
        }
      });

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);
      window.visualViewport?.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        window.visualViewport?.removeEventListener("resize", handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Keep the viewport height in sync with mobile browser chrome
  // (address bar show/hide on iOS/Android) via a CSS custom property.
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--mcts-vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mcts-section"
      style={{ height: SECTION_HEIGHT }}
    >
      <div ref={stickyRef} className="mcts-sticky">
        <h1 ref={headlineRef} className="mcts-headline">
          What we do
        </h1>

        {CARDS.map((card, i) => (
          <div
            key={card.num}
            ref={setCardRef(i)}
            className={`mcts-card mcts-card--${i + 1}`}
            style={{
              backgroundImage: `url(${CARD_IMAGES[i]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="mcts-card__top">
              <span className="mcts-card__num">{card.num}</span>
              <h2 className="mcts-card__title">
                {card.title.split("\n").map((l, li) => (
                  <span key={li} className="mcts-card__title-line">
                    {l}
                  </span>
                ))}
              </h2>
            </div>

            <div ref={setDescWrapRef(i)} className="mcts-desc">
              <div className="mcts-desc__stack">
                {card.desc.map((s, si) => (
                  <div
                    key={si}
                    ref={setDescSectionRef(i, si)}
                    className="mcts-desc__section"
                  >
                    <h3 className="mcts-desc__heading">{s.heading}</h3>
                    <p className="mcts-desc__body">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
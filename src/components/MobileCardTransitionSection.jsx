import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
        body: "Bringing the customer alive through rich customer profiles that go beyond demographics—capturing motivations, behaviours, anxieties and aspirations.",
      },
      {
        heading: "Craft Consumer Decision Journeys",
        body: "Mapping every touchpoint, trigger and barrier from discovery to purchase, so you know exactly what to say, when to say it and where it matters most.",
      },
      {
        heading: "Identify High-Impact Personalization Opportunities",
        body: "Finding the moments where personalization creates the biggest impact on conversion, loyalty and advocacy, helping prioritize creative, budget and technology investments.",
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
        body: "End-to-end production—from planning and filming to editing—creating premium video assets that are both brand-ready and AI-ready for personalization.",
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
        body: "Continuously monitor performance, optimize campaigns and improve results in real time, making every future interaction smarter than the last.",
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
          gsap.set(el, {
            opacity: 0,
            y: 40,
            zIndex: 10 + i,
          });
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

        // Hero card in
        if (cardEl) {
          tl.to(cardEl, { opacity: 1, y: 0, duration: 0.55, ease: E_OUT }, t);
        }
        if (descWrap) {
          tl.to(descWrap, { opacity: 1, duration: 0.4 }, t + 0.2);
        }

        const heroInEnd = t + 0.6;

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
      <style>{`
        .mcts-section {
          position: relative;
          width: 100%;
          background: #EDEAE2;
        }

        .mcts-sticky {
          position: relative;
          width: 100%;
          height: 100vh;
          height: calc(var(--mcts-vh, 1vh) * 100);
          height: 100dvh;
          overflow: hidden;
          background: #EDEAE2;
        }

.mcts-headline {
  position: absolute;
  top: 22px;
  left: 0;
  right: 0;

  width: 100%;
  margin: 0;

  text-align: center;

  font-family: "Avenir Black";
  font-weight: 900;

  font-size:clamp(45px,7vw,10px)!important;
  line-height: 0.95;
  letter-spacing: -0.035em;

  color: #111;

  z-index: 100;
}

        .mcts-card {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: env(safe-area-inset-top, 1.5rem) 1.25rem
            env(safe-area-inset-bottom, 1.5rem) 1.25rem;
          box-sizing: border-box;
          color: #fff;
        }

        .mcts-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.15) 0%,
            rgba(0, 0, 0, 0.35) 55%,
            rgba(0, 0, 0, 0.75) 100%
          );
          pointer-events: none;
          z-index: 0;
        }

        .mcts-card__top {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 2.5rem;
        }

.mcts-card__num {
  font-family: "Avenir Black";
  font-size: 28px;   /* yaha size increase karo */
  font-weight: 900;
  letter-spacing: 0.12em;
  opacity: 0.9;
}
        .mcts-card__title {
          margin: 0;
          font-size: clamp(2rem, 9vw, 3.25rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }

        .mcts-card__title-line {
          display: block;
        }

        .mcts-desc {
          position: relative;
          z-index: 1;
          width: 100%;
          padding-bottom: 1.5rem;
        }

        .mcts-desc__stack {
          position: relative;
          min-height: 8.5rem;
        }

        .mcts-desc__section {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .mcts-desc__heading {
          margin: 0 0 0.5rem 0;
          font-size: clamp(1.05rem, 4.5vw, 1.35rem);
          font-weight: 700;
        }

        .mcts-desc__body {
          margin: 0;
          font-size: clamp(0.9rem, 3.6vw, 1rem);
          line-height: 1.5;
          opacity: 0.92;
        }

        @supports not (height: 100dvh) {
          .mcts-sticky {
            height: calc(var(--mcts-vh, 1vh) * 100);
          }
        }
      `}</style>

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
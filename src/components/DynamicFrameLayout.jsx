import { useState, useEffect, useRef, useCallback } from "react";
import "./DynamicFrameLayout.css";
import { FaExpand, FaPlay, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate, useNavigationType } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import realEstateVideo from "../assets/real-estate.mp4";
import bfsiVideo from "../assets/bfsi.mp4";
import travelVideo from "../assets/travel.mp4";
import healthVideo from "../assets/health.mp4";
import retailVideo from "../assets/Retail.mp4";
import automotiveVideo from "../assets/automotive.mp4";
import b2bVideo from "../assets/b2b.mp4";
import techVideo from "../assets/tech.mp4";
import fashionVideo from "../assets/fashion.mp4";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  { name: "Real Estate",         video: realEstateVideo, className: "real-estate", slug: "real-estate" },
  { name: "BFSI",                video: bfsiVideo,       className: "bfsi",        slug: "bfsi"        },
  { name: "Travel & Hospitality",video: travelVideo,     className: "travel",      slug: "travel"      },
  { name: "Health & Wellness",   video: healthVideo,     className: "health",      slug: "health"      },
  { name: "Retail & D2C",        video: retailVideo,     className: "retail",      slug: "retail"      },
  { name: "Automotive",          video: automotiveVideo, className: "automotive",  slug: "automotive"  },
  { name: "B2B & SaaS",          video: b2bVideo,        className: "saas",        slug: "b2b"         },
  { name: "Tech & Startups",     video: techVideo,       className: "tech",        slug: "tech"        },
  { name: "Fashion & Lifestyle", video: fashionVideo,    className: "fashion",     slug: "fashion"     },
];

/* Max scale reached by the scroll-driven zoom (1 + 1 * 0.9). The reverse
   transition starts here so the back animation mirrors the forward one. */
const ZOOM_MAX_SCALE = 1.9;

/* Key used to hand off the selected card + scroll position across the route
   navigation so the grid can replay the reverse transition when we return. */
const RETURN_KEY = "dfl_return";

function getPos(index) {
  return { row: Math.floor(index / 3), col: index % 3 };
}

/* ── Letter-eraser hook ──────────────────────────────────────
   When active=true  → strips letters from the front one-by-one
   When active=false → instantly restores full text           */
function useLetterErase(fullText, active) {
  const [displayed, setDisplayed] = useState(fullText);
  const timerRef = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);

    if (active) {
      // Start erasing from the beginning, one letter every 40 ms
      let len = fullText.length;
      timerRef.current = setInterval(() => {
        len -= 1;
        if (len <= 0) {
          setDisplayed("");
          clearInterval(timerRef.current);
        } else {
          setDisplayed(fullText.slice(fullText.length - len));
        }
      }, 40);
    } else {
      setDisplayed(fullText);
    }

    return () => clearInterval(timerRef.current);
  }, [active, fullText]);

  return displayed;
}

/* Individual card so each can own its own eraser hook */
function IndustryCard({ industry, index, hovered, setHovered, onCardClick, cardRef }){
  const isHovered = hovered === index;
  const isDimmed  = hovered !== null && !isHovered;

  const displayedName = useLetterErase(industry.name, isHovered);

  return (
    <div
      ref={cardRef}
      className={`dfl-card ${industry.className}${isHovered ? " is-hovered" : ""}${isDimmed ? " is-dimmed" : ""}`}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => onCardClick(index)}
    >
      {/* Video — only renders on hover card */}
      <video
        className={`dfl-video${isHovered ? " dfl-video--visible" : ""}`}
        src={industry.video}
        muted
        loop
        autoPlay
        playsInline
        preload="none"
      />

      {/* Dark base overlay */}
      <div className="dfl-overlay" />

      {/* Floating controls */}
      <div className={`dfl-controls${isHovered ? " dfl-controls--visible" : ""}`}>
        <button className="dfl-ctrl-btn" aria-label="Expand"><FaExpand size={10} /></button>
        <button className="dfl-ctrl-btn" aria-label="Play"><FaPlay size={10} /></button>
        <button className="dfl-ctrl-btn" aria-label="Open"><FaExternalLinkAlt size={10} /></button>
      </div>

      {/* Centered title block */}
      <div className={`dfl-title-block${isHovered ? " dfl-title-block--erasing" : ""}`}>
        <h3 className="dfl-name">
          {isHovered
            ? (displayedName.length > 0
                ? <><span className="dfl-name-ghost">{industry.name}</span><span className="dfl-name-visible">{displayedName}</span></>
                : null)
            : industry.name
          }
        </h3>
        {/* Animated separator line */}
        <div className={`dfl-sep${isHovered ? " dfl-sep--shrink" : ""}`} />
      </div>
    </div>
  );
}

export default function DynamicFrameLayout() {
  const navigate = useNavigate();
  const navigationType = useNavigationType(); // "POP" on browser back/forward
  const [hovered, setHovered] = useState(null);

  /* ── Fullscreen transition state ──────────────────────────── */
  const [activeIndex, setActiveIndex] = useState(null); // index of card currently in fullscreen flow
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScrollCue, setShowScrollCue] = useState(false);

  const cardRefs = useRef([]);
  const fsWrapRef = useRef(null);   // wrapper: owns geometry + zoom scale (animated by GSAP)
  const fsVideoRef = useRef(null);  // the actual <video>: NEVER receives the zoom transform
  const fsContainerRef = useRef(null);
  const fsTintRef = useRef(null);
  const scrollSpacerRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const navigatedRef = useRef(false);
  const closingRef = useRef(false);
  const restoringRef = useRef(false); // true while the reverse (back) transition runs
  const pageScrollRef = useRef(0);    // page scroll position captured when a card is clicked

  const getColTemplate = () => {
    if (hovered === null) return "repeat(3, 1fr)";
    const { col: hCol } = getPos(hovered);
    return [0, 1, 2].map(c => c === hCol ? "2.1fr" : "0.7fr").join(" ");
  };

  const getRowTemplate = () => {
    if (hovered === null) return "repeat(3, 1fr)";
    const { row: hRow } = getPos(hovered);
    return [0, 1, 2].map(r => r === hRow ? "2.1fr" : "0.7fr").join(" ");
  };

  /* Current vertical page scroll, cross-browser */
  const getScrollY = () =>
    window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  /* Capture the clicked card's current bounding rect */
  const getCardRect = (index) => {
    const el = cardRefs.current[index];
    if (!el) return null;
    return el.getBoundingClientRect();
  };

  /* Keep the cloned <video> playing no matter what (re-arm on any stall) */
  const ensurePlaying = useCallback(() => {
    const v = fsVideoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    if (v.paused) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }, []);

  /* ── Open fullscreen: animate WRAPPER from card rect → viewport ── */
  const openFullscreen = useCallback((index) => {
    // Capture the EXACT page scroll position so we can restore the Industries
    // section (not the Hero) when the user navigates back later.
    pageScrollRef.current = getScrollY();

    const rect = getCardRect(index);
    if (!rect || !fsWrapRef.current) return;

    navigatedRef.current = false;
    closingRef.current = false;
    setActiveIndex(index);
    setIsFullscreen(true);

    // Lock the real page scroll; the spacer below drives ScrollTrigger instead
    document.body.style.overflow = "hidden";

    const wrapEl = fsWrapRef.current;

    // Position the wrapper exactly over the original card first (no flash).
    // transform stays scale(1) here — geometry only.
    gsap.set(wrapEl, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      opacity: 1,
      scale: 1,
      transformOrigin: "center center",
    });

    // Start playback immediately and keep it alive through the tween.
    ensurePlaying();

    // Animate to fullscreen — premium, cinematic easing.
    // We animate top/left/width/height (layout), NOT scale, so the video
    // element itself is never under a scaling transform → frames stay live.
    gsap.to(wrapEl, {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      duration: 0.85,
      ease: "power3.inOut",
      onUpdate: ensurePlaying,
      onComplete: () => {
        if (fsTintRef.current) fsTintRef.current.classList.add("dfl-fullscreen-overlay-tint--visible");
        setShowScrollCue(true);
        ensurePlaying();
        // Re-enable body scroll AFTER the expand finishes so the
        // scroll-driven zoom (Step 4) can begin from a clean state.
        document.body.style.overflow = "";
        window.scrollTo(0, 0);
        setupScrollZoom(index);
      },
    });

    gsap.fromTo(
      fsContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power1.out" }
    );
  }, [ensurePlaying]);

  /* ── Close fullscreen: reverse animation back into the card ── */
  const closeFullscreen = useCallback(() => {
    if (activeIndex === null || closingRef.current) return;
    closingRef.current = true;

    setShowScrollCue(false);
    if (fsTintRef.current) fsTintRef.current.classList.remove("dfl-fullscreen-overlay-tint--visible");

    // Tear down scroll-driven zoom before reversing
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    document.body.style.overflow = "hidden";

    // Return the page to where the card was before the overlay opened,
    // so the wrapper collapses into the correct on-screen position.
    window.scrollTo(0, pageScrollRef.current);

    const rect = getCardRect(activeIndex);
    const wrapEl = fsWrapRef.current;

    if (rect && wrapEl) {
      // Reset zoom scale instantly, then animate geometry back to the card.
      gsap.set(wrapEl, { scale: 1, transformOrigin: "center center" });
      gsap.to(wrapEl, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        duration: 0.7,
        ease: "power3.inOut",
        onUpdate: ensurePlaying,
        onComplete: () => {
          gsap.set(wrapEl, { opacity: 0 });
          document.body.style.overflow = "";
          window.scrollTo(0, pageScrollRef.current);
          setIsFullscreen(false);
          setActiveIndex(null);
          closingRef.current = false;
        },
      });
    } else {
      document.body.style.overflow = "";
      window.scrollTo(0, pageScrollRef.current);
      setIsFullscreen(false);
      setActiveIndex(null);
      closingRef.current = false;
    }

    gsap.to(fsContainerRef.current, { opacity: 0, duration: 0.5, ease: "power1.in" });
  }, [activeIndex, ensurePlaying]);

  /* ── Step 4: scroll-driven zoom, scrubbed to scroll position ──
     The scale is applied to the WRAPPER only. The <video> inside fills
     the wrapper at 100% and is never transformed, so it keeps decoding
     and painting live frames while the wrapper layer is scaled. */
  const setupScrollZoom = useCallback((index) => {
    if (!fsWrapRef.current || !scrollSpacerRef.current) return;

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }

    const wrapEl = fsWrapRef.current;
    gsap.set(wrapEl, { scale: 1, transformOrigin: "center center" });
    ensurePlaying();

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: scrollSpacerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress; // 0 → 1
        const scale = 1 + progress * 0.9; // gradual zoom up to ~1.9x
        // Scale the wrapper layer (GSAP writes transform: ... scale()).
        gsap.set(wrapEl, { scale });

        // Guarantee the live video keeps playing across the whole zoom.
        ensurePlaying();

        // Fade the scroll cue out early in the scroll
        if (progress > 0.04) {
          setShowScrollCue(false);
        }

        if (progress >= 0.995 && !navigatedRef.current) {
          navigatedRef.current = true;
          const industry = industries[index];
          finishTransition(index, industry.slug);
        }
      },
    });
    // Make sure ScrollTrigger has correct measurements after layout settles
    ScrollTrigger.refresh();
  }, [ensurePlaying]);

  /* ── Step 5: navigate once zoom completes ── */
  const finishTransition = useCallback((index, slug) => {
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    document.body.style.overflow = "";

    // Remember which card we left from AND the page scroll position of the
    // Industries section, so the reverse (back) transition can restore the
    // exact view — not the top/Hero — when the user returns.
    try {
      sessionStorage.setItem(
        RETURN_KEY,
        JSON.stringify({ index, scrollY: pageScrollRef.current })
      );
    } catch { /* ignore storage errors */ }

    navigate(`/industry/${slug}`);
  }, [navigate]);

  /* ── Reverse transition (browser Back) ───────────────────────
     Restores the Industries scroll position first, then replays the
     forward flow backwards: starts fullscreen + zoomed, zooms back out,
     then collapses the live video into its original card. */
  const reverseTransition = useCallback((index, scrollY) => {
    const wrapEl = fsWrapRef.current;
    if (!wrapEl) return;

    navigatedRef.current = false;
    closingRef.current = true;   // keeps the cloned video visible
    restoringRef.current = true;
    pageScrollRef.current = scrollY || 0;

    // Restore the exact selection + fullscreen state we left in.
    setActiveIndex(index);
    setIsFullscreen(true);
    setShowScrollCue(false);

    // Put the underlying page back at the Industries section BEFORE locking,
    // so the collapse lands on the real card position (not the Hero).
    window.scrollTo(0, pageScrollRef.current);
    document.body.style.overflow = "hidden";

    // Begin from the state we left: fully fullscreen and fully zoomed in.
    gsap.set(wrapEl, {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      opacity: 1,
      scale: ZOOM_MAX_SCALE,
      transformOrigin: "center center",
    });
    if (fsTintRef.current) fsTintRef.current.classList.add("dfl-fullscreen-overlay-tint--visible");

    ensurePlaying();

    // Wait two frames so the grid has laid out and card rects are accurate,
    // and re-apply the scroll in case the browser tried to restore its own.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, pageScrollRef.current);
        ensurePlaying();
        const rect = getCardRect(index);

        // 1) Zoom the fullscreen video back out to 1x.
        gsap.to(wrapEl, {
          scale: 1,
          duration: 0.55,
          ease: "power2.out",
          onUpdate: ensurePlaying,
        });

        if (rect) {
          // 2) Collapse the fullscreen frame back into its original card.
          gsap.to(wrapEl, {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            duration: 0.7,
            ease: "power3.inOut",
            delay: 0.5,
            onUpdate: ensurePlaying,
            onComplete: () => {
              if (fsTintRef.current) fsTintRef.current.classList.remove("dfl-fullscreen-overlay-tint--visible");
              gsap.to(fsContainerRef.current, { opacity: 0, duration: 0.3, ease: "power1.in" });
              gsap.set(wrapEl, { opacity: 0 });
              document.body.style.overflow = "";
              window.scrollTo(0, pageScrollRef.current);
              setIsFullscreen(false);
              setActiveIndex(null);
              closingRef.current = false;
              restoringRef.current = false;
            },
          });
        } else {
          // Fallback: no card rect — just dismiss cleanly.
          if (fsTintRef.current) fsTintRef.current.classList.remove("dfl-fullscreen-overlay-tint--visible");
          gsap.to(fsContainerRef.current, { opacity: 0, duration: 0.3 });
          gsap.set(wrapEl, { opacity: 0 });
          document.body.style.overflow = "";
          window.scrollTo(0, pageScrollRef.current);
          setIsFullscreen(false);
          setActiveIndex(null);
          closingRef.current = false;
          restoringRef.current = false;
        }
      });
    });
  }, [ensurePlaying]);

  /* On mount: if we arrived here via browser Back AND we have a stored
     selection, restore scroll + replay the reverse transition into that card. */
  useEffect(() => {
    // Take manual control of scroll restoration so the browser doesn't snap
    // the page to the top (Hero) before our reverse transition runs.
    let prevScrollRestoration;
    if ("scrollRestoration" in window.history) {
      prevScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
    }

    let raf1;
    let raf2;
    try {
      const raw = sessionStorage.getItem(RETURN_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const index = parsed && typeof parsed.index === "number" ? parsed.index : null;
        const scrollY = parsed && typeof parsed.scrollY === "number" ? parsed.scrollY : 0;
        // Only replay on real back/forward navigation, not a fresh push.
        if (navigationType === "POP" && index !== null && industries[index]) {
          sessionStorage.removeItem(RETURN_KEY);
          // Restore scroll immediately to avoid any flash of the Hero.
          window.scrollTo(0, scrollY);
          raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => reverseTransition(index, scrollY));
          });
        } else {
          // Different entry path — discard the stale marker.
          sessionStorage.removeItem(RETURN_KEY);
        }
      }
    } catch { /* ignore storage / parse errors */ }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (prevScrollRestoration && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = prevScrollRestoration;
      }
    };
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Click handler: open if closed, close if open (no navigation here) */
  const handleCardClick = useCallback((index) => {
    if (restoringRef.current) return; // ignore clicks mid reverse-transition
    if (isFullscreen) {
      closeFullscreen();
    } else {
      openFullscreen(index);
    }
  }, [isFullscreen, openFullscreen, closeFullscreen]);

  /* Click anywhere on the fullscreen overlay closes it, per Step 3 */
  const handleOverlayClick = useCallback(() => {
    if (restoringRef.current) return; // don't interrupt the reverse transition
    closeFullscreen();
  }, [closeFullscreen]);

  /* When the cloned video gets a source, prime playback immediately so
     it is already running by the time the expand starts. */
  useEffect(() => {
    if (activeIndex !== null) {
      ensurePlaying();
    }
  }, [activeIndex, ensurePlaying]);

  /* Cleanup on unmount: kill ScrollTrigger, restore scroll, clear styles */
  useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <div
        className="dfl-grid"
        style={{
          gridTemplateColumns: getColTemplate(),
          gridTemplateRows:    getRowTemplate(),
        }}
      >
        {industries.map((industry, index) => (
          <IndustryCard
            key={index}
            industry={industry}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            onCardClick={handleCardClick}
            cardRef={(el) => (cardRefs.current[index] = el)}
          />
        ))}
      </div>

      {/* ── Fullscreen transition layer (Apple-style) ───────────── */}
      {isFullscreen && (
        <div
          ref={fsContainerRef}
          className="dfl-fullscreen"
          onClick={handleOverlayClick}
        >
          {/* Scroll spacer drives the ScrollTrigger scrub; lives
              behind the fixed video/tint, invisible to the eye */}
          <div ref={scrollSpacerRef} className="dfl-scroll-spacer" />
        </div>
      )}

      {/* Wrapper + video clone + tint + scroll cue render independently of
          dfl-fullscreen's mount so the close animation can run smoothly
          even as isFullscreen toggles false mid-tween.

          KEY: the WRAPPER owns geometry + zoom scale (animated by GSAP).
          The <video> stays untouched (no scaling transform), is never
          recreated, and keeps playing live frames the whole time. */}
      <div
        ref={fsWrapRef}
        className="dfl-fullscreen-video"
        style={{ opacity: isFullscreen || closingRef.current ? 1 : 0 }}
        onClick={handleOverlayClick}
      >
        <video
          ref={fsVideoRef}
          className="dfl-fullscreen-video-inner"
          src={activeIndex !== null ? industries[activeIndex].video : undefined}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
        />
      </div>

      <div ref={fsTintRef} className="dfl-fullscreen-overlay-tint" />

      <div className={`dfl-scroll-cue${showScrollCue ? " dfl-scroll-cue--visible" : ""}`}>
        <span className="dfl-scroll-cue-text">Scroll Down</span>
        <span className="dfl-scroll-cue-arrow">↓</span>
      </div>
    </>
  );
}

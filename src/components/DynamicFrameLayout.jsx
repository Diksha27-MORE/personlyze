// DynamicFrameLayout.jsx
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import "./DynamicFrameLayout.css";
import { FaExpand, FaPlay, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate, useNavigationType } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createPortal } from "react-dom";

import realEstateVideo from "../assets/real-estate.mp4";
import bfsiVideo from "../assets/bfsi.mp4";
import travelVideo from "../assets/travel.mp4";
import healthVideo from "../assets/health.mp4";
import retailVideo from "../assets/Retail.mp4";
import automotiveVideo from "../assets/automotive.mp4";
import b2bVideo from "../assets/b2b.mp4";
import techVideo from "../assets/tech.mp4";
import fashionVideo from "../assets/fashion.mp4";

import realEstateImg from "../assets/real-estateimg.png";
import bfsiImg from "../assets/bfsi-img.png";
import travelImg from "../assets/travelimg.png";
import healthImg from "../assets/healthimg.png";
import retailImg from "../assets/Retailimg.png";
import automotiveImg from "../assets/automotiveimg.png";
import b2bImg from "../assets/b2bimg.png";
import techImg from "../assets/techimg.png";
import fashionImg from "../assets/fashionimg.png";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  { name: "Real Estate",          video: realEstateVideo, image: realEstateImg, className: "real-estate", slug: "real-estate" },
  { name: "BFSI",                 video: bfsiVideo,       image: bfsiImg,       className: "bfsi",        slug: "bfsi"        },
  { name: "Travel & Hospitality", video: travelVideo,     image: travelImg,     className: "travel",      slug: "travel"      },
  { name: "Health & Wellness",    video: healthVideo,     image: healthImg,     className: "health",      slug: "health"      },
  { name: "Retail & D2C",         video: retailVideo,     image: retailImg,     className: "retail",      slug: "retail"      },
  { name: "Automotive",           video: automotiveVideo, image: automotiveImg, className: "automotive",  slug: "automotive"  },
  { name: "B2B & SaaS",           video: b2bVideo,        image: b2bImg,        className: "saas",        slug: "b2b"         },
  { name: "Tech & Startups",      video: techVideo,       image: techImg,       className: "tech",        slug: "tech"        },
  { name: "Fashion & Lifestyle",  video: fashionVideo,    image: fashionImg,    className: "fashion",     slug: "fashion"     },
];

const ZOOM_MAX_SCALE = 1.9;
const RETURN_KEY = "dfl_return";

const getPos = (index) => ({ row: Math.floor(index / 3), col: index % 3 });

const isTouchDevice =
  typeof window !== "undefined" &&
  (("ontouchstart" in window) || (navigator.maxTouchPoints > 0));

/* ── Letter-eraser hook ────────────────────────────────────── */
function useLetterErase(fullText, active) {
  const [displayed, setDisplayed] = useState(fullText);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (active) {
      let len = fullText.length;
      timerRef.current = setInterval(() => {
        len -= 1;
        if (len <= 0) {
          setDisplayed("");
          clearInterval(timerRef.current);
          timerRef.current = null;
        } else {
          setDisplayed(fullText.slice(fullText.length - len));
        }
      }, 40);
    } else {
      setDisplayed(fullText);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active, fullText]);

  return displayed;
}

/* ── IndustryCard ──────────────────────────────────────────── */
const IndustryCard = memo(function IndustryCard({
  industry,
  index,
  isHovered,
  isDimmed,
  setHovered,
  onCardClick,
  cardRef,
}) {
  const displayedName = useLetterErase(industry.name, isHovered);
  const videoRef = useRef(null);

  // Play/pause preloaded hover video without reloading src.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isHovered) {
      v.muted = true;
      // Kick decoder in advance
      try { v.currentTime = v.currentTime; } catch { /* ignore */ }
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
    }
  }, [isHovered]);

  const bgStyle = useMemo(
    () => ({ backgroundImage: `url(${industry.image})` }),
    [industry.image]
  );

  const handleEnter = useCallback(() => setHovered(index), [index, setHovered]);
  const handleLeave = useCallback(() => setHovered(null), [setHovered]);
  const handleClick = useCallback(() => onCardClick(index), [index, onCardClick]);

  const cardClass =
    `dfl-card ${industry.className}` +
    (isHovered ? " is-hovered" : "") +
    (isDimmed ? " is-dimmed" : "");

  return (
    <div
      ref={cardRef}
      className={cardClass}
      style={bgStyle}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        className={`dfl-video${isHovered ? " dfl-video--visible" : ""}`}
        src={industry.video}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        // no autoPlay — we control play/pause via effect so no repeated .play() calls
      />

      <div className="dfl-overlay" />

      <div className={`dfl-controls${isHovered ? " dfl-controls--visible" : ""}`}>
        <button className="dfl-ctrl-btn" aria-label="Expand"><FaExpand size={10} /></button>
        <button className="dfl-ctrl-btn" aria-label="Play"><FaPlay size={10} /></button>
        <button className="dfl-ctrl-btn" aria-label="Open"><FaExternalLinkAlt size={10} /></button>
      </div>

      <div className={`dfl-title-block${isHovered ? " dfl-title-block--erasing" : ""}`}>
<h3 className="dfl-name">
  {industry.name}
</h3>
        <div className={`dfl-sep${isHovered ? " dfl-sep--shrink" : ""}`} />
      </div>
    </div>
  );
});

export default function DynamicFrameLayout() {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [hovered, setHovered] = useState(null);

  const [activeIndex, setActiveIndex] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScrollCue, setShowScrollCue] = useState(false);

  const cardRefs = useRef([]);
  const fsWrapRef = useRef(null);
  const fsVideoRef = useRef(null);
  const fsContainerRef = useRef(null);
  const fsTintRef = useRef(null);
  const scrollSpacerRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const openTweenRef = useRef(null);
  const closeTweenRef = useRef(null);
  const zoomTweenRef = useRef(null);
  const navigatedRef = useRef(false);
  const closingRef = useRef(false);
  const restoringRef = useRef(false);
  const animatingRef = useRef(false);   // guards duplicate open/close animations
  const pageScrollRef = useRef(0);
  const activeIndexRef = useRef(null);

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  const { colTemplate, rowTemplate } = useMemo(() => {
    if (hovered === null) {
      return { colTemplate: "repeat(3, 1fr)", rowTemplate: "repeat(3, 1fr)" };
    }
    const { row: hRow, col: hCol } = getPos(hovered);
    return {
      colTemplate: [0, 1, 2].map(c => c === hCol ? "2.1fr" : "0.7fr").join(" "),
      rowTemplate: [0, 1, 2].map(r => r === hRow ? "2.1fr" : "0.7fr").join(" "),
    };
  }, [hovered]);

  const gridStyle = useMemo(
    () => ({ gridTemplateColumns: colTemplate, gridTemplateRows: rowTemplate }),
    [colTemplate, rowTemplate]
  );

  const getScrollY = () =>
    window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  const getCardRect = (index) => {
    const el = cardRefs.current[index];
    return el ? el.getBoundingClientRect() : null;
  };

  /* Play the fullscreen clone once; no more per-frame .play() calls. */
  const primePlayback = useCallback(() => {
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

  /* Rebind a stall recovery listener — only when needed */
  useEffect(() => {
    const v = fsVideoRef.current;
    if (!v) return;
    const onStalled = () => {
      if (v.paused) {
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    };
    v.addEventListener("pause", onStalled);
    v.addEventListener("stalled", onStalled);
    v.addEventListener("suspend", onStalled);
    return () => {
      v.removeEventListener("pause", onStalled);
      v.removeEventListener("stalled", onStalled);
      v.removeEventListener("suspend", onStalled);
    };
  }, []);

  /* ── Open fullscreen ── */
  const openFullscreen = useCallback((index) => {
    if (animatingRef.current || isFullscreen) return; // dedupe double-clicks
    const rect = getCardRect(index);
    if (!rect || !fsWrapRef.current) return;

    animatingRef.current = true;
    pageScrollRef.current = getScrollY();
    navigatedRef.current = false;
    closingRef.current = false;

    setActiveIndex(index);
    setIsFullscreen(true);

document.body.style.setProperty("overflow", "auto", "important");
document.documentElement.style.setProperty("overflow", "auto", "important");
    const wrapEl = fsWrapRef.current;

    gsap.set(wrapEl, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      opacity: 1,
      scale: 1,
      force3D: true,
      transformOrigin: "center center",
    });

    primePlayback();

    if (openTweenRef.current) openTweenRef.current.kill();
    openTweenRef.current = gsap.to(wrapEl, {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      duration: 0.85,
      ease: "power3.inOut",
      force3D: true,
      onComplete: () => {
        if (fsTintRef.current) fsTintRef.current.classList.add("dfl-fullscreen-overlay-tint--visible");
        setShowScrollCue(true);
        primePlayback();
document.body.style.setProperty("overflow", "auto", "important");
document.documentElement.style.setProperty("overflow", "auto", "important");
window.scrollTo(0, 0);
        setupScrollZoom(index);
        animatingRef.current = false;
      },
    });

    gsap.fromTo(
      fsContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power1.out" }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen, primePlayback]);

  /* ── Close fullscreen ── */
  const closeFullscreen = useCallback(() => {
    const idx = activeIndexRef.current;
    if (idx === null || closingRef.current || animatingRef.current) return;
    closingRef.current = true;
    animatingRef.current = true;

    setShowScrollCue(false);
    if (fsTintRef.current) fsTintRef.current.classList.remove("dfl-fullscreen-overlay-tint--visible");

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    if (zoomTweenRef.current) { zoomTweenRef.current.kill(); zoomTweenRef.current = null; }

document.body.style.setProperty("overflow", "hidden", "important");
document.documentElement.style.setProperty("overflow", "hidden", "important");
window.scrollTo(0, pageScrollRef.current);

    const rect = getCardRect(idx);
    const wrapEl = fsWrapRef.current;

    if (rect && wrapEl) {
      gsap.set(wrapEl, { scale: 1, force3D: true, transformOrigin: "center center" });
      if (closeTweenRef.current) closeTweenRef.current.kill();
      closeTweenRef.current = gsap.to(wrapEl, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        duration: 0.7,
        ease: "power3.inOut",
        force3D: true,
        onComplete: () => {
          gsap.set(wrapEl, { opacity: 0 });
document.body.style.setProperty("overflow", "auto", "important");
document.documentElement.style.setProperty("overflow", "auto", "important");
window.scrollTo(0, pageScrollRef.current);
setIsFullscreen(false);
          setActiveIndex(null);
          closingRef.current = false;
          animatingRef.current = false;
        },
      });
    } else {
document.body.style.setProperty("overflow", "auto", "important");
document.documentElement.style.overflow = "";
      window.scrollTo(0, pageScrollRef.current);
      setIsFullscreen(false);
      setActiveIndex(null);
      closingRef.current = false;
      animatingRef.current = false;
    }

    gsap.to(fsContainerRef.current, { opacity: 0, duration: 0.5, ease: "power1.in" });
  }, []);

  /* ── Scroll-driven zoom ── */
  const setupScrollZoom = useCallback((index) => {
    
    if (!fsWrapRef.current || !scrollSpacerRef.current) return;

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }

    const wrapEl = fsWrapRef.current;
    gsap.set(wrapEl, { scale: 1, force3D: true, transformOrigin: "center center" });
    primePlayback();

    // Quick setter avoids per-frame object allocations / lookups.
    const setScale = gsap.quickSetter(wrapEl, "scale");
    let cueHidden = false;

const spacerEl = scrollSpacerRef.current;
scrollTriggerRef.current = ScrollTrigger.create({
  start: 0,
  end: () => spacerEl.offsetHeight,
  scrub: true,
  invalidateOnRefresh: true,
 onUpdate: (self) => {
  const progress = self.progress;
  setScale(1 + progress * 0.9);

  // TEMP DEBUG — remove after confirming
  console.log("scrollY:", getScrollY(), "docHeight:", document.documentElement.scrollHeight, "progress:", progress.toFixed(3));

        if (!cueHidden && progress > 0.04) {
          cueHidden = true;
          setShowScrollCue(false);
        }

        if (progress >= 0.995 && !navigatedRef.current) {
          navigatedRef.current = true;
          finishTransition(index, industries[index].slug);
        }
      },
    });
    ScrollTrigger.refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primePlayback]);

  const finishTransition = useCallback((index, slug) => {
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    document.body.style.setProperty("overflow", "auto", "important");
    document.documentElement.style.setProperty("overflow", "auto", "important");
    try {
      sessionStorage.setItem(
        RETURN_KEY,
        JSON.stringify({ index, scrollY: pageScrollRef.current })
      );
    } catch { /* ignore */ }
    navigate(`/industry/${slug}`);
  }, [navigate]);

  /* ── Reverse transition ── */
  const reverseTransition = useCallback((index, scrollY) => {
    const wrapEl = fsWrapRef.current;
    if (!wrapEl) return;

    navigatedRef.current = false;
    closingRef.current = true;
    restoringRef.current = true;
    animatingRef.current = true;
    pageScrollRef.current = scrollY || 0;

    setActiveIndex(index);
    setIsFullscreen(true);
    setShowScrollCue(false);

    window.scrollTo(0, pageScrollRef.current);
    document.body.style.setProperty("overflow", "hidden", "important");
    document.documentElement.style.setProperty("overflow", "hidden", "important");

    gsap.set(wrapEl, {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      opacity: 1,
      scale: ZOOM_MAX_SCALE,
      force3D: true,
      transformOrigin: "center center",
    });
    if (fsTintRef.current) fsTintRef.current.classList.add("dfl-fullscreen-overlay-tint--visible");

    primePlayback();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, pageScrollRef.current);
        primePlayback();
        const rect = getCardRect(index);

        gsap.to(wrapEl, {
          scale: 1,
          duration: 0.55,
          ease: "power2.out",
          force3D: true,
        });

        const done = () => {
          if (fsTintRef.current) fsTintRef.current.classList.remove("dfl-fullscreen-overlay-tint--visible");
          gsap.to(fsContainerRef.current, { opacity: 0, duration: 0.3, ease: "power1.in" });
          gsap.set(wrapEl, { opacity: 0 });
document.body.style.setProperty("overflow", "auto", "important");
document.documentElement.style.setProperty("overflow", "auto", "important");
window.scrollTo(0, pageScrollRef.current);
          setIsFullscreen(false);
          setActiveIndex(null);
          closingRef.current = false;
          restoringRef.current = false;
          animatingRef.current = false;
        };

        if (rect) {
          gsap.to(wrapEl, {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            duration: 0.7,
            ease: "power3.inOut",
            delay: 0.5,
            force3D: true,
            onComplete: done,
          });
        } else {
          done();
        }
      });
    });
  }, [primePlayback]);

  /* Mount: handle browser Back replay */
  useEffect(() => {
    let prevScrollRestoration;
    if ("scrollRestoration" in window.history) {
      prevScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
    }

    let raf1, raf2;
    try {
      const raw = sessionStorage.getItem(RETURN_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const index = parsed && typeof parsed.index === "number" ? parsed.index : null;
        const scrollY = parsed && typeof parsed.scrollY === "number" ? parsed.scrollY : 0;
        if (navigationType === "POP" && index !== null && industries[index]) {
          sessionStorage.removeItem(RETURN_KEY);
          window.scrollTo(0, scrollY);
          raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => reverseTransition(index, scrollY));
          });
        } else {
          sessionStorage.removeItem(RETURN_KEY);
        }
      }
    } catch { /* ignore */ }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (prevScrollRestoration && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = prevScrollRestoration;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = useCallback((index) => {
    if (restoringRef.current || animatingRef.current) return;
    if (isFullscreen) closeFullscreen();
    else openFullscreen(index);
  }, [isFullscreen, openFullscreen, closeFullscreen]);

  const handleOverlayClick = useCallback(() => {
    if (restoringRef.current || animatingRef.current) return;
    closeFullscreen();
  }, [closeFullscreen]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) { scrollTriggerRef.current.kill(); scrollTriggerRef.current = null; }
      if (openTweenRef.current)  { openTweenRef.current.kill();  openTweenRef.current = null; }
      if (closeTweenRef.current) { closeTweenRef.current.kill(); closeTweenRef.current = null; }
      if (zoomTweenRef.current)  { zoomTweenRef.current.kill();  zoomTweenRef.current = null; }
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars && t.vars.trigger === scrollSpacerRef.current) t.kill();
      });
document.body.style.setProperty("overflow", "auto", "important");
document.documentElement.style.setProperty("overflow", "auto", "important");
    };
  }, []);

  const setCardRef = useCallback((index) => (el) => {
    cardRefs.current[index] = el;
  }, []);

  return (
    <>
      <div className="dfl-grid" style={gridStyle}>
        {industries.map((industry, index) => (
          <IndustryCard
            key={industry.slug}
            industry={industry}
            index={index}
            isHovered={hovered === index}
            isDimmed={hovered !== null && hovered !== index}
            setHovered={setHovered}
            onCardClick={handleCardClick}
            cardRef={setCardRef(index)}
          />
        ))}
      </div>

{isFullscreen && (
  <div
    ref={fsContainerRef}
    className="dfl-fullscreen"
    onClick={handleOverlayClick}
  />
)}

{isFullscreen &&
  createPortal(
    <div ref={scrollSpacerRef} className="dfl-scroll-spacer" />,
    document.body
  )}

      <div
        ref={fsWrapRef}
        className="dfl-fullscreen-video"
        style={{
          opacity: isFullscreen || closingRef.current ? 1 : 0,
          pointerEvents: isFullscreen ? "auto" : "none",
        }}
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
          disablePictureInPicture
        />
      </div>

      <div ref={fsTintRef} className="dfl-fullscreen-overlay-tint" />

      <div className={`dfl-scroll-cue${showScrollCue ? " dfl-scroll-cue--visible" : ""}`}>
        <span className="dfl-scroll-cue-text">Scroll Down</span>
        <span className="dfl-scroll-cue-arrow">↓</span>
      </div>

      {/* Silence unused-var warning; kept for potential mobile branches. */}
      {false && isTouchDevice}
    </>
  );
}

// DynamicFrameLayout.jsx

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import "./DynamicFrameLayout.css";
import { FaExpand, FaPlay, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
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

const ZOOM_MAX_SCALE = 1.45;
const RETURN_KEY = "dfl_return";
const HANDOFF_KEY = "dfl_handoff";

const getPos = (index) => ({ row: Math.floor(index / 3), col: index % 3 });

const isTouchDevice =
  typeof window !== "undefined" &&
  (("ontouchstart" in window) || (navigator.maxTouchPoints > 0));

/* ── Letter-eraser hook ────────────────────────────────────── */
function useLetterErase(fullText, active) {
  const [displayed, setDisplayed] = useState(fullText);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
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
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, [active, fullText]);

  return displayed;
}

/* ── IndustryCard ──────────────────────────────────────────── */
const IndustryCard = memo(function IndustryCard({
  industry, index, isHovered, isDimmed, isSourceHidden,
  setHovered, onCardClick, cardRef,
}) {
  const displayedName = useLetterErase(industry.name, isHovered);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isHovered) {
      v.muted = true;
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
    (isDimmed ? " is-dimmed" : "") +
    (isSourceHidden ? " is-source-hidden" : "");

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
        muted loop playsInline preload="auto" disablePictureInPicture
      />
      <div className="dfl-overlay" />
      <div className={`dfl-controls${isHovered ? " dfl-controls--visible" : ""}`}>
        <button className="dfl-ctrl-btn" aria-label="Expand"><FaExpand size={10} /></button>
        <button className="dfl-ctrl-btn" aria-label="Play"><FaPlay size={10} /></button>
        <button className="dfl-ctrl-btn" aria-label="Open"><FaExternalLinkAlt size={10} /></button>
      </div>
      <div className={`dfl-title-block${isHovered ? " dfl-title-block--erasing" : ""}`}>
        <h3 className="dfl-name">{industry.name}</h3>
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
  const [showTitle, setShowTitle] = useState(false);

  const cardRefs = useRef([]);
  const fsWrapRef = useRef(null);
  const fsVideoRef = useRef(null);
  const fsContainerRef = useRef(null);
  const fsTintRef = useRef(null);
  const fsTitleRef = useRef(null);
  const fsSubtitleRef = useRef(null);
  const scrollSpacerRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const openTweenRef = useRef(null);
  const closeTweenRef = useRef(null);
  const zoomTweenRef = useRef(null);
  const navigatedRef = useRef(false);
  const closingRef = useRef(false);
  const restoringRef = useRef(false);
  const animatingRef = useRef(false);
  const pageScrollRef = useRef(0);
  const activeIndexRef = useRef(null);
  const spacerHeightRef = useRef(0);

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  const { colTemplate, rowTemplate } = useMemo(() => {
    if (hovered === null) return { colTemplate: "repeat(3, 1fr)", rowTemplate: "repeat(3, 1fr)" };
    const { row: hRow, col: hCol } = getPos(hovered);
    return {
      colTemplate: [0,1,2].map(c => c === hCol ? "2.1fr" : "0.7fr").join(" "),
      rowTemplate: [0,1,2].map(r => r === hRow ? "2.1fr" : "0.7fr").join(" "),
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

  const primePlayback = useCallback(() => {
    const v = fsVideoRef.current;
    if (!v) return;
    v.muted = true; v.loop = true; v.playsInline = true;
    if (v.paused) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }, []);

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

  /* ── Open fullscreen (shared element from clicked card) ── */
  const openFullscreen = useCallback((index) => {
    if (animatingRef.current || isFullscreen) return;
    const rect = getCardRect(index);
    if (!rect || !fsWrapRef.current) return;

    animatingRef.current = true;
    pageScrollRef.current = getScrollY();
    navigatedRef.current = false;
    closingRef.current = false;

    setActiveIndex(index);
    setIsFullscreen(true);
    setShowTitle(false);

    document.body.style.setProperty("overflow", "auto", "important");
    document.documentElement.style.setProperty("overflow", "auto", "important");

    const wrapEl = fsWrapRef.current;

    gsap.set(wrapEl, {
      top: rect.top, left: rect.left,
      width: rect.width, height: rect.height,
      opacity: 1, scale: 1,
      borderRadius: getComputedStyle(cardRefs.current[index]).borderRadius || "0px",
      force3D: true, transformOrigin: "center center",
    });

    // Reset the inner video's own transform to a clean GSAP-owned baseline
    // every time we open — this is what the scroll-zoom tween will animate
    // from later, in setupScrollZoom().
    if (fsVideoRef.current) {
      gsap.set(fsVideoRef.current, {
        scale: 1,
        transformOrigin: "50% 50%",
        force3D: true,
      });
    }

    primePlayback();

    if (openTweenRef.current) openTweenRef.current.kill();
    openTweenRef.current = gsap.to(wrapEl, {
      top: 0, left: 0,
      width: window.innerWidth, height: window.innerHeight,
      borderRadius: 0,
      duration: 0.95,
      ease: "expo.inOut",
      force3D: true,
      onComplete: () => {
        if (fsTintRef.current) fsTintRef.current.classList.add("dfl-fullscreen-overlay-tint--visible");
        primePlayback();

        document.body.style.setProperty("overflow", "auto", "important");
        document.documentElement.style.setProperty("overflow", "auto", "important");
        window.scrollTo(0, 0);

        setShowTitle(true);
        // FIX (null target #2): fsTitleRef and fsSubtitleRef both belong to
        // elements inside the same `{isFullscreen && activeIndustry && (...)}`
        // block, so they mount together — but the original guard only
        // checked `fsTitleRef.current` before passing BOTH refs into the
        // array target. That let a `null` slip into the array on any frame
        // where only one ref had attached, which GSAP's array-target
        // resolution flags as "GSAP target not found." (as opposed to the
        // "target null not found." wording used for a single null argument).
        // Checking both refs before firing removes that possibility
        // entirely, with no change to the animation itself.
        if (fsTitleRef.current && fsSubtitleRef.current) {
          gsap.fromTo(
            [fsTitleRef.current, fsSubtitleRef.current],
            { y: 24, opacity: 0, filter: "blur(6px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out", stagger: 0.08 }
          );
        }
        setTimeout(() => setShowScrollCue(true), 350);

        setupScrollZoom(index);
        animatingRef.current = false;
      },
    });

    gsap.fromTo(
      fsContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.55, ease: "power2.out" }
    );

    // FIX (null target #1 — the primary cause of both warnings):
    // fsContainerRef points at a <div> that is conditionally rendered
    // (`{isFullscreen && (<div ref={fsContainerRef} .../>)}`). Above, we
    // just called `setIsFullscreen(true)`, but React batches that state
    // update — it does NOT apply synchronously, so the conditional div has
    // not been mounted yet at this point in the function. That means
    // `fsContainerRef.current` was still `null` (left over from the
    // previous render, when isFullscreen was false), and the gsap.fromTo
    // call right above this comment was firing on a null target every
    // single time `openFullscreen` ran — this is exactly what produced
    // "GSAP target null not found." in the console.
    //
    // The fix: defer the animation to the next animation frame (after
    // React has committed the re-render and the div genuinely exists in
    // the DOM), and guard on the ref just in case. Duration, easing, and
    // opacity values are untouched — the fade timing is visually identical,
    // delayed only by a single frame (~16ms), which is imperceptible and
    // is also why this fade wasn't reliably showing up before.
    requestAnimationFrame(() => {
      if (!fsContainerRef.current) return;
      gsap.fromTo(
        fsContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.55, ease: "power2.out" }
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen, primePlayback]);

  /* ── Close fullscreen (dismiss without navigating) ── */
  const closeFullscreen = useCallback(() => {
    const idx = activeIndexRef.current;
    if (idx === null || closingRef.current || animatingRef.current) return;
    closingRef.current = true;
    animatingRef.current = true;

    setShowScrollCue(false);
    setShowTitle(false);
    if (fsTintRef.current) fsTintRef.current.classList.remove("dfl-fullscreen-overlay-tint--visible");

    if (scrollTriggerRef.current) { scrollTriggerRef.current.kill(); scrollTriggerRef.current = null; }
    if (zoomTweenRef.current) { zoomTweenRef.current.kill(); zoomTweenRef.current = null; }

    document.body.style.setProperty("overflow", "hidden", "important");
    document.documentElement.style.setProperty("overflow", "hidden", "important");
    window.scrollTo(0, pageScrollRef.current);

    const rect = getCardRect(idx);
    const wrapEl = fsWrapRef.current;

    if (rect && wrapEl) {
      gsap.set(wrapEl, { scale: 1, force3D: true, transformOrigin: "center center" });
      if (fsVideoRef.current) {
        gsap.set(fsVideoRef.current, { scale: 1, transformOrigin: "50% 50%", force3D: true });
      }
      if (closeTweenRef.current) closeTweenRef.current.kill();
      closeTweenRef.current = gsap.to(wrapEl, {
        top: rect.top, left: rect.left,
        width: rect.width, height: rect.height,
        duration: 0.75, ease: "expo.inOut", force3D: true,
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

    // FIX: defensive null guard. In the normal flow fsContainerRef.current
    // is still mounted here (isFullscreen hasn't flushed to false yet in
    // this synchronous call), so this wasn't the source of either console
    // warning — but it relies on the same "ref must already exist"
    // assumption that caused the bug above, so it's guarded the same way
    // for consistency. No effect on the fade-out animation or its timing.
    if (fsContainerRef.current) {
      gsap.to(fsContainerRef.current, { opacity: 0, duration: 0.5, ease: "power2.in" });
    }
  }, []);

  /* ── Scroll-driven zoom + text reveal ──────────────────────
   * Two things happen here, deliberately on separate GSAP objects:
   *
   * 1. `zoomTweenRef` — a REAL gsap.to() tween that owns the video's
   *    `scale`, wired directly to ScrollTrigger via the tween's own
   *    `scrollTrigger` config. This is the fix: previously the scale
   *    was pushed via a bare `gsap.quickSetter(videoEl, "scale")`
   *    inside a plain `ScrollTrigger.create({ onUpdate })` callback —
   *    a manual quickSetter created via gsap.set() (not a tween) is
   *    the fragile path for a transform property and was silently not
   *    producing a visible scale change on the <video> element. Letting
   *    a proper tween own the property is the reliable, idiomatic
   *    ScrollTrigger pattern (and is exactly what `zoomTweenRef` was
   *    already scaffolded for — it was just never assigned).
   *
   * 2. `scrollTriggerRef` — the existing manual ScrollTrigger, kept
   *    for everything that isn't a simple tweenable property (title/
   *    subtitle stagger via quickSetter, tint opacity, scroll-cue
   *    hide, and the end-of-scroll navigation trigger). It uses the
   *    exact same trigger/start/end/scrub as the zoom tween so both
   *    stay perfectly in sync frame-for-frame.
   * ──────────────────────────────────────────────────────────── */
  const setupScrollZoom = useCallback((index) => {
    if (!fsWrapRef.current || !scrollSpacerRef.current) return;
    if (scrollTriggerRef.current) { scrollTriggerRef.current.kill(); scrollTriggerRef.current = null; }
    if (zoomTweenRef.current) { zoomTweenRef.current.kill(); zoomTweenRef.current = null; }

    const wrapEl     = fsWrapRef.current;
    const videoEl    = fsVideoRef.current;
    const tintEl     = fsTintRef.current;
    const titleEl    = fsTitleRef.current;
    const subtitleEl = fsSubtitleRef.current;
    const spacerEl   = scrollSpacerRef.current;

    const distance = Math.max(
  window.innerHeight * 3,
  3000
);
    spacerEl.style.height = distance + "px";
    spacerHeightRef.current = distance;

    gsap.set(wrapEl, { scale: 1, force3D: true, transformOrigin: "center center" });

    if (videoEl) {
      gsap.set(videoEl, { scale: 1, transformOrigin: "50% 50%", force3D: true });
    }

    primePlayback();

    const setTitleY       = titleEl ? gsap.quickSetter(titleEl, "y", "px") : null;
    const setTitleOpacity = titleEl ? gsap.quickSetter(titleEl, "opacity") : null;
    const setSubY         = subtitleEl ? gsap.quickSetter(subtitleEl, "y", "px") : null;
    const setSubOpacity   = subtitleEl ? gsap.quickSetter(subtitleEl, "opacity") : null;
    const setTintOpacity  = tintEl ? gsap.quickSetter(tintEl, "opacity") : null;

    let cueHidden = false;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // The real zoom driver — a proper tween scrubbed by ScrollTrigger.
        if (videoEl) {
          zoomTweenRef.current = gsap.to(videoEl, {
            scale: ZOOM_MAX_SCALE,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: spacerEl,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: spacerEl,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            if (setTitleY && setTitleOpacity) {
              setTitleY(-p * 60);
              setTitleOpacity(1 - Math.min(1, p * 1.4));
            }
            if (setSubY && setSubOpacity) {
              setSubY(-p * 40);
              setSubOpacity(1 - Math.min(1, p * 1.6));
            }
            if (setTintOpacity) setTintOpacity(0.6 + p * 0.4);

            if (!cueHidden && p > 0.04) { cueHidden = true; setShowScrollCue(false); }

            if (p >= 0.98 && !navigatedRef.current) {
              navigatedRef.current = true;
              finishTransition(index, industries[index].slug);
            }
          },
        });
        ScrollTrigger.refresh();
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primePlayback]);

  const finishTransition = useCallback((index, slug) => {
    if (scrollTriggerRef.current) { scrollTriggerRef.current.kill(); scrollTriggerRef.current = null; }
    if (zoomTweenRef.current) { zoomTweenRef.current.kill(); zoomTweenRef.current = null; }
    document.body.style.setProperty("overflow", "auto", "important");
    document.documentElement.style.setProperty("overflow", "auto", "important");

    try {
      sessionStorage.setItem(RETURN_KEY, JSON.stringify({ index, scrollY: pageScrollRef.current }));
      sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({ slug, index, ts: Date.now() }));
    } catch { /* ignore */ }

    navigate(`/industry/${slug}`);
  }, [navigate]);

  /* ── Reverse transition (browser back) ── */
  const reverseTransition = useCallback((index, scrollY) => {
    const wrapEl = fsWrapRef.current;
    if (!wrapEl) return;

    closingRef.current = true;
    restoringRef.current = true;
    animatingRef.current = true;
    pageScrollRef.current = scrollY || 0;

    setActiveIndex(index);
    setIsFullscreen(true);
    setShowScrollCue(false);
    setShowTitle(false);

    window.scrollTo(0, pageScrollRef.current);
    document.body.style.setProperty("overflow", "hidden", "important");
    document.documentElement.style.setProperty("overflow", "hidden", "important");

    gsap.set(wrapEl, {
      top: 0, left: 0,
      width: window.innerWidth, height: window.innerHeight,
      opacity: 1, scale: ZOOM_MAX_SCALE,
      force3D: true, transformOrigin: "center center",
    });
    if (fsTintRef.current) fsTintRef.current.classList.add("dfl-fullscreen-overlay-tint--visible");

    primePlayback();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, pageScrollRef.current);
        primePlayback();
        const rect = getCardRect(index);

        gsap.to(wrapEl, { scale: 1, duration: 0.6, ease: "power2.out", force3D: true });

        const done = () => {
          if (fsTintRef.current) fsTintRef.current.classList.remove("dfl-fullscreen-overlay-tint--visible");
          // FIX: guard here too — reverseTransition follows the same
          // pattern as closeFullscreen (fsContainerRef is expected to
          // already be mounted since isFullscreen is still true at this
          // point), but the guard costs nothing and keeps every
          // fsContainerRef.current usage in the file consistent.
          if (fsContainerRef.current) {
            gsap.to(fsContainerRef.current, { opacity: 0, duration: 0.35, ease: "power2.in" });
          }
          gsap.set(wrapEl, { opacity: 0 });
          document.body.style.setProperty("overflow", "auto", "important");
          document.documentElement.style.setProperty("overflow", "auto", "important");
          window.scrollTo(0, pageScrollRef.current);
          setIsFullscreen(false);
          setActiveIndex(null);
          closingRef.current = false;
          restoringRef.current = false;
          animatingRef.current = false;
          setHovered(index);
        };

        if (rect) {
          gsap.to(wrapEl, {
            top: rect.top, left: rect.left,
            width: rect.width, height: rect.height,
            duration: 0.8, ease: "expo.inOut", delay: 0.45,
            force3D: true, onComplete: done,
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
    if (isFullscreen) return;
    openFullscreen(index);
  }, [isFullscreen, openFullscreen]);

  const handleCloseClick = useCallback((e) => {
    e.stopPropagation();
    if (restoringRef.current || animatingRef.current) return;
    closeFullscreen();
  }, [closeFullscreen]);

  /* Esc to close */
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e) => { if (e.key === "Escape") closeFullscreen(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen, closeFullscreen]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) { scrollTriggerRef.current.kill(); scrollTriggerRef.current = null; }
      if (zoomTweenRef.current)  { zoomTweenRef.current.kill();  zoomTweenRef.current = null; }
      if (openTweenRef.current)  { openTweenRef.current.kill();  openTweenRef.current = null; }
      if (closeTweenRef.current) { closeTweenRef.current.kill(); closeTweenRef.current = null; }
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars && t.vars.trigger === scrollSpacerRef.current) t.kill();
      });
      document.body.style.setProperty("overflow", "auto", "important");
      document.documentElement.style.setProperty("overflow", "auto", "important");
    };
  }, []);

  const setCardRef = useCallback((index) => (el) => { cardRefs.current[index] = el; }, []);

  const activeIndustry = activeIndex !== null ? industries[activeIndex] : null;

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
            isSourceHidden={isFullscreen && activeIndex === index}
            setHovered={setHovered}
            onCardClick={handleCardClick}
            cardRef={setCardRef(index)}
          />
        ))}
      </div>

      {/* Fullscreen black backdrop — non-blocking so wheel/touch reaches the window. */}
      {isFullscreen && (
        <div
          ref={fsContainerRef}
          className="dfl-fullscreen"
          style={{ pointerEvents: "none" }}
        />
      )}

      {isFullscreen &&
        createPortal(
          <div ref={scrollSpacerRef} className="dfl-scroll-spacer" />,
          document.body
        )}

      {/* Shared-element wrapper — clones the card into fullscreen and drives the scroll zoom. */}
      <div
        ref={fsWrapRef}
        className="dfl-fullscreen-video"
        style={{
          opacity: isFullscreen || closingRef.current ? 1 : 0,
          pointerEvents: "none",
        }}
      >
        <video
          ref={fsVideoRef}
          className="dfl-fullscreen-video-inner"
          src={activeIndustry ? activeIndustry.video : undefined}
          muted loop autoPlay playsInline preload="auto" disablePictureInPicture
        />
      </div>

      <div ref={fsTintRef} className="dfl-fullscreen-overlay-tint" />

      {/* Explicit close button — the only interactive element over the fullscreen. */}
      {isFullscreen && (
        <button
          type="button"
          aria-label="Close"
          onClick={handleCloseClick}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1005,
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            pointerEvents: "auto",
          }}
        >
          <FaTimes size={14} />
        </button>
      )}

      {isFullscreen && activeIndustry && (
        <div className={`dfl-fs-caption${showTitle ? " dfl-fs-caption--visible" : ""}`}>
          <div ref={fsSubtitleRef} className="dfl-fs-eyebrow">Industry</div>
          <h2 ref={fsTitleRef} className="dfl-fs-title">{activeIndustry.name}</h2>
          <div className="dfl-fs-rule" />
        </div>
      )}

      <div className={`dfl-scroll-cue${showScrollCue ? " dfl-scroll-cue--visible" : ""}`}>
        <span className="dfl-scroll-cue-text">Scroll Down</span>
        <span className="dfl-scroll-cue-arrow">↓</span>
      </div>

      {false && isTouchDevice}
    </>
  );
}
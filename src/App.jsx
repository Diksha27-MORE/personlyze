import React, { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Routes, Route, useLocation } from "react-router-dom";

import Hero from "./components/Hero";
import Workspace from "./components/Workspace";
import Results from "./components/Results";
import Industries from "./components/Industries";
import CardTransitionSection from "./components/CardTransitionSection";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";

import IndustryLanding from "./pages/IndustryLanding";

import { BookDemoModalProvider } from "./context/BookDemoModalContext";

import "./App.css";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------
// THE ACTUAL FIX for "/ opens already scrolled to Solutions":
//
// On a real browser reload, `history.scrollRestoration` defaults to
// "auto" — the browser restores whatever scrollY you were at on your
// previous visit, and it keeps RE-APPLYING that restore as the page's
// DOM grows underneath it (this app renders sections progressively via
// `heroReady && (...)`, and GSAP adds pin-spacer height even later).
// Setting scrollRestoration = "manual" from inside a useEffect runs too
// late: the browser has already committed its first restore attempt by
// the time any React effect fires. Doing it here, at module-evaluation
// time (before React has even rendered), is the earliest point in our
// code that can run, and it reliably wins the race.
// ---------------------------------------------------------------------
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
if (typeof window !== "undefined" && window.location.hash !== "#solutions") {
  window.scrollTo(0, 0);
}

/* =========================
   HOME PAGE
========================= */
function HomePage() {
  const location = useLocation();
  const containerRef = useRef(null);
  const [heroReady, setHeroReady] = React.useState(false);

  // Purely visual — controls whether #solutions is allowed to be seen.
  // It stays hidden (visibility only, layout/height untouched) for the
  // brief window between the panels mounting and ScrollTrigger settling,
  // which is what caused Solutions to flash on screen right after the
  // Hero intro finished. No scroll math, locks, or observers depend on
  // this flag — it never affects any of the existing scroll behavior.
  const [solutionsVisible, setSolutionsVisible] = React.useState(false);

  const isRestoringScroll = useRef(false);

  useLayoutEffect(() => {
    if (!heroReady) return;

    if (location.hash !== "#solutions") {
      // Explicitly guarantee a normal `/` load (or any non-#solutions
      // hash) starts at the very top of the Hero, rather than silently
      // relying on whatever scroll position the browser happens to be
      // at. Runs synchronously before paint, so there's no visible jump.
      window.scrollTo(0, 0);
      return;
    }

    isRestoringScroll.current = true;

    let rafId = null;
    let attempts = 0;
    let lastOffsetTop = null;
    let stableFrames = 0;

    const MAX_ATTEMPTS = 360;
    const REQUIRED_STABLE_FRAMES = 8;
    const RESTORE_WINDOW_MS = 6000;

    const scrollToSolutions = () => {
      const section = document.getElementById("solutions");
      if (!section) return false;

      window.scrollTo({
        top: section.offsetTop,
        left: 0,
        behavior: "auto",
      });

      return true;
    };

    const attemptScroll = () => {
      attempts += 1;

      const section = document.getElementById("solutions");

      if (section) {
        const currentOffsetTop = section.offsetTop;

        window.scrollTo({
          top: currentOffsetTop,
          left: 0,
          behavior: "auto",
        });

        if (lastOffsetTop === currentOffsetTop) {
          stableFrames += 1;
        } else {
          stableFrames = 0;
          lastOffsetTop = currentOffsetTop;
        }

        if (
          stableFrames >= REQUIRED_STABLE_FRAMES ||
          attempts >= MAX_ATTEMPTS
        ) {
          return;
        }
      } else if (attempts >= MAX_ATTEMPTS) {
        return;
      }

      rafId = requestAnimationFrame(attemptScroll);
    };

    attemptScroll();

    const onLate = () => {
      if (!isRestoringScroll.current) return;
      scrollToSolutions();
    };

    window.addEventListener("load", onLate);

    if (document.fonts && typeof document.fonts.ready?.then === "function") {
      document.fonts.ready.then(onLate).catch(() => {});
    }

    let resizeObserver = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        onLate();
      });

      resizeObserver.observe(document.body);
    }

    const stopLateListeners = setTimeout(() => {
      isRestoringScroll.current = false;
      window.removeEventListener("load", onLate);

      if (resizeObserver) resizeObserver.disconnect();
    }, RESTORE_WINDOW_MS);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);

      clearTimeout(stopLateListeners);

      window.removeEventListener("load", onLate);

      if (resizeObserver) resizeObserver.disconnect();

      isRestoringScroll.current = false;
    };
  }, [location.hash, heroReady]);

  useEffect(() => {
    if (!heroReady) return;
    const sections = gsap.utils.toArray(".panel");

    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleClass: "active",
      })
    );

    // ===================================================================
    // THE ACTUAL FIX — this was the real cause of "intro finishes, then
    // the page jumps to Solutions."
    //
    // The old code called ScrollTrigger.refresh() via requestAnimationFrame
    // the INSTANT heroReady became true — i.e. the instant the Hero intro
    // finished. But that's also the exact instant CardTransitionSection
    // (the pinned/horizontal-scroll .panel.large section) mounts and sets
    // up its OWN GSAP pin for the very first time, before its video/images
    // have loaded and before its true layout height is known. Forcing a
    // global refresh() into that unstable half-second is a well-documented
    // GSAP trigger: once the pin's boundaries resolve moments later, GSAP
    // snaps scroll position to align the pin — which is the jump you saw.
    //
    // The fix: never refresh on an animation frame right after mount.
    // Wait for the window to fully finish loading (video/images/fonts all
    // resolved) before refreshing, same as GSAP's own recommendation. As
    // a hard guarantee, also re-assert scrollY 0 right after that refresh
    // (unless the URL explicitly asked for #solutions), so even if
    // something nudges the scroll during that settling window, it's
    // corrected immediately and invisibly.
    // ===================================================================
    let refreshTimer = null;

    const doRefresh = () => {
      refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        if (window.location.hash !== "#solutions") {
          window.scrollTo(0, 0);
        }
        setSolutionsVisible(true);
      }, 50);
    };

    if (document.readyState === "complete") {
      doRefresh();
    } else {
      window.addEventListener("load", doRefresh, { once: true });
    }

    return () => {
      window.removeEventListener("load", doRefresh);
      if (refreshTimer !== null) clearTimeout(refreshTimer);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [heroReady]);

  /* =========================
     SECTION-LOCKED SCROLL
     Workspace Screen 1 → Workspace Screen 2 (video) → Results → Solutions.
     Only intercepts scroll while inside that zone; everything before
     (Hero) and everything from Testimonials onward (after Solutions),
     keeps native/GSAP-driven scrolling.

     NOTE: this must live inside HomePage (not App), because it looks
     up #workspace-screen-1, #workspace-screen-2, .results-section and
     #solutions, all of which are rendered by HomePage's JSX below. A
     useEffect placed outside any component is an invalid hook call and
     will crash the app (that was the earlier bug).
  ========================= */
  useEffect(() => {
    if (!heroReady) return;
    const LOCK_RESUME_MS = 900;
    let isAnimating = false;
    let unlockTimer = null;
    let touchStartY = null;

    const getSectionTops = () => {
      const screen1 = document.getElementById("workspace-screen-1");
      const screen2 = document.getElementById("workspace-screen-2");
      const results = document.querySelector(".results-section");
      if (!screen1 || !screen2 || !results) return null;

      const topOf = (el) => el.getBoundingClientRect().top + window.scrollY;
      return { tops: [topOf(screen1), topOf(screen2), topOf(results)] };
    };

const isInLockedZone = (tops, direction) => {
  const currentY = window.scrollY;
  const buffer = 2;

  // Down scroll
  if (direction > 0) {
    return currentY >= tops[0] - buffer && currentY < tops[2] - buffer;
  }

  // Up scroll
  // Agar Workspace Screen 1 par hi ho, Hero ko native scroll karne do
  if (currentY <= tops[0] + 10) {
    return false;
  }

  return currentY >= tops[0] - buffer && currentY < tops[2] - buffer;
};

    const goToIndex = (tops, index) => {
      const clamped = Math.max(0, Math.min(index, tops.length - 1));
      isAnimating = true;
      window.scrollTo({ top: tops[clamped], behavior: "smooth" });
      clearTimeout(unlockTimer);
      unlockTimer = setTimeout(() => {
        isAnimating = false;
      }, LOCK_RESUME_MS);
    };

    const navigate = (direction) => {
      const data = getSectionTops();
      if (!data) return;
      const { tops } = data;

      const currentY = window.scrollY;
      let currentIndex = 0;
      let minDist = Infinity;
      tops.forEach((t, i) => {
        const d = Math.abs(currentY - t);
        if (d < minDist) {
          minDist = d;
          currentIndex = i;
        }
      });

      goToIndex(tops, currentIndex + direction);
    };

    const handleWheel = (e) => {
      const data = getSectionTops();
      if (!data || !isInLockedZone(data.tops)) return;

      e.preventDefault();
      if (isAnimating) return;

      navigate(e.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (e) => {
      const data = getSectionTops();
      if (!data || !isInLockedZone(data.tops)) {
        touchStartY = null;
        return;
      }
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (touchStartY === null) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      if (touchStartY === null) return;
      const endY = e.changedTouches[0].clientY;
      const delta = touchStartY - endY;
      touchStartY = null;

      const SWIPE_THRESHOLD = 40;
      if (Math.abs(delta) < SWIPE_THRESHOLD || isAnimating) return;

      navigate(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      clearTimeout(unlockTimer);
    };
  }, [heroReady]);

  /* =========================
     SOLUTIONS SINGLE-STOP LOCK
     Independent from the Workspace→Results lock above, and from
     CardTransitionSection's own pinning/horizontal scroll — this
     effect never intercepts scroll anywhere before Solutions, so
     the "What We Do" section scrolls 100% natively, unmodified.

     Uses IntersectionObserver (not a scroll-position range) to
     detect the exact moment #solutions enters the viewport, from
     either direction. On that crossing it performs a single smooth
     snap to align the section, then briefly blocks wheel/touch
     scrolling (same pattern/duration as the lock above) so the
     section "stops" for one scroll, after which it releases and
     Testimonials/Footer (or Results, on the way back up) scroll
     normally again. The "consumed" flag resets once the section is
     fully left, so the stop re-triggers correctly next time.
  ========================= */
  useEffect(() => {
    if (!heroReady) return;
    const solutions = document.getElementById("solutions");
    if (!solutions) return;

    const LOCK_RESUME_MS = 900;
    let locked = false;
    let hasSnappedForThisEntry = false;
    let unlockTimer = null;

    const snapToSolutions = () => {
      if (locked) return;
      locked = true;
      hasSnappedForThisEntry = true;

      window.scrollTo({
        top: solutions.offsetTop,
        left: 0,
        behavior: "smooth",
      });

      clearTimeout(unlockTimer);
      unlockTimer = setTimeout(() => {
        locked = false;
      }, LOCK_RESUME_MS);
    };

    const handleWheel = (e) => {
      if (!locked) return;
      e.preventDefault();
    };

    const handleTouchMove = (e) => {
      if (!locked) return;
      e.preventDefault();
    };

    // Solutions must NEVER auto-snap on initial load — only when the user
    // actually scrolls there. IntersectionObserver doesn't just fire once
    // on observe(): it fires again any time the intersection state
    // genuinely changes, and that includes changes caused by LAYOUT
    // SETTLING (video/fonts finishing load, GSAP building pin-spacer
    // height for CardTransitionSection), not just user scrolling. That
    // reflow can move #solutions in and out of the "intersecting" zone
    // a moment after mount even while scrollY never changes — which is
    // indistinguishable from a real scroll-into-view to the observer, but
    // isn't one. So instead of trying to guess which callback is "real",
    // we gate snapping on genuine user input: wheel, touch, or keyboard.
    // Until the user has actually driven a scroll themselves, every
    // observer callback is recorded as a baseline only and never snaps.
    let hasUserScrolled = false;
    const SCROLL_KEYS = new Set([
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
      "Spacebar",
    ]);
    const markUserScrolled = () => {
      hasUserScrolled = true;
    };
    const handleKeyDown = (e) => {
      if (SCROLL_KEYS.has(e.key) || e.code === "Space") {
        hasUserScrolled = true;
      }
    };
    window.addEventListener("wheel", markUserScrolled, { passive: true });
    window.addEventListener("touchstart", markUserScrolled, { passive: true });
    window.addEventListener("keydown", handleKeyDown, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!hasUserScrolled) {
            // Not a real scroll — just record where things currently
            // stand and refuse to snap.
            hasSnappedForThisEntry = entry.isIntersecting;
            return;
          }

          if (entry.isIntersecting) {
            if (!hasSnappedForThisEntry) {
              snapToSolutions();
            }
          } else {
            // Fully left the section (either direction) — allow the
            // single-stop snap to re-trigger on the next approach.
            hasSnappedForThisEntry = false;
          }
        });
      },
      { threshold: 0.01 }
    );

    observer.observe(solutions);

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("wheel", markUserScrolled);
      window.removeEventListener("touchstart", markUserScrolled);
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(unlockTimer);
    };
  }, [heroReady]);

  return (
    <div ref={containerRef} className="app">
      <section id="home" className="panel hero">
        <Hero onReveal={() => setHeroReady(true)} />
      </section>

      {/* Everything below the Hero mounts ONLY after the Hero intro/reveal
          finishes. Before that, #solutions & co. simply do not exist in the
          DOM, so they can never flash on first paint and none of the
          scroll/IntersectionObserver logic below can fire against a
          half-laid-out page. */}
      {heroReady && (
      <>
      <section id="who-we-are" className="panel">
        <Workspace />
      </section>

      <section id="why-personlyze" className="panel">
        <Results />
      </section>

      <section id="what-we-do" className="panel large">
        <CardTransitionSection />
      </section>

      <section
        id="solutions"
        className="panel"
        style={{ visibility: solutionsVisible ? "visible" : "hidden" }}
      >
        <Industries />
      </section>

      <section id="testimonials" className="panel">
        <Testimonials />
      </section>
      <section id="faq" className="panel">
        <FAQ />
      </section>

      <section id="contact" className="panel">
        <Footer />
      </section>
      </>
      )}
    </div>
  );
}

/* =========================
   MAIN APP
========================= */
function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";

    const previousScrollRestoration =
      "scrollRestoration" in window.history
        ? window.history.scrollRestoration
        : null;

    if (previousScrollRestoration) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      document.documentElement.style.scrollBehavior = "";

      if (previousScrollRestoration) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, []);

  return (
    <BookDemoModalProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/industry/:slug" element={<IndustryLanding />} />
      </Routes>
    </BookDemoModalProvider>
  );
}

export default App;
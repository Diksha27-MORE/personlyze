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

import IndustryLanding from "./pages/IndustryLanding";

import { BookDemoModalProvider } from "./context/BookDemoModalContext";

import "./App.css";

gsap.registerPlugin(ScrollTrigger);

/* =========================
   HOME PAGE
========================= */
function HomePage() {
  const location = useLocation();
  const containerRef = useRef(null);

  const isRestoringScroll = useRef(false);

  useLayoutEffect(() => {
    if (location.hash !== "#solutions") return;

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
  }, [location.hash]);

  useEffect(() => {
    const sections = gsap.utils.toArray(".panel");

    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleClass: "active",
      })
    );

    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshId);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  /* =========================
     SECTION-LOCKED SCROLL
     Workspace Screen 1 → Workspace Screen 2 (video) → Results.
     Only intercepts scroll while inside that zone; everything before
     (Hero) and everything from Results onward (its pinned carousel,
     and the rest of the page) keeps native/GSAP-driven scrolling.

     NOTE: this must live inside HomePage (not App), because it looks
     up #workspace-screen-1, #workspace-screen-2 and .results-section,
     all of which are rendered by HomePage's JSX below. A useEffect
     placed outside any component is an invalid hook call and will
     crash the app (that was the earlier bug).
  ========================= */
  useEffect(() => {
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

    const isInLockedZone = (tops) => {
      const currentY = window.scrollY;
      const buffer = 2;
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
  }, []);

  return (
    <div ref={containerRef} className="app">
      <section id="home" className="panel hero">
        <Hero />
      </section>

      <section id="who-we-are" className="panel">
        <Workspace />
      </section>

      <section id="why-personlyze" className="panel">
        <Results />
      </section>

      <section id="what-we-do" className="panel large">
        <CardTransitionSection />
      </section>

      <section id="solutions" className="panel">
        <Industries />
      </section>

      <section id="testimonials" className="panel">
        <Testimonials />
      </section>

      <section id="contact" className="panel">
        <Footer />
      </section>
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
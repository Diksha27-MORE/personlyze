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

import "./App.css";

gsap.registerPlugin(ScrollTrigger);

/* =========================
   HOME PAGE
========================= */
function HomePage() {
  const location = useLocation();
  const containerRef = useRef(null);

  // Guards against duplicate/overlapping restoration attempts
  const isRestoringScroll = useRef(false);

  /*
    Restore scroll position to #solutions BEFORE the browser paints.

    PRODUCTION BUG THIS FIXES:
    In dev, all JS chunks, images, videos and fonts are already in memory,
    so on the very first frame after HomePage mounts, `#solutions.offsetTop`
    is already its final value — the old "stable across 2 frames" check
    exits immediately with the correct offset.

    In a deployed build, sections above #solutions (Hero video, Workspace,
    Results, CardTransitionSection) load their assets asynchronously. On the
    first frame after mount, `#solutions` exists but its `offsetTop` is
    computed against panels that haven't reached their final height yet.
    Two consecutive frames can easily read the same (wrong, small) value
    before anything loads, the old code marked that "stable", scrolled to a
    position near the top of the document, and exited. Moments later the
    hero video/images/fonts finished loading, every panel above grew, the
    page reflowed downward, and the scroll position you set now visually
    corresponds to the Hero section. That's the "Back sends me to Hero" bug.

    Fix:
      1. Require offsetTop to be stable across several consecutive frames,
         not just two, so a momentary plateau during asset load can't end
         the loop early.
      2. Also re-scroll whenever late signals fire during the restoration
         window: `window` `load`, `document.fonts.ready`, and any body
         resize picked up by ResizeObserver. This catches hero videos,
         late images, and font swaps that arrive after the RAF loop ends.
      3. Extend the max duration to cover realistic production asset load.

    No visual/animation/design changes — still pre-paint, still instant
    ("auto"), still no opacity toggling or black flash.
  */
  useLayoutEffect(() => {
    if (location.hash !== "#solutions") return;

    isRestoringScroll.current = true;

    let rafId = null;
    let attempts = 0;
    let lastOffsetTop = null;
    let stableFrames = 0;

    const MAX_ATTEMPTS = 360;          // ~6s ceiling at 60fps
    const REQUIRED_STABLE_FRAMES = 8;  // must hold steady this many frames
    const RESTORE_WINDOW_MS = 6000;    // late-signal listeners live this long

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

        // Always keep the viewport pinned to the current best-known offset,
        // so any reflow that happens mid-loop is immediately corrected.
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

        if (stableFrames >= REQUIRED_STABLE_FRAMES || attempts >= MAX_ATTEMPTS) {
          // Poll is done — but late listeners below keep correcting for a
          // little longer in case a video/font/image lands after this.
          return;
        }
      } else if (attempts >= MAX_ATTEMPTS) {
        return;
      }

      rafId = requestAnimationFrame(attemptScroll);
    };

    // Runs synchronously before paint — kills the flash.
    attemptScroll();

    // Late signals: re-pin scroll when assets that affect layout above
    // #solutions finally arrive. Bounded by RESTORE_WINDOW_MS so we don't
    // fight the user if they scroll away.
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

  /*
    GSAP ScrollTrigger
  */
  useEffect(() => {
    const sections = gsap.utils.toArray(".panel");

    const triggers = sections.map((section) => {
      return ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleClass: "active",
      });
    });

    // Defer refresh one tick so it accounts for the scroll position
    // we just restored, instead of racing it.
    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshId);
      triggers.forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="app">
      <section id="hero" className="panel hero">
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

    // Stop the browser from applying its own native scroll
    // restoration on navigation — it races our useLayoutEffect
    // restoration and is a common source of an extra flash frame.
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
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/industry/:slug" element={<IndustryLanding />} />
    </Routes>
  );
}

export default App;

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
    No opacity toggling, no hidden state, no black flash — the page
    stays mounted and visible the entire time. We just make sure the
    very first paint after navigation already lands in the right place.

    PRODUCTION FIX:
    In dev, all modules/assets are already in memory, so the target
    section is present and laid out within a single animation frame.
    In a deployed build, JS chunks, web fonts, and images can still be
    loading when this effect first runs, so `#solutions` may not exist
    yet (or may not have its final offsetTop) on the very next frame.
    A single requestAnimationFrame retry isn't reliably enough time in
    that case, so the scroll silently no-ops and the user is left on
    the Hero section — i.e. it looks like "Back to Industries" sent
    them to Home instead of Industries.

    Fix: poll with requestAnimationFrame until the element exists AND
    its offsetTop has stabilized across two consecutive frames (i.e.
    layout has settled), then scroll. Bounded by a max attempt count
    so it can't loop forever if something is truly missing.
  */
  useLayoutEffect(() => {

    if (location.hash !== "#solutions") return;

    isRestoringScroll.current = true;

    let rafId = null;
    let attempts = 0;
    let lastOffsetTop = null;

    const MAX_ATTEMPTS = 90; // ~1.5s at 60fps ceiling, plenty for chunk/font load

    const attemptScroll = () => {

      attempts += 1;

      const section = document.getElementById("solutions");

      if (section) {

        const currentOffsetTop = section.offsetTop;
        const stable = lastOffsetTop === currentOffsetTop;

        // "auto" = instant, no animation, no flash
        window.scrollTo({
          top: currentOffsetTop,
          left: 0,
          behavior: "auto",
        });

        if (stable || attempts >= MAX_ATTEMPTS) {
          isRestoringScroll.current = false;
          return;
        }

        lastOffsetTop = currentOffsetTop;

      } else if (attempts >= MAX_ATTEMPTS) {
        // Gave up — element genuinely never appeared.
        isRestoringScroll.current = false;
        return;
      }

      rafId = requestAnimationFrame(attemptScroll);

    };

    // Runs synchronously, before the browser paints this commit.
    // This is what actually kills the flash — by the time the user
    // sees anything, we're already scrolled to the right spot (or as
    // close as we can get before the polling loop settles).
    attemptScroll();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      isRestoringScroll.current = false;
    };

  }, [location.hash]);



  /*
    GSAP ScrollTrigger
  */
  useEffect(() => {

    const sections = gsap.utils.toArray(".panel");


    const triggers = sections.map((section)=>{

      return ScrollTrigger.create({

        trigger: section,

        start:"top 80%",

        end:"bottom 20%",

        toggleClass:"active",

      });

    });


    // Defer refresh one tick so it accounts for the scroll position
    // we just restored, instead of racing it.
    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });


    return ()=>{

      cancelAnimationFrame(refreshId);

      triggers.forEach((trigger)=>{
        trigger.kill();
      });

    };


  },[]);



  return (

    <div
      ref={containerRef}
      className="app"
    >


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



      <section id="contact" className="panel">
        <Footer />
      </section>


    </div>

  );

}



/* =========================
   MAIN APP
========================= */

function App(){

  useEffect(()=>{

    document.documentElement.style.scrollBehavior="auto";

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


    return ()=>{

      document.documentElement.style.scrollBehavior="";

      if (previousScrollRestoration) {
        window.history.scrollRestoration = previousScrollRestoration;
      }

    };


  },[]);



  return (

    <Routes>


      <Route
        path="/"
        element={<HomePage />}
      />


      <Route
        path="/industry/:slug"
        element={<IndustryLanding />}
      />


    </Routes>

  );

}


export default App;
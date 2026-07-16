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
  */
  useLayoutEffect(() => {

    if (location.hash !== "#solutions") return;

    isRestoringScroll.current = true;

    const scrollToSolutions = () => {

      const section = document.getElementById("solutions");

      if (section) {
        // "auto" = instant, no animation, no flash
        window.scrollTo({
          top: section.offsetTop,
          left: 0,
          behavior: "auto",
        });
      }

    };

    // Runs synchronously, before the browser paints this commit.
    // This is what actually kills the flash — by the time the user
    // sees anything, we're already scrolled to the right spot.
    scrollToSolutions();

    // Safety net: if fonts/images haven't finished laying out yet,
    // offsetTop can be slightly off. Re-check on the next frame.
    // Because the page is already visible and roughly in the right
    // place, any correction here is a tiny nudge, not a blank flash.
    const rafId = requestAnimationFrame(() => {
      scrollToSolutions();
      isRestoringScroll.current = false;
    });

    return () => {
      cancelAnimationFrame(rafId);
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
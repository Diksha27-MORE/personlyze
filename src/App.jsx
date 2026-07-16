import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Routes, Route } from "react-router-dom";

import Hero from "./components/Hero";
import Workspace from "./components/Workspace";
import Results from "./components/Results";
import Industries from "./components/Industries";
import CardTransitionSection from "./components/CardTransitionSection";
import Footer from "./components/Footer"; 

// NEW IMPORT
import IndustryLanding from "./pages/IndustryLanding";

import "./App.css";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef(null);

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

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Routes>
      {/* HOME PAGE */}
      <Route
        path="/"
        element={
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

  <section id="contact" className="panel">
    <Footer />
  </section>
</div>
        }
      />

      {/* INDUSTRY LANDING PAGE */}
      <Route
        path="/industry/:slug"
        element={<IndustryLanding />}
      />
    </Routes>
  );
}

export default App;
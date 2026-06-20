import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Routes, Route } from "react-router-dom";

import Hero from "./components/Hero";
import Workspace from "./components/Workspace";
import Results from "./components/Results";
import Industries from "./components/Industries";
import CardTransitionSection from "./components/CardTransitionSection";
import IndustryVideoPage from "./components/IndustryVideoPage";

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
            <section className="panel hero">
              <Hero />
            </section>

            <section className="panel">
              <Workspace />
            </section>

            <section className="panel">
              <Results />
            </section>

            <section className="panel large">
              <CardTransitionSection />
            </section>

            <section className="panel">
              <Industries />
            </section>
          </div>
        }
      />

      {/* INDUSTRY PAGE */}
      <Route path="/industry" element={<IndustryVideoPage />} />
    </Routes>
  );
}

export default App;
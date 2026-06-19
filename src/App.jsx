import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import Hero from "./components/Hero";
import Workspace from "./components/Workspace";
import Results from "./components/Results";
import Industries from "./components/Industries";
import CardTransitionSection from "./components/CardTransitionSection";

import "./App.css";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const sections = gsap.utils.toArray(".panel");

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleClass: "active",
        // markers: true, // enable for debugging
      });
    });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
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
  );
}

export default App;
import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Industries from "./components/Industries";
import Workspace from "./components/Workspace"; 
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="app">
      <Hero />
      <Workspace />
      <Stats />
      <Industries />
    </div>
  );
}

export default App;
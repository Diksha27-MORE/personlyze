import { useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimations() {

  useLayoutEffect(() => {

    const mm = gsap.matchMedia();

    // GLOBAL PERFORMANCE SETTINGS
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });

    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });

    // =========================
    // DESKTOP SYSTEM (UNCHANGED)
    // =========================
    mm.add("(min-width: 769px)", () => {

      const sections = gsap.utils.toArray(".panel");

      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          toggleClass: "active"
        });
      });

    });

    // =========================
    // MOBILE SYSTEM (LIGHTWEIGHT)
    // =========================
    mm.add("(max-width: 768px)", () => {

      const sections = gsap.utils.toArray(".panel");

      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 95%",
          toggleClass: "active",
          fastScrollEnd: true
        });
      });

      // 🔥 kill scroll lag
      gsap.ticker.lagSmoothing(0);

      // 🔥 reduce recalculations
      ScrollTrigger.config({
        ignoreMobileResize: true,
        limitCallbacks: true
      });

      // 🔥 optional: reduce animation stress
      gsap.globalTimeline.timeScale(1.1);

    });

    return () => mm.revert();

  }, []);
}
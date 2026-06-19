import { useEffect } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimations() {
  useEffect(() => {

    // 🧠 Smooth baseline setup
    gsap.config({
      force3D: true,
    });

    ScrollTrigger.config({
      limitCallbacks: true,
    });

    const mm = ScrollTrigger.matchMedia({

      // 💻 DESKTOP
      "(min-width: 769px)": () => {
        const sections = gsap.utils.toArray(".panel");

        sections.forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 85%",
            toggleClass: "active",
          });
        });
      },

      // 📱 MOBILE
      "(max-width: 768px)": () => {
        const sections = gsap.utils.toArray(".panel");

        sections.forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 90%",
            toggleClass: "active",
          });
        });
      }

    });

    return () => mm.revert();
  }, []);
}
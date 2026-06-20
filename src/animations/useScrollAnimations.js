import { useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimations() {
  useLayoutEffect(() => {

    const ctx = gsap.context(() => {

      const mm = gsap.matchMedia();

      // 💻 DESKTOP
      mm.add("(min-width: 769px)", () => {
        gsap.utils.toArray(".panel").forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            toggleClass: "active",
          });
        });
      });

      // 📱 MOBILE
      mm.add("(max-width: 768px)", () => {
        gsap.utils.toArray(".panel").forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 95%",
            toggleClass: "active",
          });
        });
      });

      return () => mm.revert();

    });

    return () => ctx.revert();
  }, []);
}
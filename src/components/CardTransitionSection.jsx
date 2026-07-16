import { useState, useEffect } from "react";
import DesktopCardTransitionSection from "./DesktopCardTransitionSection";
import MobileCardTransitionSection from "./MobileCardTransitionSection";

export default function CardTransitionSection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile
    ? <MobileCardTransitionSection />
    : <DesktopCardTransitionSection />;
}
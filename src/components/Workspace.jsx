import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Workspace.css";
import workspaceImg from "../assets/workspace.png";
import workspaceMobileImg from "../assets/workspace-mobile.jpg";

gsap.registerPlugin(ScrollTrigger);

const YOUTUBE_ID = "qPMJL64Qvq0";

export default function Workspace() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const videoRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ── GSAP entrance + word-by-word scroll reveal ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headingRef.current.querySelectorAll(".reveal-word");
      const aiSpans = headingRef.current.querySelectorAll(".workspace-ai");

      // Initial state: solid light grey. No blur, no opacity change — the
      // ONLY property that ever animates is color. .ai starts grey too —
      // it gets its own red tween below, timed to match the last word.
      gsap.set(words, {
        color: "#CFCFCF",
        willChange: "color",
      });
      gsap.set(aiSpans, {
        color: "#CFCFCF",
        willChange: "color",
      });

      // Video keeps its own simple fade/scale-in, separate from the text.
      gsap.fromTo(
        videoRef.current,
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "top 55%",
            scrub: 1,
          },
        }
      );

      // Word-by-word, color-only reveal, driven by scroll position.
      // Each word gets an equal slice of the scroll range, with a slight
      // overlap between slices so one color settles just as the next begins.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 15%",
          scrub: 1,
        },
      });

      words.forEach((word, i) => {
        tl.to(
          word,
          {
            color: "#111111",
            duration: 1,
            ease: "none", // linear: color tracks scroll 1:1, no "settling" feel
          },
          i === 0 ? 0 : "-=0.25"
        );

        // .ai gets its own tween — grey to RED, not black — running on the
        // exact same timeline slice ("<") as its parent word, so it follows
        // identical scroll progress/timing, just resolving to a different color.
        const aiSpan = word.querySelector(".workspace-ai");
        if (aiSpan) {
          tl.to(
            aiSpan,
            {
              color: "#d10000",
              duration: 1,
              ease: "none",
            },
            "<"
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Close modal on Escape ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <section className="workspace-section" ref={sectionRef}>
        <div
          className="workspace-video"
          ref={videoRef}
          onClick={() => setModalOpen(true)}
          role="button"
          aria-label="Play platform walkthrough video"
        >
          {/* Heading now lives inside the video frame, layered on top of
              the footage — matches the reference composition instead of
              sitting above the video as a separate block. */}
          <section className="workspace-title">
            <h1 className="workspace-heading" ref={headingRef}>
              <span className="reveal-word">what</span>
              <span className="heading-space"> </span>
              <span className="reveal-word">is</span>
              <span className="heading-space"> </span>
              <span className="reveal-word reveal-last">
                <span className="workspace-brand">personlyze</span>
                <span className="workspace-ai">.ai</span>?
              </span>
            </h1>
          </section>
<picture>
  <source
    media="(max-width: 640px)"
    srcSet={workspaceMobileImg}
  />

  <img
    src={workspaceImg}
    alt="Workspace"
    className="workspace-video-media"
  />
</picture>

          <button
            className="play-btn"
            aria-label="Play video"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
          >
            <svg viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
        </div>
      </section>

      {modalOpen && (
        <div
          className="video-modal-overlay"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="video-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-modal-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close video"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`}
              title="Personlyze Platform Demo"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
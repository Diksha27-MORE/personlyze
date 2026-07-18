import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Workspace.css";
import workspaceImg from "../assets/workspace.png";
import workspaceMobileImg from "../assets/workspace-mobile.png";

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
        {/* Editorial headline — its own section, in normal flow, above the
            video. No card, no overlay, no positioning relative to the
            footage below. Word-level markup (.reveal-word) and reading
            order are unchanged from the original; only grouped into a
            primary statement + a right-aligned supporting column. */}
        <section className="workspace-title">
          <div className="workspace-heading" ref={headingRef}>
            <p className="heading-statement">
              <span className="reveal-word">We</span>{" "}
              <span className="reveal-word">are</span>{" "}
              <span className="reveal-word">your</span>{" "}
              <span className="reveal-word">strategy-first,</span>{" "}
              <span className="reveal-word">AI-powered,</span>{" "}
              <span className="reveal-word">personalization</span>{" "}
              <span className="reveal-word">partner.</span>
            </p>

            <p className="heading-support">
              <span className="reveal-word">We</span>{" "}
              <span className="reveal-word">build</span>{" "}
              <span className="reveal-word">and</span>{" "}
              <span className="reveal-word">scale</span>{" "}
              <span className="reveal-word">marketing,</span>{" "}
              <span className="reveal-word">communication</span>{" "}
              <span className="reveal-word">and</span>{" "}
              <span className="reveal-word">content</span>{" "}
              <span className="reveal-word">for</span>{" "}
              <span className="reveal-word">businesses</span>{" "}
              <span className="reveal-word">and</span>{" "}
              <span className="reveal-word">brands</span>{" "}
              <span className="reveal-word">around</span>{" "}
              <span className="reveal-word">the</span>{" "}
              <span className="reveal-word">world.</span>{" "}
              <span className="reveal-word">From</span>{" "}
              <span className="reveal-word">customer</span>{" "}
              <span className="reveal-word">strategy</span>{" "}
              <span className="reveal-word">to</span>{" "}
              <span className="reveal-word">production</span>{" "}
              <span className="reveal-word">to</span>{" "}
              <span className="reveal-word">deployment—</span>{" "}
              <span className="reveal-word">we</span>{" "}
              <span className="reveal-word">run</span>{" "}
              <span className="reveal-word">the</span>{" "}
              <span className="reveal-word">entire</span>{" "}
              <span className="reveal-word">process</span>{" "}
              <span className="reveal-word">end-to-end.</span>
            </p>
          </div>
        </section>

        {/* Video — untouched: same wrapper, same children, same classes. */}
        <div
          className="workspace-video"
          ref={videoRef}
          onClick={() => setModalOpen(true)}
          role="button"
          aria-label="Play platform walkthrough video"
        >
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
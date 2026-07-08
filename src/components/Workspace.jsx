import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Workspace.css";
import workspaceImg from "../assets/workspace.png";

gsap.registerPlugin(ScrollTrigger);

const YOUTUBE_ID = "qPMJL64Qvq0";

export default function Workspace() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const videoRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.to(videoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.0,
        ease: "power3.out",
      }).to(
        headingRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.6"
      );
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
    what is&nbsp;
    <span className="workspace-brand">personlyze</span>
    <span className="workspace-ai">.ai</span>?
  </h1>
</section>
          <img
            src={workspaceImg}
            alt="Workspace"
            className="workspace-video-media"
          />

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
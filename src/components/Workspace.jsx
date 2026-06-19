import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Workspace.css";
import workspaceImg from "../assets/workspace.png";

gsap.registerPlugin(ScrollTrigger);

// Replace with your actual YouTube video ID
const YOUTUBE_ID ="qPMJL64Qvq0";

export default function Workspace() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctasRef = useRef(null);
  const cardRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ── GSAP scroll-triggered entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
      })
        .to(
          subtitleRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .to(
          ctasRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5"
        )
        .to(
          cardRef.current,
          { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
          "-=0.4"
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
        {/* Heading */}
        <h1 className="workspace-heading" ref={headingRef}>
          Welcome to Personlyze.ai{" "}
          <span className="emoji" role="img" aria-label="wave">
            
          </span>
        </h1>

        {/* Subtitle */}
        <p className="workspace-subtitle" ref={subtitleRef}>
          A new kind of growth engine — where AI doesn't just optimise, it
          understands. Tailored for ambitious brands, built for the post-cookie
          internet.
        </p>

        {/* CTA buttons */}
        <div className="workspace-ctas" ref={ctasRef}>
          <button className="ws-btn ws-btn-ghost">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            AI Personalization
          </button>

          <button className="ws-btn ws-btn-ghost" onClick={() => setModalOpen(true)}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Watch Demo
          </button>

          <button className="ws-btn ws-btn-beta">
            Explore Platform
            <span className="beta-tag">BETA</span>
          </button>
        </div>

        {/* Video card */}
        <div
          className="workspace-video-card"
          ref={cardRef}
          onClick={() => setModalOpen(true)}
          role="button"
          aria-label="Play platform walkthrough video"
        >
                 <img
                     src={workspaceImg}
                       alt="Workspace"
                           className="video-card-image"
                             />

          <span className="video-card-label">
            Personlyze · Platform Walkthrough
          </span>
          <span className="video-card-duration">02:14</span>

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

          <div className="video-card-footer">
            <p className="video-card-footer-title">
              See Personlyze<span>.ai</span> in action.
            </p>
            <span className="video-card-watch">
              Watch Full Demo &nbsp;→
            </span>
          </div>
        </div>
      </section>

      {/* Video modal */}
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
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Workspace.css";
import workspaceImg from "../assets/workspace.png";
import workspaceMobileImg from "../assets/workspace-mobile.jpeg";

gsap.registerPlugin(ScrollTrigger);

const YOUTUBE_ID = "qPMJL64Qvq0";
const MOBILE_MP4_SRC =
  "https://res.cloudinary.com/t4s8m2hn/video/upload/v1784788885/Personlyze_AI_-_Intro_9_16_1_ndznph.mp4";
const MOBILE_BREAKPOINT = "(max-width: 640px)";
const PHASE2_DELAY_MS = 5000; // cover image is shown for this long, no video exists yet

export default function Workspace() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const videoRef = useRef(null); // outer container — GSAP fade target (shared by desktop + mobile)
  const mp4Ref = useRef(null); // mobile inline <video> element
  const phaseTimerRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);

  /* ── Mobile-only state ──────────────────────────────────────────
     ONE state drives everything: `phase`.
       'cover' → only the cover image + play button exist. No <video>
                 tag anywhere in the DOM. This is the initial value,
                 always, on every mount.
       'video' → the <video> tag is mounted for the first time here,
                 plays, and the controls (mute / watch on YouTube)
                 appear. The play button is gone.

     `coverVisible` exists only to let the cover image crossfade out
     instead of popping off. It is flipped to false by a CSS
     `transitionend` event on the cover element itself — not by a
     second timer — so there is exactly one timer in this whole
     component: the 5s delay below. ────────────────────────────── */
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_BREAKPOINT).matches
  );
  const [phase, setPhase] = useState("cover");
  const [coverVisible, setCoverVisible] = useState(true);
  const [muted, setMuted] = useState(true);

  /* ── GSAP entrance + word-by-word scroll reveal (unchanged) ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headingRef.current.querySelectorAll(".reveal-word");
      const aiSpans = headingRef.current.querySelectorAll(".workspace-ai");

      gsap.set(words, {
        color: "#CFCFCF",
        willChange: "color",
      });
      gsap.set(aiSpans, {
        color: "#CFCFCF",
        willChange: "color",
      });

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
            ease: "none",
          },
          i === 0 ? 0 : "-=0.25"
        );

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

  /* ── Close modal on Escape (unchanged) ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Track mobile breakpoint ── */
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT);
    const handler = (e) => setIsMobile(e.matches);
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, []);

  /* ── The ONLY timer in this component.
     ROOT CAUSE FIX: the countdown must NOT start on component mount.
     This component (like the rest of the page) mounts immediately,
     often while an intro/splash animation is still covering the screen
     or before the user has scrolled this section into view — so a
     mount-based timer was silently burning down before anyone ever saw
     the cover image.

     Instead, an IntersectionObserver watches the actual video stage
     element. The 5s (or whatever PHASE2_DELAY_MS is set to) countdown
     starts only the first time that element is genuinely visible in
     the viewport — i.e. only once the user can actually see the cover
     image and Play button. It is one-shot (the observer disconnects
     after firing) so scrolling away and back doesn't restart it. ── */
  useEffect(() => {
    if (!isMobile) return undefined;

    setPhase("cover");
    setCoverVisible(true);
    clearTimeout(phaseTimerRef.current);

    const node = videoRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      // Fallback for environments without IntersectionObserver support:
      // start immediately rather than never starting at all.
      phaseTimerRef.current = setTimeout(() => setPhase("video"), PHASE2_DELAY_MS);
      return () => clearTimeout(phaseTimerRef.current);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          phaseTimerRef.current = setTimeout(() => {
            setPhase("video");
          }, PHASE2_DELAY_MS);
          observer.disconnect(); // one-shot: only ever starts the countdown once
        }
      },
      { threshold: 0.5 } // require the stage to be meaningfully on-screen, not just a sliver
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      clearTimeout(phaseTimerRef.current);
    };
  }, [isMobile]);

  /* ── Once phase flips to 'video', the <video> element mounts for the
     first time on this render. Play it explicitly (muted autoplay is
     allowed by browsers). No timer involved. ── */
  useEffect(() => {
    if (phase !== "video" || !mp4Ref.current) return;
    const playPromise = mp4Ref.current.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        /* autoplay blocked — video stays paused until user interacts */
      });
    }
  }, [phase]);

  /* ── Keep the <video> element's muted property in sync with state ── */
  useEffect(() => {
    if (mp4Ref.current) {
      mp4Ref.current.muted = muted;
    }
  }, [muted]);

  /* ── Pause inline video while the YouTube modal is open, resume after ── */
  useEffect(() => {
    if (phase !== "video" || !mp4Ref.current) return;
    if (modalOpen) {
      mp4Ref.current.pause();
    } else {
      const playPromise = mp4Ref.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    }
  }, [modalOpen, phase]);

  // Event-driven cover removal — fires when the cover's own opacity
  // transition finishes, replacing what used to be a second timer.
  const handleCoverTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== "opacity") return;
    if (phase === "video") setCoverVisible(false);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setMuted((m) => !m);
  };

  const openModal = (e) => {
    if (e) e.stopPropagation();
    setModalOpen(true);
  };

  return (
    <>
      <section className="workspace-section" ref={sectionRef}>
        {/* Editorial headline — unchanged */}
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

        {isMobile ? (
          /* ══════════════════ MOBILE-ONLY EXPERIENCE ══════════════════
             phase === 'cover' → only image + play button, no <video> in
             the DOM at all.
             phase === 'video' → <video> mounts for the first time, plays,
             controls appear, play button is gone. ═══════════════════ */
          <div className="workspace-video mobile-video-stage" ref={videoRef}>
            {coverVisible && (
              <div
                className={`mobile-cover-wrap${
                  phase === "video" ? " is-fading-out" : ""
                }`}
                onClick={openModal}
                onTransitionEnd={handleCoverTransitionEnd}
                role="button"
                aria-label="Play platform walkthrough video"
              >
                <img
                  src={workspaceMobileImg}
                  alt="Workspace"
                  className="workspace-video-media"
                />

                {phase !== "video" && (
                  <button
                    className="play-btn"
                    aria-label="Play video"
                    onClick={openModal}
                  >
                    <svg viewBox="0 0 24 24">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {phase === "video" && (
              <div className="mobile-inline-video-wrap">
                <video
                  ref={mp4Ref}
                  className="mobile-inline-video"
                  src={MOBILE_MP4_SRC}
                  muted
                  playsInline
                  preload="auto"
                  loop
                  autoPlay
                />

                <div className="mobile-video-controls">
                  <button
                    type="button"
                    className="glass-btn mute-btn"
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute video" : "Mute video"}
                    aria-pressed={!muted}
                  >
                    <span className="mute-btn-icon" aria-hidden="true">
                      {muted ? "🔇" : "🔊"}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="glass-pill youtube-btn"
                    onClick={openModal}
                  >
                    <span aria-hidden="true">▶</span> Watch on YouTube
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ══════════════════ DESKTOP — untouched ══════════════════ */
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
        )}
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
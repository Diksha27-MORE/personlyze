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

export default function Workspace() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const videoRef = useRef(null); // outer container — GSAP fade target + IntersectionObserver target (mobile)
  const mp4Ref = useRef(null); // mobile inline <video> element

  const [modalOpen, setModalOpen] = useState(false);

  /* ── Mobile-only state ──────────────────────────────────────────
     Screen 3 (video) is now fully manual:
       isPlaying === false → poster/cover image + centered transparent
                              play button are shown, video is paused.
       isPlaying === true  → cover fades out, video plays (with sound,
                              since playback is always a direct result
                              of a user tap).
     There is no auto-play and no timer anywhere in this component
     anymore — the user is always the one who starts playback. ── */
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_BREAKPOINT).matches
  );
  const [isPlaying, setIsPlaying] = useState(false);

  /* ── GSAP entrance + word-by-word scroll reveal (unchanged) ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headingRef.current?.querySelectorAll(".reveal-word") ?? [];
      const aiSpans = headingRef.current?.querySelectorAll(".workspace-ai") ?? [];

      if (words.length) {
        gsap.set(words, {
          color: "#CFCFCF",
          willChange: "color",
        });
      }

      if (aiSpans.length) {
        gsap.set(aiSpans, {
          color: "#CFCFCF",
          willChange: "color",
        });
      }

      if (videoRef.current && sectionRef.current) {
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
      }

      if (sectionRef.current) {
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
      }
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

  /* ── Auto-pause the mobile video whenever it scrolls (mostly) out
     of view. This is NOT one-shot: it re-checks every time visibility
     changes, so leaving and returning to the video always re-applies
     the rule. It only ever pauses — resuming is always a manual tap,
     per spec ("if the user scrolls back, keep the video paused until
     the user presses Play again"). ── */
  useEffect(() => {
    if (!isMobile) return undefined;

    const node = videoRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) {
          setIsPlaying((wasPlaying) => {
            if (wasPlaying && mp4Ref.current) {
              mp4Ref.current.pause();
            }
            return false;
          });
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isMobile]);

  /* ── Pause inline video while the YouTube modal is open. Resuming
     afterwards is left to the user (tap Play again) — consistent
     with the "always a deliberate tap" rule above. ── */
  useEffect(() => {
    if (!isMobile || !mp4Ref.current) return;
    if (modalOpen && isPlaying) {
      mp4Ref.current.pause();
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, isMobile]);

  /* ── When the clip finishes naturally, reset to the poster/cover
     state instead of holding on the last frame. ── */
  useEffect(() => {
    const el = mp4Ref.current;
    if (!isMobile || !el) return undefined;

    const onEnded = () => {
      setIsPlaying(false);
      el.currentTime = 0;
    };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, [isMobile]);

  /* ── Direct, gesture-synchronous play/pause toggle. Calling
     play()/pause() straight from the click handler (rather than from
     an effect) keeps this reliably tied to the user's tap, including
     for unmuted playback. ── */
  const toggleMobilePlayback = (e) => {
    if (e) e.stopPropagation();
    const el = mp4Ref.current;
    if (!el) return;

    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => setIsPlaying(false));
      }
      setIsPlaying(true);
    }
  };

  const openModal = (e) => {
    if (e) e.stopPropagation();
    setModalOpen(true);
  };

  /* ── Book a Demo → same WhatsApp deep link used site-wide (Hero /
     Footer), so the action is identical everywhere. ── */
  const handleBookDemo = () => {
    const phone = "919819104471";
    const message = encodeURIComponent(
      `Hi, I'd like to book a demo of Personlyze AI for my business.
Details below.
Name:
Company:
Website:
Email:`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <>
      <section className="workspace-section" ref={sectionRef}>
        {/* ══════════════════ Screen 2 — "Who We Are" ══════════════════
            Desktop: identical to before — an editorial headline in
            normal flow, no card, no button.
            Mobile: the same headline content, but wrapped so it fills
            almost the entire viewport as a standalone screen, with a
            Book a Demo button pinned to the bottom of that screen.
            Screen 3 simply sits in normal flow right after it, so it
            only comes into view once the user scrolls past this
            full-height screen — no extra JS needed for that part.

            id="workspace-screen-1" — anchor used by the section-locked
            wheel/touch scroll controller in App.jsx. ── */}
        <section
          id="workspace-screen-1"
          className={`workspace-title${isMobile ? " mobile-whoweare-card" : ""}`}
        >
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

          {isMobile && (
            <button
              type="button"
              className="mobile-book-demo-btn"
              onClick={handleBookDemo}
            >
              Book a Demo
            </button>
          )}
        </section>

        {isMobile ? (
          /* ══════════════════ Screen 3 — MOBILE VIDEO ══════════════════
             Full-viewport stage. Poster/cover shows until the user taps
             Play. Tapping anywhere on the stage (or the play/pause
             button itself) toggles playback. Scrolling the stage out of
             view auto-pauses it; resuming is always a manual tap.

             id="workspace-screen-2" — anchor used by the section-locked
             wheel/touch scroll controller in App.jsx. ─── */
          <div
            id="workspace-screen-2"
            className="workspace-video mobile-video-stage"
            ref={videoRef}
            onClick={toggleMobilePlayback}
            role="button"
            aria-label={isPlaying ? "Pause video" : "Play platform walkthrough video"}
          >
            <div
              className={`mobile-cover-wrap${isPlaying ? " is-fading-out" : ""}`}
              aria-hidden={isPlaying}
            >
              <img
                src={workspaceMobileImg}
                alt="Workspace"
                className="workspace-video-media"
              />
            </div>

            <video
              ref={mp4Ref}
              className="mobile-inline-video"
              src={MOBILE_MP4_SRC}
              playsInline
              preload="metadata"
            />

            <button
              type="button"
              className="mobile-playpause-btn"
              onClick={toggleMobilePlayback}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <polygon points="6,4 20,12 6,20" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="glass-pill youtube-btn mobile-youtube-btn"
              onClick={openModal}
            >
              <svg viewBox="0 0 28 20" className="youtube-icon" aria-hidden="true">
                <rect x="0" y="0" width="28" height="20" rx="6" fill="#FF0000" />
                <polygon points="11,6 20,10 11,14" fill="#fff" />
              </svg>
              Watch on YouTube
            </button>
          </div>
        ) : (
          /* ══════════════════ DESKTOP — untouched (only id added) ══════════════════

             id="workspace-screen-2" — anchor used by the section-locked
             wheel/touch scroll controller in App.jsx. ── */
          <div
            id="workspace-screen-2"
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
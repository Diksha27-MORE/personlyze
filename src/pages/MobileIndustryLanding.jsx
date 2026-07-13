import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import "./IndustryLanding.css";

/* --------------------------------------------------------------------------
 * Card photos (desktop) — unchanged
 * -------------------------------------------------------------------------- */
const cardPhotos = {
  ...import.meta.glob("../card-photos/*.jpg", { eager: true, import: "default" }),
  ...import.meta.glob("../card-photos/*.png", { eager: true, import: "default" }),
};
const IMAGE_PREFIX_BY_SLUG = {
  "real-estate": "real",
  bfsi: "bfsi",
  travel: "travel",
  health: "health",
  retail: "retail",
  automotive: "automotive",
  saas: "saas",
  b2b: "saas",
  tech: "tech",
  fashion: "fashion",
};
function getCardImage(slug, cardNumber) {
  const prefix = IMAGE_PREFIX_BY_SLUG[slug];
  if (!prefix) return null;
  const key = `../card-photos/${prefix}-card-${cardNumber}.jpg`;
  return cardPhotos[key] ?? null;
}
/* --------------------------------------------------------------------------
 * Problem photos (mobile challenge cards)
 * File naming: {prefix}-problem1.png, {prefix}-problem2.png
 * Falls back gracefully (returns null) if the image doesn't exist.
 * -------------------------------------------------------------------------- */
const PROBLEM_PREFIX_BY_SLUG = {
  "real-estate": "real",
  bfsi: "bfsi",
  travel: "travel",
  health: "health",
  retail: "retail",
  automotive: "automotive",
  saas: "saas",
  b2b: "saas",
  tech: "tech",
  fashion: "fashion",
};
function getProblemImage(slug, challengeNumber) {
  try {
    const prefix = PROBLEM_PREFIX_BY_SLUG[slug];
    if (!prefix) return null;
    const png = `../card-photos/${prefix}-problem${challengeNumber}.png`;
    const jpg = `../card-photos/${prefix}-problem${challengeNumber}.jpg`;
    return cardPhotos[png] ?? cardPhotos[jpg] ?? null;
  } catch {
    return null;
  }
}
/* ==========================================================================
 * MOBILE-ONLY COMPONENTS
 * ========================================================================== */
function MobileIndustryLanding({
  slug,
  image,
  heroTitle,
  heroDescription,
  challenges,   // [{ problem, cards: [5] }, { problem, cards: [5] }]
}) {
  const [openChallengeIndex, setOpenChallengeIndex] = useState(null);
  const cardRefs = useRef({});
  // Build a safe 2-item challenges array.
  const safeChallenges =
    Array.isArray(challenges) && challenges.length > 0
      ? challenges.slice(0, 2)
      : [
          { problem: "Challenge 1", cards: [] },
          { problem: "Challenge 2", cards: [] },
        ];
  while (safeChallenges.length < 2) {
    safeChallenges.push({ problem: `Challenge ${safeChallenges.length + 1}`, cards: [] });
  }
  const handleOpen = (i) => setOpenChallengeIndex(i);
  const handleClose = () => setOpenChallengeIndex(null);
  const selectedChallenge =
    openChallengeIndex !== null ? safeChallenges[openChallengeIndex] : null;
  return (
    <div className="industry-landing industry-landing--mobile">
      {/* Hero */}
      <div className="industry-hero" style={{ backgroundImage: `url(${image})` }}>
        <div className="industry-hero__overlay" />
        <div className="industry-hero__content">
          <h1 className={`industry-hero__title industry-hero__title--${slug}`}>
  {heroTitle}
</h1>
          <p className="industry-hero__description">{heroDescription}</p>
        </div>
      </div>
      {/* Two Challenge cards */}
      <div className="mobile-challenges">
        {safeChallenges.map((challenge, i) => {
          const n = i + 1;
          const bg = getProblemImage(slug, n);
          const hasImage = Boolean(bg);
          return (
            <button
              key={n}
              ref={(el) => (cardRefs.current[n] = el)}
              className={`mobile-challenge-card ${
                hasImage ? "mobile-challenge-card--image" : "mobile-challenge-card--blank"
              }`}
              onClick={() => handleOpen(i)}
              type="button"
              style={hasImage ? { backgroundImage: `url(${bg})` } : undefined}
            >
              {hasImage && <span className="mobile-challenge-card__overlay" />}
              <span className="mobile-challenge-card__inner">
                <span className="mobile-challenge-card__label">Challenge</span>
                <span className="mobile-challenge-card__problem">
                  {challenge.problem}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {selectedChallenge && (
        <MobileChallengeOverlay
          slug={slug}
          challengeNumber={openChallengeIndex + 1}
          cards={selectedChallenge.cards}
          originEl={cardRefs.current[openChallengeIndex + 1]}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
/* --------------------------------------------------------------------------
 * Fullscreen "Instagram-style" overlay with GSAP open/close
 * -------------------------------------------------------------------------- */
function MobileChallengeOverlay({ slug, challengeNumber, cards, originEl, onClose }) {
  const scrimRef = useRef(null);
  const sheetRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealedIndex, setRevealedIndex] = useState(null);
  /* Open animation from origin card */
  useLayoutEffect(() => {
    const scrim = scrimRef.current;
    const sheet = sheetRef.current;
    if (!sheet || !scrim) return;
    const ctx = gsap.context(() => {
      const originRect = originEl?.getBoundingClientRect();
      const vw = window.innerWidth;
      gsap.set(scrim, { autoAlpha: 0 });
      if (originRect) {
        const startScale = Math.max(originRect.width / vw, 0.6);
        gsap.set(sheet, {
          transformOrigin: `${originRect.left + originRect.width / 2}px ${
            originRect.top + originRect.height / 2
          }px`,
          scale: startScale,
          y: 24,
          autoAlpha: 0,
        });
      } else {
        gsap.set(sheet, { scale: 0.92, y: 24, autoAlpha: 0 });
      }
      gsap
        .timeline()
        .to(scrim, { autoAlpha: 1, duration: 0.25, ease: "power2.out" }, 0)
        .to(sheet, { scale: 1, y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" }, 0);
    });
    return () => ctx.revert();
  }, [originEl]);
  /* Close animation (reverse) */
  const runClose = () => {
    const scrim = scrimRef.current;
    const sheet = sheetRef.current;
    if (!sheet || !scrim) {
      onClose();
      return;
    }
    const originRect = originEl?.getBoundingClientRect();
    const vw = window.innerWidth;
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(
      sheet,
      {
        scale: originRect ? Math.max(originRect.width / vw, 0.6) : 0.92,
        y: 24,
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      0
    ).to(scrim, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0.05);
  };
  /* Swipe pagination tracking */
  const handleScroll = () => {
    const t = trackRef.current;
    if (!t) return;
    const idx = Math.round(t.scrollLeft / t.clientWidth);
    if (idx !== activeIndex) setActiveIndex(idx);
  };
  /* Lock body scroll while open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  // The Video card is always at index 2 (3rd card) in the 5-card flow.
  const VIDEO_INDEX = 2;
  return (
    <div className="mobile-overlay" role="dialog" aria-modal="true">
      <div ref={scrimRef} className="mobile-overlay__scrim" onClick={runClose} />
      <div ref={sheetRef} className="mobile-overlay__sheet">
        <button
          type="button"
          className="mobile-overlay__close"
          onClick={runClose}
          aria-label="Close"
        >
          ×
        </button>
        <div ref={trackRef} className="mobile-overlay__track" onScroll={handleScroll}>
          {cards.map((card, i) => (
            <div className="mobile-overlay__slide" key={i}>
              <MobileIndustryCard
                card={card}
                index={i}
                backgroundImage={getCardImage(slug, i + 1)}
                isVideo={i === VIDEO_INDEX}
                revealed={revealedIndex === i}
                onTap={() => setRevealedIndex((cur) => (cur === i ? null : i))}
              />
            </div>
          ))}
        </div>
        <div className="mobile-overlay__dots">
          {cards.map((c, i) => (
            <button
              key={i}
              type="button"
              className={`mobile-overlay__dot ${i === activeIndex ? "is-active" : ""}`}
              onClick={() => {
                trackRef.current?.scrollTo({
                  left: i * trackRef.current.clientWidth,
                  behavior: "smooth",
                });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
/* --------------------------------------------------------------------------
 * Mobile card — reuses desktop card design; tap-to-reveal instead of hover
 * -------------------------------------------------------------------------- */
function MobileIndustryCard({ card, backgroundImage, isVideo, revealed, onTap }) {
  // Video card: only thumbnail + play icon. No title / description ever.
  if (isVideo) {
    return (
      <div
        className="industry-card industry-card--mobile industry-card--video"
        onClick={onTap}
        style={
          backgroundImage
            ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="industry-card__bg-overlay" />
        <div className="industry-card__play" aria-hidden="true">
          <svg viewBox="0 0 60 60" width="72" height="72">
            <circle cx="30" cy="30" r="30" fill="rgba(0,0,0,0.55)" />
            <polygon points="24,18 44,30 24,42" fill="#fff" />
          </svg>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`industry-card industry-card--mobile ${revealed ? "is-revealed" : ""}`}
      onClick={onTap}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="industry-card__bg-overlay" />
      <div className="industry-card__placeholder">
        <span className="industry-card__placeholder-title">{card.title}</span>
      </div>
      <div className="industry-card__detail">
        <h3 className="industry-card__detail-title">{card.title}</h3>
        <p className="industry-card__detail-text">{card.content}</p>
      </div>
    </div>
  );
}
export default MobileIndustryLanding;
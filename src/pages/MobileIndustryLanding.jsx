import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./MobileIndustryLanding.css";

import realEstateVideo from "../assets/real-estate.mp4";
import bfsiVideo from "../assets/bfsi.mp4";
import travelVideo from "../assets/travel.mp4";
import healthVideo from "../assets/health.mp4";
import retailVideo from "../assets/Retail.mp4";
import automotiveVideo from "../assets/automotive.mp4";
import b2bVideo from "../assets/b2b.mp4";
import fashionVideo from "../assets/fashion.mp4";

/* --------------------------------------------------------------------------
 * Image lookups (shared prefix map for both card photos and problem photos)
 * -------------------------------------------------------------------------- */
const cardPhotos = {
  ...import.meta.glob("../card-photos/*.jpg", { eager: true, import: "default" }),
  ...import.meta.glob("../card-photos/*.png", { eager: true, import: "default" }),
};

/* Only needed when an industry's image-file prefix differs from its slug.
 * Anything not listed falls back to using the slug itself as the prefix,
 * so new industries work automatically as long as filenames match the slug. */
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

/* Hero background video per industry slug. */
const HERO_VIDEO_BY_SLUG = {
  "real-estate": realEstateVideo,
  bfsi: bfsiVideo,
  travel: travelVideo,
  health: healthVideo,
  retail: retailVideo,
  automotive: automotiveVideo,
  b2b: b2bVideo,
  saas: b2bVideo,
  fashion: fashionVideo,
};

function getPrefix(slug) {
  return IMAGE_PREFIX_BY_SLUG[slug] || slug;
}

function getCardImage(slug, cardNumber) {
  const prefix = getPrefix(slug);
  if (!prefix) return null;
  const key = `../card-photos/${prefix}-card-${cardNumber}.jpg`;
  return cardPhotos[key] ?? null;
}

function getProblemImage(slug, challengeNumber) {
  try {
    const prefix = getPrefix(slug);
    if (!prefix) return null;
    const png = `../card-photos/${prefix}-problem${challengeNumber}.png`;
    const jpg = `../card-photos/${prefix}-problem${challengeNumber}.jpg`;
    return cardPhotos[png] ?? cardPhotos[jpg] ?? null;
  } catch {
    return null;
  }
}

/* For each challenge, how many cards came before it across all prior
 * challenges — gives the correct global image number regardless of how many
 * challenges exist or how many cards are in each one. */
function getChallengeCardOffsets(challenges) {
  const offsets = [];
  let running = 0;
  for (const challenge of challenges) {
    offsets.push(running);
    running += Array.isArray(challenge?.cards) ? challenge.cards.length : 0;
  }
  return offsets;
}

/* A card is the "Video" card if the data marks it explicitly. Legacy
 * fallback: a challenge with exactly 5 cards treats the 3rd (index 2) as
 * video, matching the original fixed 5-card layout. */
function isVideoCard(card, cardIndexInChallenge, totalCardsInChallenge) {
  if (!card) return false;
  const type = (card.type || card.cardType || "").toString().toLowerCase();
  if (type === "video") return true;
  if (card.videoUrl || card.video) return true;
  if ((card.title || "").toLowerCase().includes("video")) return true;
  if (totalCardsInChallenge === 5 && cardIndexInChallenge === 2) return true;
  return false;
}

/* ==========================================================================
 * MOBILE-ONLY COMPONENTS
 * ========================================================================== */
function MobileIndustryLanding({
  slug,
  image, // used as the hero video's poster frame while it loads
  video, // optional explicit override for the hero video source
  heroTitle,
  heroDescription,
  challenges, // any number of { problem, cards: [...] }
}) {
  const navigate = useNavigate();
  const [openChallengeIndex, setOpenChallengeIndex] = useState(null);
  const cardRefs = useRef({});

  const heroVideo = video || HERO_VIDEO_BY_SLUG[slug] || null;

  // Any number of challenges, each with any number of cards. Only falls
  // back to a single placeholder challenge if the data is missing/invalid.
  const safeChallenges =
    Array.isArray(challenges) && challenges.length > 0
      ? challenges
      : [{ problem: "Challenge 1", cards: [] }];

  const challengeCardOffsets = getChallengeCardOffsets(safeChallenges);

  const handleOpen = (i) => setOpenChallengeIndex(i);
  const handleClose = () => setOpenChallengeIndex(null);
  const selectedChallenge =
    openChallengeIndex !== null ? safeChallenges[openChallengeIndex] : null;

  /* Navigate home and tell the homepage which section to scroll to once it
   * mounts. The homepage reads this from location.state (see #solutions'
   * useEffect in App.jsx) — no manual DOM polling needed here. */
  const handleBackToIndustries = () => {
    navigate("/", { state: { scrollTo: "solutions" } });
  };

  return (
    <div className="industry-landing industry-landing--mobile">
      {/* Hero */}
      <div className="industry-hero">
        <button
          type="button"
          className="industry-back-button"
          onClick={handleBackToIndustries}
        >
          <span className="industry-back-button__arrow" aria-hidden="true">
            ←
          </span>
          <span className="industry-back-button__label">Back to Industries</span>
        </button>

        {heroVideo && (
          <video
            className="industry-hero__video"
            src={heroVideo}
            poster={image}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        )}
        <div className="industry-hero__overlay" />
        <div className="industry-hero__content">
          <h1 className={`industry-hero__title industry-hero__title--${slug}`}>
            {heroTitle}
          </h1>
          <p className="industry-hero__description">{heroDescription}</p>
        </div>
      </div>

      {/* Challenge cards — any number, stacked vertically */}
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
          cards={selectedChallenge.cards}
          cardNumberOffset={challengeCardOffsets[openChallengeIndex]}
          originEl={cardRefs.current[openChallengeIndex + 1]}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Fullscreen "Instagram-style" overlay with GSAP open/close.
 * Every slide shows its full image + title + description immediately —
 * there is no intermediate preview state.
 * -------------------------------------------------------------------------- */
function MobileChallengeOverlay({ slug, cards, cardNumberOffset, originEl, onClose }) {
  const scrimRef = useRef(null);
  const sheetRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const goToSlide = (i) => {
    const t = trackRef.current;
    if (!t) return;
    const clamped = Math.max(0, Math.min(i, cards.length - 1));
    t.scrollTo({ left: clamped * t.clientWidth, behavior: "smooth" });
  };

  const handlePrev = () => goToSlide(activeIndex - 1);
  const handleNext = () => goToSlide(activeIndex + 1);

  /* Lock body scroll while open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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
          {cards.map((card, i) => {
            const cardNumber = cardNumberOffset + i + 1;
            return (
              <div className="mobile-overlay__slide" key={i}>
                <MobileIndustryCard
                  card={card}
                  backgroundImage={getCardImage(slug, cardNumber)}
                  isVideo={isVideoCard(card, i, cards.length)}
                />
              </div>
            );
          })}
        </div>

        {activeIndex > 0 && (
          <button
            type="button"
            className="mobile-overlay__nav mobile-overlay__nav--prev"
            onClick={handlePrev}
            aria-label="Previous"
          >
            ‹
          </button>
        )}
        {activeIndex < cards.length - 1 && (
          <button
            type="button"
            className="mobile-overlay__nav mobile-overlay__nav--next"
            onClick={handleNext}
            aria-label="Next"
          >
            ›
          </button>
        )}

        <div className="mobile-overlay__dots">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`mobile-overlay__dot ${i === activeIndex ? "is-active" : ""}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Mobile card — reuses desktop card design. Background image/video, dark
 * overlay, title, and full description are all visible immediately; there
 * is no preview/reveal step.
 * -------------------------------------------------------------------------- */
function MobileIndustryCard({ card, backgroundImage, isVideo }) {
  // Video card: only thumbnail + play icon. No title / description ever.
  if (isVideo) {
    return (
      <div
        className="industry-card industry-card--mobile industry-card--video"
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
      className="industry-card industry-card--mobile"
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
      <div className="industry-card__detail">
        <h3 className="industry-card__detail-title">{card.title}</h3>
        <p className="industry-card__detail-text">{card.content}</p>
      </div>
    </div>
  );
}

export default MobileIndustryLanding;
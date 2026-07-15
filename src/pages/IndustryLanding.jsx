import { useParams } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import industries from "../data/industries";
import MobileIndustryLanding from "./MobileIndustryLanding";
import "./IndustryLanding.css";

const cardPhotos = {
  ...import.meta.glob("../card-photos/*.jpg", { eager: true, import: "default" }),
  ...import.meta.glob("../card-photos/*.png", { eager: true, import: "default" }),
};

/* Only needed when an industry's image-file prefix differs from its slug
 * (e.g. slug "real-estate" -> files named "real-card-1.jpg"). Any industry
 * NOT listed here automatically falls back to using its own slug as the
 * prefix, so brand-new industries work with zero code changes as long as
 * their image files are named `${slug}-card-${n}.jpg` / `${slug}-problem${n}.png`. */
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

function getPrefix(slug) {
  return IMAGE_PREFIX_BY_SLUG[slug] || slug;
}

function getCardImage(slug, cardNumber) {
  const prefix = getPrefix(slug);
  if (!prefix) return null;
  const key = `../card-photos/${prefix}-card-${cardNumber}.jpg`;
  return cardPhotos[key] ?? null;
}

/* Large hero image for each Step-1 challenge card. Works for any number of
 * challenges — challengeNumber is just that challenge's 1-based position. */
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

/* Default labels applied in order to a challenge's cards. A card can always
 * override this with an explicit `card.label` field in the data — that takes
 * priority. Challenges with more cards than there are default labels simply
 * get no label on the extra cards (no guessing). */
const CARD_LABELS = [
  "What This Means",
  "Personlyze Intervention",
  "Video",
  "Why This Works",
  "Expected Outcome",
];

function getCardLabel(card, indexInChallenge) {
  if (card && card.label) return card.label;
  return CARD_LABELS[indexInChallenge] ?? null;
}

/* A card is treated as the "Video" card if the data says so explicitly
 * (type/videoUrl/video/title). As a legacy fallback — for data that hasn't
 * been updated to mark video cards explicitly — a challenge with exactly
 * 5 cards still treats the 3rd card (index 2) as video, matching the
 * original fixed 5-card layout. New/variable-length challenges should just
 * mark their video card explicitly in the data. */
function isVideoCard(card, cardIndexInChallenge, totalCardsInChallenge) {
  if (!card) return false;
  const type = (card.type || card.cardType || "").toString().toLowerCase();
  if (type === "video") return true;
  if (card.videoUrl || card.video) return true;
  if ((card.title || "").toLowerCase().includes("video")) return true;
  if (totalCardsInChallenge === 5 && cardIndexInChallenge === 2) return true;
  return false;
}

/* Computes, for each challenge, how many cards came before it across all
 * prior challenges. challengeCardOffsets[i] + cardIndexInChallenge + 1 gives
 * the correct *global* image number for that card, however many challenges
 * or cards-per-challenge exist. */
function getChallengeCardOffsets(challenges) {
  const offsets = [];
  let running = 0;
  for (const challenge of challenges) {
    offsets.push(running);
    running += Array.isArray(challenge?.cards) ? challenge.cards.length : 0;
  }
  return offsets;
}

/* Number of detail cards visible at once in the carousel viewport. */
const VISIBLE_CARDS_IN_CAROUSEL = 3;

/* -------------------------------------------------------------------------- */
/*  Mobile detection                                                          */
/* -------------------------------------------------------------------------- */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

/* ========================================================================== */
/*  MAIN COMPONENT                                                            */
/* ========================================================================== */
export default function IndustryLanding() {
  const { slug } = useParams();
  const industry = industries.find((item) => item.slug === slug);
  const isMobile = useIsMobile();

  /* ---- desktop reveal state ---------------------------------------------
   * stage: "challenges" (step 1) -> "detail" (step 2, sliding carousel)
   * All hooks are declared unconditionally, before any early return, so the
   * mobile branch below never violates the rules of hooks. */
  const [stage, setStage] = useState("challenges");
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const challengeCardRefs = useRef([]);
  const detailHeaderRef = useRef(null);
  const detailCardRefs = useRef([]);
  const carouselTrackRef = useRef(null);
  const carouselViewportRef = useRef(null);

  // Reset ref buckets every render so stale nodes from a previous stage
  // never linger in the array GSAP animates against.
  challengeCardRefs.current = [];
  detailCardRefs.current = [];

  /* Entrance animation whenever we land on a stage (challenges or detail). */
  useLayoutEffect(() => {
    if (isMobile || !industry) return;

    if (stage === "challenges") {
      const cards = challengeCardRefs.current.filter(Boolean);
      if (!cards.length) return;
      gsap.set(cards, { clearProps: "transform,opacity,filter" });
      gsap.fromTo(
        cards,
        { opacity: 0, y: 44, scale: 0.96, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    } else if (stage === "detail") {
      const header = detailHeaderRef.current;
      const cards = detailCardRefs.current.filter(Boolean);
      const tl = gsap.timeline();
      if (header) {
        tl.fromTo(
          header,
          { opacity: 0, y: -24, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power2.out" }
        );
      }
      if (cards.length) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.94, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.65,
            stagger: 0.09,
            ease: "power3.out",
          },
          header ? "-=0.25" : 0
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, activeChallengeIndex, isMobile, industry]);

  /* Slide the carousel track whenever the window position changes. Measures
   * the real card width each time so it stays correct at any viewport size
   * and any number of cards. */
  useLayoutEffect(() => {
    if (isMobile || !industry || stage !== "detail") return;
    const track = carouselTrackRef.current;
    const firstCard = detailCardRefs.current[0];
    if (!track || !firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 24;
    const distance = (cardWidth + gap) * carouselIndex;
    gsap.to(track, { x: -distance, duration: 0.65, ease: "power3.inOut" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carouselIndex, stage, activeChallengeIndex, isMobile, industry]);

  /* Keep the carousel aligned if the window resizes (no animation, just snap). */
  useEffect(() => {
    if (isMobile || !industry) return;
    function handleResize() {
      if (stage !== "detail") return;
      const track = carouselTrackRef.current;
      const firstCard = detailCardRefs.current[0];
      if (!track || !firstCard) return;
      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = 24;
      gsap.set(track, { x: -(cardWidth + gap) * carouselIndex });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [stage, carouselIndex, isMobile, industry]);

  if (!industry) {
    return (
      <div className="industry-landing__not-found">
        <h1>Industry Not Found</h1>
      </div>
    );
  }

  const { heroTitle, heroDescription, challenges, image } = industry;

  /* Works for any number of challenges, each with any number of cards. */
  const challengeCardOffsets = getChallengeCardOffsets(challenges);

  /* ====================================================================== */
  /*  MOBILE BRANCH — untouched                                            */
  /* ====================================================================== */
  if (isMobile) {
    return (
      <MobileIndustryLanding
        slug={slug}
        image={image}
        heroTitle={heroTitle}
        heroDescription={heroDescription}
        challenges={challenges}
      />
    );
  }

  /* ====================================================================== */
  /*  DESKTOP BRANCH — continuous two-stage GSAP reveal + carousel          */
  /* ====================================================================== */
  function handleOpenChallenge(index) {
    if (isTransitioning || stage === "detail") return;
    const clickedCard = challengeCardRefs.current[index];
    const otherCards = challengeCardRefs.current.filter(
      (el, i) => el && i !== index
    );

    if (!clickedCard && !otherCards.length) {
      setActiveChallengeIndex(index);
      setCarouselIndex(0);
      setStage("detail");
      return;
    }

    setIsTransitioning(true);

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        setActiveChallengeIndex(index);
        setCarouselIndex(0);
        setStage("detail");
        setIsTransitioning(false);
      },
    });

    // Neutralize the CSS hover transition so it doesn't fight the tween.
    tl.set([clickedCard, ...otherCards].filter(Boolean), { transition: "none" }, 0);

    if (clickedCard) {
      // 1. Selected card lifts and scales slightly — feels "chosen".
      tl.to(clickedCard, { scale: 1.045, duration: 0.32, ease: "power2.out" }, 0);
    }
    if (otherCards.length) {
      // 2. Everything else softly recedes.
      tl.to(
        otherCards,
        { opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)", duration: 0.5 },
        0.08
      );
    }
    if (clickedCard) {
      // 3. Selected card "expands" toward the viewer and dissolves into the
      //    incoming detail view, so the two stages read as one continuous move.
      tl.to(
        clickedCard,
        { opacity: 0, scale: 1.14, filter: "blur(14px)", duration: 0.55 },
        0.26
      );
    }
  }

  function handleBack() {
    if (isTransitioning || stage === "challenges") return;
    const header = detailHeaderRef.current;
    const cards = detailCardRefs.current.filter(Boolean);
    setIsTransitioning(true);
    const tl = gsap.timeline({
      defaults: { ease: "power2.in" },
      onComplete: () => {
        setStage("challenges");
        setActiveChallengeIndex(null);
        setCarouselIndex(0);
        setIsTransitioning(false);
      },
    });
    if (cards.length) {
      tl.to(cards, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        filter: "blur(6px)",
        duration: 0.4,
        stagger: 0.04,
      });
    }
    if (header) {
      tl.to(
        header,
        { opacity: 0, y: -18, filter: "blur(4px)", duration: 0.3 },
        cards.length ? "-=0.22" : 0
      );
    }
    if (!cards.length && !header) {
      tl.to({}, { duration: 0.01 });
    }
  }

  function handleCarouselPrev() {
    if (isTransitioning) return;
    setCarouselIndex((i) => Math.max(0, i - 1));
  }

  function handleCarouselNext(maxIndex) {
    if (isTransitioning) return;
    setCarouselIndex((i) => Math.min(maxIndex, i + 1));
  }

  const activeChallenge =
    activeChallengeIndex !== null ? challenges[activeChallengeIndex] : null;

  /* Carousel bounds are computed from the *actual* number of cards in the
   * active challenge — works whether a challenge has 3, 5, 8, or any other
   * number of cards. */
  const activeCardsCount = activeChallenge?.cards?.length ?? 0;
  const carouselMaxIndex = Math.max(0, activeCardsCount - VISIBLE_CARDS_IN_CAROUSEL);

  return (
    <div className="industry-landing" style={{ backgroundImage: `url(${image})` }}>
      <div className="industry-hero" style={{ backgroundImage: `url(${image})` }}>
        <div className="industry-hero__overlay" />
        <div className="industry-hero__content">
          <h1 className="industry-hero__title">{heroTitle}</h1>
          <p className="industry-hero__description">{heroDescription}</p>
        </div>
      </div>

      <div className="industry-cards-section">
        <div className="industry-cards-section__overlay" />

        {stage === "challenges" && (
          <div className="industry-challenges-grid">
            {challenges.map((challenge, index) => {
              const bgImage = getProblemImage(slug, index + 1);
              return (
                <button
                  type="button"
                  key={index}
                  className="industry-challenge-card"
                  onClick={() => handleOpenChallenge(index)}
                  ref={(el) => {
                    challengeCardRefs.current[index] = el;
                  }}
                >
                  <div
                    className="industry-challenge-card__media"
                    style={
                      bgImage
                        ? { backgroundImage: `url(${bgImage})` }
                        : undefined
                    }
                  />
                  <div className="industry-challenge-card__overlay" />
                  <div className="industry-challenge-card__inner">
                    <span className="industry-challenge-card__label">
                      Challenge {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="industry-challenge-card__problem">{challenge.problem}</p>
                    <span className="industry-challenge-card__cta">
                      Explore <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {stage === "detail" && activeChallenge && (
          <div className="industry-detail">
            <div className="industry-detail__header" ref={detailHeaderRef}>
              <button type="button" className="industry-detail__back" onClick={handleBack}>
                <span aria-hidden="true">&larr;</span> Back
              </button>
              <span className="industry-detail__eyebrow">
                Challenge {String(activeChallengeIndex + 1).padStart(2, "0")}
              </span>
              <p className="industry-detail__problem">{activeChallenge.problem}</p>
            </div>

            <div className="industry-carousel">
              <button
                type="button"
                className="industry-carousel__arrow industry-carousel__arrow--left"
                onClick={handleCarouselPrev}
                disabled={carouselIndex === 0}
                aria-label="Show previous card"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12.5 4L6.5 10L12.5 16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="industry-carousel__viewport" ref={carouselViewportRef}>
                <div className="industry-carousel__track" ref={carouselTrackRef}>
                  {activeChallenge.cards.map((card, cardIndex) => {
                    const cardNumber =
                      challengeCardOffsets[activeChallengeIndex] + cardIndex + 1;
                    return (
                      <div
                        className="industry-carousel__slot"
                        key={cardIndex}
                        ref={(el) => {
                          detailCardRefs.current[cardIndex] = el;
                        }}
                      >
                        <IndustryCard
                          card={card}
                          backgroundImage={getCardImage(slug, cardNumber)}
                          label={getCardLabel(card, cardIndex)}
                          isVideo={isVideoCard(card, cardIndex, activeCardsCount)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                className="industry-carousel__arrow industry-carousel__arrow--right"
                onClick={() => handleCarouselNext(carouselMaxIndex)}
                disabled={carouselIndex === carouselMaxIndex}
                aria-label="Show next card"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7.5 4L13.5 10L7.5 16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="industry-carousel__dots">
              {Array.from({ length: carouselMaxIndex + 1 }).map((_, dotIndex) => (
                <button
                  type="button"
                  key={dotIndex}
                  className={`industry-carousel__dot${
                    carouselIndex === dotIndex ? " is-active" : ""
                  }`}
                  onClick={() => setCarouselIndex(dotIndex)}
                  aria-label={`Go to card position ${dotIndex + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  DESKTOP CARD (hover-driven overlay, plus optional video face)           */
/* ========================================================================== */
function IndustryCard({ card, backgroundImage, label, isVideo }) {
  return (
    <div
      className={`industry-card${isVideo ? " industry-card--video" : ""}`}
      tabIndex={0}
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
      {isVideo && (
        <div className="industry-card__play" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.45)" />
            <path d="M26 20L46 32L26 44V20Z" fill="#fff" />
          </svg>
        </div>
      )}
      <div className="industry-card__placeholder">
        <span className="industry-card__placeholder-title">{card.title}</span>
      </div>
      <div className="industry-card__detail">
        {/* The label slot is always rendered (even if empty) so the title
            sits at the exact same vertical position on every card. */}
        <span
          className="industry-card__detail-label"
          style={{ visibility: label ? "visible" : "hidden" }}
        >
          {label || "\u00A0"}
        </span>
        <h3 className="industry-card__detail-title">{card.title}</h3>
        <p className="industry-card__detail-text">{card.content}</p>
      </div>
    </div>
  );
}
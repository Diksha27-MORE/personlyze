import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import "./IndustryLanding.css";

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

/* ========================================================================== */
/*  MOBILE-ONLY COMPONENTS                                                    */
/* ========================================================================== */

function MobileIndustryLanding({ slug, image, heroTitle, heroDescription, cards }) {
  const [openChallenge, setOpenChallenge] = useState(null); // 1 | 2 | null
  const cardRefs = useRef({});

  const handleOpen = (n) => setOpenChallenge(n);
  const handleClose = () => setOpenChallenge(null);

  return (
    <div className="industry-landing industry-landing--mobile">
      {/* Hero (identical structure) */}
      <div className="industry-hero" style={{ backgroundImage: `url(${image})` }}>
        <div className="industry-hero__overlay" />
        <div className="industry-hero__content">
          <h1 className="industry-hero__title">{heroTitle}</h1>
          <p className="industry-hero__description">{heroDescription}</p>
        </div>
      </div>

      {/* Two placeholder Challenge cards */}
      <div className="mobile-challenges">
        {[1, 2].map((n) => (
          <button
            key={n}
            ref={(el) => (cardRefs.current[n] = el)}
            className="mobile-challenge-card"
            onClick={() => handleOpen(n)}
            type="button"
          >
            <span className="mobile-challenge-card__title">Challenge {n}</span>
          </button>
        ))}
      </div>

      {openChallenge !== null && (
        <MobileChallengeOverlay
          slug={slug}
          cards={cards}
          originEl={cardRefs.current[openChallenge]}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Fullscreen "Instagram-style" overlay with GSAP open/close                 */
/* -------------------------------------------------------------------------- */
function MobileChallengeOverlay({ slug, cards, originEl, onClose }) {
  const scrimRef = useRef(null);
  const sheetRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealedId, setRevealedId] = useState(null);

  /* --- Open animation from origin card --------------------------------- */
useLayoutEffect(() => {
  const scrim = scrimRef.current;
  const sheet = sheetRef.current;
  if (!sheet || !scrim) return;

  const ctx = gsap.context(() => {
    const originRect = originEl?.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

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

    gsap.timeline()
      .to(scrim, { autoAlpha: 1, duration: 0.25, ease: "power2.out" }, 0)
      .to(sheet, { scale: 1, y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" }, 0);
  });

  return () => ctx.revert();
}, [originEl]);
  /* --- Close animation (reverse) --------------------------------------- */
  const runClose = () => {
    const scrim = scrimRef.current;
    const sheet = sheetRef.current;
    if (!sheet || !scrim) { onClose(); return; }

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

  /* --- Swipe pagination tracking --------------------------------------- */
  const handleScroll = () => {
    const t = trackRef.current;
    if (!t) return;
    const idx = Math.round(t.scrollLeft / t.clientWidth);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  /* --- Lock body scroll while open ------------------------------------- */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
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

        <div
          ref={trackRef}
          className="mobile-overlay__track"
          onScroll={handleScroll}
        >
          {cards.map((card, i) => (
            <div className="mobile-overlay__slide" key={card.id}>
              <MobileIndustryCard
                card={card}
                index={i}
                backgroundImage={getCardImage(slug, i + 1)}
                isVideo={i === 3}
                revealed={revealedId === card.id}
                onTap={() =>
                  setRevealedId((cur) => (cur === card.id ? null : card.id))
                }
              />
            </div>
          ))}
        </div>

<div className="mobile-overlay__dots">
  {cards.map((c, i) => (
    <button
      key={c.id}
      type="button"
      className={`mobile-overlay__dot ${
        i === activeIndex ? "is-active" : ""
      }`}
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

/* -------------------------------------------------------------------------- */
/*  Mobile card — reuses desktop card design; tap-to-reveal instead of hover */
/* -------------------------------------------------------------------------- */
function MobileIndustryCard({ card, backgroundImage, isVideo, revealed, onTap }) {
  return (
    <div
      className={`industry-card industry-card--mobile ${
        revealed ? "is-revealed" : ""
      }`}
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

      {isVideo && !revealed && (
        <div className="industry-card__play" aria-hidden="true">
          <svg viewBox="0 0 60 60" width="64" height="64">
            <circle cx="30" cy="30" r="30" fill="rgba(0,0,0,0.55)" />
            <polygon points="24,18 44,30 24,42" fill="#fff" />
          </svg>
        </div>
      )}

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
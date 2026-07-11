import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import industries from "../data/industries";
import MobileIndustryLanding from "./MobileIndustryLanding";
import "./IndustryLanding.css";

const CARDS_PER_VIEW = 3;

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

  /* ---- desktop carousel state (untouched) ------------------------------- */
  const [page, setPage] = useState(1);
  const [withTransition, setWithTransition] = useState(true);

  if (!industry) {
    return (
      <div className="industry-landing__not-found">
        <h1>Industry Not Found</h1>
      </div>
    );
  }

  const { heroTitle, heroDescription, cards, image } = industry;

  /* ====================================================================== */
  /*  MOBILE BRANCH                                                         */
  /* ====================================================================== */
  if (isMobile) {
    return (
      <MobileIndustryLanding
        slug={slug}
        image={image}
        heroTitle={heroTitle}
        heroDescription={heroDescription}
        cards={cards}
      />
    );
  }

  /* ====================================================================== */
  /*  DESKTOP BRANCH — unchanged from your current file                     */
  /* ====================================================================== */
  const totalPages = Math.max(1, Math.ceil(cards.length / CARDS_PER_VIEW));

  const toSlide = (card, originalIndex, keySuffix) => ({
    card,
    originalIndex,
    key: keySuffix ? `${card.id}-${keySuffix}` : String(card.id),
    isClone: Boolean(keySuffix),
  });

  const startClones = cards
    .slice(-CARDS_PER_VIEW)
    .map((card, i) => toSlide(card, cards.length - CARDS_PER_VIEW + i, "clone-start"));
  const realSlides = cards.map((card, i) => toSlide(card, i, null));
  const endClones = cards
    .slice(0, CARDS_PER_VIEW)
    .map((card, i) => toSlide(card, i, "clone-end"));

  const extendedSlides = [...startClones, ...realSlides, ...endClones];
  const extendedTotalPages = totalPages + 2;

  const goPrev = () => { setWithTransition(true); setPage((c) => c - 1); };
  const goNext = () => { setWithTransition(true); setPage((c) => c + 1); };

  const handleTransitionEnd = () => {
    if (page === extendedTotalPages - 1) { setWithTransition(false); setPage(1); }
    else if (page === 0)                 { setWithTransition(false); setPage(totalPages); }
  };

  useEffect(() => {
    if (!withTransition) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => setWithTransition(true));
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [withTransition]);

  return (
    <div className="industry-landing" style={{ backgroundImage: `url(${image})` }}>
      <div className="industry-hero" style={{ backgroundImage: `url(${image})` }}>
        <div className="industry-hero__overlay" />
        <div className="industry-hero__content">
          <h1 className="industry-hero__title">{heroTitle}</h1>
          <p className="industry-hero__description">{heroDescription}</p>
        </div>
      </div>

      <div className="industry-cards-section" style={{ background: "#e5d9d9" }}>
        <div className="industry-cards-section__overlay" />
        <div className="industry-carousel">
          <div className="industry-carousel__viewport">
            <button
              type="button"
              className="industry-carousel__arrow industry-carousel__arrow--left"
              onClick={goPrev}
              aria-label="Previous cards"
            >&#8592;</button>

            <div className="industry-carousel__track-wrapper">
              <div
                className="industry-carousel__track"
                style={{
                  width: `${extendedTotalPages * 100}%`,
                  transform: `translateX(-${page * (100 / extendedTotalPages)}%)`,
                  transition: withTransition ? undefined : "none",
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {extendedSlides.map((slide) => (
                  <div
                    className="industry-card-slot"
                    key={slide.key}
                    style={{ flexBasis: `${100 / extendedSlides.length}%` }}
                  >
                    <IndustryCard
                      card={slide.card}
                      backgroundImage={getCardImage(slug, slide.originalIndex + 1)}
                      isClone={slide.isClone}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="industry-carousel__arrow industry-carousel__arrow--right"
              onClick={goNext}
              aria-label="Next cards"
            >&#8594;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  DESKTOP CARD (unchanged — hover-driven overlay)                           */
/* ========================================================================== */
function IndustryCard({ card, backgroundImage, isClone }) {
  return (
    <div
      className="industry-card"
      tabIndex={isClone ? -1 : 0}
      aria-hidden={isClone || undefined}
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
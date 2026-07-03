import { useParams } from "react-router-dom";
import { useState } from "react";
import industries from "../data/industries";
import "./IndustryLanding.css";

const CARDS_PER_VIEW = 3;

export default function IndustryLanding() {
  const { slug } = useParams();
  const industry = industries.find((item) => item.slug === slug);

  // Which page of the carousel is showing (0 = cards 1-3, 1 = cards 4-6, ...)
  const [page, setPage] = useState(0);

  if (!industry) {
    return (
      <div className="industry-landing__not-found">
        <h1>Industry Not Found</h1>
      </div>
    );
  }

  const { theme, heroTitle, heroDescription, cards } = industry;
  const totalPages = Math.max(1, Math.ceil(cards.length / CARDS_PER_VIEW));

  const goPrev = () => {
    setPage((current) => Math.max(0, current - 1));
  };

  const goNext = () => {
    setPage((current) => Math.min(totalPages - 1, current + 1));
  };

  return (
    <div className="industry-landing" style={{ background: theme.gradient }}>
      {/* Hero */}
      <div className="industry-hero">
        <h1 className="industry-hero__title">{heroTitle}</h1>
        <p className="industry-hero__description">{heroDescription}</p>
      </div>

      {/* Cards section — fixed light background, holds the carousel */}
      <div className="industry-cards-section">
        <div className="industry-carousel">
          <div className="industry-carousel__viewport">
            <button
              type="button"
              className="industry-carousel__arrow industry-carousel__arrow--left"
              onClick={goPrev}
              disabled={page === 0}
              aria-label="Previous cards"
            >
              &#8592;
            </button>

            <div className="industry-carousel__track-wrapper">
              <div
                className="industry-carousel__track"
                style={{
                  width: `${totalPages * 100}%`,
                  transform: `translateX(-${page * (100 / totalPages)}%)`,
                }}
              >
                {cards.map((card) => (
                  <div
                    className="industry-card-slot"
                    key={card.id}
                    style={{ flexBasis: `${100 / cards.length}%` }}
                  >
                    <IndustryCard card={card} accentColor={theme.primary} />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="industry-carousel__arrow industry-carousel__arrow--right"
              onClick={goNext}
              disabled={page === totalPages - 1}
              aria-label="Next cards"
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IndustryCard({ card, accentColor }) {
  return (
    <div
      className="industry-card"
      tabIndex={0}
      style={{ background: accentColor }}
    >
      {/* Front */}
      <div className="industry-card__placeholder">
        <span className="industry-card__placeholder-title">
          {card.title}
        </span>
      </div>

      {/* Hover */}
      <div className="industry-card__detail">
        <h3 className="industry-card__detail-title">
          {card.title}
        </h3>

        <p className="industry-card__detail-text">
          {card.content}
        </p>
      </div>
    </div>
  );
}

function DetailBlock({ label, text }) {
  return (
    <div className="industry-card__detail-block">
      <span className="industry-card__detail-label">{label}</span>
      <p className="industry-card__detail-text">{text}</p>
    </div>
  );
}
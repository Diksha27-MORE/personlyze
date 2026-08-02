// DynamicFrameLayoutMobile.jsx  ·  MOBILE ONLY  ·  v2 (stacked deck)
// Apple Wallet / Arc / Linear / Framer feel.
//
// Behaviour:
//  - NOTHING is expanded on arrival. Every card starts in the same collapsed state.
//  - Collapsed = overlapping stacked card: image + industry title only.
//    Only ~54px of each following card peeks out (Apple Wallet stack).
//  - Tapping a collapsed card smoothly expands it (full image, description, CTA)
//    and collapses whichever card was open. Only one open at a time.
//  - Tapping the open card again — or its CTA — navigates to the industry page.
//
// The desktop component is untouched.
import { useState, useEffect, useRef, useCallback, memo } from "react";
import "./DynamicFrameLayoutMobile.css";
import { useNavigate } from "react-router-dom";

import realEstateVideo from "../assets/real-estate.mp4";
import bfsiVideo from "../assets/bfsi.mp4";
import travelVideo from "../assets/travel.mp4";
import healthVideo from "../assets/health.mp4";
import retailVideo from "../assets/Retail.mp4";
import automotiveVideo from "../assets/automotive.mp4";
import b2bVideo from "../assets/b2b.mp4";
import fashionVideo from "../assets/fashion.mp4";

import realEstateImg from "../assets/real-estateimg.png";
import bfsiImg from "../assets/bfsi-img.png";
import travelImg from "../assets/travelimg.png";
import healthImg from "../assets/healthimg.png";
import retailImg from "../assets/Retailimg.png";
import automotiveImg from "../assets/automotiveimg.png";
import b2bImg from "../assets/b2bimg.png";
import fashionImg from "../assets/fashionimg.png";

const industries = [
  {
    name: "Real Estate",
    video: realEstateVideo,
    image: realEstateImg,
    slug: "real-estate",
    description:
      "AI powered personalization for real estate businesses to engage, convert and delight every customer.",
  },
  {
    name: "BFSI",
    video: bfsiVideo,
    image: bfsiImg,
    slug: "bfsi",
    description:
      "AI driven solutions for BFSI companies to personalize customer journeys at scale.",
  },
  {
    name: "Travel & Hospitality",
    video: travelVideo,
    image: travelImg,
    slug: "travel",
    description:
      "Personalized travel experiences that turn browsers into loyal guests.",
  },
  {
    name: "Health & Wellness",
    video: healthVideo,
    image: healthImg,
    slug: "health",
    description: "AI powered engagement that builds trust and better health outcomes.",
  },
  {
    name: "Retail & D2C",
    video: retailVideo,
    image: retailImg,
    slug: "retail",
    description: "Convert browsers into buyers with hyper-personalized retail journeys.",
  },
  {
    name: "Automotive",
    video: automotiveVideo,
    image: automotiveImg,
    slug: "automotive",
    description:
      "Guide every test drive and purchase decision with tailored automotive experiences.",
  },
  {
    name: "B2B & SaaS",
    video: b2bVideo,
    image: b2bImg,
    slug: "b2b",
    description: "Personalized journeys that shorten sales cycles and grow B2B accounts.",
  },
  {
    name: "Fashion & Lifestyle",
    video: fashionVideo,
    image: fashionImg,
    slug: "fashion",
    description: "Style recommendations and campaigns tailored to every shopper.",
  },
  {
    name: "Internal Communication",
    video: fashionVideo,
    image: fashionImg,
    slug: "internal-communication",
    description:
      "Keep every employee informed and engaged with personalized internal updates.",
  },
];

/* ============================================================
   CARD
   ============================================================ */
const IndustryCard = memo(function IndustryCard({
  industry,
  index,
  total,
  isExpanded,
  isOpenElsewhere,
  onSelect,
  onOpen,
  registerCard,
}) {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);

  /* The video only ever loads for the single expanded card. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isExpanded) {
      if (!v.src) v.src = industry.video;
      v.muted = true;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      setVideoReady(false);
      try {
        v.pause();
        v.removeAttribute("src");
        v.load();
      } catch {
        /* ignore */
      }
    }
  }, [isExpanded, industry.video]);

  const handleTap = useCallback(() => {
    if (isExpanded) onOpen(index);
    else onSelect(index);
  }, [isExpanded, index, onOpen, onSelect]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleTap();
      }
    },
    [handleTap],
  );

  return (
    <div
      className={[
        "dfl-m-slot",
        isExpanded ? "is-expanded" : "is-collapsed",
        isOpenElsewhere ? "is-dimmed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      ref={(el) => registerCard(index, el)}
      style={{ "--i": index, zIndex: index + 1 }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={
          isExpanded ? `Open ${industry.name} page` : `Expand ${industry.name}`
        }
        onClick={handleTap}
        onKeyDown={handleKeyDown}
        className={`dfl-m-card${isExpanded ? " is-expanded" : ""}`}
      >
        <div
          className="dfl-m-card-bg"
          style={{ backgroundImage: `url(${industry.image})` }}
        />
        <video
          ref={videoRef}
          className={`dfl-m-card-video${videoReady && isExpanded ? " is-visible" : ""}`}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          onPlaying={() => setVideoReady(true)}
        />
        <div className="dfl-m-card-scrim" />

        {/* Title strip — always inside the visible peek area, always legible. */}
        <div className="dfl-m-card-head">
          <h3 className="dfl-m-name">{industry.name}</h3>
          <span className="dfl-m-chev" aria-hidden="true" />
        </div>

        {/* Revealed only when expanded. */}
        <div className="dfl-m-reveal" aria-hidden={!isExpanded}>
          <p className="dfl-m-desc">{industry.description}</p>
          <button
            type="button"
            className="dfl-m-cta"
            tabIndex={isExpanded ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation();
              onOpen(index);
            }}
          >
            Explore {industry.name}
            <span className="dfl-m-cta-arrow" aria-hidden="true">
              →
            </span>
          </button>
          <span className="dfl-m-count" aria-hidden="true">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
});

/* ============================================================
   DECK
   ============================================================ */
export default function DynamicFrameLayoutMobile() {
  const navigate = useNavigate();
  const cardsRef = useRef([]);
  const [expanded, setExpanded] = useState(null); // nothing open on arrival

  const registerCard = useCallback((index, el) => {
    cardsRef.current[index] = el;
  }, []);

  const handleSelect = useCallback((index) => {
    setExpanded((prev) => (prev === index ? null : index));
    if (navigator.vibrate) navigator.vibrate(10);

    requestAnimationFrame(() => {
      const el = cardsRef.current[index];
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }, []);

  const handleOpen = useCallback(
    (index) => {
      navigate(`/industry/${industries[index].slug}`);
    },
    [navigate],
  );

  return (
    <section
      className={`dfl-m-section${expanded !== null ? " has-open" : ""}`}
      aria-label="Industries"
    >

      <div className="dfl-m-deck">
        {industries.map((industry, index) => (
          <IndustryCard
            key={industry.slug + index}
            industry={industry}
            index={index}
            total={industries.length}
            isExpanded={expanded === index}
            isOpenElsewhere={expanded !== null && expanded !== index}
            onSelect={handleSelect}
            onOpen={handleOpen}
            registerCard={registerCard}
          />
        ))}
      </div>
    </section>
  );
}

// DynamicFrameLayoutMobile.jsx  ·  v5  ·  simple premium vertical card list (mobile)
//
// No stacked deck, no sticky, no overlap, no expand/collapse, no hover, no video.
// 10 full-width cards, one below another, 180–220px tall.
// Image fills the card + numbered label top-center + industry name centered
// + ">" arrow bottom-right + iOS-style touch ripple on tap.
// Tap anywhere on a card navigates straight to the industry page.
import { memo, useCallback, useRef, useState } from "react";
import "./DynamicFrameLayoutMobile.css";
import { useNavigate } from "react-router-dom";

import realEstateImg from "../assets/real-estateimg.png";
import financeImg from "../assets/bfsi-img.png";
import travelImg from "../assets/travelimg.png";
import healthImg from "../assets/healthimg.png";
import retailImg from "../assets/Retailimg.png";
import automotiveImg from "../assets/automotiveimg.png";
import b2bImg from "../assets/b2bimg.png";
import fashionImg from "../assets/fashionimg.png";

// TODO: replace with real Govt & Politics image/video assets once available.
// Using a placeholder (falls back to fashionImg) so the card renders correctly
// until the real creative is dropped in.
import govtPlaceholderImg from "../assets/fashionimg.png";
// import govtPoliticsVideo from "../assets/govt-politics.mp4"; // placeholder for future video preview

const industries = [
  { name: "Real Estate", image: realEstateImg, slug: "real-estate" },
  { name: "Finance", image: financeImg, slug: "bfsi" },
  { name: "Travel & Hospitality", image: travelImg, slug: "travel" },
  { name: "Health & Wellness", image: healthImg, slug: "health" },
  { name: "Retail & D2C", image: retailImg, slug: "retail" },
  { name: "Automotive", image: automotiveImg, slug: "automotive" },
  { name: "B2B & SaaS", image: b2bImg, slug: "b2b" },
  { name: "Fashion & Lifestyle", image: fashionImg, slug: "fashion" },
  {
    name: "Internal Communication",
    image: fashionImg,
    slug: "internal-communication",
  },
  {
    name: "Govt & Politics",
    image: govtPlaceholderImg, // placeholder — swap in real asset
    video: null, // placeholder — swap in real asset when video previews are added back
    slug: "govt-politics",
  },
];

/* Only real touch devices get the ripple — mouse/pen pointers are skipped. */
const isTouchPointer = (e) => e.pointerType === "touch";

const IndustryCard = memo(function IndustryCard({ industry, index, onOpen }) {
  const cardRef = useRef(null);
  const rippleIdRef = useRef(0);
  const [ripples, setRipples] = useState([]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpen(industry.slug);
      }
    },
    [industry.slug, onOpen],
  );

  const spawnRipple = useCallback((e) => {
    if (!isTouchPointer(e)) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Size the ripple so it always covers the full card from the tap point.
    const maxDist = Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y),
    );
    const size = maxDist * 2;

    const id = rippleIdRef.current++;
    setRipples((prev) => [...prev, { id, x, y, size }]);

    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  }, []);

  const label = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={cardRef}
      role="link"
      tabIndex={0}
      aria-label={`Open ${industry.name} industry page`}
      className="dfl-m-card"
      onClick={() => onOpen(industry.slug)}
      onKeyDown={handleKeyDown}
      onPointerDown={spawnRipple}
    >
      <div
        className="dfl-m-card-bg"
        style={{ backgroundImage: `url(${industry.image})` }}
      />
      <div className="dfl-m-card-scrim" />

      <span className="dfl-m-number">
        {label} 
      </span>

      <h3 className="dfl-m-name">{industry.name}</h3>

      <span className="dfl-m-arrow" aria-hidden="true">
        &gt;
      </span>

      <span className="dfl-m-ripple-layer" aria-hidden="true">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="dfl-m-ripple"
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
              marginLeft: -r.size / 2,
              marginTop: -r.size / 2,
            }}
          />
        ))}
      </span>
    </article>
  );
});

export default function DynamicFrameLayoutMobile() {
  const navigate = useNavigate();

  const handleOpen = useCallback(
    (slug) => {
      navigate(`/industry/${slug}`);
    },
    [navigate],
  );

  return (
    <section className="dfl-m-section" aria-label="Industries">
      <div className="dfl-m-list">
        {industries.map((industry, index) => (
          <IndustryCard
            key={industry.slug}
            industry={industry}
            index={index}
            onOpen={handleOpen}
          />
        ))}
      </div>
    </section>
  );
}
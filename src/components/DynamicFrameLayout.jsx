import { useState, useEffect, useRef } from "react";
import "./DynamicFrameLayout.css";
import { FaExpand, FaPlay, FaExternalLinkAlt } from "react-icons/fa";

import realEstateVideo from "../assets/real-estate.mp4";
import bfsiVideo from "../assets/bfsi.mp4";
import travelVideo from "../assets/travel.mp4";
import healthVideo from "../assets/health.mp4";
import retailVideo from "../assets/Retail.mp4";
import automotiveVideo from "../assets/automotive.mp4";
import b2bVideo from "../assets/b2b.mp4";
import techVideo from "../assets/tech.mp4";
import fashionVideo from "../assets/fashion.mp4";

const industries = [
  { name: "Real Estate",         video: realEstateVideo, className: "real-estate" },
  { name: "BFSI",                video: bfsiVideo,       className: "bfsi"        },
  { name: "Travel & Hospitality",video: travelVideo,     className: "travel"      },
  { name: "Health & Wellness",   video: healthVideo,     className: "health"      },
  { name: "Retail & D2C",        video: retailVideo,     className: "retail"      },
  { name: "Automotive",          video: automotiveVideo, className: "automotive"  },
  { name: "B2B & SaaS",          video: b2bVideo,        className: "saas"        },
  { name: "Tech & Startups",     video: techVideo,       className: "tech"        },
  { name: "Fashion & Lifestyle", video: fashionVideo,    className: "fashion"     },
];

function getPos(index) {
  return { row: Math.floor(index / 3), col: index % 3 };
}

/* ── Letter-eraser hook ──────────────────────────────────────
   When active=true  → strips letters from the front one-by-one
   When active=false → instantly restores full text           */
function useLetterErase(fullText, active) {
  const [displayed, setDisplayed] = useState(fullText);
  const timerRef = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);

    if (active) {
      // Start erasing from the beginning, one letter every 40 ms
      let len = fullText.length;
      timerRef.current = setInterval(() => {
        len -= 1;
        if (len <= 0) {
          setDisplayed("");
          clearInterval(timerRef.current);
        } else {
          setDisplayed(fullText.slice(fullText.length - len));
        }
      }, 40);
    } else {
      setDisplayed(fullText);
    }

    return () => clearInterval(timerRef.current);
  }, [active, fullText]);

  return displayed;
}

/* Individual card so each can own its own eraser hook */
function IndustryCard({ industry, index, hovered, setHovered }) {
  const isHovered = hovered === index;
  const isDimmed  = hovered !== null && !isHovered;

  const displayedName = useLetterErase(industry.name, isHovered);

  /* Grid sizing */
  const { row, col } = getPos(index);
  const { row: hRow, col: hCol } = hovered !== null ? getPos(hovered) : { row: -1, col: -1 };

  return (
    <div
      className={`dfl-card ${industry.className}${isHovered ? " is-hovered" : ""}${isDimmed ? " is-dimmed" : ""}`}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      {/* Video — only renders on hover card */}
      <video
        className={`dfl-video${isHovered ? " dfl-video--visible" : ""}`}
        src={industry.video}
        muted
        loop
        autoPlay
        playsInline
        preload="none"
      />

      {/* Dark base overlay */}
      <div className="dfl-overlay" />

      {/* Floating controls */}
      <div className={`dfl-controls${isHovered ? " dfl-controls--visible" : ""}`}>
        <button className="dfl-ctrl-btn" aria-label="Expand"><FaExpand size={10} /></button>
        <button className="dfl-ctrl-btn" aria-label="Play"><FaPlay size={10} /></button>
        <button className="dfl-ctrl-btn" aria-label="Open"><FaExternalLinkAlt size={10} /></button>
      </div>

      {/* Centered title block */}
      <div className={`dfl-title-block${isHovered ? " dfl-title-block--erasing" : ""}`}>
        <h3 className="dfl-name">
          {isHovered
            ? (displayedName.length > 0
                ? <><span className="dfl-name-ghost">{industry.name}</span><span className="dfl-name-visible">{displayedName}</span></>
                : null)
            : industry.name
          }
        </h3>
        {/* Animated separator line */}
        <div className={`dfl-sep${isHovered ? " dfl-sep--shrink" : ""}`} />
      </div>
    </div>
  );
}

export default function DynamicFrameLayout() {
  const [hovered, setHovered] = useState(null);

  const getColTemplate = () => {
    if (hovered === null) return "repeat(3, 1fr)";
    const { col: hCol } = getPos(hovered);
    return [0, 1, 2].map(c => c === hCol ? "2.1fr" : "0.7fr").join(" ");
  };

  const getRowTemplate = () => {
    if (hovered === null) return "repeat(3, 1fr)";
    const { row: hRow } = getPos(hovered);
    return [0, 1, 2].map(r => r === hRow ? "2.1fr" : "0.7fr").join(" ");
  };

  return (
    <div
      className="dfl-grid"
      style={{
        gridTemplateColumns: getColTemplate(),
        gridTemplateRows:    getRowTemplate(),
      }}
    >
      {industries.map((industry, index) => (
        <IndustryCard
          key={index}
          industry={industry}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}

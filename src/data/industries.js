// -----------------------------------------------------------------------------
// industries.js
// CHANGES:
// 1. Removed the `theme` object (primary + gradient) from every industry.
//    Backgrounds now come purely from images (hero image + per-card photos).
// 2. Every industry now has EXACTLY ONE problem = 6 cards, in this order:
//      Category → Customer Stage → Marketing Challenge →
//      What this means? → The Personlyze Fix → Why This Works?
// 3. Tech previously had 12 cards (2 problems). Kept only the first 6
//    (the "signup-activation" problem). Removed "feature-adoption".
// 4. No other content was edited — copy, slugs, images, className unchanged.
// -----------------------------------------------------------------------------

import realEstateImg from "../assets/real-estateimg.png";
import bfsiImg from "../assets/bfsi-img.png";
import travelImg from "../assets/travelimg.png";
import healthImg from "../assets/healthimg.png";
import retailImg from "../assets/Retailimg.png";
import automotiveImg from "../assets/automotiveimg.png";
import b2bImg from "../assets/b2bimg.png";
import techImg from "../assets/techimg.png";
import fashionImg from "../assets/fashionimg.png";

const industries = [
  {
    slug: "real-estate",
    name: "Real Estate",
    image: realEstateImg,
    className: "real-estate",
    heroTitle: "Real Estate",
    heroDescription:
      "AI-driven engagement for developers and brokers — turning cold leads into site visits, and site visits into signed bookings.",
    cards: [
      { id: "re-1", title: "Category", content: "Conversion" },
      { id: "re-2", title: "Customer Stage", content: "Consideration" },
      {
        id: "re-3",
        title: "Marketing Challenge",
        content:
          "Warm walk-ins go cold within days due to slow, generic follow-up.",
      },
      {
        id: "re-4",
        title: "What this means?",
        content:
          "Unanswered objections about price, layout or possession date kill momentum after the visit and the buyer drifts to another project.",
      },
      {
        id: "re-5",
        title: "The Personlyze Fix",
        content:
          "Trigger a same-day AI follow-up that directly addresses the buyer's specific objections raised during the visit.",
      },
      {
        id: "re-6",
        title: "Why This Works?",
        content:
          "Answering real concerns while interest is still fresh keeps the buyer engaged and dramatically shortens the path to booking.",
      },
    ],
  },
  {
    slug: "bfsi",
    name: "BFSI",
    image: bfsiImg,
    className: "bfsi",
    heroTitle: "BFSI",
    heroDescription:
      "AI-led engagement for banks, NBFCs and insurers — turning loan and policy enquiries into disbursed, retained customers.",
    cards: [
      { id: "bf-1", title: "Category", content: "Lead Generation" },
      { id: "bf-2", title: "Customer Stage", content: "Acquisition" },
      {
        id: "bf-3",
        title: "Marketing Challenge",
        content: "RM time is wasted on unqualified loan leads from paid campaigns.",
      },
      {
        id: "bf-4",
        title: "What this means?",
        content:
          "Most calls end before eligibility is even established, driving cost-per-disbursal up and RM productivity down.",
      },
      {
        id: "bf-5",
        title: "The Personlyze Fix",
        content:
          "AI pre-qualifies income, employment and intent on WhatsApp, then routes only scored, ready leads to RMs.",
      },
      {
        id: "bf-6",
        title: "Why This Works?",
        content:
          "RMs start each conversation with a complete profile and high intent, dramatically improving conversion per call.",
      },
    ],
  },
  {
    slug: "travel",
    name: "Travel & Hospitality",
    image: travelImg,
    className: "travel",
    heroTitle: "Travel & Hospitality",
    heroDescription:
      "AI-powered guest engagement that turns browsers into bookers, and bookers into repeat guests.",
    cards: [
      { id: "tv-1", title: "Category", content: "Lead Generation" },
      { id: "tv-2", title: "Customer Stage", content: "Consideration" },
      {
        id: "tv-3",
        title: "Marketing Challenge",
        content:
          "Most started bookings are abandoned at the payment or rate-comparison step.",
      },
      {
        id: "tv-4",
        title: "What this means?",
        content:
          "Delayed and generic recovery emails lose the booking entirely as guests move on to OTAs or competing hotels.",
      },
      {
        id: "tv-5",
        title: "The Personlyze Fix",
        content:
          "Send a personalised WhatsApp message within 10 minutes with the exact rate, dates and a one-tap rate lock.",
      },
      {
        id: "tv-6",
        title: "Why This Works?",
        content:
          "Speed and specificity recapture intent while the trip is still top of mind, recovering bookings that email would miss.",
      },
    ],
  },
  {
    slug: "health",
    name: "Health & Wellness",
    image: healthImg,
    className: "health",
    heroTitle: "Health & Wellness",
    heroDescription:
      "AI-driven patient engagement that improves appointment adherence, reduces no-shows, and keeps patients on their care path.",
    cards: [
      { id: "hl-1", title: "Category", content: "Retention" },
      { id: "hl-2", title: "Customer Stage", content: "Pre-Appointment" },
      {
        id: "hl-3",
        title: "Marketing Challenge",
        content: "No-shows directly cost clinics scheduled revenue every day.",
      },
      {
        id: "hl-4",
        title: "What this means?",
        content:
          "A single reminder is easy to forget, especially for routine consults, and the slot stays empty without a chance to refill.",
      },
      {
        id: "hl-5",
        title: "The Personlyze Fix",
        content:
          "AI confirmation and reminder sequence on WhatsApp with one-tap reschedule and a waitlist auto-fill.",
      },
      {
        id: "hl-6",
        title: "Why This Works?",
        content:
          "Multiple light, well-timed touches catch patients before they forget and let the clinic recover empty slots in real time.",
      },
    ],
  },
  {
    slug: "retail",
    name: "Retail & D2C",
    image: retailImg,
    className: "retail",
    heroTitle: "Retail & D2C",
    heroDescription:
      "AI-powered commerce engagement that recovers lost carts, personalises offers, and turns one-time buyers into repeat customers.",
    cards: [
      { id: "rt-1", title: "Category", content: "Conversion" },
      { id: "rt-2", title: "Customer Stage", content: "Consideration" },
      {
        id: "rt-3",
        title: "Marketing Challenge",
        content: "The majority of online carts are abandoned at or near checkout.",
      },
      {
        id: "rt-4",
        title: "What this means?",
        content:
          "Slow, generic recovery emails miss the high-intent window and the sale is lost to a competitor or marketplace.",
      },
      {
        id: "rt-5",
        title: "The Personlyze Fix",
        content:
          "AI sends a WhatsApp nudge within 15 minutes showing the exact cart, available stock and a one-tap checkout link.",
      },
      {
        id: "rt-6",
        title: "Why This Works?",
        content:
          "High visibility plus relevance recaptures intent before it fades and consistently outperforms email recovery.",
      },
    ],
  },
  {
    slug: "automotive",
    name: "Automotive",
    image: automotiveImg,
    className: "automotive",
    heroTitle: "Automotive",
    heroDescription:
      "AI-driven engagement for dealerships and service centers — from first enquiry to test drive to lifetime service retention.",
    cards: [
      { id: "au-1", title: "Category", content: "Lead Generation" },
      { id: "au-2", title: "Customer Stage", content: "Acquisition" },
      {
        id: "au-3",
        title: "Marketing Challenge",
        content:
          "Online enquiries rarely turn into actual test drives at the showroom.",
      },
      {
        id: "au-4",
        title: "What this means?",
        content:
          "Slow callbacks lose buyers to faster dealers — even those representing competing brands.",
      },
      {
        id: "au-5",
        title: "The Personlyze Fix",
        content:
          "AI responds within minutes with model details, EMI options and a direct test-drive booking link.",
      },
      {
        id: "au-6",
        title: "Why This Works?",
        content:
          "Speed wins the buyer regardless of brand loyalty and lifts test-drive show rate significantly.",
      },
    ],
  },
  {
    slug: "b2b",
    name: "B2B & SaaS",
    image: b2bImg,
    className: "saas",
    heroTitle: "B2B & SaaS",
    heroDescription:
      "AI-driven engagement across the funnel — from demo request to trial activation to expansion revenue.",
    cards: [
      { id: "b2-1", title: "Category", content: "Lead Generation" },
      { id: "b2-2", title: "Customer Stage", content: "Consideration" },
      {
        id: "b2-3",
        title: "Marketing Challenge",
        content: "A meaningful share of booked demos turn into no-shows.",
      },
      {
        id: "b2-4",
        title: "What this means?",
        content:
          "Generic reminders don't reconnect the prospect to the actual problem they wanted solved, so the call drops in priority.",
      },
      {
        id: "b2-5",
        title: "The Personlyze Fix",
        content:
          "AI sends context-specific reminders referencing the prospect's use case, role and pain point before the call.",
      },
      {
        id: "b2-6",
        title: "Why This Works?",
        content:
          "Reminding the buyer of their own problem — not your product — meaningfully lifts show-up rate.",
      },
    ],
  },
  {
    slug: "tech",
    name: "Tech & Startups",
    image: techImg,
    className: "tech",
    heroTitle: "Tech & Startups",
    heroDescription:
      "AI-powered growth engagement built for speed — turning sign-ups into activated users and early adopters into advocates.",
    // Kept ONLY the first 6 cards (signup-activation problem). Removed feature-adoption.
    cards: [
      { id: "tc-1", title: "Category", content: "Conversion" },
      { id: "tc-2", title: "Customer Stage", content: "New User" },
      {
        id: "tc-3",
        title: "Marketing Challenge",
        content: "A large share of new sign-ups never return after the first session.",
      },
      {
        id: "tc-4",
        title: "What this means?",
        content:
          "Users churn before reaching the product's value moment, so paid acquisition spend is effectively wasted.",
      },
      {
        id: "tc-5",
        title: "The Personlyze Fix",
        content:
          "AI nudges the exact onboarding step each user dropped at, across email, WhatsApp and in-app.",
      },
      {
        id: "tc-6",
        title: "Why This Works?",
        content:
          "Addressing the real drop-off point — not a generic Day 2 email — drives meaningful return and activation.",
      },
    ],
  },
  {
    slug: "fashion",
    name: "Fashion & Lifestyle",
    image: fashionImg,
    className: "fashion",
    heroTitle: "Fashion & Lifestyle",
    heroDescription:
      "AI-powered styling and engagement that turns browsers into buyers and one-time purchases into a wardrobe relationship.",
    cards: [
      { id: "fs-1", title: "Category", content: "Conversion" },
      { id: "fs-2", title: "Customer Stage", content: "Consideration" },
      {
        id: "fs-3",
        title: "Marketing Challenge",
        content:
          "Fashion cart abandonment is driven mostly by fit and styling doubt, not price.",
      },
      {
        id: "fs-4",
        title: "What this means?",
        content:
          "Generic discount codes don't solve the real concern, so the cart stays abandoned despite the offer.",
      },
      {
        id: "fs-5",
        title: "The Personlyze Fix",
        content:
          "An AI stylist addresses fit, styling and occasion questions directly on WhatsApp with curated alternatives.",
      },
      {
        id: "fs-6",
        title: "Why This Works?",
        content:
          "Solving the real hesitation converts far better than a discount and protects margin at the same time.",
      },
    ],
  },
];

export default industries;

// -----------------------------------------------------------------------------
// Data model:
//   - Each industry has TWO independent challenges.
//   - Each challenge has:
//       problem: string   (short 1-2 line problem statement shown on the card)
//       cards:   5 items in this exact order:
//         1. What this means
//         2. Personlyze Intervention
//         3. Video
//         4. Why this works
//         5. Expected Outcome
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
  /* ========================================================================
   * REAL ESTATE
   * ====================================================================== */
  {
    slug: "real-estate",
    name: "Real Estate",
    image: realEstateImg,
    className: "real-estate",
    heroTitle: "Real Estate",
    heroDescription:
      "AI-driven engagement for developers and brokers — turning cold leads into site visits, and site visits into signed bookings.",
    challenges: [
      {
        problem: "Warm walk-ins go cold within days due to slow, generic follow-up.",
        cards: [
          {
            title: "What this means",
            content:
              "Unanswered objections about price, layout or possession date kill momentum after the visit and the buyer drifts to another project.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Trigger a same-day AI follow-up that directly addresses the buyer's specific objections raised during the visit.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Answering real concerns while interest is still fresh keeps the buyer engaged and dramatically shortens the path to booking.",
          },
          {
            title: "Expected Outcome",
            content: "Faster follow-up and higher site-visit-to-booking conversion.",
          },
        ],
      },
      {
        problem:
          "High-intent enquiries from portals are lost to faster competing projects.",
        cards: [
          {
            title: "What this means",
            content:
              "Buyers submit interest on multiple projects at once and go with whichever developer engages first with relevant details.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI responds in minutes on WhatsApp with the exact configuration, pricing and a one-tap site-visit booking link.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Speed plus a relevant, low-friction next step captures the buyer before another developer does.",
          },
          {
            title: "Expected Outcome",
            content: "More qualified leads and higher site-visit bookings.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * BFSI
   * ====================================================================== */
  {
    slug: "bfsi",
    name: "BFSI",
    image: bfsiImg,
    className: "bfsi",
    heroTitle: "BFSI",
    heroDescription:
      "AI-led engagement for banks, NBFCs and insurers — turning loan and policy enquiries into disbursed, retained customers.",
    challenges: [
      {
        problem: "RM time is wasted on unqualified loan leads from paid campaigns.",
        cards: [
          {
            title: "What this means",
            content:
              "Most calls end before eligibility is even established, driving cost-per-disbursal up and RM productivity down.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI pre-qualifies income, employment and intent on WhatsApp, then routes only scored, ready leads to RMs.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "RMs start each conversation with a complete profile and high intent, dramatically improving conversion per call.",
          },
          {
            title: "Expected Outcome",
            content: "More qualified leads and higher disbursal per RM.",
          },
        ],
      },
      {
        problem: "Policy renewals lapse silently, eroding retention and LTV.",
        cards: [
          {
            title: "What this means",
            content:
              "Generic reminders don't surface the customer's specific policy, premium or upgrade options, so renewals slip past due dates.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI sends a personalised WhatsApp sequence with the exact premium, benefits and a one-tap renewal link.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Relevance and a frictionless payment path keep customers on-book instead of lapsing.",
          },
          {
            title: "Expected Outcome",
            content: "Improved customer retention and renewal rate.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * TRAVEL & HOSPITALITY
   * ====================================================================== */
  {
    slug: "travel",
    name: "Travel & Hospitality",
    image: travelImg,
    className: "travel",
    heroTitle: "Travel & Hospitality",
    heroDescription:
      "AI-powered guest engagement that turns browsers into bookers, and bookers into repeat guests.",
    challenges: [
      {
        problem:
          "Most started bookings are abandoned at the payment or rate-comparison step.",
        cards: [
          {
            title: "What this means",
            content:
              "Delayed and generic recovery emails lose the booking entirely as guests move on to OTAs or competing hotels.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Send a personalised WhatsApp message within 10 minutes with the exact rate, dates and a one-tap rate lock.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Speed and specificity recapture intent while the trip is still top of mind, recovering bookings that email would miss.",
          },
          {
            title: "Expected Outcome",
            content: "Reduced booking drop-offs and higher direct conversions.",
          },
        ],
      },
      {
        problem: "Repeat-guest revenue is missed because past guests are re-acquired via OTAs.",
        cards: [
          {
            title: "What this means",
            content:
              "Hotels pay commission again to reach guests they already served, instead of bringing them back directly.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI reactivates past guests on WhatsApp with a tailored offer for their preferred room type and season.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Personal, relevant outreach beats generic OTA listings and rebuilds a direct guest relationship.",
          },
          {
            title: "Expected Outcome",
            content: "Higher repeat bookings and better guest retention.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * HEALTH & WELLNESS
   * ====================================================================== */
  {
    slug: "health",
    name: "Health & Wellness",
    image: healthImg,
    className: "health",
    heroTitle: "Health & Wellness",
    heroDescription:
      "AI-driven patient engagement that improves appointment adherence, reduces no-shows, and keeps patients on their care path.",
    challenges: [
      {
        problem: "No-shows directly cost clinics scheduled revenue every day.",
        cards: [
          {
            title: "What this means",
            content:
              "A single reminder is easy to forget, especially for routine consults, and the slot stays empty without a chance to refill.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI confirmation and reminder sequence on WhatsApp with one-tap reschedule and a waitlist auto-fill.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Multiple light, well-timed touches catch patients before they forget and let the clinic recover empty slots in real time.",
          },
          {
            title: "Expected Outcome",
            content: "Higher appointment bookings and fewer no-shows.",
          },
        ],
      },
      {
        problem: "Patients drop off their treatment plan after the first consultation.",
        cards: [
          {
            title: "What this means",
            content:
              "Without proactive nudges, patients skip follow-up visits and prescribed tests, hurting outcomes and clinic revenue.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI runs a personalised care-path journey on WhatsApp with reminders, education and easy re-booking.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Timely, relevant guidance keeps patients engaged with their treatment instead of falling out of the funnel.",
          },
          {
            title: "Expected Outcome",
            content: "Improved adherence and better patient retention.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * RETAIL & D2C
   * ====================================================================== */
  {
    slug: "retail",
    name: "Retail & D2C",
    image: retailImg,
    className: "retail",
    heroTitle: "Retail & D2C",
    heroDescription:
      "AI-powered commerce engagement that recovers lost carts, personalises offers, and turns one-time buyers into repeat customers.",
    challenges: [
      {
        problem: "The majority of online carts are abandoned at or near checkout.",
        cards: [
          {
            title: "What this means",
            content:
              "Slow, generic recovery emails miss the high-intent window and the sale is lost to a competitor or marketplace.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI sends a WhatsApp nudge within 15 minutes showing the exact cart, available stock and a one-tap checkout link.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "High visibility plus relevance recaptures intent before it fades and consistently outperforms email recovery.",
          },
          {
            title: "Expected Outcome",
            content: "Recovered carts and higher checkout conversion.",
          },
        ],
      },
      {
        problem: "First-time buyers rarely come back for a second purchase.",
        cards: [
          {
            title: "What this means",
            content:
              "Batch newsletters ignore what the buyer actually purchased, so repeat-purchase windows are missed entirely.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI recommends the next-best product on WhatsApp based on past purchase, category and replenishment cycle.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Right product, right time, right channel drives repeat orders that generic campaigns don't.",
          },
          {
            title: "Expected Outcome",
            content: "Higher repeat rate and increased customer LTV.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * AUTOMOTIVE
   * ====================================================================== */
  {
    slug: "automotive",
    name: "Automotive",
    image: automotiveImg,
    className: "automotive",
    heroTitle: "Automotive",
    heroDescription:
      "AI-driven engagement for dealerships and service centers — from first enquiry to test drive to lifetime service retention.",
    challenges: [
      {
        problem: "Online enquiries rarely turn into actual test drives at the showroom.",
        cards: [
          {
            title: "What this means",
            content:
              "Slow callbacks lose buyers to faster dealers — even those representing competing brands.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI responds within minutes with model details, EMI options and a direct test-drive booking link.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Speed wins the buyer regardless of brand loyalty and lifts test-drive show rate significantly.",
          },
          {
            title: "Expected Outcome",
            content: "Higher test-drive show rate and more qualified leads.",
          },
        ],
      },
      {
        problem: "Service customers churn to unauthorised garages after the free-service window.",
        cards: [
          {
            title: "What this means",
            content:
              "Generic service reminders don't convey value, so owners default to cheaper local options and dealer service revenue drops.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI sends personalised service reminders with due-date, cost estimate and a one-tap slot booking on WhatsApp.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Clear value plus zero-friction booking keeps customers within the dealer network for the vehicle's lifetime.",
          },
          {
            title: "Expected Outcome",
            content: "Improved service retention and higher workshop revenue.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * B2B & SAAS
   * ====================================================================== */
  {
    slug: "b2b",
    name: "B2B & SaaS",
    image: b2bImg,
    className: "saas",
    heroTitle: "B2B & SaaS",
    heroDescription:
      "AI-driven engagement across the funnel — from demo request to trial activation to expansion revenue.",
    challenges: [
      {
        problem: "A meaningful share of booked demos turn into no-shows.",
        cards: [
          {
            title: "What this means",
            content:
              "Generic reminders don't reconnect the prospect to the actual problem they wanted solved, so the call drops in priority.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI sends context-specific reminders referencing the prospect's use case, role and pain point before the call.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Reminding the buyer of their own problem — not your product — meaningfully lifts show-up rate.",
          },
          {
            title: "Expected Outcome",
            content: "Increased demo attendance and more qualified pipeline.",
          },
        ],
      },
      {
        problem: "Trial users churn before hitting the product's value moment.",
        cards: [
          {
            title: "What this means",
            content:
              "One-size-fits-all onboarding emails don't address where each trial user actually got stuck, so activation stalls.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI nudges each user at the exact onboarding step they dropped at, across email, WhatsApp and in-app.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Targeted, contextual nudges unblock the specific friction point and consistently lift activation.",
          },
          {
            title: "Expected Outcome",
            content: "Higher trial-to-paid conversion and better activation.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * TECH & STARTUPS
   * ====================================================================== */
  {
    slug: "tech",
    name: "Tech & Startups",
    image: techImg,
    className: "tech",
    heroTitle: "Tech & Startups",
    heroDescription:
      "AI-powered growth engagement built for speed — turning sign-ups into activated users and early adopters into advocates.",
    challenges: [
      {
        problem: "A large share of new sign-ups never return after the first session.",
        cards: [
          {
            title: "What this means",
            content:
              "Users churn before reaching the product's value moment, so paid acquisition spend is effectively wasted.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI nudges the exact onboarding step each user dropped at, across email, WhatsApp and in-app.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Addressing the real drop-off point — not a generic Day 2 email — drives meaningful return and activation.",
          },
          {
            title: "Expected Outcome",
            content: "Higher activation and reduced first-session drop-off.",
          },
        ],
      },
      {
        problem: "Activated users don't discover the features that drive retention.",
        cards: [
          {
            title: "What this means",
            content:
              "Power features stay hidden behind menus, so users never reach the depth of value that makes them stick.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI surfaces the right next feature for each user based on behaviour, role and usage pattern.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Contextual feature nudges deepen product usage and directly improve long-term retention.",
          },
          {
            title: "Expected Outcome",
            content: "Better engagement and stronger user retention.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * FASHION & LIFESTYLE
   * ====================================================================== */
  {
    slug: "fashion",
    name: "Fashion & Lifestyle",
    image: fashionImg,
    className: "fashion",
    heroTitle: "Fashion & Lifestyle",
    heroDescription:
      "AI-powered styling and engagement that turns browsers into buyers and one-time purchases into a wardrobe relationship.",
    challenges: [
      {
        problem:
          "Fashion cart abandonment is driven mostly by fit and styling doubt, not price.",
        cards: [
          {
            title: "What this means",
            content:
              "Generic discount codes don't solve the real concern, so the cart stays abandoned despite the offer.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "An AI stylist addresses fit, styling and occasion questions directly on WhatsApp with curated alternatives.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Solving the real hesitation converts far better than a discount and protects margin at the same time.",
          },
          {
            title: "Expected Outcome",
            content: "Recovered carts with protected margin.",
          },
        ],
      },
      {
        problem: "Returns are high because customers pick the wrong size or style.",
        cards: [
          {
            title: "What this means",
            content:
              "Bracketing behaviour and wrong-fit orders inflate reverse logistics costs and destroy contribution margin.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "AI recommends the right size and style before checkout using purchase history and body-fit signals.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Getting the fit right pre-purchase directly cuts returns and lifts net revenue per order.",
          },
          {
            title: "Expected Outcome",
            content: "Lower return rate and higher net contribution.",
          },
        ],
      },
    ],
  },
];

export default industries;
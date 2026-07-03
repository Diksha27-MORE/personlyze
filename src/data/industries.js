import realEstateVideo from "../assets/real-estate.mp4";
import bfsiVideo from "../assets/bfsi.mp4";
import travelVideo from "../assets/travel.mp4";
import healthVideo from "../assets/health.mp4";
import retailVideo from "../assets/Retail.mp4";
import automotiveVideo from "../assets/automotive.mp4";
import b2bVideo from "../assets/b2b.mp4";
import techVideo from "../assets/tech.mp4";
import fashionVideo from "../assets/fashion.mp4";

/**
 * Each card has six display fields, always rendered in this order with
 * these exact labels in the UI:
 *
 *   Category              -> card.category
 *   Customer Stage        -> card.customerStage
 *   Marketing Challenge   -> card.marketingChallenge
 *   What this means?      -> card.whatThisMeans
 *   The Personlyze Fix    -> card.theFix
 *   Why This Works?       -> card.whyThisWorks
 *
 * `id` is an internal identifier only (for React keys / routing).
 * It must NEVER be rendered in the UI.
 */

const industries = [
  {
    slug: "real-estate",
    name: "Real Estate",
    video: realEstateVideo,
    className: "real-estate",
    theme: {
      primary: "#1f8de0",
      gradient: "linear-gradient(180deg,#1f8de0 0%,#176db3 50%,#0f4e80 100%)",
    },
    heroTitle: "Real Estate",
    heroDescription:
      "AI-driven engagement for developers and brokers — turning cold leads into site visits, and site visits into signed bookings.",
    cards: [
      {
        id: "site-visit-conversion-category",
        title: "Category",
        content: "Conversion",
      },
      {
        id: "site-visit-conversion-customer-stage",
        title: "Customer Stage",
        content: "Consideration",
      },
      {
        id: "site-visit-conversion-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Warm walk-ins go cold within days due to slow, generic follow-up.",
      },
      {
        id: "site-visit-conversion-what-this-means",
        title: "What this means?",
        content:
          "Unanswered objections about price, layout or possession date kill momentum after the visit and the buyer drifts to another project.",
      },
      {
        id: "site-visit-conversion-the-fix",
        title: "The Personlyze Fix",
        content:
          "Trigger a same-day AI follow-up that directly addresses the buyer's specific objections raised during the visit.",
      },
      {
        id: "site-visit-conversion-why-this-works",
        title: "Why This Works?",
        content:
          "Answering real concerns while interest is still fresh keeps the buyer engaged and dramatically shortens the path to booking.",
      },
      {
        id: "post-booking-retention-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "post-booking-retention-customer-stage",
        title: "Customer Stage",
        content: "Onboarding",
      },
      {
        id: "post-booking-retention-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Buyers go quiet between booking and possession, creating cancellation risk.",
      },
      {
        id: "post-booking-retention-what-this-means",
        title: "What this means?",
        content:
          "Long silence between milestones makes buyers doubt the decision and become more receptive to competitor offers or refunds.",
      },
      {
        id: "post-booking-retention-the-fix",
        title: "The Personlyze Fix",
        content:
          "Automated milestone updates with construction photos, payment schedule reminders and personalised RM check-ins.",
      },
      {
        id: "post-booking-retention-why-this-works",
        title: "Why This Works?",
        content:
          "Visible progress and consistent communication keep buyers confident, reduce cancellations and improve referrals.",
      },
      {
        id: "channel-partner-enablement-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "channel-partner-enablement-customer-stage",
        title: "Customer Stage",
        content: "Acquisition",
      },
      {
        id: "channel-partner-enablement-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Inconsistent broker follow-up causes leads to leak across the channel.",
      },
      {
        id: "channel-partner-enablement-what-this-means",
        title: "What this means?",
        content:
          "Brokers misrepresent pricing or inventory, and the developer has no visibility into how leads are being worked, hurting trust at closing.",
      },
      {
        id: "channel-partner-enablement-the-fix",
        title: "The Personlyze Fix",
        content:
          "Share project briefs, pricing and updates automatically with brokers, and track every lead through a centralised AI workflow.",
      },
      {
        id: "channel-partner-enablement-why-this-works",
        title: "Why This Works?",
        content:
          "Real-time visibility and standardised messaging let the developer step in before leads go cold or get mis-sold.",
      },
      {
        id: "site-visit-no-show-recovery-category",
        title: "Category",
        content: "Conversion",
      },
      {
        id: "site-visit-no-show-recovery-customer-stage",
        title: "Customer Stage",
        content: "Consideration",
      },
      {
        id: "site-visit-no-show-recovery-marketing-challenge",
        title: "Marketing Challenge",
        content: "A large share of confirmed site visits never show up.",
      },
      {
        id: "site-visit-no-show-recovery-what-this-means",
        title: "What this means?",
        content:
          "Missed slots are rarely re-contacted in time, and the prospect's intent fades before the sales team reaches back out.",
      },
      {
        id: "site-visit-no-show-recovery-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI sends an instant same-hour reschedule message with a short video walkthrough and one-tap booking options.",
      },
      {
        id: "site-visit-no-show-recovery-why-this-works",
        title: "Why This Works?",
        content:
          "Catching the buyer while intent is still warm recovers high-value visits that would otherwise be written off.",
      },
      {
        id: "negotiation-stage-support-category",
        title: "Category",
        content: "Conversion",
      },
      {
        id: "negotiation-stage-support-customer-stage",
        title: "Customer Stage",
        content: "Decision",
      },
      {
        id: "negotiation-stage-support-marketing-challenge",
        title: "Marketing Challenge",
        content: "Price and payment-plan negotiations drag deals on for weeks.",
      },
      {
        id: "negotiation-stage-support-what-this-means",
        title: "What this means?",
        content:
          "Manual follow-ups feel pushy and slow, and buyers stall as they compare options with other developers in parallel.",
      },
      {
        id: "negotiation-stage-support-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI delivers personalised payment-plan comparisons, EMI breakdowns and limited-time offers tailored to the buyer's profile.",
      },
      {
        id: "negotiation-stage-support-why-this-works",
        title: "Why This Works?",
        content:
          "Clear, on-demand financial clarity removes hesitation and helps the buyer commit before the offer window closes.",
      },
    ],
  },
  {
    slug: "bfsi",
    name: "BFSI",
    video: bfsiVideo,
    className: "bfsi",
    theme: {
      primary: "#8b3fd9",
      gradient: "linear-gradient(180deg,#8b3fd9 0%,#6f2eb3 50%,#521d85 100%)",
    },
    heroTitle: "BFSI",
    heroDescription:
      "AI-led engagement for banks, NBFCs and insurers — turning loan and policy enquiries into disbursed, retained customers.",
    cards: [
      {
        id: "loan-lead-qualification-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "loan-lead-qualification-customer-stage",
        title: "Customer Stage",
        content: "Acquisition",
      },
      {
        id: "loan-lead-qualification-marketing-challenge",
        title: "Marketing Challenge",
        content: "RM time is wasted on unqualified loan leads from paid campaigns.",
      },
      {
        id: "loan-lead-qualification-what-this-means",
        title: "What this means?",
        content:
          "Most calls end before eligibility is even established, driving cost-per-disbursal up and RM productivity down.",
      },
      {
        id: "loan-lead-qualification-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI pre-qualifies income, employment and intent on WhatsApp, then routes only scored, ready leads to RMs.",
      },
      {
        id: "loan-lead-qualification-why-this-works",
        title: "Why This Works?",
        content:
          "RMs start each conversation with a complete profile and high intent, dramatically improving conversion per call.",
      },
      {
        id: "policy-renewal-nudges-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "policy-renewal-nudges-customer-stage",
        title: "Customer Stage",
        content: "Renewal",
      },
      {
        id: "policy-renewal-nudges-marketing-challenge",
        title: "Marketing Challenge",
        content: "Generic renewal reminders are ignored, keeping renewal rates flat.",
      },
      {
        id: "policy-renewal-nudges-what-this-means",
        title: "What this means?",
        content:
          "Customers don't see what they personally lose by not renewing, so they either delay or move to a competitor for a better quote.",
      },
      {
        id: "policy-renewal-nudges-the-fix",
        title: "The Personlyze Fix",
        content:
          "Personalised WhatsApp nudges that name the exact no-claim bonus, sum insured and benefits at risk if they don't renew.",
      },
      {
        id: "policy-renewal-nudges-why-this-works",
        title: "Why This Works?",
        content:
          "A concrete, personal loss is far more persuasive than a generic reminder and pushes customers to renew on time.",
      },
      {
        id: "claims-anxiety-support-category",
        title: "Category",
        content: "Support",
      },
      {
        id: "claims-anxiety-support-customer-stage",
        title: "Customer Stage",
        content: "Post-Purchase",
      },
      {
        id: "claims-anxiety-support-marketing-challenge",
        title: "Marketing Challenge",
        content: "Repeat calls asking for claim status overload support teams.",
      },
      {
        id: "claims-anxiety-support-what-this-means",
        title: "What this means?",
        content:
          "Customers chase updates because no one proactively tells them where the claim stands, eroding trust and inflating service costs.",
      },
      {
        id: "claims-anxiety-support-the-fix",
        title: "The Personlyze Fix",
        content:
          "Proactive AI updates at every claim milestone, with clear next steps and a direct contact for escalation.",
      },
      {
        id: "claims-anxiety-support-why-this-works",
        title: "Why This Works?",
        content:
          "Removing the need to chase reduces inbound volume, builds long-term trust and improves renewal intent.",
      },
      {
        id: "cross-sell-at-life-events-category",
        title: "Category",
        content: "Growth",
      },
      {
        id: "cross-sell-at-life-events-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "cross-sell-at-life-events-marketing-challenge",
        title: "Marketing Challenge",
        content: "Cross-sell campaigns ignore the customer's life-event context.",
      },
      {
        id: "cross-sell-at-life-events-what-this-means",
        title: "What this means?",
        content:
          "Generic product blasts go to the wrong audience at the wrong time, hurting both conversion and brand perception.",
      },
      {
        id: "cross-sell-at-life-events-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI flags life-event signals — new job, marriage, child, home purchase — and triggers relevant, well-timed offers.",
      },
      {
        id: "cross-sell-at-life-events-why-this-works",
        title: "Why This Works?",
        content:
          "Contextual, timely offers feel like financial guidance rather than a sales push, lifting take-up sharply.",
      },
      {
        id: "kyc-document-followup-category",
        title: "Category",
        content: "Conversion",
      },
      {
        id: "kyc-document-followup-customer-stage",
        title: "Customer Stage",
        content: "Onboarding",
      },
      {
        id: "kyc-document-followup-marketing-challenge",
        title: "Marketing Challenge",
        content: "A meaningful share of applications stall on missing documents.",
      },
      {
        id: "kyc-document-followup-what-this-means",
        title: "What this means?",
        content:
          "Customers receive vague 'pending' messages and abandon the application midway, especially in higher-ticket products.",
      },
      {
        id: "kyc-document-followup-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI names the exact missing document, shares a secure upload link and follows up at the right cadence.",
      },
      {
        id: "kyc-document-followup-why-this-works",
        title: "Why This Works?",
        content:
          "A specific, frictionless ask gets completed; a vague one gets ignored — recovering otherwise-lost applications.",
      },
      {
        id: "fraud-alert-engagement-category",
        title: "Category",
        content: "Support",
      },
      {
        id: "fraud-alert-engagement-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "fraud-alert-engagement-marketing-challenge",
        title: "Marketing Challenge",
        content: "Fraud alerts blend into routine notifications and get missed.",
      },
      {
        id: "fraud-alert-engagement-what-this-means",
        title: "What this means?",
        content:
          "Real threats go unnoticed until financial damage is done, which then drives disputes, churn and reputational risk.",
      },
      {
        id: "fraud-alert-engagement-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI escalates channel and urgency — SMS, WhatsApp, voice — to match the severity and confirmed risk of the alert.",
      },
      {
        id: "fraud-alert-engagement-why-this-works",
        title: "Why This Works?",
        content:
          "Matching urgency to real risk drives immediate customer action and reduces fraud losses materially.",
      },
    ],
  },
  {
    slug: "travel",
    name: "Travel & Hospitality",
    video: travelVideo,
    className: "travel",
    theme: {
      primary: "#f2c14e",
      gradient: "linear-gradient(180deg,#f2c14e 0%,#d9a733 50%,#b88716 100%)",
    },
    heroTitle: "Travel & Hospitality",
    heroDescription:
      "AI-powered guest engagement that turns browsers into bookers, and bookers into repeat guests.",
    cards: [
      {
        id: "abandoned-booking-recovery-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "abandoned-booking-recovery-customer-stage",
        title: "Customer Stage",
        content: "Consideration",
      },
      {
        id: "abandoned-booking-recovery-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Most started bookings are abandoned at the payment or rate-comparison step.",
      },
      {
        id: "abandoned-booking-recovery-what-this-means",
        title: "What this means?",
        content:
          "Delayed and generic recovery emails lose the booking entirely as guests move on to OTAs or competing hotels.",
      },
      {
        id: "abandoned-booking-recovery-the-fix",
        title: "The Personlyze Fix",
        content:
          "Send a personalised WhatsApp message within 10 minutes with the exact rate, dates and a one-tap rate lock.",
      },
      {
        id: "abandoned-booking-recovery-why-this-works",
        title: "Why This Works?",
        content:
          "Speed and specificity recapture intent while the trip is still top of mind, recovering bookings that email would miss.",
      },
      {
        id: "pre-stay-upsell-category",
        title: "Category",
        content: "Growth",
      },
      {
        id: "pre-stay-upsell-customer-stage",
        title: "Customer Stage",
        content: "Pre-Stay",
      },
      {
        id: "pre-stay-upsell-marketing-challenge",
        title: "Marketing Challenge",
        content: "Significant add-on revenue is left on the table before arrival.",
      },
      {
        id: "pre-stay-upsell-what-this-means",
        title: "What this means?",
        content:
          "Identical upsell offers go to every guest regardless of trip purpose, season or party size, hurting take-up.",
      },
      {
        id: "pre-stay-upsell-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI sends tailored upsells — airport transfers, spa, dining, experiences — 3–5 days before arrival based on guest profile.",
      },
      {
        id: "pre-stay-upsell-why-this-works",
        title: "Why This Works?",
        content:
          "Relevance and timing multiply offer conversion and directly lift revenue per available room.",
      },
      {
        id: "post-stay-loyalty-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "post-stay-loyalty-customer-stage",
        title: "Customer Stage",
        content: "Post-Purchase",
      },
      {
        id: "post-stay-loyalty-marketing-challenge",
        title: "Marketing Challenge",
        content: "Guests skip loyalty sign-up and review prompts after checkout.",
      },
      {
        id: "post-stay-loyalty-what-this-means",
        title: "What this means?",
        content:
          "Generic thank-you emails get ignored, so the property loses both repeat-stay potential and public reviews.",
      },
      {
        id: "post-stay-loyalty-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI sends a personalised post-stay message referencing the actual stay, with a one-tap review and loyalty enrollment.",
      },
      {
        id: "post-stay-loyalty-why-this-works",
        title: "Why This Works?",
        content:
          "Specific, personal asks convert significantly better than generic follow-ups and build a long-term guest relationship.",
      },
      {
        id: "itinerary-personalisation-category",
        title: "Category",
        content: "Growth",
      },
      {
        id: "itinerary-personalisation-customer-stage",
        title: "Customer Stage",
        content: "Pre-Stay",
      },
      {
        id: "itinerary-personalisation-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Guests miss on-site amenities, experiences and F&B that drive ancillary revenue.",
      },
      {
        id: "itinerary-personalisation-what-this-means",
        title: "What this means?",
        content:
          "Without guidance, guests default to outside options and the property loses both revenue and satisfaction lift.",
      },
      {
        id: "itinerary-personalisation-the-fix",
        title: "The Personlyze Fix",
        content:
          "An AI concierge sends a tailored pre-arrival itinerary based on the guest's profile, trip purpose and stay length.",
      },
      {
        id: "itinerary-personalisation-why-this-works",
        title: "Why This Works?",
        content:
          "Curated suggestions feel like genuine service, lifting on-property spend and review scores at the same time.",
      },
      {
        id: "group-event-booking-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "group-event-booking-customer-stage",
        title: "Customer Stage",
        content: "Consideration",
      },
      {
        id: "group-event-booking-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Slow response on high-value group and event enquiries costs business to faster competitors.",
      },
      {
        id: "group-event-booking-what-this-means",
        title: "What this means?",
        content:
          "Organisers book wherever they hear back first, so even a few hours' delay loses the entire event.",
      },
      {
        id: "group-event-booking-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI sends an instant indicative quote with alternative date options and a clear next step to book a walk-through.",
      },
      {
        id: "group-event-booking-why-this-works",
        title: "Why This Works?",
        content:
          "Speed beats price in group business — being first in the inbox often wins the contract outright.",
      },
      {
        id: "off-season-reactivation-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "off-season-reactivation-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "off-season-reactivation-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Past guests aren't re-engaged effectively during low-occupancy periods.",
      },
      {
        id: "off-season-reactivation-what-this-means",
        title: "What this means?",
        content:
          "Generic seasonal promos underperform because they aren't matched to the guest's travel pattern or preferences.",
      },
      {
        id: "off-season-reactivation-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI targets past guests whose travel pattern matches a low-occupancy window with a personalised return offer.",
      },
      {
        id: "off-season-reactivation-why-this-works",
        title: "Why This Works?",
        content:
          "A personal, well-timed return offer drives meaningful incremental bookings during otherwise empty periods.",
      },
    ],
  },
  {
    slug: "health",
    name: "Health & Wellness",
    video: healthVideo,
    className: "health",
    theme: {
      primary: "#ff5b6e",
      gradient: "linear-gradient(180deg,#ff5b6e 0%,#e63c51 50%,#b91d35 100%)",
    },
    heroTitle: "Health & Wellness",
    heroDescription:
      "AI-driven patient engagement that improves appointment adherence, reduces no-shows, and keeps patients on their care path.",
    cards: [
      {
        id: "appointment-noshow-reduction-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "appointment-noshow-reduction-customer-stage",
        title: "Customer Stage",
        content: "Pre-Appointment",
      },
      {
        id: "appointment-noshow-reduction-marketing-challenge",
        title: "Marketing Challenge",
        content: "No-shows directly cost clinics scheduled revenue every day.",
      },
      {
        id: "appointment-noshow-reduction-what-this-means",
        title: "What this means?",
        content:
          "A single reminder is easy to forget, especially for routine consults, and the slot stays empty without a chance to refill.",
      },
      {
        id: "appointment-noshow-reduction-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI confirmation and reminder sequence on WhatsApp with one-tap reschedule and a waitlist auto-fill.",
      },
      {
        id: "appointment-noshow-reduction-why-this-works",
        title: "Why This Works?",
        content:
          "Multiple light, well-timed touches catch patients before they forget and let the clinic recover empty slots in real time.",
      },
      {
        id: "treatment-plan-adherence-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "treatment-plan-adherence-customer-stage",
        title: "Customer Stage",
        content: "Active Treatment",
      },
      {
        id: "treatment-plan-adherence-marketing-challenge",
        title: "Marketing Challenge",
        content: "Patients drop off multi-visit treatment plans before completion.",
      },
      {
        id: "treatment-plan-adherence-what-this-means",
        title: "What this means?",
        content:
          "Without visible progress, motivation fades and patients abandon the plan, hurting outcomes and clinic revenue.",
      },
      {
        id: "treatment-plan-adherence-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI check-ins reinforcing where the patient is in the plan, what's next and why each step matters.",
      },
      {
        id: "treatment-plan-adherence-why-this-works",
        title: "Why This Works?",
        content:
          "Seeing progress keeps the plan feeling worthwhile, lifting adherence and lifetime patient value.",
      },
      {
        id: "preventive-care-recall-category",
        title: "Category",
        content: "Growth",
      },
      {
        id: "preventive-care-recall-customer-stage",
        title: "Customer Stage",
        content: "Existing Patient",
      },
      {
        id: "preventive-care-recall-marketing-challenge",
        title: "Marketing Challenge",
        content: "Overdue checkups and screenings rarely get self-booked by patients.",
      },
      {
        id: "preventive-care-recall-what-this-means",
        title: "What this means?",
        content:
          "Deferred care becomes urgent, costlier care, and the clinic loses recurring preventive revenue along the way.",
      },
      {
        id: "preventive-care-recall-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI recall message naming the exact overdue service with a one-tap booking link and clinician availability.",
      },
      {
        id: "preventive-care-recall-why-this-works",
        title: "Why This Works?",
        content:
          "Specific, frictionless asks are far more actionable than generic 'time for a checkup' reminders.",
      },
      {
        id: "post-discharge-followup-category",
        title: "Category",
        content: "Support",
      },
      {
        id: "post-discharge-followup-customer-stage",
        title: "Customer Stage",
        content: "Post-Procedure",
      },
      {
        id: "post-discharge-followup-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "There's no structured check-in after discharge, so complications get caught late.",
      },
      {
        id: "post-discharge-followup-what-this-means",
        title: "What this means?",
        content:
          "Early warning signs go unnoticed until they become emergencies, hurting outcomes and driving avoidable readmissions.",
      },
      {
        id: "post-discharge-followup-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI daily symptom check-ins during the critical recovery window, with smart escalation to a clinician.",
      },
      {
        id: "post-discharge-followup-why-this-works",
        title: "Why This Works?",
        content:
          "Early detection is simpler and cheaper than an ER visit and meaningfully improves patient outcomes.",
      },
      {
        id: "new-patient-onboarding-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "new-patient-onboarding-customer-stage",
        title: "Customer Stage",
        content: "Acquisition",
      },
      {
        id: "new-patient-onboarding-marketing-challenge",
        title: "Marketing Challenge",
        content: "Rushed paper or in-clinic intake slows down the first visit.",
      },
      {
        id: "new-patient-onboarding-what-this-means",
        title: "What this means?",
        content:
          "Doctors often start the consultation with incomplete information, hurting both quality of care and patient perception.",
      },
      {
        id: "new-patient-onboarding-the-fix",
        title: "The Personlyze Fix",
        content:
          "An AI intake assistant collects history, allergies and documents before the appointment over WhatsApp.",
      },
      {
        id: "new-patient-onboarding-why-this-works",
        title: "Why This Works?",
        content:
          "Visit time goes to actual care, not data collection, improving both clinical outcomes and patient satisfaction.",
      },
      {
        id: "wellness-program-engagement-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "wellness-program-engagement-customer-stage",
        title: "Customer Stage",
        content: "Active Member",
      },
      {
        id: "wellness-program-engagement-marketing-challenge",
        title: "Marketing Challenge",
        content: "Members disengage from wellness programs after the first few weeks.",
      },
      {
        id: "wellness-program-engagement-what-this-means",
        title: "What this means?",
        content:
          "Without structure or accountability, members stop attending and the program loses both outcomes and renewals.",
      },
      {
        id: "wellness-program-engagement-the-fix",
        title: "The Personlyze Fix",
        content:
          "An AI coach delivers personalised progress check-ins, nudges and milestone celebrations.",
      },
      {
        id: "wellness-program-engagement-why-this-works",
        title: "Why This Works?",
        content:
          "Personal accountability sustains long-term engagement and turns members into renewing advocates.",
      },
    ],
  },
  {
    slug: "retail",
    name: "Retail & D2C",
    video: retailVideo,
    className: "retail",
    theme: {
      primary: "#ff4fa0",
      gradient: "linear-gradient(180deg,#ff4fa0 0%,#e63789 50%,#b81f65 100%)",
    },
    heroTitle: "Retail & D2C",
    heroDescription:
      "AI-powered commerce engagement that recovers lost carts, personalises offers, and turns one-time buyers into repeat customers.",
    cards: [
      {
        id: "cart-recovery-category",
        title: "Category",
        content: "Conversion",
      },
      {
        id: "cart-recovery-customer-stage",
        title: "Customer Stage",
        content: "Consideration",
      },
      {
        id: "cart-recovery-marketing-challenge",
        title: "Marketing Challenge",
        content: "The majority of online carts are abandoned at or near checkout.",
      },
      {
        id: "cart-recovery-what-this-means",
        title: "What this means?",
        content:
          "Slow, generic recovery emails miss the high-intent window and the sale is lost to a competitor or marketplace.",
      },
      {
        id: "cart-recovery-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI sends a WhatsApp nudge within 15 minutes showing the exact cart, available stock and a one-tap checkout link.",
      },
      {
        id: "cart-recovery-why-this-works",
        title: "Why This Works?",
        content:
          "High visibility plus relevance recaptures intent before it fades and consistently outperforms email recovery.",
      },
      {
        id: "personalised-cross-sell-category",
        title: "Category",
        content: "Growth",
      },
      {
        id: "personalised-cross-sell-customer-stage",
        title: "Customer Stage",
        content: "Post-Purchase",
      },
      {
        id: "personalised-cross-sell-marketing-challenge",
        title: "Marketing Challenge",
        content: "Upsell and cross-sell emails get ignored as generic blasts.",
      },
      {
        id: "personalised-cross-sell-what-this-means",
        title: "What this means?",
        content:
          "Low click-through and rising unsubscribes hurt list health and reduce future campaign ROI.",
      },
      {
        id: "personalised-cross-sell-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI recommends complementary products tied to the actual purchase and shopping history.",
      },
      {
        id: "personalised-cross-sell-why-this-works",
        title: "Why This Works?",
        content:
          "Relevant, well-timed offers feel helpful rather than promotional and meaningfully lift repeat order rate.",
      },
      {
        id: "winback-churned-customers-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "winback-churned-customers-customer-stage",
        title: "Customer Stage",
        content: "Dormant",
      },
      {
        id: "winback-churned-customers-marketing-challenge",
        title: "Marketing Challenge",
        content: "90+ day dormant customers aren't reactivated effectively.",
      },
      {
        id: "winback-churned-customers-what-this-means",
        title: "What this means?",
        content:
          "Generic discount blasts rarely move disengaged shoppers and only train customers to wait for sales.",
      },
      {
        id: "winback-churned-customers-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI sends a win-back message tied to the customer's original category, style and price band.",
      },
      {
        id: "winback-churned-customers-why-this-works",
        title: "Why This Works?",
        content:
          "Relevance — not depth of discount — is what reactivates dormant customers and protects margin at the same time.",
      },
      {
        id: "size-fit-guidance-category",
        title: "Category",
        content: "Conversion",
      },
      {
        id: "size-fit-guidance-customer-stage",
        title: "Customer Stage",
        content: "Consideration",
      },
      {
        id: "size-fit-guidance-marketing-challenge",
        title: "Marketing Challenge",
        content: "Sizing doubt drives both cart abandonment and high return rates.",
      },
      {
        id: "size-fit-guidance-what-this-means",
        title: "What this means?",
        content:
          "Customers guess and either don't buy or return, hurting both conversion and unit economics.",
      },
      {
        id: "size-fit-guidance-the-fix",
        title: "The Personlyze Fix",
        content:
          "An AI sizing assistant uses past purchases, brand fit notes and body data to recommend the right size.",
      },
      {
        id: "size-fit-guidance-why-this-works",
        title: "Why This Works?",
        content:
          "Resolving fit doubt up front prevents abandonment and slashes return rates simultaneously.",
      },
      {
        id: "loyalty-points-engagement-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "loyalty-points-engagement-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "loyalty-points-engagement-marketing-challenge",
        title: "Marketing Challenge",
        content: "A large share of issued loyalty points go unredeemed.",
      },
      {
        id: "loyalty-points-engagement-what-this-means",
        title: "What this means?",
        content:
          "Customers forget points exist or what they're worth, so the loyalty program fails to drive repeat purchase.",
      },
      {
        id: "loyalty-points-engagement-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI nudges at redemption thresholds with concrete product options the customer can buy using their points.",
      },
      {
        id: "loyalty-points-engagement-why-this-works",
        title: "Why This Works?",
        content:
          "A specific, tangible offer converts dormant points into a real purchase and a real visit.",
      },
      {
        id: "restock-waitlist-conversion-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "restock-waitlist-conversion-customer-stage",
        title: "Customer Stage",
        content: "Consideration",
      },
      {
        id: "restock-waitlist-conversion-marketing-challenge",
        title: "Marketing Challenge",
        content: "Restock alerts are slow, generic and trigger inventory rushes.",
      },
      {
        id: "restock-waitlist-conversion-what-this-means",
        title: "What this means?",
        content:
          "Mass blasts cause immediate stockouts again and frustrate the customers who waited longest.",
      },
      {
        id: "restock-waitlist-conversion-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI sends a personal alert with a short reservation window and one-tap checkout for waitlist members.",
      },
      {
        id: "restock-waitlist-conversion-why-this-works",
        title: "Why This Works?",
        content:
          "Urgency plus fairness converts waitlist interest into actual revenue without retriggering stockouts.",
      },
    ],
  },
  {
    slug: "automotive",
    name: "Automotive",
    video: automotiveVideo,
    className: "automotive",
    theme: {
      primary: "#ff944d",
      gradient: "linear-gradient(180deg,#ff944d 0%,#e66d1f 50%,#b85000 100%)",
    },
    heroTitle: "Automotive",
    heroDescription:
      "AI-driven engagement for dealerships and service centers — from first enquiry to test drive to lifetime service retention.",
    cards: [
      {
        id: "test-drive-conversion-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "test-drive-conversion-customer-stage",
        title: "Customer Stage",
        content: "Acquisition",
      },
      {
        id: "test-drive-conversion-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Online enquiries rarely turn into actual test drives at the showroom.",
      },
      {
        id: "test-drive-conversion-what-this-means",
        title: "What this means?",
        content:
          "Slow callbacks lose buyers to faster dealers — even those representing competing brands.",
      },
      {
        id: "test-drive-conversion-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI responds within minutes with model details, EMI options and a direct test-drive booking link.",
      },
      {
        id: "test-drive-conversion-why-this-works",
        title: "Why This Works?",
        content:
          "Speed wins the buyer regardless of brand loyalty and lifts test-drive show rate significantly.",
      },
      {
        id: "finance-preapproval-category",
        title: "Category",
        content: "Conversion",
      },
      {
        id: "finance-preapproval-customer-stage",
        title: "Customer Stage",
        content: "Consideration",
      },
      {
        id: "finance-preapproval-marketing-challenge",
        title: "Marketing Challenge",
        content: "Buyers stall on the purchase decision because of financing uncertainty.",
      },
      {
        id: "finance-preapproval-what-this-means",
        title: "What this means?",
        content:
          "Without a clear EMI and approval status, buyers delay or move to a competitor who shows them the numbers first.",
      },
      {
        id: "finance-preapproval-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI surfaces an indicative EMI and instant pre-approval based on basic profile inputs.",
      },
      {
        id: "finance-preapproval-why-this-works",
        title: "Why This Works?",
        content:
          "Removing financial doubt early keeps buyers moving and shortens the path from enquiry to booking.",
      },
      {
        id: "service-retention-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "service-retention-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "service-retention-marketing-challenge",
        title: "Marketing Challenge",
        content: "Customers skip scheduled service or switch to local garages.",
      },
      {
        id: "service-retention-what-this-means",
        title: "What this means?",
        content:
          "The dealership loses high-margin service revenue and the ongoing relationship that drives the next purchase.",
      },
      {
        id: "service-retention-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI sends a personalised reminder naming the exact service due, indicative cost and a one-tap slot booking.",
      },
      {
        id: "service-retention-why-this-works",
        title: "Why This Works?",
        content:
          "Low-friction convenience beats switching to a local garage and protects long-term wallet share.",
      },
      {
        id: "trade-in-valuation-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "trade-in-valuation-customer-stage",
        title: "Customer Stage",
        content: "Consideration",
      },
      {
        id: "trade-in-valuation-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Existing customers delay upgrades because they don't know their trade-in value.",
      },
      {
        id: "trade-in-valuation-what-this-means",
        title: "What this means?",
        content:
          "Without a real budget number, the upgrade conversation stalls and the customer keeps the current vehicle longer.",
      },
      {
        id: "trade-in-valuation-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI returns an indicative trade-in value within minutes based on model, year and condition inputs.",
      },
      {
        id: "trade-in-valuation-why-this-works",
        title: "Why This Works?",
        content:
          "A real number turns intent into a decision and brings the customer back into the showroom funnel.",
      },
      {
        id: "accessory-upsell-category",
        title: "Category",
        content: "Growth",
      },
      {
        id: "accessory-upsell-customer-stage",
        title: "Customer Stage",
        content: "Post-Purchase",
      },
      {
        id: "accessory-upsell-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "High-margin accessories and service packages rarely get offered post-sale.",
      },
      {
        id: "accessory-upsell-what-this-means",
        title: "What this means?",
        content:
          "Generic offers ignore actual vehicle usage, leading to weak take-up and lost incremental revenue.",
      },
      {
        id: "accessory-upsell-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI suggests add-ons matched to the specific vehicle, mileage and usage pattern.",
      },
      {
        id: "accessory-upsell-why-this-works",
        title: "Why This Works?",
        content:
          "Context-matched offers feel like genuine advice rather than upsell and convert at much higher rates.",
      },
      {
        id: "recall-safety-communication-category",
        title: "Category",
        content: "Support",
      },
      {
        id: "recall-safety-communication-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "recall-safety-communication-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Safety recalls see low response rates through traditional mail and SMS.",
      },
      {
        id: "recall-safety-communication-what-this-means",
        title: "What this means?",
        content:
          "Unaddressed recalls create real safety and liability exposure for both customer and brand.",
      },
      {
        id: "recall-safety-communication-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI sends a personalised WhatsApp message naming the exact recall, the fix and a one-tap appointment slot.",
      },
      {
        id: "recall-safety-communication-why-this-works",
        title: "Why This Works?",
        content:
          "Specific, frictionless action drives completion rates that mail and SMS simply can't match.",
      },
    ],
  },
  {
    slug: "b2b",
    name: "B2B & SaaS",
    video: b2bVideo,
    className: "saas",
    theme: {
      primary: "#3ecf8e",
      gradient: "linear-gradient(180deg,#3ecf8e 0%,#28b874 50%,#158856 100%)",
    },
    heroTitle: "B2B & SaaS",
    heroDescription:
      "AI-driven engagement across the funnel — from demo request to trial activation to expansion revenue.",
    cards: [
      {
        id: "demo-to-show-rate-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "demo-to-show-rate-customer-stage",
        title: "Customer Stage",
        content: "Consideration",
      },
      {
        id: "demo-to-show-rate-marketing-challenge",
        title: "Marketing Challenge",
        content: "A meaningful share of booked demos turn into no-shows.",
      },
      {
        id: "demo-to-show-rate-what-this-means",
        title: "What this means?",
        content:
          "Generic reminders don't reconnect the prospect to the actual problem they wanted solved, so the call drops in priority.",
      },
      {
        id: "demo-to-show-rate-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI sends context-specific reminders referencing the prospect's use case, role and pain point before the call.",
      },
      {
        id: "demo-to-show-rate-why-this-works",
        title: "Why This Works?",
        content:
          "Reminding the buyer of their own problem — not your product — meaningfully lifts show-up rate.",
      },
      {
        id: "trial-activation-category",
        title: "Category",
        content: "Conversion",
      },
      {
        id: "trial-activation-customer-stage",
        title: "Customer Stage",
        content: "Trial",
      },
      {
        id: "trial-activation-marketing-challenge",
        title: "Marketing Challenge",
        content: "Free trial users churn before reaching the product's value moment.",
      },
      {
        id: "trial-activation-what-this-means",
        title: "What this means?",
        content:
          "Generic onboarding emails get buried and users never complete the steps that unlock real value.",
      },
      {
        id: "trial-activation-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI nudges the exact next step the user hasn't completed, in-app and on WhatsApp.",
      },
      {
        id: "trial-activation-why-this-works",
        title: "Why This Works?",
        content:
          "Targeting the real blocker — not a generic checklist — meaningfully lifts trial-to-paid conversion.",
      },
      {
        id: "expansion-renewal-category",
        title: "Category",
        content: "Growth",
      },
      {
        id: "expansion-renewal-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "expansion-renewal-marketing-challenge",
        title: "Marketing Challenge",
        content: "Expansion opportunities and renewal risk are spotted too late.",
      },
      {
        id: "expansion-renewal-what-this-means",
        title: "What this means?",
        content:
          "Reactive CS conversations miss the moment to drive expansion or save an account at risk.",
      },
      {
        id: "expansion-renewal-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI monitors usage and sentiment signals and surfaces ready-to-go outreach with talking points for CS.",
      },
      {
        id: "expansion-renewal-why-this-works",
        title: "Why This Works?",
        content:
          "Acting on real product signals beats a fixed renewal-date calendar and grows net revenue retention.",
      },
      {
        id: "inbound-lead-routing-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "inbound-lead-routing-customer-stage",
        title: "Customer Stage",
        content: "Acquisition",
      },
      {
        id: "inbound-lead-routing-marketing-challenge",
        title: "Marketing Challenge",
        content: "High-intent inbound leads cool off without an immediate response.",
      },
      {
        id: "inbound-lead-routing-what-this-means",
        title: "What this means?",
        content:
          "Buyers move on to whoever replies first, so even a 30-minute delay can lose the opportunity entirely.",
      },
      {
        id: "inbound-lead-routing-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI qualifies the lead, answers basic questions and books a call onto the AE's calendar within minutes.",
      },
      {
        id: "inbound-lead-routing-why-this-works",
        title: "Why This Works?",
        content:
          "Speed plus context wins the first meeting and dramatically lifts inbound-to-pipeline conversion.",
      },
      {
        id: "champion-departure-risk-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "champion-departure-risk-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "champion-departure-risk-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Accounts quietly go dark when the internal champion leaves the company.",
      },
      {
        id: "champion-departure-risk-what-this-means",
        title: "What this means?",
        content:
          "The risk is invisible until usage drops to zero, by which point the renewal is essentially lost.",
      },
      {
        id: "champion-departure-risk-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI flags champion-departure signals — LinkedIn changes, drop in usage — and triggers outreach to a new stakeholder.",
      },
      {
        id: "champion-departure-risk-why-this-works",
        title: "Why This Works?",
        content:
          "Early detection gives CS time to rebuild the relationship and protect the renewal before it's at risk.",
      },
      {
        id: "feature-request-loop-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "feature-request-loop-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "feature-request-loop-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Customers rarely hear back when a requested feature actually ships.",
      },
      {
        id: "feature-request-loop-what-this-means",
        title: "What this means?",
        content:
          "A high-value trust-building moment is missed and customers feel unheard despite the product team delivering.",
      },
      {
        id: "feature-request-loop-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI automatically notifies each requester the moment their feature ships, with a short walkthrough.",
      },
      {
        id: "feature-request-loop-why-this-works",
        title: "Why This Works?",
        content:
          "Closing the loop turns customers into advocates and directly strengthens long-term retention.",
      },
    ],
  },
  {
    slug: "tech",
    name: "Tech & Startups",
    video: techVideo,
    className: "tech",
    theme: {
      primary: "#00c2ff",
      gradient: "linear-gradient(180deg,#00c2ff 0%,#009fd9 50%,#0077a3 100%)",
    },
    heroTitle: "Tech & Startups",
    heroDescription:
      "AI-powered growth engagement built for speed — turning sign-ups into activated users and early adopters into advocates.",
    cards: [
      {
        id: "signup-activation-category",
        title: "Category",
        content: "Conversion",
      },
      {
        id: "signup-activation-customer-stage",
        title: "Customer Stage",
        content: "New User",
      },
      {
        id: "signup-activation-marketing-challenge",
        title: "Marketing Challenge",
        content: "A large share of new sign-ups never return after the first session.",
      },
      {
        id: "signup-activation-what-this-means",
        title: "What this means?",
        content:
          "Users churn before reaching the product's value moment, so paid acquisition spend is effectively wasted.",
      },
      {
        id: "signup-activation-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI nudges the exact onboarding step each user dropped at, across email, WhatsApp and in-app.",
      },
      {
        id: "signup-activation-why-this-works",
        title: "Why This Works?",
        content:
          "Addressing the real drop-off point — not a generic Day 2 email — drives meaningful return and activation.",
      },
      {
        id: "feature-adoption-category",
        title: "Category",
        content: "Growth",
      },
      {
        id: "feature-adoption-customer-stage",
        title: "Customer Stage",
        content: "Active User",
      },
      {
        id: "feature-adoption-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Users never discover the features that drive long-term retention.",
      },
      {
        id: "feature-adoption-what-this-means",
        title: "What this means?",
        content:
          "Narrow usage patterns limit perceived value and put accounts at higher churn risk.",
      },
      {
        id: "feature-adoption-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI surfaces contextual nudges at the right in-app moment based on the user's actual workflow.",
      },
      {
        id: "feature-adoption-why-this-works",
        title: "Why This Works?",
        content:
          "Timely, relevant nudges convert into real feature trial and meaningfully lift retention curves.",
      },
      {
        id: "founder-led-referrals-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "founder-led-referrals-customer-stage",
        title: "Customer Stage",
        content: "Active User",
      },
      {
        id: "founder-led-referrals-marketing-challenge",
        title: "Marketing Challenge",
        content: "Happy users rarely refer without being asked at the right moment.",
      },
      {
        id: "founder-led-referrals-what-this-means",
        title: "What this means?",
        content:
          "Generic referral banners and emails get ignored because they're disconnected from real product value.",
      },
      {
        id: "founder-led-referrals-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI triggers a personalised referral ask right after a high-engagement milestone or success moment.",
      },
      {
        id: "founder-led-referrals-why-this-works",
        title: "Why This Works?",
        content:
          "Asking at peak perceived value drives significantly stronger referral conversion than scheduled campaigns.",
      },
      {
        id: "waitlist-to-activation-category",
        title: "Category",
        content: "Conversion",
      },
      {
        id: "waitlist-to-activation-customer-stage",
        title: "Customer Stage",
        content: "Waitlisted",
      },
      {
        id: "waitlist-to-activation-marketing-challenge",
        title: "Marketing Challenge",
        content: "Waitlisted users lose excitement before they ever get access.",
      },
      {
        id: "waitlist-to-activation-what-this-means",
        title: "What this means?",
        content:
          "Activation rates are weak once access is granted because context and momentum are long gone.",
      },
      {
        id: "waitlist-to-activation-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI keeps users warm with progress updates and reconnects context the moment access is granted.",
      },
      {
        id: "waitlist-to-activation-why-this-works",
        title: "Why This Works?",
        content:
          "Maintained momentum recovers users who silence would otherwise lose, lifting activation sharply.",
      },
      {
        id: "investor-stakeholder-updates-category",
        title: "Category",
        content: "Growth",
      },
      {
        id: "investor-stakeholder-updates-customer-stage",
        title: "Customer Stage",
        content: "Existing Relationship",
      },
      {
        id: "investor-stakeholder-updates-marketing-challenge",
        title: "Marketing Challenge",
        content: "Founders lose momentum with investors between funding rounds.",
      },
      {
        id: "investor-stakeholder-updates-what-this-means",
        title: "What this means?",
        content:
          "A missed chance to turn investors into active advocates for hiring, intros and the next round.",
      },
      {
        id: "investor-stakeholder-updates-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI helps founders draft consistent, metric-specific updates pulled directly from the source data.",
      },
      {
        id: "investor-stakeholder-updates-why-this-works",
        title: "Why This Works?",
        content:
          "Regular, credible updates keep investors engaged as allies rather than passive cap-table entries.",
      },
      {
        id: "community-engagement-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "community-engagement-customer-stage",
        title: "Customer Stage",
        content: "Active Member",
      },
      {
        id: "community-engagement-marketing-challenge",
        title: "Marketing Challenge",
        content: "Early community and beta members go quiet shortly after sign-up.",
      },
      {
        id: "community-engagement-what-this-means",
        title: "What this means?",
        content:
          "Feedback loops fade without structure, hurting both product velocity and community health.",
      },
      {
        id: "community-engagement-the-fix",
        title: "The Personlyze Fix",
        content:
          "An AI moderator tailors asks, recognition and prompts to each member's actual contributions.",
      },
      {
        id: "community-engagement-why-this-works",
        title: "Why This Works?",
        content:
          "Personal recognition sustains genuine, ongoing engagement and keeps the community compounding.",
      },
    ],
  },
  {
    slug: "fashion",
    name: "Fashion & Lifestyle",
    video: fashionVideo,
    className: "fashion",
    theme: {
      primary: "#d56eff",
      gradient: "linear-gradient(180deg,#d56eff 0%,#b94be6 50%,#8b28b8 100%)",
    },
    heroTitle: "Fashion & Lifestyle",
    heroDescription:
      "AI-powered styling and engagement that turns browsers into buyers and one-time purchases into a wardrobe relationship.",
    cards: [
      {
        id: "style-based-recovery-category",
        title: "Category",
        content: "Conversion",
      },
      {
        id: "style-based-recovery-customer-stage",
        title: "Customer Stage",
        content: "Consideration",
      },
      {
        id: "style-based-recovery-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Fashion cart abandonment is driven mostly by fit and styling doubt, not price.",
      },
      {
        id: "style-based-recovery-what-this-means",
        title: "What this means?",
        content:
          "Generic discount codes don't solve the real concern, so the cart stays abandoned despite the offer.",
      },
      {
        id: "style-based-recovery-the-fix",
        title: "The Personlyze Fix",
        content:
          "An AI stylist addresses fit, styling and occasion questions directly on WhatsApp with curated alternatives.",
      },
      {
        id: "style-based-recovery-why-this-works",
        title: "Why This Works?",
        content:
          "Solving the real hesitation converts far better than a discount and protects margin at the same time.",
      },
      {
        id: "personalised-styling-category",
        title: "Category",
        content: "Growth",
      },
      {
        id: "personalised-styling-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "personalised-styling-marketing-challenge",
        title: "Marketing Challenge",
        content: "Generic 'new arrivals' emails get ignored and unsubscribe rates climb.",
      },
      {
        id: "personalised-styling-what-this-means",
        title: "What this means?",
        content: "One-size-fits-all blasts hurt engagement and erode list health over time.",
      },
      {
        id: "personalised-styling-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI builds a curated 'picked for you' selection based on style profile, past purchases and current wardrobe.",
      },
      {
        id: "personalised-styling-why-this-works",
        title: "Why This Works?",
        content:
          "A small, relevant set consistently outperforms a large generic catalog email on both clicks and orders.",
      },
      {
        id: "vip-repeat-purchase-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "vip-repeat-purchase-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "vip-repeat-purchase-marketing-challenge",
        title: "Marketing Challenge",
        content: "High-value repeat customers get the same treatment as everyone else.",
      },
      {
        id: "vip-repeat-purchase-what-this-means",
        title: "What this means?",
        content:
          "Loyalty is under-leveraged, making the most valuable customers easy for competitors to poach.",
      },
      {
        id: "vip-repeat-purchase-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI segmentation triggers early access, personal previews and stylist outreach for top customers.",
      },
      {
        id: "vip-repeat-purchase-why-this-works",
        title: "Why This Works?",
        content:
          "Tangible recognition protects the highest-value base and meaningfully lifts annual spend per customer.",
      },
      {
        id: "outfit-completion-category",
        title: "Category",
        content: "Growth",
      },
      {
        id: "outfit-completion-customer-stage",
        title: "Customer Stage",
        content: "Post-Purchase",
      },
      {
        id: "outfit-completion-marketing-challenge",
        title: "Marketing Challenge",
        content:
          "Single-item buyers rarely realise the full-outfit potential of a purchase.",
      },
      {
        id: "outfit-completion-what-this-means",
        title: "What this means?",
        content:
          "Average basket size stays low even though buyer intent peaks at checkout.",
      },
      {
        id: "outfit-completion-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI suggests complementary pieces that complete the look at checkout and in the order confirmation.",
      },
      {
        id: "outfit-completion-why-this-works",
        title: "Why This Works?",
        content:
          "Styling help — not a generic upsell — converts at materially higher rates and lifts AOV.",
      },
      {
        id: "seasonal-wardrobe-refresh-category",
        title: "Category",
        content: "Lead Generation",
      },
      {
        id: "seasonal-wardrobe-refresh-customer-stage",
        title: "Customer Stage",
        content: "Existing Customer",
      },
      {
        id: "seasonal-wardrobe-refresh-marketing-challenge",
        title: "Marketing Challenge",
        content: "Customers shop reactively once the season has already shifted.",
      },
      {
        id: "seasonal-wardrobe-refresh-what-this-means",
        title: "What this means?",
        content:
          "Brands miss the early-season intent window where margin is highest and full price still holds.",
      },
      {
        id: "seasonal-wardrobe-refresh-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI sends a tailored refresh selection ahead of the season shift based on the customer's wardrobe history.",
      },
      {
        id: "seasonal-wardrobe-refresh-why-this-works",
        title: "Why This Works?",
        content:
          "Early, relevant timing captures intent at full margin before discount-driven urgency takes over.",
      },
      {
        id: "return-exchange-experience-category",
        title: "Category",
        content: "Retention",
      },
      {
        id: "return-exchange-experience-customer-stage",
        title: "Customer Stage",
        content: "Post-Purchase",
      },
      {
        id: "return-exchange-experience-marketing-challenge",
        title: "Marketing Challenge",
        content: "Friction-heavy returns push customers away from the brand for good.",
      },
      {
        id: "return-exchange-experience-what-this-means",
        title: "What this means?",
        content:
          "One bad return experience colors the entire brand perception and kills repeat purchase.",
      },
      {
        id: "return-exchange-experience-the-fix",
        title: "The Personlyze Fix",
        content:
          "AI defaults to easy exchange over refund, with one-tap size swap and style recommendations.",
      },
      {
        id: "return-exchange-experience-why-this-works",
        title: "Why This Works?",
        content:
          "Easy exchange retains both the revenue and the customer relationship, lifting lifetime value.",
      },
    ],
  },
];

export default industries;
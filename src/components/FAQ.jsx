import React, { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    question: "What does a typical engagement with Studio Swell look like?",
    answer:
      "We start with a two-week discovery sprint to map your users and goals, then move into design and build in parallel two-week cycles, with a working preview you can click through after every cycle.",
  },
  {
    question: "How long does a full product design take?",
    answer:
      "Most mobile or web products take six to ten weeks from kickoff to a build-ready handoff, depending on scope. Smaller feature work can turn around in as little as two weeks.",
  },
  {
    question: "Do you also build the product, or only design it?",
    answer:
      "Both. Our design and engineering teams work side by side, so what you approve in a prototype is exactly what ships, no separate handoff or reinterpretation.",
  },
  {
    question: "Can you work with our existing design system?",
    answer:
      "Yes. We regularly extend and refine existing systems rather than replace them, so your product stays consistent while we raise the level of craft.",
  },
  {
    question: "What happens after launch?",
    answer:
      "Every engagement includes a 30-day support window for fixes and refinements, and most clients move into an ongoing monthly retainer for continued design work.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-inner">
        <div className="faq-intro">
          <span className="faq-eyebrow">FAQ</span>
          <h2 className="faq-heading">Questions, answered</h2>
          <p className="faq-subtext">
            Everything you need to know before starting a project with us.
            Can&rsquo;t find your answer? Reach out any time.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div className="faq-answer-wrapper">
                  <div className="faq-answer-inner">
                    <p className="faq-answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
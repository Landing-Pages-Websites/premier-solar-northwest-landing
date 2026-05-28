"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/content";

/**
 * Floating sticky CTA — form/contact ONLY (per division Rule #8 and the
 * Family Resource Home Care 2026-05-25 QA finding). NEVER include phone
 * here. NEVER show on top of the contact section (would stack a second
 * CTA over the primary form). Renders as:
 *   - Mobile: full-width bottom bar
 *   - Desktop: bottom-right pill
 * Both hide once the top of #contact enters the viewport.
 */
export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.6;
      const scrolledPast = window.scrollY > threshold;

      // Hide once user reaches the contact section (don't stack CTAs).
      const contact = document.getElementById("contact");
      let aboveContact = true;
      if (contact) {
        const rect = contact.getBoundingClientRect();
        // The contact section top is above the viewport bottom — we're
        // inside or past it. Hide the floating CTA.
        aboveContact = rect.top > window.innerHeight * 0.4;
      }

      setVisible(scrolledPast && aboveContact);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Mobile — full-width bottom bar */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white border-t border-[var(--color-line)] shadow-2xl transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="px-4 py-3">
          <a
            href="#contact"
            className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-3 rounded-full font-bold shadow-lg shadow-[var(--color-primary)]/30 transition"
          >
            {BRAND.primaryCtaLabel}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        </div>
      </div>

      {/* Desktop — bottom-right pill */}
      <div
        className={`hidden sm:block fixed bottom-5 right-5 z-40 transition-all duration-300 ${
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <a
          href="#contact"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-3 rounded-full font-bold shadow-lg shadow-[var(--color-primary)]/30 transition"
        >
          {BRAND.primaryCtaShort}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </a>
      </div>
    </>
  );
}

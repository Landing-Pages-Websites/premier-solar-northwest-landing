"use client";

import { useTracking } from "@/hooks/useTracking";
import { Reveal } from "@/components/Reveal";
import { DualCTA } from "@/components/DualCTA";
import { FormCard } from "@/components/FormCard";
import { BRAND } from "@/lib/content";

/**
 * Hero — split layout. Left: eyebrow + H1 + subhead + offer callout +
 * trust row + dual CTA. Right: lead form card (above-the-fold conversion
 * surface, per task content_requests #5).
 */
export function HeroSection() {
  // Backup tracking layer — primary config lives in layout.tsx <head>.
  useTracking({
    siteKey: "yyuozfzulja4g3ws",
    gtmId: "GTM-PH74NDN",
  });

  return (
    <section
      id="hero"
      className="relative bg-hero-photo pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden"
    >
      {/* Orange brand glow, top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(230, 88, 47, 0.22) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start">
          <Reveal className="space-y-5 lg:pt-6 relative">
            <p className="eyebrow eyebrow-on-dark">
              Locally owned since {BRAND.since} · {BRAND.serviceArea}
            </p>
            <h1 className="text-[2.25rem] sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.05] tracking-tight drop-shadow-lg">
              {BRAND.tagline}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl">
              Heat pump installation, furnace replacement, AC install +
              repair, and emergency HVAC service for Portland metro
              homeowners. NATE-certified technicians, in-house electricians,{" "}
              <span className="font-bold text-[var(--color-amber)]">
                {BRAND.installsCompleted} installs since {BRAND.since}
              </span>
              .
            </p>

            {/* $500 off offer callout — above-the-fold per task content_requests #3. */}
            <div
              id="featured-offer"
              className="rounded-xl bg-white/10 backdrop-blur ring-2 ring-[var(--color-amber)] px-4 py-3 sm:px-5 sm:py-4 max-w-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-amber)] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[var(--color-accent)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 12V8H6a2 2 0 1 1 0-4h12v4" />
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                    {BRAND.offerHeadline}
                  </h2>
                  <p className="mt-1 text-sm sm:text-base text-white/90 leading-relaxed">
                    {BRAND.offerSub} Mention this page when we visit your
                    home.
                  </p>
                </div>
              </div>
            </div>

            {/* Service chips — high-volume keyword mirror, AC + repair traffic. */}
            <div className="space-y-3 pt-1">
              <h3 className="text-sm sm:text-base font-bold text-[var(--color-amber)] uppercase tracking-wide">
                Heating &amp; Cooling Services
              </h3>
              <ul
                className="flex flex-wrap gap-2 max-w-xl"
                aria-label="HVAC services offered"
              >
                {[
                  "Heat Pump Install",
                  "Furnace Replacement",
                  "AC Install & Repair",
                  "Whole-System Repair",
                  "Emergency Service",
                ].map((svc) => (
                  <li
                    key={svc}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur ring-1 ring-white/30 px-3 py-1 text-xs sm:text-sm font-semibold text-white"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-[var(--color-amber)]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {svc}
                  </li>
                ))}
              </ul>
            </div>

            <DualCTA
              variant="onDark"
              align="start"
              className="!mt-7"
            />

            {/* Standalone hero phone CTA — separate from DualCTA, large
                tap target visible on desktop AND mobile. Director ruling
                2026-05-29: phone-enabled HVAC LPs need the phone as a
                thumb-target conversion floor on the hero, not just inside
                the secondary DualCTA link. */}
            <a
              href={BRAND.phoneHref}
              aria-label={`Call ${BRAND.phoneDisplay}`}
              className="mt-4 inline-flex items-center gap-3 rounded-xl bg-white text-[var(--color-accent)] hover:bg-[var(--color-amber-50)] px-5 py-3.5 font-extrabold text-base sm:text-lg shadow-xl shadow-black/20 transition w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)] font-semibold">
                  Talk to an HVAC expert
                </span>
                <span className="text-base sm:text-lg font-extrabold">
                  {BRAND.phoneDisplay}
                </span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={120} className="lg:sticky lg:top-24">
            <FormCard variant="hero" idSuffix="hero" />
            <p className="mt-3 text-center text-xs text-white/80">
              No heat or no AC right now?{" "}
              <a
                href={BRAND.phoneHref}
                className="font-bold hover:underline"
              >
                Call {BRAND.phoneDisplay} for priority service
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

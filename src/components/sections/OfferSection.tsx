import { Reveal } from "@/components/Reveal";
import { DualCTA } from "@/components/DualCTA";
import { BRAND } from "@/lib/content";

/**
 * Featured offer block — $500 off furnace + AC combo. Per task
 * content_requests #3, this offer is featured prominently on the page.
 */
export function OfferSection() {
  return (
    <section
      id="featured-offer-detail"
      className="relative py-20 sm:py-24 bg-pinstripe-navy text-white overflow-hidden"
    >
      {/* Amber accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(246, 183, 4, 0.18) 0%, transparent 70%)",
        }}
      />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <p className="eyebrow eyebrow-on-dark">Limited-time offer</p>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
            <span className="text-[var(--color-amber)]">$500 OFF</span>
            <span className="block mt-2">Furnace + AC Combo Replacement</span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Pair a new high-efficiency furnace with a matching central AC
            and save $500 on the complete install. Includes haul-away of
            your old equipment, permits, and our limited workmanship +
            labor warranty in writing.
          </p>

          <ul className="mt-8 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            {[
              {
                t: "Right-sized for your home",
                b: "Manual J load calc included — no oversized, short-cycling junk.",
              },
              {
                t: "Rebates handled",
                b: "We walk you through Energy Trust of Oregon rebates and federal tax credits.",
              },
              {
                t: "One-day install on most homes",
                b: "Clean, on-time install. We respect your time and your floors.",
              },
            ].map((item) => (
              <li
                key={item.t}
                className="rounded-xl bg-white/5 backdrop-blur ring-1 ring-white/15 p-5"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--color-amber)] text-[var(--color-accent)] flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
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
                </div>
                <h3 className="mt-3 text-base font-bold text-white">
                  {item.t}
                </h3>
                <p className="mt-1 text-sm text-white/75 leading-relaxed">
                  {item.b}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-white/65">
            Offer available on qualifying matched-system installs. Mention
            this page when {BRAND.fullName} visits your home for the free
            in-home estimate.
          </p>
          <DualCTA
            label="Claim $500 Off — Get My Quote"
            variant="onDark"
          />
        </Reveal>
      </div>
    </section>
  );
}

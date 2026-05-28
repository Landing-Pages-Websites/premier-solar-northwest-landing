import { Reveal } from "@/components/Reveal";
import { FormCard } from "@/components/FormCard";
import { BRAND } from "@/lib/content";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative py-20 sm:py-24 bg-navy-deep text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <Reveal>
            <p className="eyebrow eyebrow-on-dark">Get your free quote</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Ready for a real quote? Let&apos;s get you on the calendar.
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/85 leading-relaxed">
              Fill out the form and a {BRAND.fullName} HVAC expert will
              follow up shortly to schedule your free in-home estimate.
              For immediate service or an HVAC emergency, give us a call —
              we&apos;ll fast-track the dispatch.
            </p>

            <div className="mt-7 space-y-5">
              <a
                href={BRAND.phoneHref}
                className="flex items-start gap-4 rounded-xl border-2 border-[var(--color-amber)] bg-white/5 backdrop-blur p-5 hover:bg-white/10 transition group"
              >
                <div className="w-11 h-11 rounded-full bg-[var(--color-amber)] text-[var(--color-accent)] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-amber)] uppercase tracking-wider">
                    Call our HVAC team
                  </p>
                  <p className="mt-0.5 text-xl sm:text-2xl font-extrabold text-white">
                    {BRAND.phoneDisplay}
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    Emergency HVAC service prioritized
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4 rounded-xl border border-white/15 bg-white/5 backdrop-blur p-5">
                <div className="w-11 h-11 rounded-full bg-[var(--color-amber)]/20 border border-[var(--color-amber)]/40 text-[var(--color-amber)] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-amber)] uppercase tracking-wider">
                    Service area
                  </p>
                  <p className="mt-0.5 text-base font-semibold text-white">
                    Portland · Beaverton · Hillsboro · Tigard · Tualatin ·
                    Lake Oswego · Gresham · and the rest of the Portland
                    metro
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    Based in {BRAND.basedIn} · Since {BRAND.since}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <FormCard
              variant="card"
              idSuffix="contact"
              heading="Tell us about your HVAC project"
              subheading="Free in-home estimate. We quote before we start. No surprise fees."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

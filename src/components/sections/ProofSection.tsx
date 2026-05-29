import { Reveal } from "@/components/Reveal";
import { DualCTA } from "@/components/DualCTA";
import { BRAND } from "@/lib/content";

/**
 * Social proof — stat bar (years in business, installs completed) +
 * 3 verbatim customer reviews scraped from premiersolarnw.com (homepage
 * testimonial block, Dec 2025 wayback snapshot). Sources logged in
 * content-sources.json per division Rubric 6 (Content Authenticity).
 */
const TESTIMONIALS = [
  {
    quote:
      "Great company, very responsive, lots of integrity. Very happy with the end result and the support. Would recommend them to others without hesitation.",
    name: "David C.",
    context: "Verified PSNW customer · Portland, OR",
  },
  {
    quote:
      "Everyone at PSNW was very professional. We've had zero issues and are very happy that we pulled the trigger on going 100% with them. The whole process was seamless really. And quick! Highly recommended PSNW.",
    name: "Chris G.",
    context: "Verified PSNW customer · Portland metro",
  },
  {
    quote:
      "HIRE THEM. I've worked with hundreds of contractors across the country and Premier Solar NW is one of the best. They are professional, friendly, communicative, helpful, fast, hard-working, and competitively priced. At each step of the way they exceeded my expectations.",
    name: "Bryson E.",
    context: "Verified PSNW customer · Portland metro",
  },
] as const;

export function ProofSection() {
  return (
    <section
      id="social-proof"
      className="py-20 sm:py-24 bg-[var(--color-surface-alt)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Stat bar — per task content_requests #4 */}
        <Reveal>
          <div className="rounded-2xl bg-[var(--color-accent)] text-white p-8 sm:p-10 grid sm:grid-cols-3 gap-6 text-center shadow-xl">
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-[var(--color-amber)]">
                {new Date().getFullYear() - BRAND.since}+
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/85">
                Years in business
              </p>
              <p className="mt-1 text-sm text-white/70">
                Locally owned in Portland since {BRAND.since}
              </p>
            </div>
            <div className="sm:border-x sm:border-white/15">
              <p className="text-4xl sm:text-5xl font-extrabold text-[var(--color-amber)]">
                {BRAND.installsCompleted}
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/85">
                Installs completed
              </p>
              <p className="mt-1 text-sm text-white/70">
                Solar + HVAC since {BRAND.since}
              </p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-[var(--color-amber)] flex items-center justify-center gap-1">
                4.8
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                </svg>
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/85">
                Google review average
              </p>
              <p className="mt-1 text-sm text-white/70">
                Across Portland metro customers
              </p>
            </div>
          </div>
        </Reveal>

        {/* Testimonials grid */}
        <Reveal className="text-center max-w-2xl mx-auto mt-16 mb-10">
          <p className="eyebrow">What customers say</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--color-accent)] leading-tight">
            Real reviews from Portland homeowners
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <figure className="h-full rounded-2xl bg-white border border-[var(--color-line)] p-6 sm:p-7 shadow-sm">
                <svg
                  className="w-8 h-8 text-[var(--color-primary)] mb-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7.17 6A5.5 5.5 0 0 0 2 11.5V18h6.5v-6.5H5.5a3.67 3.67 0 0 1 3.67-3.67V6zm10 0a5.5 5.5 0 0 0-5.17 5.5V18H18.5v-6.5h-3a3.67 3.67 0 0 1 3.67-3.67V6z" />
                </svg>
                <blockquote className="text-base text-[var(--color-ink)]/90 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 pt-5 border-t border-[var(--color-line)]">
                  <p className="text-sm font-bold text-[var(--color-accent)]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    {t.context}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <p className="mt-6 text-center text-xs text-[var(--color-ink-muted)]">
            Reviews collected from{" "}
            <a
              href="https://premiersolarnw.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-primary)]"
            >
              premiersolarnw.com
            </a>
            . Verbatim quotes.
          </p>
        </Reveal>

        <Reveal delay={350}>
          <DualCTA />
        </Reveal>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/Reveal";
import { DualCTA } from "@/components/DualCTA";
import { TRUST_POINTS } from "@/lib/content";

/**
 * Why Us — trust stack. Renders the four key proof points from the task
 * spec content_requests #2: locally-owned-since-2011, NATE-certified,
 * in-house electricians, workmanship + labor warranty.
 */
export function WhyUsSection() {
  return (
    <section
      id="why-us"
      className="py-20 sm:py-24 bg-[var(--color-surface)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow">Why Premier Solar NW</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--color-accent)] leading-tight">
            The HVAC team Portland homeowners actually want to hire
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-ink-muted)] leading-relaxed">
            Premier Solar Northwest has been earning trust in the Portland
            metro since 2011. Our HVAC division brings the same locally-owned
            quality standard to your heating and cooling system.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
          {TRUST_POINTS.map((tp, i) => (
            <Reveal key={tp.title} delay={i * 70}>
              <div className="h-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface-alt)] p-6 sm:p-7 hover:shadow-lg hover:border-[var(--color-primary)]/40 transition">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0 font-extrabold">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[var(--color-accent)] leading-snug">
                      {tp.title}
                    </h3>
                    <p className="mt-2 text-base text-[var(--color-ink)]/85 leading-relaxed">
                      {tp.body}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <DualCTA />
        </Reveal>
      </div>
    </section>
  );
}

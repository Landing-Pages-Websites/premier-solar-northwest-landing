import { Reveal } from "@/components/Reveal";
import { DualCTA } from "@/components/DualCTA";
import { FAQS } from "@/lib/content";

export function FAQSection() {
  return (
    <section id="faq" className="py-20 sm:py-24 bg-[var(--color-surface)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow">Frequently asked</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--color-accent)] leading-tight">
            HVAC questions, answered
          </h2>
          <p className="mt-4 text-base text-[var(--color-ink-muted)] leading-relaxed">
            Cost, timing, certifications, rebates, service areas — the
            things Portland homeowners actually ask when they call us.
          </p>
        </Reveal>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 40}>
              <details className="group rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-alt)] hover:border-[var(--color-primary)]/40 transition">
                <summary className="cursor-pointer list-none p-5 sm:p-6 flex items-start justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--color-accent)] leading-snug">
                    {faq.q}
                  </h3>
                  <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-lg leading-none transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 -mt-1">
                  <p className="text-base text-[var(--color-ink)]/85 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <DualCTA />
        </Reveal>
      </div>
    </section>
  );
}

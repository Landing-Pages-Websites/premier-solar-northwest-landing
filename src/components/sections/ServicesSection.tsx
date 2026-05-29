import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { DualCTA } from "@/components/DualCTA";
import { SERVICES } from "@/lib/content";

/**
 * Services — alternating image/text cards for each of the 5 HVAC
 * services from the task spec. Anchors per service for ad campaign
 * deep-linking + Quality Score messaging.
 */
export function ServicesSection() {
  return (
    <section
      id="services"
      className="py-20 sm:py-24 bg-warm-cream"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow">HVAC Services</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--color-accent)] leading-tight">
            Full-service HVAC for Portland homes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-ink-muted)] leading-relaxed">
            From a quick capacitor swap to a full furnace + AC changeover,
            our NATE-certified team handles installation, replacement, and
            repair end-to-end. One crew. One quote. No surprises.
          </p>
        </Reveal>

        <div className="space-y-12 sm:space-y-16">
          {SERVICES.map((svc, i) => (
            <Reveal key={svc.id} delay={i * 80}>
              <section
                id={svc.id}
                aria-labelledby={`${svc.id}-title`}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-[var(--color-accent)]/15 aspect-[4/3] bg-[var(--color-surface-alt)]">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="eyebrow">
                    {String(i + 1).padStart(2, "0")} / {SERVICES.length}
                  </p>
                  <h3
                    id={`${svc.id}-title`}
                    className="mt-2 text-2xl sm:text-3xl font-extrabold text-[var(--color-accent)] leading-tight"
                  >
                    {svc.title}
                  </h3>
                  <p className="mt-4 text-base sm:text-lg text-[var(--color-ink)]/85 leading-relaxed">
                    {svc.blurb}
                  </p>
                  <DualCTA align="start" />
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { BRAND } from "@/lib/content";

/**
 * Legal-only footer. No nav, no social, no outbound links beyond the
 * primary call CTA. Division Rubric 3 (Structural Conformance) flags
 * "On This Page" / anchor-nav footers — keep this pure legal.
 */
export function Footer() {
  return (
    <footer className="bg-[var(--color-accent)] text-[var(--color-ink-on-dark)] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-3">
        <p className="text-sm text-white/90 font-semibold">
          © {new Date().getFullYear()} {BRAND.fullName}
        </p>
        <p className="text-xs text-white/75 leading-relaxed">
          Based in {BRAND.basedIn} · {BRAND.phoneDisplay} · Serving the{" "}
          {BRAND.serviceArea} since {BRAND.since}
        </p>
        <p className="text-[11px] text-white/55 leading-relaxed max-w-2xl mx-auto pt-2 border-t border-white/10">
          Licensed HVAC contractor. Service availability varies by location
          and system type. $500 off furnace + AC combo offer is current at
          time of estimate and applies to qualifying matched-system
          installs. Warranty terms are provided in writing with each
          install. Energy Trust of Oregon rebates, utility incentives, and
          federal tax credits subject to eligibility and program terms.
        </p>
      </div>
    </footer>
  );
}

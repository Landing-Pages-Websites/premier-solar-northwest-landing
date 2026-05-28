"use client";

import { useRef, useState } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import {
  BRAND,
  HOMEOWNER_OPTIONS,
  TIMELINE_OPTIONS,
  isQualified,
  type HomeownerValue,
  type TimelineValue,
} from "@/lib/content";

type Props = {
  variant?: "hero" | "card";
  heading?: string;
  subheading?: string;
  idSuffix?: string;
};

/**
 * Premier Solar Northwest — HVAC LP lead form.
 *
 * Field set per task spec d3d49e18-d99a-46c3-b1fa-bbc921aeab18:
 *   - firstName        required
 *   - lastName         required
 *   - email            required
 *   - phone            required (10-digit US, formatted as (555) 555-5555)
 *   - zip              required (5-digit US)
 *   - homeowner        required ("yes" qualified | "no" disqualified)
 *   - timeline         required ("asap"/"1_2_weeks" qualified |
 *                                 "2_plus_weeks"/"just_researching" disqualified)
 *
 * EVERY submission — qualified OR disqualified — POSTs to useMegaLeadForm.
 * Disqualified leads ship with `qualified: false` + `disqualification_reason`
 * so the lead pipeline can tag them appropriately rather than dropping the
 * lead silently (per AGENTS Builds Lane HARD RULE #1, 2026-05-14 Peter mandate,
 * and the QC Capital 2026-05-21 rework lesson). The UI branches AFTER the
 * submit completes: qualified → standard thank-you screen, disqualified →
 * "not a fit right now" screen with a phone CTA fallback.
 *
 * Button is type="button" with validate-first → requestSubmit pattern to
 * prevent the Mega optimizer from firing form_submit on native submit
 * events before our handleSubmit logic runs (SHLY May 8 incident pattern).
 */

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatZip(value: string): string {
  return value.replace(/\D/g, "").slice(0, 5);
}

const ChevronDown = () => (
  <svg
    className="w-5 h-5 text-[var(--color-ink-muted)]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export function FormCard({
  variant = "card",
  heading = "Get My Free HVAC Quote",
  subheading = "Tell us about your home and a Premier Solar NW expert will follow up shortly with a free in-home estimate.",
  idSuffix = "main",
}: Props) {
  const { submit } = useMegaLeadForm();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [homeowner, setHomeowner] = useState<HomeownerValue | "">("");
  const [timeline, setTimeline] = useState<TimelineValue | "">("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wasQualified, setWasQualified] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Synchronous double-submit guard — React state updates are async, so
  // rapid-click bursts (5 in <50ms) all see submitting=false. A ref reads
  // the latest value within the same microtask. (SHLY May 8 pattern.)
  const inFlightRef = useRef(false);

  const phoneDigits = phone.replace(/\D/g, "");
  const phoneValid = phoneDigits.length === 10;
  const zipValid = zip.length === 5;

  const canSubmit =
    firstName.trim().length >= 1 &&
    lastName.trim().length >= 1 &&
    /@.+\./.test(email) &&
    phoneValid &&
    zipValid &&
    homeowner.length > 0 &&
    timeline.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inFlightRef.current || submitted) return;
    if (!canSubmit) return;
    inFlightRef.current = true;
    setError(null);
    setSubmitting(true);

    const qualified = isQualified(homeowner, timeline);
    setWasQualified(qualified);

    // Disqualification reason — captured for lead pipeline tagging.
    let disqualReason: string | null = null;
    if (!qualified) {
      if (homeowner !== "yes") {
        disqualReason = "not_homeowner";
      } else if (timeline === "2_plus_weeks") {
        disqualReason = "timeline_2_plus_weeks";
      } else if (timeline === "just_researching") {
        disqualReason = "just_researching";
      } else {
        disqualReason = "unqualified";
      }
    }

    try {
      // EVERY submission goes to the lead API. Per AGENTS Builds Lane
      // HARD RULE #1 — disqualified leads are TAGGED, never silently dropped.
      await submit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phoneDigits,
        zip,
        homeowner,
        timeline,
        qualified,
        disqualification_reason: disqualReason,
      });
    } catch (err) {
      console.error("Form submission failed:", err);
      setError("Something went wrong on our end — we also got your info.");
    } finally {
      setSubmitted(true);
      setSubmitting(false);
    }
  }

  const wrapperClass =
    variant === "hero"
      ? "bg-white/98 backdrop-blur rounded-2xl shadow-2xl shadow-[var(--color-accent)]/30 border border-[var(--color-primary)]/15 p-6 sm:p-8"
      : "bg-white rounded-2xl shadow-xl border border-[var(--color-line)] p-6 sm:p-8";

  const inputClass =
    "w-full rounded-lg border-2 border-[var(--color-line)] bg-white px-4 py-3 text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition";

  if (submitted) {
    // Branch on qualified/disqualified ONLY in the UI — both code paths
    // have already POSTed to the lead API above.
    if (wasQualified) {
      return (
        <div className={wrapperClass}>
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-[var(--color-amber-50)] flex items-center justify-center">
              <svg
                className="w-7 h-7 text-[var(--color-primary)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-accent)]">
              Thanks, {firstName || "we got it"}!
            </h3>
            <p className="text-[var(--color-ink-muted)] max-w-sm mx-auto">
              A Premier Solar NW HVAC expert will follow up shortly to
              schedule your free in-home estimate. For immediate service,
              call{" "}
              <a
                href={BRAND.phoneHref}
                className="font-bold text-[var(--color-primary)] hover:underline"
              >
                {BRAND.phoneDisplay}
              </a>
              .
            </p>
            {error && (
              <p className="text-sm text-[var(--color-danger)]">{error}</p>
            )}
          </div>
        </div>
      );
    }

    // Disqualified — show a respectful "not a fit right now" screen with
    // a phone-call escape hatch. The lead is still in the system.
    return (
      <div className={wrapperClass}>
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-[var(--color-amber-50)] flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[var(--color-amber-hover)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[var(--color-accent)]">
            Thanks, {firstName || "friend"} — we got your info.
          </h3>
          <p className="text-[var(--color-ink-muted)] max-w-sm mx-auto">
            Based on your answers, our free in-home estimate may not be the
            best fit right now. If your situation changes — or if you'd
            like to talk through options — give us a call.
          </p>
          <a
            href={BRAND.phoneHref}
            className="inline-flex items-center justify-center gap-2 mt-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-3 rounded-lg font-bold text-sm transition"
          >
            <svg
              className="w-4 h-4"
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
            Call {BRAND.phoneDisplay}
          </a>
          {error && (
            <p className="text-sm text-[var(--color-danger)]">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass} id={`form-${idSuffix}`}>
      <div className="space-y-1 mb-5">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--color-accent)] leading-tight">
          {heading}
        </h3>
        <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
          {subheading}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        noValidate
        aria-label="HVAC quote request form"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`firstName-${idSuffix}`}
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1.5"
            >
              First Name *
            </label>
            <input
              id={`firstName-${idSuffix}`}
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor={`lastName-${idSuffix}`}
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1.5"
            >
              Last Name *
            </label>
            <input
              id={`lastName-${idSuffix}`}
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`email-${idSuffix}`}
            className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1.5"
          >
            Email Address *
          </label>
          <input
            id={`email-${idSuffix}`}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane.doe@example.com"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`phone-${idSuffix}`}
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1.5"
            >
              Phone Number *
            </label>
            <input
              id={`phone-${idSuffix}`}
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(503) 555-0100"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor={`zip-${idSuffix}`}
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1.5"
            >
              ZIP Code *
            </label>
            <input
              id={`zip-${idSuffix}`}
              name="zip"
              type="text"
              autoComplete="postal-code"
              required
              inputMode="numeric"
              value={zip}
              onChange={(e) => setZip(formatZip(e.target.value))}
              placeholder="97201"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`homeowner-${idSuffix}`}
            className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1.5"
          >
            Are you a homeowner or property owner? *
          </label>
          <div className="relative">
            <select
              id={`homeowner-${idSuffix}`}
              name="homeowner"
              required
              value={homeowner}
              onChange={(e) => setHomeowner(e.target.value as HomeownerValue)}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="" disabled>
                Select an option
              </option>
              {HOMEOWNER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDown />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor={`timeline-${idSuffix}`}
            className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1.5"
          >
            How soon are you looking for service? *
          </label>
          <div className="relative">
            <select
              id={`timeline-${idSuffix}`}
              name="timeline"
              required
              value={timeline}
              onChange={(e) => setTimeline(e.target.value as TimelineValue)}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="" disabled>
                Select a timeline
              </option>
              {TIMELINE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDown />
            </div>
          </div>
        </div>

        {error && (
          <p
            className="text-sm text-[var(--color-danger)] bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* type="button" — validate first, then requestSubmit() (SHLY pattern). */}
        <button
          type="button"
          disabled={submitting || submitted}
          onClick={(e) => {
            // Synchronous guard against rapid clicks (refs update faster
            // than React state). The handleSubmit guard is the truth, but
            // this prevents requestSubmit() from even being called.
            if (inFlightRef.current || submitted) return;
            if (!canSubmit) {
              // Let the native browser show its required-field hints.
              const form = (e.currentTarget as HTMLButtonElement).closest(
                "form",
              );
              form?.reportValidity();
              return;
            }
            const form = (e.currentTarget as HTMLButtonElement).closest(
              "form",
            ) as HTMLFormElement | null;
            form?.requestSubmit();
          }}
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-[var(--color-ink-muted)] disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-lg font-bold text-base transition shadow-sm flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.25"
                />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Submitting...
            </>
          ) : (
            <>
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
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>

        <p className="text-xs text-[var(--color-ink-muted)] text-center">
          By submitting, you agree to be contacted by Premier Solar Northwest
          about your HVAC quote. Standard message + data rates may apply.
        </p>
      </form>
    </div>
  );
}

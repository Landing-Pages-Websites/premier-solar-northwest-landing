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
 *   - firstName, lastName, email, phone, zip (all required)
 *   - homeowner (yes / no)         — qualifying question
 *   - timeline  (asap / 2wk / 2+wk / researching) — qualifying question
 *
 * Rework attempt 3 changes per director ruling (2026-05-29 19:55Z):
 * - R5: stronger email regex + matching `pattern=` attr on input
 * - R5: phone inputMode="numeric" (was "tel")
 * - R5: rapid-click guard hardened — inFlightRef set BEFORE any state
 *       update, button gets disabled={submitting||submitted}
 * - R4: explicit window.dataLayer.push({event:'form_submission',...})
 *       after successful submit() — keeping MegaTag optimizer auto-detect
 *       as the primary tracking path (no MegaTag.trackEvent call)
 * - HARD RULE #8 / Peter mandate 2026-05-19: inline per-field validation
 *   errors — every required field has its own role=alert sibling, blur
 *   triggers + live-clear, empty-submit shows all + focuses first invalid
 *
 * EVERY submission — qualified OR disqualified — POSTs to useMegaLeadForm
 * (per AGENTS Builds Lane HARD RULE #1 + 2026-05-14 Peter mandate +
 * QC Capital 2026-05-21 lesson). UI branches AFTER submit completes.
 */

// RFC-5322-lite email validator. Replaces the prior /@.+\./ (which let
// `@company.com` through — QA attempt 1 finding 2026-05-28T21:16Z).
const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
// Same regex as an attribute string (no anchors — HTML pattern is anchored implicitly).
const EMAIL_PATTERN = "[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}";

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

// Per-field validators. Return null when valid, error message when invalid.
type FieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "zip"
  | "address"
  | "homeowner"
  | "timeline";

function validateField(key: FieldKey, value: string): string | null {
  switch (key) {
    case "firstName":
      return value.trim().length >= 1 ? null : "Please enter your first name.";
    case "lastName":
      return value.trim().length >= 1 ? null : "Please enter your last name.";
    case "email":
      if (value.trim().length === 0) {
        return "Please enter your email address.";
      }
      return EMAIL_RE.test(value.trim())
        ? null
        : "Please enter a valid email address.";
    case "phone": {
      const digits = value.replace(/\D/g, "");
      if (digits.length === 0) return "Please enter your phone number.";
      return digits.length === 10
        ? null
        : "Phone must be a 10-digit number.";
    }
    case "zip":
      if (value.length === 0) return "Please enter your ZIP code.";
      return value.length === 5 ? null : "ZIP must be 5 digits.";
    case "address":
      return value.trim().length >= 5
        ? null
        : "Please enter your street address.";
    case "homeowner":
      return value.length > 0 ? null : "Please select an option.";
    case "timeline":
      return value.length > 0 ? null : "Please select a timeline.";
  }
}

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
  const [address, setAddress] = useState("");
  const [homeowner, setHomeowner] = useState<HomeownerValue | "">("");
  const [timeline, setTimeline] = useState<TimelineValue | "">("");

  // Inline per-field error map. Populated on blur / change / submit.
  // Empty string here = "field has been touched and is currently valid"
  // (we don't render anything for empty messages). null = untouched.
  type ErrorMap = Partial<Record<FieldKey, string | null>>;
  const [errors, setErrors] = useState<ErrorMap>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wasQualified, setWasQualified] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Synchronous double-submit guard. React state is async; in a 5-click
  // burst all clicks see submitting=false before the first setState lands.
  // A ref reads the latest value within the same microtask. We flip it
  // BEFORE any state update so the second click bails immediately.
  // (SHLY May 8 pattern + QA attempt 1 finding 2026-05-28T21:16Z —
  // 5 leads in 196ms in ad_leads. Hardened per director attempt-3 ruling.)
  const inFlightRef = useRef(false);

  // Refs for focus-management on empty-submit.
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});
  const setFieldRef =
    (key: FieldKey) => (el: HTMLInputElement | HTMLSelectElement | null) => {
      fieldRefs.current[key] = el;
    };

  const phoneDigits = phone.replace(/\D/g, "");
  const phoneValid = phoneDigits.length === 10;
  const zipValid = zip.length === 5;

  const canSubmit =
    firstName.trim().length >= 1 &&
    lastName.trim().length >= 1 &&
    EMAIL_RE.test(email.trim()) &&
    phoneValid &&
    zipValid &&
    address.trim().length >= 5 &&
    homeowner.length > 0 &&
    timeline.length > 0;

  // Blur handler — show format-specific message if invalid.
  function handleBlur(key: FieldKey, value: string) {
    const msg = validateField(key, value);
    setErrors((prev) => ({ ...prev, [key]: msg }));
  }

  // Change handler — if the field already had an error, re-validate live
  // so the message clears the moment the input becomes valid.
  function clearErrorIfFixed(key: FieldKey, value: string) {
    setErrors((prev) => {
      if (prev[key] === undefined) return prev;
      const msg = validateField(key, value);
      // msg === null → valid, blank out; msg !== null → keep showing the
      // updated message (e.g. "10-digit" → "valid")
      if (prev[key] === msg) return prev;
      return { ...prev, [key]: msg };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Synchronous double-click guard — must be the very first line.
    if (inFlightRef.current || submitted) return;

    if (!canSubmit) {
      // Run every validator, show every error at once, focus the first invalid.
      const allErrors: ErrorMap = {
        firstName: validateField("firstName", firstName),
        lastName: validateField("lastName", lastName),
        email: validateField("email", email),
        phone: validateField("phone", phone),
        zip: validateField("zip", zip),
        address: validateField("address", address),
        homeowner: validateField("homeowner", homeowner),
        timeline: validateField("timeline", timeline),
      };
      setErrors(allErrors);
      const firstInvalid = (
        Object.keys(allErrors) as FieldKey[]
      ).find((k) => allErrors[k]);
      if (firstInvalid) {
        const el = fieldRefs.current[firstInvalid];
        el?.focus();
      }
      return;
    }

    // Mark in-flight synchronously before any state update.
    inFlightRef.current = true;
    setFormError(null);
    setSubmitting(true);

    const qualified = isQualified(homeowner, timeline);
    setWasQualified(qualified);

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
      // EVERY submission goes to the lead API. Disqualified leads tagged,
      // never silently dropped (AGENTS Builds Lane HARD RULE #1 +
      // 2026-05-14 Peter mandate + QC Capital 2026-05-21 rework lesson).
      const res = await submit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phoneDigits,
        zip,
        address: address.trim(),
        homeowner,
        timeline,
        qualified,
        disqualification_reason: disqualReason,
      });

      if (res?.ok !== true) {
        throw new Error("Submission was not confirmed");
      }

      // Manual dataLayer push for GTM — required by AGENTS Builds HARD
      // RULE #4 per director ruling 2026-05-29. The optimizer auto-detect
      // is the primary tracking path; this is the belt-and-suspenders
      // GTM signal. Do NOT add MegaTag.trackEvent (auto-detect handles it).
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "form_submission",
          form_id: `${idSuffix}_lead_form`,
          qualified,
          disqualification_reason: disqualReason,
        });
      }

      setSubmitted(true);
      setSubmitting(false);
      // inFlightRef stays true after a confirmed success so late clicks bail.
    } catch (err) {
      console.error("Form submission failed:", err);
      setFormError(
        "We could not send your request. Please check your connection and try again, or email us at bcullivan@premiersolarnw.com.",
      );
      setSubmitting(false);
      inFlightRef.current = false; // clear the latch so a retry is possible
    }
  }

  const wrapperClass =
    variant === "hero"
      ? "bg-white/98 backdrop-blur rounded-2xl shadow-2xl shadow-[var(--color-accent)]/30 border border-[var(--color-primary)]/15 p-6 sm:p-8"
      : "bg-white rounded-2xl shadow-xl border border-[var(--color-line)] p-6 sm:p-8";

  const inputBase =
    "w-full rounded-lg border-2 bg-white px-4 py-3 text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 transition";
  const inputClass = (hasError: boolean) =>
    `${inputBase} ${
      hasError
        ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)] focus:border-[var(--color-danger)]"
        : "border-[var(--color-line)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
    }`;

  if (submitted) {
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
          </div>
        </div>
      );
    }

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
            best fit right now. If your situation changes — or if you&apos;d
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
        </div>
      </div>
    );
  }

  // Helper for the inline error message under each field.
  const renderError = (key: FieldKey) => {
    const msg = errors[key];
    if (!msg) return null;
    return (
      <p
        id={`${key}-${idSuffix}-error`}
        role="alert"
        aria-live="polite"
        className="lp-input-error mt-1.5 text-xs font-semibold text-[var(--color-danger)]"
      >
        {msg}
      </p>
    );
  };

  const ariaProps = (key: FieldKey) =>
    errors[key]
      ? {
          "aria-invalid": true as const,
          "aria-describedby": `${key}-${idSuffix}-error`,
        }
      : {};

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
              ref={setFieldRef("firstName")}
              id={`firstName-${idSuffix}`}
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                clearErrorIfFixed("firstName", e.target.value);
              }}
              onBlur={(e) => handleBlur("firstName", e.target.value)}
              placeholder="Jane"
              className={inputClass(!!errors.firstName)}
              {...ariaProps("firstName")}
            />
            {renderError("firstName")}
          </div>
          <div>
            <label
              htmlFor={`lastName-${idSuffix}`}
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1.5"
            >
              Last Name *
            </label>
            <input
              ref={setFieldRef("lastName")}
              id={`lastName-${idSuffix}`}
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                clearErrorIfFixed("lastName", e.target.value);
              }}
              onBlur={(e) => handleBlur("lastName", e.target.value)}
              placeholder="Doe"
              className={inputClass(!!errors.lastName)}
              {...ariaProps("lastName")}
            />
            {renderError("lastName")}
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
            ref={setFieldRef("email")}
            id={`email-${idSuffix}`}
            name="email"
            type="email"
            autoComplete="email"
            required
            pattern={EMAIL_PATTERN}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearErrorIfFixed("email", e.target.value);
            }}
            onBlur={(e) => handleBlur("email", e.target.value)}
            placeholder="jane.doe@example.com"
            className={inputClass(!!errors.email)}
            {...ariaProps("email")}
          />
          {renderError("email")}
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
              ref={setFieldRef("phone")}
              id={`phone-${idSuffix}`}
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                setPhone(formatted);
                clearErrorIfFixed("phone", formatted);
              }}
              onBlur={(e) => handleBlur("phone", e.target.value)}
              placeholder="(503) 555-0100"
              className={inputClass(!!errors.phone)}
              {...ariaProps("phone")}
            />
            {renderError("phone")}
          </div>
          <div>
            <label
              htmlFor={`zip-${idSuffix}`}
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1.5"
            >
              ZIP Code *
            </label>
            <input
              ref={setFieldRef("zip")}
              id={`zip-${idSuffix}`}
              name="zip"
              type="text"
              autoComplete="postal-code"
              required
              inputMode="numeric"
              value={zip}
              onChange={(e) => {
                const formatted = formatZip(e.target.value);
                setZip(formatted);
                clearErrorIfFixed("zip", formatted);
              }}
              onBlur={(e) => handleBlur("zip", e.target.value)}
              placeholder="97201"
              className={inputClass(!!errors.zip)}
              {...ariaProps("zip")}
            />
            {renderError("zip")}
          </div>
        </div>

        <div>
          <label
            htmlFor={`address-${idSuffix}`}
            className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1.5"
          >
            Street Address *
          </label>
          <input
            ref={setFieldRef("address")}
            id={`address-${idSuffix}`}
            name="address"
            type="text"
            autoComplete="street-address"
            required
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              clearErrorIfFixed("address", e.target.value);
            }}
            onBlur={(e) => handleBlur("address", e.target.value)}
            placeholder="123 SE Main St, Portland, OR 97214"
            className={inputClass(!!errors.address)}
            {...ariaProps("address")}
          />
          {renderError("address")}
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
              ref={setFieldRef("homeowner")}
              id={`homeowner-${idSuffix}`}
              name="homeowner"
              required
              value={homeowner}
              onChange={(e) => {
                const v = e.target.value as HomeownerValue;
                setHomeowner(v);
                clearErrorIfFixed("homeowner", v);
              }}
              onBlur={(e) => handleBlur("homeowner", e.target.value)}
              className={`${inputClass(!!errors.homeowner)} appearance-none pr-10`}
              {...ariaProps("homeowner")}
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
          {renderError("homeowner")}
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
              ref={setFieldRef("timeline")}
              id={`timeline-${idSuffix}`}
              name="timeline"
              required
              value={timeline}
              onChange={(e) => {
                const v = e.target.value as TimelineValue;
                setTimeline(v);
                clearErrorIfFixed("timeline", v);
              }}
              onBlur={(e) => handleBlur("timeline", e.target.value)}
              className={`${inputClass(!!errors.timeline)} appearance-none pr-10`}
              {...ariaProps("timeline")}
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
          {renderError("timeline")}
        </div>

        {formError && (
          <p
            className="text-sm text-[var(--color-danger)] bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            role="alert"
            aria-live="polite"
          >
            {formError}
          </p>
        )}

        {/* type="button" + disabled + sync inFlightRef pattern.
            (SHLY May 8 + QA attempt 1 hardening.) */}
        <button
          type="button"
          disabled={submitting || submitted}
          onClick={(e) => {
            // Synchronous guard — refs update faster than React state.
            if (inFlightRef.current || submitted) return;
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

        <p className="text-[11px] font-semibold text-[var(--color-ink-muted)] text-center">
          NATE-certified · Licensed HVAC contractor · 1,000+ installs since 2011
        </p>
      </form>
    </div>
  );
}

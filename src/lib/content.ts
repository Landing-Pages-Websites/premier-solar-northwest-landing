/**
 * Premier Solar Northwest — HVAC LP content constants.
 * Source of truth: task d3d49e18-d99a-46c3-b1fa-bbc921aeab18
 * + live page https://premiersolarnw.com/heating-ventilation-and-air-conditioning-hvac/
 * + https://premierhvacpro.jobbersites.com/.
 *
 * NOTE: This LP is HVAC ONLY — solar / battery / electrical-only services
 * are intentionally excluded per the task spec content_requests.
 */

export const BRAND = {
  name: "Premier Solar NW",
  fullName: "Premier Solar Northwest",
  hvacName: "Premier HVAC Pro",
  tagline: "Portland's Trusted HVAC Experts",
  taglineLong:
    "HVAC installation, replacement, and repair for Portland metro homeowners.",
  since: 2011,
  installsCompleted: "1,000+",
  basedIn: "Portland, OR",
  serviceArea: "Portland Metro Area",
  // CTM tracking number (provided by task — must display verbatim)
  phoneDisplay: "(971) 357-9233",
  phoneHref: "tel:+19713579233",
  email: "bcullivan@premiersolarnw.com",
  primaryCtaLabel: "Get My Free In-Home Estimate",
  primaryCtaShort: "Get Free Quote",
  // Featured offer
  offerHeadline: "$500 OFF Furnace + AC Combo Replacement",
  offerSub: "Limited-time savings on a complete heating + cooling upgrade.",
} as const;

// Homeowner / property-owner dropdown
export const HOMEOWNER_OPTIONS = [
  { value: "yes", label: "Yes — I own this home / property" },
  { value: "no", label: "No — I'm renting" },
] as const;

export type HomeownerValue = (typeof HOMEOWNER_OPTIONS)[number]["value"];

// Timeline dropdown — qualifies leads on urgency (per task spec)
export const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP — within a few days" },
  { value: "1_2_weeks", label: "Within 2 weeks" },
  { value: "2_plus_weeks", label: "2+ weeks out" },
  { value: "just_researching", label: "Just researching for now" },
] as const;

export type TimelineValue = (typeof TIMELINE_OPTIONS)[number]["value"];

/** Returns true if the answer to "homeowner?" + "timeline" both qualify. */
export function isQualified(
  homeowner: HomeownerValue | "",
  timeline: TimelineValue | "",
): boolean {
  if (homeowner !== "yes") return false;
  if (timeline !== "asap" && timeline !== "1_2_weeks") return false;
  return true;
}

export const SERVICES = [
  {
    id: "heat-pump-installation",
    title: "Heat Pump Installation",
    blurb:
      "All-electric heating + cooling in one efficient system. Perfect for Portland's wet winters and warm summers, with Energy Trust of Oregon rebates available on qualifying systems.",
    image: "/images/heat-pump.webp",
  },
  {
    id: "furnace-replacement",
    title: "Furnace Replacement",
    blurb:
      "High-efficiency gas furnace upgrades with right-sized BTU loads and clean install work. We pull the permits, haul the old unit, and stand behind every install with our limited workmanship + labor warranty.",
    image: "/images/furnace.webp",
  },
  {
    id: "ac-installation-repair",
    title: "AC Installation & Repair",
    blurb:
      "Central AC installation and same-week repair for residential homes across the Portland metro. From a quiet new central system to a fast capacitor swap, NATE-certified technicians handle the diagnosis and the fix.",
    image: "/images/hvac-install.webp",
  },
  {
    id: "hvac-repair",
    title: "Whole-System HVAC Repair",
    blurb:
      "Furnace, heat pump, AC, mini-split, or thermostat — we diagnose the real problem before we quote the repair. No upsell pressure, no surprise fees. We quote before we start, every time.",
    image: "/images/hvac-tech.webp",
  },
  {
    id: "emergency-hvac",
    title: "Emergency HVAC Service",
    blurb:
      "No heat in January? No AC during a Portland heat wave? Call us first. Our team prioritizes emergency service calls so you're not stuck in a freezing or sweltering house waiting on a callback.",
    image: "/images/emergency-hvac.webp",
  },
] as const;

export const TRUST_POINTS = [
  {
    title: "Locally Owned Since 2011",
    body: "Family-owned and operated in Portland, OR. The same crew that started Premier Solar NW in 2011 still runs the HVAC division — no franchise overhead, no out-of-state call center.",
  },
  {
    title: "NATE-Certified Technicians",
    body: "Every install lead and lead tech is NATE-certified (North American Technician Excellence) — the HVAC industry's top trade certification for installation and service quality.",
  },
  {
    title: "In-House Electricians",
    body: "Heat pump and AC installs almost always need electrical work. Our in-house electricians handle the panel, the disconnect, and the wiring on the same visit. No third-party scheduling, no finger-pointing.",
  },
  {
    title: "Workmanship + Labor Warranty",
    body: "Every HVAC installation comes with our limited workmanship + labor warranty in writing. We stand behind the install long after the truck leaves your driveway.",
  },
] as const;

export const FAQS: { q: string; a: string }[] = [
  {
    q: "How much does a new furnace or heat pump cost in Portland?",
    a: "It depends on the size of your home, the efficiency tier, and whether your existing ductwork and electrical can support the new system. We quote the price before we start, in writing, with no surprise fees. Right now we're also offering $500 off a furnace + AC combo replacement — fill out the form for a free in-home estimate.",
  },
  {
    q: "Are you NATE-certified?",
    a: "Yes. Our install leads and lead technicians are NATE-certified (North American Technician Excellence), the HVAC industry's top trade certification. Combined with our in-house electricians, that means a single qualified crew handles the entire job.",
  },
  {
    q: "Do you offer emergency HVAC repair?",
    a: "Yes. We prioritize emergency service calls so you're not stuck in a freezing or sweltering house. Call (971) 357-9233 or submit the form — let us know it's urgent and we'll fast-track the dispatch.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve the Portland metro area — Portland, Beaverton, Hillsboro, Tigard, Tualatin, Lake Oswego, West Linn, Oregon City, Clackamas, Happy Valley, Gresham, Milwaukie, Wilsonville, Sherwood, Newberg, Canby, Gladstone, Fairview, Forest Grove, North Plains, Banks, St. Helens, and Scappoose.",
  },
  {
    q: "Do you handle the rebates and permits?",
    a: "Yes. We pull all required permits and walk you through the available Energy Trust of Oregon rebates, utility incentives, and federal tax credits on qualifying high-efficiency heat pump installations.",
  },
  {
    q: "How long does an HVAC installation take?",
    a: "Most furnace or AC replacements take 1 day. Heat pump installs and full system changeovers typically take 1-2 days. We schedule the install at your convenience and keep your home clean while we work.",
  },
  {
    q: "What if my existing ducts or electrical aren't up to spec?",
    a: "We diagnose duct and electrical condition during the free in-home estimate and include any required upgrades in your written quote. Our in-house electricians handle panel and circuit work on the same visit — no third-party scheduling.",
  },
  {
    q: "Are you the same company as Premier Solar Northwest?",
    a: "Yes. Premier Solar Northwest has been serving Oregon and Washington since 2011, and HVAC is now a core part of what we do. Same family-owned crew, same quality standard you'd expect from a local Portland company.",
  },
];

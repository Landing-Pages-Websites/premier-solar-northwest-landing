# Premier Solar Northwest — HVAC Landing Page

Production URL: **https://book.premiersolarnw.com**

This is the HVAC-focused landing page for Premier Solar Northwest, scoped
to ads traffic for HVAC services (heat pump install, furnace replacement,
AC install/repair, HVAC repair, emergency HVAC). Per task spec,
solar/battery/electrical-only services are intentionally excluded.

## Stack
- Next.js 16.2 (App Router, Turbopack)
- React 19.2
- Tailwind v4
- Deployed to Vercel (joeadams0s-projects team)

## Tracking
- Mega site_id: `ac6c1dfd-a0e9-48b6-a6c5-5d67ebbbfab6`
- Mega site_key: `yyuozfzulja4g3ws`
- GTM: `GTM-PH74NDN` (customer-specific, supplied by Lindsay via task comment)
- CTM: `572388.tctm.co/t.js` (universal MEGA account)
- Phone (displayed): `(971) 357-9233` (CTM-provisioned tracking number)

## Form
Lead capture form posts to `https://analytics.gomega.ai/submission/submit`.
Fields: firstName, lastName, email, phone, zip, homeowner, timeline.
Qualifying: homeowner=yes AND timeline∈{asap, 1_2_weeks}. Disqualified
leads still submit (tagged `qualified:false` + `disqualification_reason`).

## Sources
See `content-sources.json` for every claim → source mapping.

## Task
Atlas: `d3d49e18-d99a-46c3-b1fa-bbc921aeab18`

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import "./globals.css";

const inter = Inter({
  variable: "--font-body-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const interDisplay = Inter({
  variable: "--font-display-inter",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

// MEGA tracking IDs — provisioned via `mega site-tracking enable` for
// https://book.premiersolarnw.com (customer 0e9e2686-9b2b-4bf4-b4fe-903e65ceb028).
const SITE_ID = "ac6c1dfd-a0e9-48b6-a6c5-5d67ebbbfab6";
const SITE_KEY = "yyuozfzulja4g3ws";
// GTM container supplied by Lindsay/AM via task comment 2026-05-28.
const GTM_ID = "GTM-PH74NDN";

export const metadata: Metadata = {
  metadataBase: new URL("https://book.premiersolarnw.com"),
  title: {
    default:
      "Portland's Trusted HVAC Experts | Premier Solar Northwest",
    template: "%s | Premier Solar Northwest",
  },
  description:
    "Heat pump installation, furnace replacement, AC install + repair, and emergency HVAC service for Portland metro homeowners. NATE-certified technicians, in-house electricians, 1,000+ installs since 2011. $500 off furnace + AC combo replacement.",
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interDisplay.variable} h-full antialiased`}
    >
      <head>
        {/* MegaTag — optimizer config + GTM container.
            siteKey + siteId come from site_tracking_settings (provisioned
            via `mega site-tracking enable`). DO NOT replace these with
            placeholders. */}
        <meta name="mega-site-id" content={SITE_ID} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.MEGA_TAG_CONFIG={siteKey:"${SITE_KEY}",siteId:"${SITE_ID}",gtmId:"${GTM_ID}",pixelId:""};window.API_ENDPOINT="https://optimizer.gomega.ai";window.TRACKING_API_ENDPOINT="https://events-api.gomega.ai";`,
          }}
        />
        <script
          id="optimizer-script"
          src="https://cdn.gomega.ai/scripts/optimizer.min.js"
          data-site-id={SITE_ID}
          async
        />
        {/* Google Tag Manager — container ID supplied by the AM via task
            comment (GTM-PH74NDN). Customer-specific, NOT a generic placeholder. */}
        <script
          id="gtm-init"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-surface)] text-[var(--color-ink)]">
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <QueryParamPersistence />
        {children}
        {/* CallTrackingMetrics — universal MEGA account script. CTM swaps
            the displayed phone number for the Google-Ads-attributable
            tracking number on visit, so we leave the static fallback as
            the CTM-provisioned number itself. */}
        <Script
          src="https://572388.tctm.co/t.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

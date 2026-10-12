import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedTracker — India's Health Price Comparison | Compare 1mg, PharmEasy, Netmeds",
  description: "Compare medicine and supplement prices across 1mg, PharmEasy, Netmeds, Apollo, HealthKart, Amazon & Flipkart. Find the best deal instantly. Free, real-time, zero bias.",
  keywords: ["medicine price comparison india","supplement price compare","1mg vs pharmeasy","cheapest medicine online","health price tracker india","compare medicine prices"],
  openGraph: {
    title: "MedTracker — Never Overpay for Health Products Again",
    description: "Real-time price comparison across 7+ Indian health stores. Save up to 40% on medicines and supplements.",
    url: "https://medtracker.in",
    siteName: "MedTracker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedTracker — India's Health Price Intelligence",
    description: "Compare medicine prices across 1mg, PharmEasy, Netmeds and more. Always free.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: "https://medtracker.in" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MedTracker",
              "url": "https://medtracker.in",
              "description": "India's health price comparison and intelligence system",
              "potentialAction": {
                "@type": "SearchAction",
                "target": { "@type": "EntryPoint", "urlTemplate": "https://medtracker.in/?q={search_term_string}" },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}

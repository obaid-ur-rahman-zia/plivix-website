import "./globals.css";
import { Inter, Space_Grotesk, JetBrains_Mono, Noto_Sans_Bengali } from "next/font/google";
import LoadingMonitor from "../components/LoadingMonitor";
import { LoadingProvider } from "../components/LoadingContext";
import SmoothScroll from "../components/SmoothScroll";
import GsapBootstrap from "../components/GsapBootstrap";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import ThemeScript from "../components/theme/ThemeScript";
import { SiteSettingsProvider } from "../components/SiteSettingsContext";
import { I18nProvider } from "../components/I18nProvider";
import { getLocale } from "@/lib/i18n/server";
import { getSiteSettings } from "@/lib/supabase/queries";
import { sameAsFromSocials } from "@/lib/siteSocials";
import Script from "next/script";

// Body — clean, neutral, high legibility.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Display — Space Grotesk. Modern, slightly characterful tech sans.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Mono — developer vibe.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

// Bengali — loaded for every visitor but only applied when <html lang="bn">.
const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  variable: "--font-bengali",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f4ef" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL("https://www.plivix-tech.com"),
  title: "Plivix Technologies — ERP, web, mobile & AI software",
  description:
    "Plivix Technologies builds ERP systems, web platforms, mobile apps and AI automation for companies in Bangladesh and worldwide. Fixed-price proposals and clear software pricing.",
  keywords: [
    "ERP software Bangladesh",
    "ERP development",
    "software company Bangladesh",
    "custom software pricing",
    "Plivix",
    "Plivix Technologies",
    "Full-Stack Development",
    "Application Development",
    "AI Automation",
    "Machine Learning",
    "Data Science",
    "Next.js Agency",
    "AI Agency",
  ],
  openGraph: {
    title: "Plivix Technologies — ERP, web, mobile & AI software",
    description:
      "ERP systems, web platforms, mobile apps and AI automation. Fixed-price proposals.",
    url: "https://www.plivix-tech.com",
    type: "website",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    siteName: "Plivix Technologies",
    // Image file must match width/height exactly (WhatsApp/Facebook reject mismatches).
    images: [
      {
        url: "/images/og-image/og.png",
        width: 1200,
        height: 630,
        alt: "Plivix Technologies",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plivix Technologies — ERP, web, mobile & AI software",
    description:
      "ERP systems, web platforms, mobile apps and AI automation. Fixed-price proposals.",
    images: ["/images/og-image/og.png"],
  },
  applicationName: "Plivix Technologies",
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: { canonical: "/" },
};

export default async function RootLayout({ children }) {
  const siteSettings = await getSiteSettings();
  const sameAs = sameAsFromSocials(siteSettings.socials);
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${notoBengali.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "ProfessionalService"],
              "@id": "https://www.plivix-tech.com/#org",
              priceRange: "$$",
              slogan: "Progress through Logic, Innovation through Vision.",
              knowsAbout: [
                "ERP software",
                "Hospital management systems",
                "School management systems",
                "Real estate management systems",
                "Web development",
                "Mobile app development",
                "AI automation",
                "Data analytics",
              ],
              knowsLanguage: ["en", "bn"],
              name: "Plivix Technologies",
              url: "https://www.plivix-tech.com",
              logo: "https://www.plivix-tech.com/icon-512.png",
              email: siteSettings.contact_email,
              areaServed: ["Bangladesh", "Pakistan", "Worldwide"],
              address: { "@type": "PostalAddress", addressCountry: "BD" },
              ...(sameAs.length > 0 ? { sameAs } : {}),
              description:
                "Plivix Technologies builds ERP and management systems, web platforms, mobile apps and AI automation. The name stands for PLI (Progress, Logic & Innovation) and VIX (Vision, Intelligence & X).",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://www.plivix-tech.com/#website",
              url: "https://www.plivix-tech.com",
              name: "Plivix Technologies",
              inLanguage: ["en", "bn"],
              publisher: { "@id": "https://www.plivix-tech.com/#org" },
            }),
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[var(--color-accent)] focus:text-[var(--color-on-accent)] focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <SiteSettingsProvider value={siteSettings}>
          <I18nProvider locale={locale}>
          <ThemeProvider>
            <LoadingProvider>
              <GsapBootstrap />
              <SmoothScroll>
                <LoadingMonitor />
                <div id="root" className="w-full overflow-x-hidden">
                  {children}
                </div>
              </SmoothScroll>
            </LoadingProvider>
          </ThemeProvider>
          </I18nProvider>
        </SiteSettingsProvider>
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="lazyOnload" />
            <Script id="ga" strategy="lazyOnload">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}</Script>
          </>
        ) : null}
      </body>
    </html>
  );
}

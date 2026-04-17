import "./globals.css";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import LoadingMonitor from "../components/LoadingMonitor";
import { LoadingProvider } from "../components/LoadingContext";
import SmoothScroll from "../components/SmoothScroll";
import GsapBootstrap from "../components/GsapBootstrap";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import ThemeScript from "../components/theme/ThemeScript";
import { SiteSettingsProvider } from "../components/SiteSettingsContext";
import { getSiteSettings } from "@/lib/supabase/queries";
import { sameAsFromSocials } from "@/lib/siteSocials";

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

export const metadata = {
  metadataBase: new URL("https://www.plivix-tech.com"),
  title: "Plivix Technologies — Engineering intelligent systems",
  description:
    "Plivix Technologies builds production-grade web, mobile, AI and data platforms. Full-stack engineering, AI automation, machine learning and data science for modern teams.",
  keywords: [
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
    title: "Plivix Technologies — Engineering intelligent systems",
    description:
      "Full-stack engineering, AI automation, machine learning and data science for modern teams.",
    url: "https://www.plivix-tech.com",
    type: "website",
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
    title: "Plivix Technologies — Engineering intelligent systems",
    description:
      "Full-stack engineering, AI automation, machine learning and data science for modern teams.",
    images: ["/images/og-image/og.png"],
  },
  robots: "index, follow",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({ children }) {
  const siteSettings = await getSiteSettings();
  const sameAs = sameAsFromSocials(siteSettings.socials);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Plivix Technologies",
              url: "https://www.plivix-tech.com",
              logo: "/images/logo/logo-full.png",
              ...(sameAs.length > 0 ? { sameAs } : {}),
              description:
                "Plivix Technologies builds production-grade web, mobile, AI and data platforms.",
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
        </SiteSettingsProvider>
      </body>
    </html>
  );
}

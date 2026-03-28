import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/Toast";
import { LightboxProvider } from "@/components/LightboxProvider";
import { BottomNav } from "@/components/BottomNav";
import { CommandPalette } from "@/components/CommandPalette";
import { ConfettiProvider } from "@/components/Confetti";
import { PageTransition } from "@/components/PageTransition";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nidlocal.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "nid.local — Forum immobilier Québec | Acheter, vendre, louer",
    template: "%s | nid.local",
  },
  description:
    "Le forum immobilier québécois. Discussions entre propriétaires, acheteurs et locataires. Marketplace sans commission, calculatrices hypothécaires, données de marché et conseils juridiques.",
  keywords: [
    "immobilier québec", "forum immobilier", "acheter maison québec", "vendre maison sans courtier",
    "plex montréal", "condo montréal", "duplex québec", "calculatrice hypothécaire",
    "marché immobilier québec 2026", "location québec", "rénovation maison",
  ],
  authors: [{ name: "nid.local" }],
  creator: "nid.local",
  openGraph: {
    type: "website",
    locale: "fr_CA",
    url: BASE_URL,
    siteName: "nid.local",
    title: "nid.local — Forum immobilier Québec",
    description: "Le forum immobilier québécois. Discussions, marketplace sans commission, calculatrices et données de marché.",
  },
  twitter: {
    card: "summary_large_image",
    title: "nid.local — Forum immobilier Québec",
    description: "Discussions entre propriétaires, acheteurs et locataires au Québec.",
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": `${BASE_URL}/rss.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  manifest: "/manifest.json",
  themeColor: "#D4742A",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "nid.local",
  },
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={geist.variable}>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-C0LY69FTWR" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-C0LY69FTWR');
        `}</Script>
      </head>
      <body className="min-h-screen">
          <SessionProvider><ThemeProvider><ToastProvider><LightboxProvider><ConfettiProvider><PageTransition>{children}</PageTransition><BottomNav /><CommandPalette /></ConfettiProvider></LightboxProvider></ToastProvider></ThemeProvider></SessionProvider>
          <ServiceWorkerRegister />
          <Analytics />
        </body>
    </html>
  );
}

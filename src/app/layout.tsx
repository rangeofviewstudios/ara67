import type { Metadata, Viewport } from "next";
import { DM_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { getSettings } from "@/lib/content";
import { isIndexable, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.searchTitle || "Ara67";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: "%s · Ara67" },
    description: settings.description,
    robots: isIndexable ? undefined : { index: false, follow: false },
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description: settings.description,
      url: "/",
      siteName: "Ara67",
      locale: "en_US",
      type: "website",
    },
    twitter: { title, description: settings.description, card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f2f2f0",
};

// Runs before first paint so a saved theme never flashes the wrong colors.
const beforePaint = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('ara67-theme');if(t==='light'||t==='dark')d.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${dmMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: beforePaint }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

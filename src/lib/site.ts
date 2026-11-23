import type { Metadata } from "next";

/** The public address. Set NEXT_PUBLIC_SITE_URL once there is a custom domain. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/**
 * Search engines and AI crawlers are kept out until SITE_INDEXABLE=true, so placeholder content
 * cannot be indexed. Turn it on when real content is in. See "Before launch" in the README.
 */
export const isIndexable = process.env.SITE_INDEXABLE === "true";

export const organizationId = `${siteUrl}/#organization`;

export const absoluteUrl = (path: string) => (path === "/" ? siteUrl : `${siteUrl}${path}`);

/** Title, description, canonical address, and social sharing tags for one page. */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
}): Metadata {
  const shared = {
    title: `${title} · Ara67`,
    description: description ?? undefined,
    images: [image ?? "/opengraph-image.png"],
  };
  return {
    title,
    description: description ?? undefined,
    alternates: { canonical: path },
    openGraph: {
      ...shared,
      url: path,
      siteName: "Ara67",
      locale: "en_US",
      type: "website",
    },
    twitter: { ...shared, card: "summary_large_image" },
  };
}

/** The example address is not a real contact, so it never goes into structured data. */
export const publicEmail = (email: string) => (email.endsWith("@example.com") ? undefined : email);

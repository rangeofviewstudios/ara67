import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return ["/", "/services", "/work", "/contact", ...projects.map(({ slug }) => `/work/${slug}`)].map(
    (path) => ({ url: absoluteUrl(path) }),
  );
}

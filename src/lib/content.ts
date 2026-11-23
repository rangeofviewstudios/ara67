import { createReader } from "@keystatic/core/reader";
import { cache } from "react";
import config from "@config";

const reader = createReader(process.cwd(), config);

export const getSettings = cache(() => reader.singletons.settings.readOrThrow());
export const getHome = cache(() => reader.singletons.home.readOrThrow());
export const getServicesPage = cache(() => reader.singletons.servicesPage.readOrThrow());
export const getWorkPage = cache(() => reader.singletons.workPage.readOrThrow());
export const getContactPage = cache(() => reader.singletons.contactPage.readOrThrow());

export const getProjects = cache(async () => {
  const projects = await reader.collections.projects.all();
  return projects
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (a.order ?? 10) - (b.order ?? 10));
});

export type Project = Awaited<ReturnType<typeof getProjects>>[number];

export const getProject = cache(async (slug: string) => {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
});

/** Turns a Vimeo or YouTube page link into its embed URL. Anything else returns null. */
export function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^www\./, "");
  if (host === "vimeo.com") {
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}?dnt=1` : null;
  }
  const youtubeId =
    host === "youtu.be"
      ? parsed.pathname.slice(1)
      : host === "youtube.com"
        ? parsed.searchParams.get("v")
        : null;
  return youtubeId && /^[\w-]+$/.test(youtubeId)
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}`
    : null;
}

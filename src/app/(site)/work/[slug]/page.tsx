import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { MediaFrame } from "@/components/media-frame";
import { SplitHeading } from "@/components/split-heading";
import { getProject, getProjects, toEmbedUrl } from "@/lib/content";
import { absoluteUrl, organizationId, pageMetadata } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  return project
    ? pageMetadata({
        title: project.title,
        description: project.summary,
        path: `/work/${project.slug}`,
        image: project.cover,
      })
    : {};
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug);
  if (!project) notFound();

  const embedUrl = toEmbedUrl(project.videoUrl);
  const details = [
    { label: "Client", value: project.client },
    { label: "Category", value: project.category },
    { label: "Year", value: project.year },
  ].filter((detail) => detail.value);

  return (
    <article className="page-gutter pt-f55 md:pt-f89">
      <JsonLd
        data={{
          "@graph": [
            {
              "@type": "CreativeWork",
              name: project.title,
              description: project.summary,
              url: absoluteUrl(`/work/${project.slug}`),
              genre: project.category,
              creator: { "@id": organizationId },
              ...(project.year ? { dateCreated: project.year } : {}),
              ...(project.client ? { sourceOrganization: project.client } : {}),
              ...(project.cover ? { image: absoluteUrl(project.cover) } : {}),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Work", item: absoluteUrl("/work") },
                { "@type": "ListItem", position: 2, name: project.title },
              ],
            },
          ],
        }}
      />
      <SplitHeading text={project.title} className="type-display max-w-[16ch]" />

      <div className="mt-f55 md:mt-f89">
        {embedUrl ? (
          <div className="relative aspect-video w-full bg-surface">
            <iframe
              src={embedUrl}
              title={project.title}
              loading="lazy"
              allow="fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ) : (
          <MediaFrame src={project.cover} alt={project.title} sizes="100vw" priority />
        )}
      </div>

      <div className="golden mt-f55 md:mt-f89">
        <dl className="golden-minor border-b border-line">
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-f21 border-t border-line py-f13"
            >
              <dt className="type-label text-muted">{label}</dt>
              <dd className="text-right font-bold">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="golden-major text-trim max-w-[52ch] text-lg text-muted">{project.summary}</p>
      </div>

      <Link href="/work" className="text-link mt-f55 md:mt-f89">
        Back to work
      </Link>
    </article>
  );
}

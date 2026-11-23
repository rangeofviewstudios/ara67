import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SplitHeading } from "@/components/split-heading";
import { WorkGrid } from "@/components/work-grid";
import { getProjects, getWorkPage } from "@/lib/content";
import { absoluteUrl, organizationId, pageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWorkPage();
  return pageMetadata({
    title: page.searchTitle || "Work",
    description: page.searchDescription,
    path: "/work",
  });
}

export default async function WorkPage() {
  const [page, projects] = await Promise.all([getWorkPage(), getProjects()]);

  return (
    <>
      <JsonLd
        data={{
          "@type": "CollectionPage",
          name: page.heading,
          description: page.intro,
          url: absoluteUrl("/work"),
          publisher: { "@id": organizationId },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(`/work/${project.slug}`),
              name: project.title,
            })),
          },
        }}
      />
      <section className="sage-band">
        <div className="page-gutter golden py-f89 md:py-f144">
          <SplitHeading text={page.heading} className="type-display golden-full max-w-[14ch]" />
          <p className="golden-major max-w-[46ch] text-lg text-muted">{page.intro}</p>
        </div>
      </section>
      <section className="page-gutter mt-f89 md:mt-f144">
        <WorkGrid projects={projects} />
      </section>
    </>
  );
}

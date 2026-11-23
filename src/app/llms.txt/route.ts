import { getProjects, getServicesPage, getSettings } from "@/lib/content";
import { absoluteUrl, publicEmail } from "@/lib/site";

export const dynamic = "force-static";

/** A plain-text summary of the site for AI tools, built from the same content as the pages. */
export async function GET() {
  const [settings, services, projects] = await Promise.all([
    getSettings(),
    getServicesPage(),
    getProjects(),
  ]);
  const email = publicEmail(settings.contactEmail);

  const lines = [
    "# Ara67",
    "",
    `> ${settings.description}`,
    "",
    "## Services",
    ...services.services.map((service) => `- ${service.name}: ${service.summary}`),
    "",
    "## Pages",
    `- [Services](${absoluteUrl("/services")}): What Ara67 does, and common questions.`,
    `- [Work](${absoluteUrl("/work")}): Selected projects.`,
    `- [Contact](${absoluteUrl("/contact")}): Book a conversation.`,
    "",
    "## Selected work",
    ...projects.map(
      (project) =>
        `- [${project.title}](${absoluteUrl(`/work/${project.slug}`)}): ${project.summary}`,
    ),
    "",
    "## Common questions",
    ...services.faq.flatMap((item) => [`### ${item.question}`, item.answer, ""]),
    "## Contact",
    `- Location: ${settings.location}`,
    ...(email ? [`- Email: ${email}`] : []),
    ...settings.socialLinks.filter(Boolean).map((link) => `- ${link}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

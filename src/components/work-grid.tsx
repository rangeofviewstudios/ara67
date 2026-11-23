import type { Project } from "@/lib/content";
import { Reveal } from "./reveal";
import { WorkCard } from "./work-card";

export function WorkGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="work-grid">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <Reveal plain>
            <WorkCard project={project} index={index} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

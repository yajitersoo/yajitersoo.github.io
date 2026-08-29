import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { ProjectVisual } from "@/components/project-visual";
import type { Project } from "@/lib/portfolio-types";
import { getProductHref, isExternalUrl, opensInNewTab } from "@/lib/product-links";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const hasLiveUrl = isExternalUrl(project.mediaUrl) && opensInNewTab(project.mediaUrl);
  const productLabel = project.category === "interactive-dashboards" && hasLiveUrl
    ? "Open live dashboard"
    : hasLiveUrl
      ? "Open live product"
      : "View product";

  return (
    <article className="project-card">
      <Link href={`/case-study/?project=${project.slug}`} className="project-card__visual-link" aria-label={`View ${project.title}`}>
        <ProjectVisual project={project} priority={priority} />
      </Link>
      <div className="project-card__body">
        <div className="project-card__meta">
          <span>{project.categoryLabel}</span>
          {project.year ? <span>{project.year}</span> : null}
        </div>
        <h3>
          <Link href={`/case-study/?project=${project.slug}`}>{project.title}</Link>
        </h3>
        <p>{project.summary}</p>
        <div className="project-card__footer">
          <div className="tag-list" aria-label="Project tools">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="project-card__actions">
            {project.mediaUrl ? (
              <a
                href={getProductHref(project.mediaUrl, project.title)}
                target={opensInNewTab(project.mediaUrl) ? "_blank" : undefined}
                rel={opensInNewTab(project.mediaUrl) ? "noreferrer" : undefined}
                className="project-card__product-link"
              >
                {productLabel} <ExternalLink aria-hidden="true" />
              </a>
            ) : null}
            <Link href={`/case-study/?project=${project.slug}`} className="project-card__arrow" aria-label={`Open case study for ${project.title}`}>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

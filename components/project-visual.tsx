/* eslint-disable @next/next/no-img-element */
import {
  BarChart3,
  Braces,
  FileText,
  FormInput,
  MapPinned,
  MonitorPlay,
  Presentation,
  Shapes,
} from "lucide-react";
import type { Project } from "@/lib/portfolio-types";

const visualIcons = {
  map: MapPinned,
  dashboard: BarChart3,
  report: FileText,
  presentation: Presentation,
  infographic: Shapes,
  video: MonitorPlay,
  form: FormInput,
  code: Braces,
};

export function ProjectVisual({ project, priority = false }: { project: Project; priority?: boolean }) {
  if (project.thumbnailUrl) {
    return (
      <div className="project-visual project-visual--image">
        {/* Portfolio images vary substantially in aspect ratio, so a plain image gives us predictable static export behaviour. */}
        <img
          src={project.thumbnailUrl}
          alt={`${project.title} preview`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
    );
  }

  const Icon = visualIcons[project.kind as keyof typeof visualIcons] ?? Shapes;
  return (
    <div className={`project-visual project-visual--generated project-visual--${project.kind}`}>
      <span className="project-visual__grid" aria-hidden="true" />
      <Icon aria-hidden="true" />
      <span>{project.categoryLabel}</span>
    </div>
  );
}

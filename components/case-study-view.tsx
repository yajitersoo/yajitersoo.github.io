"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  Layers3,
  Lightbulb,
  ShieldCheck,
  Target,
  Wrench,
} from "lucide-react";
import { ProjectVisual } from "@/components/project-visual";
import { projectBySlug, publishedProjects, withCaseStudy } from "@/lib/projects";
import type { Project } from "@/lib/portfolio-types";
import { fetchPublishedProjects } from "@/lib/supabase/projects";
import { getProductHref, opensInNewTab } from "@/lib/product-links";

export function CaseStudyView() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("project");
  const [remoteProjects, setRemoteProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    let active = true;
    fetchPublishedProjects()
      .then((records) => {
        if (active && records?.length) setRemoteProjects(records);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const project = useMemo(() => {
    const record = remoteProjects?.find((item) => item.slug === slug) ?? projectBySlug(slug);
    return record ? withCaseStudy(record) : undefined;
  }, [remoteProjects, slug]);

  if (!project) {
    return (
      <section className="case-study-empty site-shell">
        <span>Project not found</span>
        <h1>Select a project from the portfolio library.</h1>
        <p>The requested record may have moved, remained in draft or no longer be publicly available.</p>
        <Link href="/work/" className="button-link button-link--primary">
          <ArrowLeft aria-hidden="true" /> Return to selected work
        </Link>
      </section>
    );
  }

  const hasNarrative = Boolean(project.challenge || project.contribution || project.approach || project.decisionValue);
  const related = (remoteProjects ?? publishedProjects)
    .filter((item) => item.category === project.category && item.slug !== project.slug)
    .slice(0, 3);

  return (
    <article className="case-study">
      <div className="site-shell case-study__breadcrumb">
        <Link href="/work/"><ArrowLeft aria-hidden="true" /> Selected work</Link>
        <span>/</span>
        <span>{project.categoryLabel}</span>
      </div>

      <header className="site-shell case-study__header">
        <div className="case-study__headline">
          <p className="eyebrow">{hasNarrative ? "Featured case study" : "Portfolio project"}</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="case-study__actions">
            {project.mediaUrl ? (
              <a
                href={getProductHref(project.mediaUrl, project.title)}
                target={opensInNewTab(project.mediaUrl) ? "_blank" : undefined}
                rel={opensInNewTab(project.mediaUrl) ? "noreferrer" : undefined}
                className="button-link button-link--primary"
              >
                View product <ExternalLink aria-hidden="true" />
              </a>
            ) : null}
            {project.repositoryUrl ? (
              <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="button-link button-link--secondary">
                View repository <ArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
        <dl className="case-study__metadata">
          <div><dt>Category</dt><dd>{project.categoryLabel}</dd></div>
          {project.role ? <div><dt>Role</dt><dd>{project.role}</dd></div> : null}
          <div><dt>Tools and methods</dt><dd>{project.tools.join(" • ") || "Product design"}</dd></div>
          {project.year ? <div><dt>Year</dt><dd>{project.year}</dd></div> : null}
        </dl>
      </header>

      <section className="site-shell case-study__showcase" aria-label="Project preview">
        <ProjectVisual project={project} priority />
      </section>

      {hasNarrative ? (
        <section className="site-shell case-study__body">
          <aside className="case-study__contents" aria-label="Case study contents">
            <span>Contents</span>
            <a href="#challenge">The challenge</a>
            <a href="#contribution">My contribution</a>
            <a href="#approach">Approach</a>
            <a href="#outputs">Key outputs</a>
            <a href="#decision-value">Decision value</a>
          </aside>
          <div className="case-study__narrative">
            <section id="challenge" className="case-study-section">
              <div className="case-study-section__icon"><Target aria-hidden="true" /></div>
              <div><p className="eyebrow">The challenge</p><h2>What needed to become clearer.</h2><p>{project.challenge}</p></div>
            </section>
            <section id="contribution" className="case-study-section">
              <div className="case-study-section__icon"><BriefcaseBusiness aria-hidden="true" /></div>
              <div><p className="eyebrow">My contribution</p><h2>How I shaped the product.</h2><p>{project.contribution}</p></div>
            </section>
            <section id="approach" className="case-study-section">
              <div className="case-study-section__icon"><Layers3 aria-hidden="true" /></div>
              <div><p className="eyebrow">Approach</p><h2>From fragmented information to a usable view.</h2><p>{project.approach}</p></div>
            </section>
            <section id="outputs" className="case-study-section">
              <div className="case-study-section__icon"><Wrench aria-hidden="true" /></div>
              <div>
                <p className="eyebrow">Key outputs</p>
                <h2>What the work produced.</h2>
                <ul className="case-study__outputs">
                  {project.outputs.map((output) => <li key={output}><CheckCircle2 aria-hidden="true" />{output}</li>)}
                </ul>
              </div>
            </section>
            <section id="decision-value" className="decision-value">
              <Lightbulb aria-hidden="true" />
              <div><p className="eyebrow eyebrow--light">Decision value</p><h2>{project.decisionValue}</h2></div>
            </section>
            {project.confidentialityNote ? (
              <aside className="case-study__note">
                <ShieldCheck aria-hidden="true" />
                <div><strong>Public-use note</strong><p>{project.confidentialityNote}</p></div>
              </aside>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="site-shell migrated-project-note">
          <div><p className="eyebrow">Product record</p><h2>Technical focus</h2></div>
          <p>
            This project has been migrated from the previous portfolio. Its verified product preview and technical tags are available now, while a fuller case-study narrative is being prepared.
          </p>
          <div className="tag-list tag-list--large">
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </section>
      )}

      {related.length ? (
        <section className="site-shell related-projects">
          <div className="section-heading section-heading--split">
            <div><p className="eyebrow">Continue exploring</p><h2>Related work</h2></div>
            <Link href="/work/" className="text-link">View full library <ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <div className="related-projects__list">
            {related.map((item) => (
              <Link key={item.id} href={`/case-study/?project=${item.slug}`}>
                <span>{item.categoryLabel}</span><strong>{item.title}</strong><ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

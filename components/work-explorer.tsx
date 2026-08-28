"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectCategories, publishedProjects } from "@/lib/projects";
import type { Project } from "@/lib/portfolio-types";
import { fetchPublishedProjects } from "@/lib/supabase/projects";

type SortMode = "featured" | "newest" | "title";

export function WorkExplorer() {
  const [projects, setProjects] = useState<Project[]>(publishedProjects);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [tool, setTool] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<SortMode>("featured");

  useEffect(() => {
    let active = true;
    fetchPublishedProjects()
      .then((remoteProjects) => {
        if (active && remoteProjects?.length) setProjects(remoteProjects);
      })
      .catch(() => {
        // The verified static catalogue remains available if the optional backend is unavailable.
      });
    return () => {
      active = false;
    };
  }, []);

  const tools = useMemo(
    () => [...new Set(projects.flatMap((project) => project.tools))].sort((a, b) => a.localeCompare(b)),
    [projects],
  );
  const years = useMemo(
    () => [...new Set(projects.map((project) => project.year).filter((value): value is number => Boolean(value)))].sort((a, b) => b - a),
    [projects],
  );

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = projects.filter((project) => {
      const searchable = [project.title, project.summary, project.categoryLabel, ...project.tags, ...project.tools, ...project.sectors]
        .join(" ")
        .toLowerCase();
      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (category === "all" || project.category === category) &&
        (tool === "all" || project.tools.includes(tool)) &&
        (year === "all" || project.year === Number(year))
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "newest") return (b.year ?? 0) - (a.year ?? 0) || a.displayOrder - b.displayOrder;
      return Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder;
    });
  }, [category, projects, query, sort, tool, year]);

  return (
    <div className="work-explorer">
      <div className="work-controls">
        <label className="work-search">
          <span className="sr-only">Search projects</span>
          <Search aria-hidden="true" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, tools or sectors" />
        </label>
        <div className="category-chips" aria-label="Project category">
          {projectCategories.map((option) => (
            <button
              key={option.value}
              type="button"
              className={category === option.value ? "is-active" : ""}
              onClick={() => setCategory(option.value)}
              aria-pressed={category === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="work-selects">
          <span className="work-selects__label"><SlidersHorizontal aria-hidden="true" /> Refine</span>
          <Select value={tool} onValueChange={(value) => setTool(value ?? "all")}>
            <SelectTrigger aria-label="Filter by tool"><SelectValue placeholder="Tool" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tools</SelectItem>
              {tools.map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={(value) => setYear(value ?? "all")}>
            <SelectTrigger aria-label="Filter by year"><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {years.map((item) => <SelectItem value={String(item)} key={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(value) => setSort((value ?? "featured") as SortMode)}>
            <SelectTrigger aria-label="Sort projects"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Portfolio order</SelectItem>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="title">Title A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="work-results-heading" aria-live="polite">
        <strong>{visibleProjects.length}</strong>
        <span>{visibleProjects.length === 1 ? "project" : "projects"}</span>
      </div>

      {visibleProjects.length ? (
        <div className="portfolio-grid">
          {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      ) : (
        <div className="empty-results">
          <Search aria-hidden="true" />
          <h2>No matching projects</h2>
          <p>Adjust the search term or remove one of the active filters.</p>
          <button type="button" onClick={() => { setQuery(""); setCategory("all"); setTool("all"); setYear("all"); }}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}


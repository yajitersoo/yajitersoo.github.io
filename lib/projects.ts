import projectsData from "@/data/projects.json";
import type { Project } from "@/lib/portfolio-types";

export const projects = projectsData as Project[];

export const publishedProjects = projects
  .filter((project) => project.status === "published")
  .sort((a, b) => a.displayOrder - b.displayOrder);

const featuredSlugs = [
  "alleged-tomahawk-strikes-in-nigeria",
  "imsma-data-insights-dashboard-eo-incident-trends-and-survivor-profiles",
  "ecowas-child-rights-information-managment-dashboard-ecrims",
];

export const featuredProjects = featuredSlugs
  .map((slug) => publishedProjects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

export const projectCategories = [
  { value: "all", label: "All" },
  { value: "maps", label: "GIS & Maps" },
  { value: "static-dashboards", label: "Static Dashboards" },
  { value: "interactive-dashboards", label: "Interactive Dashboards" },
  { value: "reports", label: "Reports" },
  { value: "presentations", label: "Presentations" },
  { value: "infographics", label: "Infographics" },
  { value: "videos", label: "Videos" },
  { value: "forms", label: "Digital Forms" },
] as const;

export const projectBySlug = (slug: string | null) =>
  slug ? publishedProjects.find((project) => project.slug === slug) : undefined;

export const caseStudyOverrides: Record<
  string,
  Pick<Project, "role" | "challenge" | "contribution" | "approach" | "decisionValue" | "outputs" | "confidentialityNote">
> = {
  "alleged-tomahawk-strikes-in-nigeria": {
    role: "Geospatial analysis and information product design",
    challenge:
      "Reported strike locations needed to be organised into a clear spatial product that preserved uncertainty while supporting rapid interpretation.",
    contribution:
      "Structured the available location information and designed a concise map that connects reported incidents with geographic context.",
    approach:
      "Applied geocoding, cartographic hierarchy and contextual mapping to make the reported locations easier to interpret.",
    decisionValue:
      "Improved the readability of reported strike locations for situational awareness and further analytical review.",
    outputs: ["Incident map", "Location context", "Brief spatial interpretation"],
    confidentialityNote:
      "This public-facing product reflects reported information available at the stated date and should be interpreted against its source limitations.",
  },
  "imsma-data-insights-dashboard-eo-incident-trends-and-survivor-profiles": {
    role: "Information management, analytical design and dashboard development",
    challenge:
      "Incident and survivor records contained valuable operational patterns but required a clearer structure for routine interpretation.",
    contribution:
      "Developed a dashboard concept that organises incident trends and survivor characteristics into an accessible analytical view.",
    approach:
      "Combined indicator logic, data-quality checks and visual hierarchy to surface trends while retaining appropriate disaggregation.",
    decisionValue:
      "Supports faster review of incident patterns, casualty profiles and areas requiring deeper investigation.",
    outputs: ["Trend dashboard", "Survivor profile views", "Structured analytical indicators"],
    confidentialityNote:
      "The portfolio preview contains no personally identifiable information and does not expose protected incident records.",
  },
  "ecowas-child-rights-information-managment-dashboard-ecrims": {
    role: "Dashboard and information-management product development",
    challenge:
      "Multi-country child-rights information required a consistent visual structure for monitoring and comparison.",
    contribution:
      "Designed an interactive dashboard experience that brings key measures, geographic views and reporting summaries into one interface.",
    approach:
      "Used structured measures, interactive filtering and layered visual summaries to support progressive exploration.",
    decisionValue:
      "Makes regional reporting patterns easier to compare and communicate to technical and leadership audiences.",
    outputs: ["Interactive dashboard", "Regional comparison views", "Reporting summaries"],
    confidentialityNote: null,
  },
};

export function withCaseStudy(project: Project): Project {
  const override = caseStudyOverrides[project.slug];
  return override ? { ...project, ...override } : project;
}


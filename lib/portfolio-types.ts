export type ProjectStatus = "draft" | "published" | "archived";

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  categoryLabel: string;
  kind: string;
  tags: string[];
  tools: string[];
  sectors: string[];
  year: number | null;
  featured: boolean;
  status: ProjectStatus;
  displayOrder: number;
  thumbnailUrl: string | null;
  mediaUrl: string | null;
  repositoryUrl: string | null;
  role: string | null;
  challenge: string | null;
  contribution: string | null;
  approach: string | null;
  decisionValue: string | null;
  outputs: string[];
  confidentialityNote: string | null;
  importedFromLegacy?: boolean;
};

export type ProjectInput = Omit<Project, "id" | "importedFromLegacy"> & {
  id?: string;
};

export type PortfolioProfile = {
  id?: string;
  displayName: string;
  headline: string;
  introduction: string;
  shortBio: string;
  location: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  resumeUrl?: string | null;
};


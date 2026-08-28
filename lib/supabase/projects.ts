import type { Project, ProjectInput } from "@/lib/portfolio-types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  category_label: string;
  kind: string;
  tags: string[] | null;
  tools: string[] | null;
  sectors: string[] | null;
  year: number | null;
  featured: boolean;
  status: Project["status"];
  display_order: number;
  thumbnail_url: string | null;
  media_url: string | null;
  repository_url: string | null;
  role: string | null;
  challenge: string | null;
  contribution: string | null;
  approach: string | null;
  decision_value: string | null;
  outputs: string[] | null;
  confidentiality_note: string | null;
};

const fromRow = (row: ProjectRow): Project => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  summary: row.summary,
  category: row.category,
  categoryLabel: row.category_label,
  kind: row.kind,
  tags: row.tags ?? [],
  tools: row.tools ?? [],
  sectors: row.sectors ?? [],
  year: row.year,
  featured: row.featured,
  status: row.status,
  displayOrder: row.display_order,
  thumbnailUrl: row.thumbnail_url,
  mediaUrl: row.media_url,
  repositoryUrl: row.repository_url,
  role: row.role,
  challenge: row.challenge,
  contribution: row.contribution,
  approach: row.approach,
  decisionValue: row.decision_value,
  outputs: row.outputs ?? [],
  confidentialityNote: row.confidentiality_note,
});

const toRow = (project: ProjectInput) => ({
  ...(project.id ? { id: project.id } : {}),
  slug: project.slug,
  title: project.title,
  summary: project.summary,
  category: project.category,
  category_label: project.categoryLabel,
  kind: project.kind,
  tags: project.tags,
  tools: project.tools,
  sectors: project.sectors,
  year: project.year,
  featured: project.featured,
  status: project.status,
  display_order: project.displayOrder,
  thumbnail_url: project.thumbnailUrl,
  media_url: project.mediaUrl,
  repository_url: project.repositoryUrl,
  role: project.role,
  challenge: project.challenge,
  contribution: project.contribution,
  approach: project.approach,
  decision_value: project.decisionValue,
  outputs: project.outputs,
  confidentiality_note: project.confidentialityNote,
});

export async function fetchPublishedProjects() {
  const client = getSupabaseBrowserClient();
  if (!client) return null;

  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data as ProjectRow[]).map(fromRow);
}

export async function fetchAdminProjects() {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const { data, error } = await client
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data as ProjectRow[]).map(fromRow);
}

export async function saveProject(project: ProjectInput) {
  const client = getSupabaseBrowserClient();
  if (!client) throw new Error("Supabase is not configured.");

  const row = toRow(project);
  const query = project.id
    ? client.from("projects").update(row).eq("id", project.id)
    : client.from("projects").insert(row);
  const { data, error } = await query.select("*").single();
  if (error) throw error;
  return fromRow(data as ProjectRow);
}

export async function removeProject(id: string) {
  const client = getSupabaseBrowserClient();
  if (!client) throw new Error("Supabase is not configured.");
  const { error } = await client.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function importSeedProjects(seedProjects: Project[]) {
  const client = getSupabaseBrowserClient();
  if (!client) throw new Error("Supabase is not configured.");
  const rows = seedProjects.map((project) =>
    toRow({ ...project, id: undefined }),
  );
  const { error } = await client.from("projects").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
}

export async function uploadProjectAsset(file: File, userId: string) {
  const client = getSupabaseBrowserClient();
  if (!client) throw new Error("Supabase is not configured.");
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const storagePath = `${userId}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await client.storage.from("portfolio-assets").upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return client.storage.from("portfolio-assets").getPublicUrl(storagePath).data.publicUrl;
}

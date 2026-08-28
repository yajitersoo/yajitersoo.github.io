import type { PortfolioProfile } from "@/lib/portfolio-types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ProfileRow = {
  id: string;
  display_name: string;
  headline: string;
  introduction: string;
  short_bio: string;
  location: string;
  email: string;
  linkedin_url: string;
  github_url: string;
  resume_url: string | null;
};

const fromRow = (row: ProfileRow): PortfolioProfile => ({
  id: row.id,
  displayName: row.display_name,
  headline: row.headline,
  introduction: row.introduction,
  shortBio: row.short_bio,
  location: row.location,
  email: row.email,
  linkedinUrl: row.linkedin_url,
  githubUrl: row.github_url,
  resumeUrl: row.resume_url,
});

export async function fetchAdminProfile() {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const { data, error } = await client.from("profiles").select("*").maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as ProfileRow) : null;
}

export const fetchPublicProfile = fetchAdminProfile;

export async function saveProfile(profile: PortfolioProfile) {
  const client = getSupabaseBrowserClient();
  if (!client) throw new Error("Supabase is not configured.");
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) throw userError ?? new Error("You are not signed in.");

  const row = {
    ...(profile.id ? { id: profile.id } : {}),
    owner_id: userData.user.id,
    display_name: profile.displayName,
    headline: profile.headline,
    introduction: profile.introduction,
    short_bio: profile.shortBio,
    location: profile.location,
    email: profile.email,
    linkedin_url: profile.linkedinUrl,
    github_url: profile.githubUrl,
    resume_url: profile.resumeUrl ?? null,
  };
  const { data, error } = await client.from("profiles").upsert(row, { onConflict: "owner_id" }).select("*").single();
  if (error) throw error;
  return fromRow(data as ProfileRow);
}

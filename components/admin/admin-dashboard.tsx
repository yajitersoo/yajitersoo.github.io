"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import {
  Archive,
  ArrowLeft,
  BarChart3,
  Database,
  Edit3,
  ExternalLink,
  FileImage,
  FolderOpen,
  Loader2,
  LogOut,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "@/components/brand-mark";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { profile as seedProfile } from "@/data/profile";
import { projectCategories, projects as seedProjects } from "@/lib/projects";
import type { PortfolioProfile, Project, ProjectInput } from "@/lib/portfolio-types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchAdminProfile, saveProfile } from "@/lib/supabase/profile";
import {
  fetchAdminProjects,
  importSeedProjects,
  removeProject,
  saveProject,
  uploadProjectAsset,
} from "@/lib/supabase/projects";

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 88);

const blankProject = (displayOrder: number): ProjectInput => ({
  slug: "",
  title: "",
  summary: "",
  category: "maps",
  categoryLabel: "GIS & Maps",
  kind: "map",
  tags: [],
  tools: [],
  sectors: [],
  year: new Date().getFullYear(),
  featured: false,
  status: "draft",
  displayOrder,
  thumbnailUrl: null,
  mediaUrl: null,
  repositoryUrl: null,
  role: null,
  challenge: null,
  contribution: null,
  approach: null,
  decisionValue: null,
  outputs: [],
  confidentialityNote: null,
});

const initialProfile: PortfolioProfile = {
  displayName: seedProfile.displayName,
  headline: seedProfile.headline,
  introduction: seedProfile.introduction,
  shortBio: seedProfile.shortBio,
  location: seedProfile.location,
  email: seedProfile.email,
  linkedinUrl: seedProfile.linkedinUrl,
  githubUrl: seedProfile.githubUrl,
  resumeUrl: null,
};

export function AdminDashboard() {
  const client = getSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!client);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [records, setRecords] = useState<Project[]>([]);
  const [portfolioProfile, setPortfolioProfile] = useState<PortfolioProfile>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<ProjectInput>(blankProject(1));
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const loadWorkspace = useCallback(async () => {
    if (!client) return;
    setLoading(true);
    try {
      const { data: adminRecord, error: adminError } = await client
        .from("portfolio_admins")
        .select("user_id")
        .maybeSingle();
      if (adminError) throw adminError;
      const allowed = Boolean(adminRecord);
      setIsAdmin(allowed);
      if (!allowed) return;
      const [projectRecords, savedProfile] = await Promise.all([fetchAdminProjects(), fetchAdminProfile()]);
      setRecords(projectRecords ?? []);
      if (savedProfile) setPortfolioProfile(savedProfile);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load the portfolio workspace.");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    if (!client) return;
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
      if (data.session) void loadWorkspace();
    });
    const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
      if (nextSession) void loadWorkspace();
      else {
        setRecords([]);
        setIsAdmin(false);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [client, loadWorkspace]);

  const summary = useMemo(() => ({
    total: records.length,
    published: records.filter((item) => item.status === "published").length,
    drafts: records.filter((item) => item.status === "draft").length,
    categories: new Set(records.map((item) => item.category)).size,
  }), [records]);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    if (!client) return;
    setAuthBusy(true);
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    setAuthBusy(false);
  }

  function openCreate() {
    setDraft(blankProject(records.length + 1));
    setEditorOpen(true);
  }

  function openEdit(project: Project) {
    setDraft({ ...project });
    setEditorOpen(true);
  }

  function updateDraft<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleAsset(file: File | undefined) {
    if (!file || !session?.user) return;
    setSaving(true);
    try {
      const publicUrl = await uploadProjectAsset(file, session.user.id);
      updateDraft("thumbnailUrl", publicUrl);
      toast.success("Preview image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleProjectSave(event: React.FormEvent) {
    event.preventDefault();
    const category = projectCategories.find((item) => item.value === draft.category);
    const prepared: ProjectInput = {
      ...draft,
      slug: draft.slug || slugify(draft.title),
      categoryLabel: category?.label ?? draft.categoryLabel,
      kind: draft.category.includes("dashboard") ? "dashboard" : draft.category === "maps" ? "map" : draft.category.replace(/s$/, ""),
    };
    setSaving(true);
    try {
      const saved = await saveProject(prepared);
      setRecords((current) => {
        const exists = current.some((item) => item.id === saved.id);
        return (exists ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved])
          .sort((a, b) => a.displayOrder - b.displayOrder);
      });
      setEditorOpen(false);
      toast.success(prepared.id ? "Project updated." : "Project created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save the project.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await removeProject(deleteTarget.id);
      setRecords((current) => current.filter((item) => item.id !== deleteTarget.id));
      toast.success("Project deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete the project.");
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleProfileSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const saved = await saveProfile(portfolioProfile);
      setPortfolioProfile(saved);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update the profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSeedImport() {
    setSaving(true);
    try {
      await importSeedProjects(seedProjects);
      await loadWorkspace();
      toast.success("The 57-project catalogue was imported.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Catalogue import failed.");
    } finally {
      setSaving(false);
    }
  }

  if (!isSupabaseConfigured()) return <BackendSetup />;
  if (!authReady) return <AdminLoading />;
  if (!session) {
    return (
      <main className="admin-login">
        <Link href="/" className="admin-login__back"><ArrowLeft aria-hidden="true" /> Return to portfolio</Link>
        <form onSubmit={signIn} className="admin-login__card">
          <BrandMark />
          <p className="eyebrow">Private workspace</p>
          <h1>Portfolio Studio</h1>
          <p>Sign in with the administrator account configured for this portfolio.</p>
          <div><Label htmlFor="admin-email">Email</Label><Input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          <div><Label htmlFor="admin-password">Password</Label><Input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
          <Button type="submit" disabled={authBusy}>{authBusy ? <Loader2 className="animate-spin" /> : null} Sign in</Button>
        </form>
      </main>
    );
  }

  if (loading && !records.length) return <AdminLoading />;
  if (!isAdmin) {
    return (
      <main className="admin-login">
        <div className="admin-login__card admin-login__card--notice">
          <ShieldCheck />
          <p className="eyebrow">Access restricted</p>
          <h1>This account is not a portfolio administrator.</h1>
          <p>Add the signed-in user to the <code>portfolio_admins</code> table before granting content access.</p>
          <Button variant="outline" onClick={() => client?.auth.signOut()}><LogOut /> Sign out</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand"><BrandMark /><div><strong>Portfolio Studio</strong><span>Tersoo Yaji</span></div></div>
        <nav aria-label="Administrator navigation">
          <a href="#overview"><BarChart3 /> Overview</a>
          <a href="#projects"><FolderOpen /> Projects</a>
          <a href="#profile"><UserRound /> Profile</a>
          <a href="#media"><FileImage /> Media</a>
        </nav>
        <div className="admin-sidebar__footer"><ShieldCheck /><span>Administrator-only workspace</span></div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div><p className="eyebrow">Content management</p><h1>Portfolio Studio</h1></div>
          <div><span>{session.user.email}</span><Button variant="outline" onClick={() => client?.auth.signOut()}><LogOut /> Sign out</Button></div>
        </header>

        <Tabs defaultValue="overview" className="admin-tabs">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" id="overview">
            <div className="admin-section-heading"><div><h2>Content overview</h2><p>Current publication status across the portfolio.</p></div><Button onClick={openCreate}><Plus /> New project</Button></div>
            <div className="admin-summary-grid">
              <article><FolderOpen /><strong>{summary.total}</strong><span>Projects</span></article>
              <article><ExternalLink /><strong>{summary.published}</strong><span>Published</span></article>
              <article><Edit3 /><strong>{summary.drafts}</strong><span>Drafts</span></article>
              <article><Settings2 /><strong>{summary.categories}</strong><span>Categories</span></article>
            </div>
            <ProjectTable records={records.slice(0, 8)} onEdit={openEdit} onDelete={setDeleteTarget} title="Recent projects" />
          </TabsContent>

          <TabsContent value="projects" id="projects">
            <div className="admin-section-heading"><div><h2>Projects</h2><p>Create, edit and control the publication status of portfolio products.</p></div><div><Button variant="outline" onClick={handleSeedImport} disabled={saving}><Database /> Import catalogue</Button><Button onClick={openCreate}><Plus /> New project</Button></div></div>
            <ProjectTable records={records} onEdit={openEdit} onDelete={setDeleteTarget} title={`${records.length} project records`} />
          </TabsContent>

          <TabsContent value="profile" id="profile">
            <div className="admin-section-heading"><div><h2>Profile</h2><p>Maintain the core public profile and contact details.</p></div></div>
            <form onSubmit={handleProfileSave} className="admin-profile-form">
              <div><Label htmlFor="profile-name">Display name</Label><Input id="profile-name" value={portfolioProfile.displayName} onChange={(event) => setPortfolioProfile((current) => ({ ...current, displayName: event.target.value }))} /></div>
              <div><Label htmlFor="profile-headline">Headline</Label><Input id="profile-headline" value={portfolioProfile.headline} onChange={(event) => setPortfolioProfile((current) => ({ ...current, headline: event.target.value }))} /></div>
              <div className="admin-form-span"><Label htmlFor="profile-introduction">Introduction</Label><Textarea id="profile-introduction" value={portfolioProfile.introduction} onChange={(event) => setPortfolioProfile((current) => ({ ...current, introduction: event.target.value }))} rows={4} /></div>
              <div className="admin-form-span"><Label htmlFor="profile-bio">Short biography</Label><Textarea id="profile-bio" value={portfolioProfile.shortBio} onChange={(event) => setPortfolioProfile((current) => ({ ...current, shortBio: event.target.value }))} rows={5} /></div>
              <div><Label htmlFor="profile-location">Location</Label><Input id="profile-location" value={portfolioProfile.location} onChange={(event) => setPortfolioProfile((current) => ({ ...current, location: event.target.value }))} /></div>
              <div><Label htmlFor="profile-email">Public email</Label><Input id="profile-email" type="email" value={portfolioProfile.email} onChange={(event) => setPortfolioProfile((current) => ({ ...current, email: event.target.value }))} /></div>
              <div><Label htmlFor="profile-linkedin">LinkedIn URL</Label><Input id="profile-linkedin" value={portfolioProfile.linkedinUrl} onChange={(event) => setPortfolioProfile((current) => ({ ...current, linkedinUrl: event.target.value }))} /></div>
              <div><Label htmlFor="profile-github">GitHub URL</Label><Input id="profile-github" value={portfolioProfile.githubUrl} onChange={(event) => setPortfolioProfile((current) => ({ ...current, githubUrl: event.target.value }))} /></div>
              <div className="admin-form-span"><Label htmlFor="profile-resume">CV or résumé URL</Label><Input id="profile-resume" value={portfolioProfile.resumeUrl ?? ""} onChange={(event) => setPortfolioProfile((current) => ({ ...current, resumeUrl: event.target.value }))} /></div>
              <Button type="submit" disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Save />} Save profile</Button>
            </form>
          </TabsContent>

          <TabsContent value="media" id="media">
            <div className="admin-section-heading"><div><h2>Media library</h2><p>Upload images from a project record to keep files connected to their content.</p></div></div>
            <div className="admin-media-note"><UploadCloud /><div><h3>Project-linked uploads</h3><p>Open an existing project or create a new one, then upload its preview image. Files are stored in the protected portfolio bucket while their URLs remain attached to the relevant database record.</p></div><Button onClick={openCreate}><Plus /> Add project media</Button></div>
          </TabsContent>
        </Tabs>
      </div>

      <ProjectEditor open={editorOpen} onOpenChange={setEditorOpen} draft={draft} updateDraft={updateDraft} onSubmit={handleProjectSave} onAsset={handleAsset} saving={saving} />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this project?</AlertDialogTitle><AlertDialogDescription>This permanently removes “{deleteTarget?.title}” from the database. Uploaded files are retained until removed from storage.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Delete project</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function ProjectTable({ records, onEdit, onDelete, title }: { records: Project[]; onEdit: (project: Project) => void; onDelete: (project: Project) => void; title: string }) {
  return (
    <section className="admin-table-card">
      <div className="admin-table-card__header"><h3>{title}</h3></div>
      <Table>
        <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Order</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {records.map((project) => (
            <TableRow key={project.id}>
              <TableCell><div className="admin-project-cell">{project.thumbnailUrl ? <img src={project.thumbnailUrl} alt="" /> : <span><FileImage /></span>}<div><strong>{project.title}</strong><small>{project.summary}</small></div></div></TableCell>
              <TableCell>{project.categoryLabel}</TableCell>
              <TableCell><Badge variant={project.status === "published" ? "default" : "secondary"}>{project.status}</Badge></TableCell>
              <TableCell>{project.displayOrder}</TableCell>
              <TableCell className="text-right"><div className="admin-table-actions"><Button size="icon" variant="outline" onClick={() => onEdit(project)} aria-label={`Edit ${project.title}`}><Edit3 /></Button><Button size="icon" variant="outline" onClick={() => onDelete(project)} aria-label={`Delete ${project.title}`}><Trash2 /></Button></div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!records.length ? <div className="admin-empty"><Archive /><h3>No project records yet</h3><p>Import the existing catalogue or create the first project.</p></div> : null}
    </section>
  );
}

function ProjectEditor({ open, onOpenChange, draft, updateDraft, onSubmit, onAsset, saving }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: ProjectInput;
  updateDraft: <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => void;
  onSubmit: (event: React.FormEvent) => void;
  onAsset: (file: File | undefined) => void;
  saving: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin-project-dialog">
        <DialogHeader><DialogTitle>{draft.id ? "Edit project" : "New project"}</DialogTitle><DialogDescription>Maintain the public record, case-study fields and publication status.</DialogDescription></DialogHeader>
        <form onSubmit={onSubmit} className="admin-project-form">
          <div><Label htmlFor="project-title">Title</Label><Input id="project-title" value={draft.title} onChange={(event) => { updateDraft("title", event.target.value); if (!draft.id) updateDraft("slug", slugify(event.target.value)); }} required /></div>
          <div><Label htmlFor="project-slug">URL slug</Label><Input id="project-slug" value={draft.slug} onChange={(event) => updateDraft("slug", slugify(event.target.value))} required /></div>
          <div className="admin-form-span"><Label htmlFor="project-summary">Summary</Label><Textarea id="project-summary" value={draft.summary} onChange={(event) => updateDraft("summary", event.target.value)} rows={3} required /></div>
          <div><Label>Category</Label><Select value={draft.category} onValueChange={(value) => updateDraft("category", value ?? "maps")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{projectCategories.filter((item) => item.value !== "all").map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Status</Label><Select value={draft.status} onValueChange={(value) => updateDraft("status", (value ?? "draft") as Project["status"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
          <div><Label htmlFor="project-year">Year</Label><Input id="project-year" type="number" value={draft.year ?? ""} onChange={(event) => updateDraft("year", event.target.value ? Number(event.target.value) : null)} /></div>
          <div><Label htmlFor="project-order">Display order</Label><Input id="project-order" type="number" value={draft.displayOrder} onChange={(event) => updateDraft("displayOrder", Number(event.target.value))} /></div>
          <div className="admin-form-span"><Label htmlFor="project-tags">Tags and tools</Label><Input id="project-tags" value={draft.tags.join(", ")} onChange={(event) => { const tags = event.target.value.split(",").map((value) => value.trim()).filter(Boolean); updateDraft("tags", tags); updateDraft("tools", tags); }} placeholder="Power BI, GIS, Python" /></div>
          <div className="admin-form-span"><Label htmlFor="project-media">Product or live URL</Label><Input id="project-media" value={draft.mediaUrl ?? ""} onChange={(event) => updateDraft("mediaUrl", event.target.value || null)} /></div>
          <div className="admin-form-span"><Label htmlFor="project-role">Your role</Label><Input id="project-role" value={draft.role ?? ""} onChange={(event) => updateDraft("role", event.target.value || null)} /></div>
          <div className="admin-form-span"><Label htmlFor="project-challenge">The challenge</Label><Textarea id="project-challenge" value={draft.challenge ?? ""} onChange={(event) => updateDraft("challenge", event.target.value || null)} rows={3} /></div>
          <div className="admin-form-span"><Label htmlFor="project-contribution">Your contribution</Label><Textarea id="project-contribution" value={draft.contribution ?? ""} onChange={(event) => updateDraft("contribution", event.target.value || null)} rows={3} /></div>
          <div className="admin-form-span"><Label htmlFor="project-approach">Approach</Label><Textarea id="project-approach" value={draft.approach ?? ""} onChange={(event) => updateDraft("approach", event.target.value || null)} rows={3} /></div>
          <div className="admin-form-span"><Label htmlFor="project-value">Decision value</Label><Textarea id="project-value" value={draft.decisionValue ?? ""} onChange={(event) => updateDraft("decisionValue", event.target.value || null)} rows={3} /></div>
          <div className="admin-form-span"><Label htmlFor="project-outputs">Key outputs</Label><Input id="project-outputs" value={draft.outputs.join(", ")} onChange={(event) => updateDraft("outputs", event.target.value.split(",").map((value) => value.trim()).filter(Boolean))} /></div>
          <div className="admin-form-span"><Label htmlFor="project-note">Public-use or confidentiality note</Label><Textarea id="project-note" value={draft.confidentialityNote ?? ""} onChange={(event) => updateDraft("confidentialityNote", event.target.value || null)} rows={2} /></div>
          <div className="admin-upload-field"><div><Label htmlFor="project-image">Preview image</Label><p>PNG, JPG or WebP. Public-safe products only.</p></div><Input id="project-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => onAsset(event.target.files?.[0])} /></div>
          {draft.thumbnailUrl ? <div className="admin-upload-preview"><img src={draft.thumbnailUrl} alt="Current project preview" /><button type="button" onClick={() => updateDraft("thumbnailUrl", null)}>Remove preview</button></div> : null}
          <div className="admin-switch-field"><div><Label htmlFor="project-featured">Feature this project</Label><p>Featured projects receive priority placement.</p></div><Switch id="project-featured" checked={draft.featured} onCheckedChange={(checked) => updateDraft("featured", checked)} /></div>
          <DialogFooter className="admin-form-span"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Save />} Save project</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BackendSetup() {
  return (
    <main className="admin-setup">
      <Link href="/" className="admin-login__back"><ArrowLeft /> Return to portfolio</Link>
      <div className="admin-setup__card">
        <div className="admin-setup__icon"><Database /></div>
        <p className="eyebrow">Backend connection</p>
        <h1>Connect Portfolio Studio to Supabase.</h1>
        <p>The public portfolio remains usable with the verified static catalogue. Add the project URL and publishable key to this website&apos;s build environment to activate authentication, database editing and media uploads.</p>
        <ol><li><span>1</span>Create the portfolio tables using the included migration.</li><li><span>2</span>Add your account to the administrator allowlist.</li><li><span>3</span>Set the project URL and publishable key.</li></ol>
        <div className="admin-setup__status"><ShieldCheck /><div><strong>Current state</strong><span>Public portfolio active; management connection not detected in this build</span></div></div>
      </div>
    </main>
  );
}

function AdminLoading() {
  return <main className="admin-loading"><Loader2 className="animate-spin" /><span>Opening Portfolio Studio...</span></main>;
}

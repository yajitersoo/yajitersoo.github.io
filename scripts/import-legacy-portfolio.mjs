import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

const sourceRoot = resolve(process.argv[2] ?? "/tmp/tersoo-current");
const projectRoot = resolve(import.meta.dirname, "..");
const htmlPath = join(sourceRoot, "projects.html");
const sourceAssets = join(sourceRoot, "assets", "images", "projects");
const originalDir = join(projectRoot, "public", "projects", "original");
const thumbnailDir = join(projectRoot, "public", "projects", "thumbs");
const outputPath = join(projectRoot, "data", "projects.json");

if (!existsSync(htmlPath)) {
  throw new Error(`Legacy projects page not found: ${htmlPath}`);
}

mkdirSync(originalDir, { recursive: true });
mkdirSync(thumbnailDir, { recursive: true });
mkdirSync(join(projectRoot, "data"), { recursive: true });

const decode = (value = "") =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&ndash;", "-")
    .replaceAll("&mdash;", "-")
    .trim();

const slugify = (value) =>
  decode(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 88);

const categoryLabels = {
  maps: "GIS & Maps",
  "static-dashboards": "Static Dashboards",
  "interactive-dashboards": "Interactive Dashboards",
  reports: "Reports",
  presentations: "Presentations",
  infographics: "Infographics",
  videos: "Videos",
  forms: "Digital Forms",
  python: "Python",
};

const categoryKinds = {
  maps: "map",
  "static-dashboards": "dashboard",
  "interactive-dashboards": "dashboard",
  reports: "report",
  presentations: "presentation",
  infographics: "infographic",
  videos: "video",
  forms: "form",
  python: "code",
};

const html = readFileSync(htmlPath, "utf8");
const sectionPattern = /<section\s+class="projects-category-final[^"]*"\s+id="([^"]+)"[\s\S]*?(?=<section\s+class="projects-category-final|<section\s+class="projects-cta-final|<\/main>)/g;
const cardPattern = /<button\b[^>]*class="[^"]*project-launch-card-final[^"]*"[^>]*>[\s\S]*?<\/button>/g;
const seenSlugs = new Map();
const projects = [];
let sectionMatch;
let displayOrder = 1;

while ((sectionMatch = sectionPattern.exec(html))) {
  const category = sectionMatch[1];
  const sectionHtml = sectionMatch[0];
  const cards = sectionHtml.match(cardPattern) ?? [];

  for (const card of cards) {
    const attr = (name) => {
      const match = card.match(new RegExp(`${name}="([\\s\\S]*?)"`));
      return decode(match?.[1] ?? "");
    };

    const title = attr("data-title");
    const summary = attr("data-summary");
    const live = attr("data-live");
    const imageMatch = card.match(/<img\b[^>]*src="([^"]+)"/);
    const sourceImage = decode(imageMatch?.[1] ?? "");
    const tags = [...card.matchAll(/<span>([\s\S]*?)<\/span>/g)]
      .map((match) => decode(match[1].replace(/<[^>]+>/g, "")))
      .filter(Boolean);

    const baseSlug = slugify(title) || `project-${displayOrder}`;
    const slugCount = (seenSlugs.get(baseSlug) ?? 0) + 1;
    seenSlugs.set(baseSlug, slugCount);
    const slug = slugCount === 1 ? baseSlug : `${baseSlug}-${slugCount}`;
    const yearMatch = title.match(/\b(20[12]\d)\b/);
    let thumbnailUrl = null;
    let mediaUrl = live || null;

    if (sourceImage.startsWith("assets/images/projects/")) {
      const sourceFile = join(sourceAssets, basename(sourceImage));
      if (existsSync(sourceFile)) {
        const extension = extname(sourceFile).toLowerCase() || ".png";
        const originalName = `${slug}${extension}`;
        const thumbnailName = `${slug}.webp`;
        copyFileSync(sourceFile, join(originalDir, originalName));
        execFileSync("convert", [
          sourceFile,
          "-auto-orient",
          "-strip",
          "-resize",
          "1200x760>",
          "-quality",
          "78",
          join(thumbnailDir, thumbnailName),
        ]);
        thumbnailUrl = `/projects/thumbs/${thumbnailName}`;
        mediaUrl = `/projects/original/${originalName}`;
      }
    }

    projects.push({
      id: `legacy-${String(displayOrder).padStart(3, "0")}`,
      slug,
      title,
      summary,
      category,
      categoryLabel: categoryLabels[category] ?? category,
      kind: categoryKinds[category] ?? "project",
      tags,
      tools: tags,
      sectors: [],
      year: yearMatch ? Number(yearMatch[1]) : null,
      featured: [
        "Alleged Tomahawk Strikes in Nigeria",
        "Relocation Areas 2025 and EO Incidents",
        "Cluster Munition Analysis Product",
        "Reference Maps",
        "GBV Annual Report 2023 Northeast Nigeria",
      ].includes(title),
      status: "published",
      displayOrder,
      thumbnailUrl,
      mediaUrl,
      repositoryUrl: null,
      role: null,
      challenge: null,
      contribution: null,
      approach: null,
      decisionValue: null,
      outputs: [],
      confidentialityNote: null,
      importedFromLegacy: true,
    });
    displayOrder += 1;
  }
}

if (projects.length !== 57) {
  throw new Error(`Expected 57 legacy projects, extracted ${projects.length}`);
}

writeFileSync(outputPath, `${JSON.stringify(projects, null, 2)}\n`);
console.log(`Imported ${projects.length} projects to ${outputPath}`);

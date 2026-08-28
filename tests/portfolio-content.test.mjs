import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projects = JSON.parse(readFileSync(resolve(root, "data/projects.json"), "utf8"));

test("preserves the verified 57-project catalogue", () => {
  assert.equal(projects.length, 57);
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  assert.ok(projects.every((project) => project.title && project.summary && project.category));
});

test("keeps all local previews and original products resolvable", () => {
  for (const project of projects) {
    for (const url of [project.thumbnailUrl, project.mediaUrl]) {
      if (!url?.startsWith("/projects/")) continue;
      assert.ok(existsSync(resolve(root, "public", url.slice(1))), `${project.title}: ${url}`);
    }
  }
});

test("does not expose draft records in the imported public catalogue", () => {
  assert.ok(projects.every((project) => project.status === "published"));
});


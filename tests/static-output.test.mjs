import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = [resolve(root, "dist/client"), resolve(root, "out")].find(existsSync);

test("produces a static GitHub Pages-compatible site", () => {
  assert.ok(outputRoot, "Static output directory was not produced");
  for (const route of ["index.html", "work/index.html", "case-study/index.html", "about/index.html", "contact/index.html", "admin/index.html"]) {
    assert.ok(existsSync(resolve(outputRoot, route)), `Missing ${route}`);
  }
});

test("publishes portfolio metadata rather than starter content", () => {
  const home = readFileSync(resolve(outputRoot, "index.html"), "utf8");
  assert.match(home, /Tersoo Yaji/);
  assert.match(home, /Evidence/);
  assert.doesNotMatch(home, /Starter Project/);
  assert.doesNotMatch(home, /codex-preview/);
});


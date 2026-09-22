import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve, dirname } from "node:path";
import assert from "node:assert/strict";
import { validateSnapshot, validatePreferences } from "../src/core/model.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const read = (p) => readFile(join(root, p), "utf8");
validateSnapshot(JSON.parse(await read("fixtures/demo.json")));
validatePreferences(JSON.parse(await read("config/profile.example.json")));
const catalog = JSON.parse(await read("automations/catalog.json"));
assert.equal(catalog.recipes.length, 16);
for (const recipe of catalog.recipes) {
  assert.equal(recipe.enabled, false);
  assert.equal(recipe.installedTaskId, null);
  for (const file of [recipe.promptFile, recipe.contractFile])
    await stat(join(root, "automations", file));
}
const required = [
  "README.md",
  "START-PROMPT.md",
  "SHARED-CONTEXT.md",
  "preview.html",
  "index.html",
  "docs/screenshots/README.md",
  "verification/RELEASE-CHECKS.md",
  "output/pdf/Build-Your-Own-Hub-Guide.pdf",
  "AGENTS.md",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "THIRD-PARTY-NOTICES.md",
  "src/app.mjs",
  "src/assets/manrope-LICENSE.txt",
  "src/assets/cormorant-LICENSE.txt",
];
for (const name of required) await stat(join(root, name));
const html = await read("preview.html");
assert.equal(html, await read("index.html"));
assert.ok(!/^\s*import\s/m.test(html));
assert.ok(!html.includes('src="/src/'));
assert.ok(!html.includes('href="/src/'));
assert.ok(!html.includes("url('/src/assets/"));
assert.ok(html.includes("globalThis.HUB_DEMO_SNAPSHOT="));
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else files.push(full);
  }
}
await walk(root);
const banned = [
  /\/Users\/[^/\s]+\//,
  /\b(?:sk-proj-|sk_live_|ghp_)[A-Za-z0-9_-]{12,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
for (const path of files) {
  if (!/\.(md|json|mjs|html|css|txt|yml|py)$/.test(path)) continue;
  const body = await readFile(path, "utf8");
  for (const pattern of banned)
    assert.ok(
      !pattern.test(body),
      `Private data pattern in ${path.slice(root.length)}`,
    );
  if (path.endsWith(".md") && !path.endsWith("SHARED-CONTEXT.md"))
    for (const match of body.matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (/^(https?:|#|mailto:)/.test(target)) continue;
      const full = resolve(dirname(path), target.split("#")[0]);
      assert.ok(full.startsWith(root));
      await stat(full);
    }
}
assert.ok(
  !files.some((p) => /^LICENSE(?:\.md|\.txt)?$/.test(p.split("/").pop())),
  "No project license requested.",
);
console.log(
  `Verified ${files.length} files; 16 disabled recipes; offline preview; local links; privacy patterns; no project license.`,
);

import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
const root = fileURLToPath(new URL("..", import.meta.url));
const read = (name) => readFile(join(root, name), "utf8");
let css = await read("src/styles.css");
for (const name of [
  "manrope-400.woff2",
  "manrope-700.woff2",
  "cormorant-500.woff2",
]) {
  const bytes = await readFile(join(root, "src/assets", name));
  css = css.replace(
    `/src/assets/${name}`,
    `data:font/woff2;base64,${bytes.toString("base64")}`,
  );
}
const model = (await read("src/core/model.mjs")).replaceAll(/^export /gm, "");
const app = (await read("src/app.mjs")).replace(
  /^import[\s\S]*?from ['"]\.\/core\/model\.mjs['"];\s*/,
  "",
);
const fixture = JSON.parse(await read("fixtures/demo.json"));
const script = `globalThis.HUB_DEMO_SNAPSHOT=${JSON.stringify(fixture).replaceAll("<", "\\u003c")};\n${model}\n${app}`;
let html = await read("src/index.html");
html = html
  .replace(
    '<link rel="stylesheet" href="/src/styles.css">',
    `<style>${css}</style>`,
  )
  .replace(
    '<script type="module" src="/src/app.mjs"></script>',
    `<script type="module">${script.replaceAll("</script", "<\\/script")}</script>`,
  );
await writeFile(join(root, "preview.html"), html);
await writeFile(join(root, "index.html"), html);
await writeFile(join(root, ".nojekyll"), "");
const docs = (await readdir(join(root, "docs")))
  .filter((n) => n.endsWith(".md"))
  .sort();
const catalog = JSON.parse(await read("automations/catalog.json"));
const files = [
  "README.md",
  "START-PROMPT.md",
  ...docs.map((n) => `docs/${n}`),
  "automations/README.md",
  "automations/prompts/00-shared-contract.md",
  ...catalog.recipes.map((r) => `automations/${r.promptFile}`),
];
const sections = [];
for (const file of files)
  sections.push(
    `\n\n---\n\n<!-- SOURCE FILE: ${file} -->\n\n${await read(file)}`,
  );
const header =
  "# Build Your Own Hub — shared context\n\nVersion 1.0.0 · A self-contained guide for your own ChatGPT Work or Codex. All demonstration data is fictional. The original starter has no live account connections or installed schedules. Read the starting prompt below and establish your own preferences and access.\n\nThis document contains the README, starting prompt, seven chapters, and all sixteen automation recipes. Code, screenshots, example configuration, and tests are in the companion repository ZIP. Reading this document alone does not make those files available; attach or extract them when implementation needs them.\n";
await writeFile(join(root, "SHARED-CONTEXT.md"), header + sections.join(""));
console.log(
  `Built offline preview and shared context (${files.length} source documents).`,
);

import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, posix } from "node:path";
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
const version = JSON.parse(await read("package.json")).version;
const files = [
  "docs/00-start-here.md",
  "START-PROMPT.md",
  "README.md",
  ...docs.filter((n) => !n.startsWith("00-")).map((n) => `docs/${n}`),
  "AGENTS.md",
  "automations/README.md",
  "automations/prompts/00-shared-contract.md",
  ...catalog.recipes.map((r) => `automations/${r.promptFile}`),
  "config/profile.example.json",
  "config/source-inventory.example.json",
  "config/automation-plan.example.json",
  "config/run-receipt.example.json",
  "fixtures/calendar-provider.example.json",
  "examples/calendar-adapter.mjs",
];
const anchor = (file) =>
  "file-" + file.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
const webRoot = `https://github.com/CBruney/build-your-own-hub/blob/v${version}/`;
function portableLinks(body, file) {
  let fence = false;
  return body
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fence = !fence;
        return line;
      }
      if (fence) return line;
      return line.replace(/\]\(([^)]+)\)/g, (whole, target) => {
        if (/^(?:https?:|mailto:|#)/.test(target)) return whole;
        const [name, fragment] = target.split("#");
        const path = posix.normalize(posix.join(posix.dirname(file), name));
        // Included text links stay usable even when this one file is attached alone.
        if (files.includes(path) && !fragment) return `](#${anchor(path)})`;
        return `](${webRoot}${path}${fragment ? "#" + fragment : ""})`;
      });
    })
    .join("\n");
}
const sections = [];
const toc = [];
for (const file of files) {
  const body = await read(file);
  const title = file.endsWith(".md")
    ? body.match(/^# (.+)$/m)?.[1] || file
    : file;
  toc.push(`- [${title}](#${anchor(file)})`);
  sections.push(
    `\n\n---\n\n<a id="${anchor(file)}"></a>\n\n<!-- SOURCE FILE: ${file} -->\n\n${file.endsWith(".md") ? portableLinks(body, file) : `# ${file}\n\n\`\`\`${file.endsWith(".json") ? "json" : "javascript"}\n${body}\`\`\`\n`}`,
  );
}
const header = `# Build Your Own Hub — shared context

Version ${version} · A complete reading and planning guide for your own ChatGPT Work or Codex. All example people, events, records, IDs, and receipts are fictional. The original starter has no live account connections or installed schedules.

**Begin with the first-use walkthrough, then the starting prompt.** You do not need to read this entire document before trying the fictional demo. Follow the chapter for your next decision. An assistant should read the complete context before planning a connected implementation.

This file includes all ${docs.length} guide chapters, the starting prompt, repository overview, project instructions, sixteen recipes and their shared contract, full example configuration, and the runnable adapter's input and code. Code files, tests, fonts, screenshots, and the visual PDF are in the [companion v${version} release](https://github.com/CBruney/build-your-own-hub/releases/tag/v${version}). Reading this file does not install or extract those files. Download the ZIP to run the application.

Internal links jump to material included here. Links to companion files identify this edition. The live demonstration and latest-release links can change; this document's version tells you which instructions you attached. No project license is supplied; bundled font notices are retained.

## Contents

${toc.join("\n")}
`;
await writeFile(join(root, "SHARED-CONTEXT.md"), header + sections.join(""));
console.log(
  `Built offline preview and shared context (${files.length} included source files, version ${version}).`,
);

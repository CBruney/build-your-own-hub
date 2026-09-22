import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, join } from "node:path";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const allowed = new Map([
  ["/", "src/index.html"],
  ["/src/styles.css", "src/styles.css"],
  ["/src/app.mjs", "src/app.mjs"],
  ["/src/core/model.mjs", "src/core/model.mjs"],
  ["/fixtures/demo.json", "fixtures/demo.json"],
  ["/src/assets/manrope-400.woff2", "src/assets/manrope-400.woff2"],
  ["/src/assets/manrope-700.woff2", "src/assets/manrope-700.woff2"],
  ["/src/assets/cormorant-500.woff2", "src/assets/cormorant-500.woff2"],
  ["/preview.html", "preview.html"],
]);
const mime = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  woff2: "font/woff2",
};
export function makeServer() {
  return http.createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Frame-Options", "DENY");
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end("Read-only demo");
      return;
    }
    const host = req.headers.host || "";
    if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)) {
      res.writeHead(403);
      res.end("Loopback host only");
      return;
    }
    let path;
    try {
      path = new URL(req.url, "http://127.0.0.1").pathname;
    } catch {
      res.writeHead(400);
      res.end("Invalid URL");
      return;
    }
    const file = allowed.get(path);
    if (!file) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    try {
      const bytes = await readFile(join(root, file));
      res.writeHead(200, {
        "Content-Type":
          mime[file.split(".").pop()] || "application/octet-stream",
      });
      res.end(req.method === "HEAD" ? undefined : bytes);
    } catch {
      res.writeHead(404);
      res.end("File unavailable; run npm run build for the portable preview.");
    }
  });
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("PORT must be 1–65535.");
  const server = makeServer();
  server.on("error", (error) => {
    console.error(
      `Cannot start demo: ${error.code || error.message}. Choose another PORT if needed.`,
    );
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () =>
    console.log(
      `Fictional Hub demo: http://127.0.0.1:${port} (Ctrl+C to stop)`,
    ),
  );
}

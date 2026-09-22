import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { makeServer } from "../scripts/server.mjs";
test("loopback demo exposes only allowed read-only files", async () => {
  const server = makeServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetch(base);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Fictional|fictional/);
    for (const path of [
      "/config/profile.example.json",
      "/.env",
      "/../package.json",
      "/src/core/delivery-guard.mjs",
      "/scripts/server.mjs",
    ])
      assert.equal((await fetch(base + path)).status, 404);
    assert.equal(
      (await fetch(base, { method: "POST", body: "test" })).status,
      405,
    );
    const hostStatus = await new Promise((resolve, reject) => {
      const req = http.get(
        base,
        { headers: { Host: "unrelated.example" } },
        (res) => {
          res.resume();
          resolve(res.statusCode);
        },
      );
      req.on("error", reject);
    });
    assert.equal(hostStatus, 403);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

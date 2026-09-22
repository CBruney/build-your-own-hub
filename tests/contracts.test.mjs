import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  validateSnapshot,
  sourceHealth,
  mergeSnapshots,
  safeUrl,
  localDate,
  visibleItems,
  validatePreferences,
} from "../src/core/model.mjs";
import {
  claimDelivery,
  verifySent,
  readClaim,
} from "../src/core/delivery-guard.mjs";

const fixture = JSON.parse(
  await readFile(new URL("../fixtures/demo.json", import.meta.url), "utf8"),
);
const copy = () => structuredClone(fixture);
test("fixture validates without a live source or account", () =>
  assert.equal(validateSnapshot(fixture).mode, "demo"));
test("duplicate source IDs rejected", () => {
  const s = copy();
  s.sources.push(s.sources[0]);
  assert.throws(() => validateSnapshot(s));
});
test("duplicate item IDs rejected", () => {
  const s = copy();
  s.items.push(s.items[0]);
  assert.throws(() => validateSnapshot(s));
});
test("unknown source rejected", () => {
  const s = copy();
  s.items[0].sourceId = "missing";
  assert.throws(() => validateSnapshot(s));
});
test("future observation cannot be smuggled into an older snapshot", () => {
  const s = copy();
  s.sources[0].observedAt = "2099-01-01T00:00:00Z";
  assert.throws(() => validateSnapshot(s));
});
test("checked empty is different from unavailable", () => {
  const s = copy();
  s.items = [];
  assert.equal(validateSnapshot(s).items.length, 0);
  s.sources[0].observedAt = null;
  assert.throws(() => validateSnapshot(s));
});
test("Needs You requires a real next action", () => {
  const s = copy();
  const i = s.items.find((x) => x.module === "needs");
  delete i.nextAction;
  assert.throws(() => validateSnapshot(s));
});
test("script and credential-bearing URLs rejected", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "https://user:pass@example.com/",
    "file:///etc/passwd",
  ]) {
    assert.equal(safeUrl(url), "");
    const s = copy();
    s.items[0].url = url;
    assert.throws(() => validateSnapshot(s));
  }
});
test("HTTPS source is retained", () =>
  assert.equal(
    safeUrl("https://example.org/event/one"),
    "https://example.org/event/one",
  ));
test("freshness expires without modifying source time", () => {
  const s = copy().sources[0],
    old = s.observedAt;
  assert.equal(sourceHealth(s, new Date(s.freshUntil)), "Stale");
  assert.equal(s.observedAt, old);
});
test("partial coverage remains explicit when stale", () => {
  const s = { ...fixture.sources[0], state: "partial" };
  assert.equal(sourceHealth(s, new Date(s.freshUntil)), "Stale · partial");
});
test("future timestamps cannot display checked", () =>
  assert.equal(
    sourceHealth(fixture.sources[0], new Date("2000-01-01")),
    "Unverified",
  ));
test("local dates honor midnight and daylight saving", () => {
  assert.equal(
    localDate("2026-09-22T02:00:00Z", "America/Los_Angeles"),
    "2026-09-21",
  );
  assert.equal(
    localDate("2026-11-01T08:30:00Z", "America/Los_Angeles"),
    "2026-11-01",
  );
  assert.equal(
    localDate("2026-11-01T09:30:00Z", "America/Los_Angeles"),
    "2026-11-01",
  );
});
test("failed source retains prior items and observation", () => {
  const n = copy();
  n.sources = [
    {
      ...n.sources[0],
      state: "unavailable",
      observedAt: null,
      freshUntil: null,
      detail: "Read failed",
    },
  ];
  n.items = [];
  const merged = mergeSnapshots(fixture, n);
  assert.equal(merged.items.length, fixture.items.length);
  assert.equal(merged.sources[0].observedAt, fixture.sources[0].observedAt);
  assert.equal(merged.sources[0].state, "unavailable");
});
test("checked empty source clears only that source", () => {
  const n = copy();
  n.sources = [n.sources[0]];
  n.items = [];
  const merged = mergeSnapshots(fixture, n);
  assert.equal(
    merged.items.filter((i) => i.sourceId === n.sources[0].id).length,
    0,
  );
  assert.ok(merged.items.length > 0);
});
test("partial read preserves unseen records", () => {
  const n = copy();
  n.sources = [{ ...n.sources[0], state: "partial" }];
  n.items = n.items.filter((i) => i.sourceId === n.sources[0].id).slice(0, 1);
  n.items[0].title = "Observed update";
  const merged = mergeSnapshots(fixture, n);
  assert.equal(merged.items.length, fixture.items.length);
  assert.equal(
    merged.items.find((i) => i.id === n.items[0].id).title,
    "Observed update",
  );
});
test("Hide does not mutate source records", () => {
  const before = JSON.stringify(fixture);
  assert.equal(
    visibleItems(fixture.items, [fixture.items[0].id]).length,
    fixture.items.length - 1,
  );
  assert.equal(JSON.stringify(fixture), before);
  assert.equal(visibleItems(fixture.items, []).length, fixture.items.length);
});
test("preference import rejects unsupported sections", () =>
  assert.throws(() =>
    validatePreferences({
      displayName: "Taylor",
      hubName: "Hub",
      accent: "gold",
      modules: ["briefing", "execute"],
    }),
  ));
test("at most one concurrent delivery claim succeeds; later attempts stay blocked", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hub-test-"));
  try {
    const f = {
      key: "demo-event|one",
      subject: "Example",
      body: "Fictional report",
      recipients: ["reader@example.com"],
    };
    const claims = await Promise.all(
      Array.from({ length: 12 }, () => claimDelivery(dir, f)),
    );
    assert.equal(claims.filter((c) => c.permitted).length, 1);
    const winner = claims.find((c) => c.permitted);
    assert.equal((await readClaim(winner.path)).key, f.key);
    if (process.platform !== "win32")
      assert.equal((await stat(winner.path)).mode & 0o777, 0o600);
    assert.equal((await claimDelivery(dir, f)).permitted, false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("exact Sent content and recipients are required", () => {
  const f = {
    subject: "Example",
    body: "Exact body",
    recipients: ["a@example.com", "b@example.com"],
  };
  assert.equal(
    verifySent(f, { ...f, recipients: [...f.recipients].reverse() }),
    true,
  );
  assert.equal(verifySent(f, { ...f, body: "Short body" }), false);
  assert.equal(verifySent(f, { ...f, recipients: ["a@example.com"] }), false);
});

test("missing time zone and invalid publication dates fail validation", () => {
  const s = copy();
  delete s.timeZone;
  assert.throws(() => validateSnapshot(s));
  const n = copy();
  n.items.find((i) => i.module === "newsletters").publishedAt = "Yesterday";
  assert.throws(() => validateSnapshot(n));
});

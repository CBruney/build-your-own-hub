import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import {
  validateSnapshot,
  mergeSnapshots,
  agendaDate,
  agendaOnDate,
} from "../src/core/model.mjs";
import {
  normalizeExampleCalendar,
  saveAndReadBackExample,
} from "../examples/calendar-adapter.mjs";
const input = JSON.parse(
  await readFile(
    new URL("../fixtures/calendar-provider.example.json", import.meta.url),
    "utf8",
  ),
);
const example = () => normalizeExampleCalendar(structuredClone(input));

test("example preserves explicit timed offsets and date-only all-day boundaries", () => {
  const s = example();
  assert.equal(s.mode, "demo");
  assert.equal(s.items.length, 2);
  assert.equal(s.items[0].startsAt, input.events[0].start);
  assert.equal(s.items[1].allDayStart, input.events[1].startDate);
  assert.equal(agendaDate(s.items[1], "America/Los_Angeles"), "2026-09-22");
  assert.equal(
    agendaOnDate(s.items[1], "2026-09-22", "America/Los_Angeles"),
    true,
  );
  assert.equal(
    agendaOnDate(s.items[1], "2026-09-23", "America/Los_Angeles"),
    false,
  );
});

test("an unfinished page set cannot become checked coverage", () => {
  const partial = structuredClone(input);
  partial.coverage.allPagesRead = false;
  assert.equal(normalizeExampleCalendar(partial).sources[0].state, "partial");
  assert.throws(() => normalizeExampleCalendar({ ...input, fictional: false }));
});

test("immutable example save is byte-verified and refuses connected input", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hub-adapter-"));
  try {
    const s = example();
    const first = await saveAndReadBackExample(s, dir);
    const second = await saveAndReadBackExample(s, dir);
    assert.notEqual(first.filename, second.filename);
    const bytes = await readFile(join(dir, first.filename), "utf8");
    assert.deepEqual(JSON.parse(bytes), s);
    assert.equal(
      first.sha256,
      createHash("sha256").update(bytes).digest("hex"),
    );
    assert.equal(first.readback, "verified");
    await assert.rejects(
      saveAndReadBackExample({ ...s, mode: "connected" }, dir),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("invalid dates and ambiguous timestamps are rejected", () => {
  for (const stamp of [
    "2026-02-30T07:00:00Z",
    "2026-09-22T07:00:00",
    "2026-09-22",
    "2026-09-22T24:00:00Z",
  ]) {
    const s = example();
    s.generatedAt = stamp;
    assert.throws(() => validateSnapshot(s), stamp);
  }
  const s = example();
  s.items[0].endsAt = s.items[0].startsAt;
  assert.throws(() => validateSnapshot(s));
});

test("multi-day date-only events span DST without inventing UTC times", () => {
  const s = example();
  s.items = [
    { ...s.items[1], allDayStart: "2026-10-31", allDayEnd: "2026-11-03" },
  ];
  validateSnapshot(s);
  for (const day of ["2026-10-31", "2026-11-01", "2026-11-02"])
    assert.equal(agendaOnDate(s.items[0], day, "America/Los_Angeles"), true);
  assert.equal(
    agendaOnDate(s.items[0], "2026-11-03", "America/Los_Angeles"),
    false,
  );
  for (const changes of [
    { allDayEnd: "2026-10-31" },
    { allDayStart: "2026-02-30" },
    { startsAt: "2026-10-31T08:00:00Z" },
  ]) {
    assert.throws(() =>
      validateSnapshot({ ...s, items: [{ ...s.items[0], ...changes }] }),
    );
  }
  assert.equal(agendaDate({ title: "Undated" }, "Europe/London"), null);
  assert.equal(
    agendaOnDate({ title: "Undated" }, "2026-09-22", "Europe/London"),
    false,
  );
});

test("partial refresh pins retained item provenance before source clock advances", () => {
  const before = example();
  delete before.items[1].observedAt;
  const next = example();
  next.generatedAt = "2026-09-22T08:00:00Z";
  next.sources[0].state = "partial";
  next.sources[0].observedAt = next.generatedAt;
  next.items = [
    {
      ...next.items[0],
      observedAt: next.generatedAt,
      summary: "A new observation",
    },
  ];
  const result = mergeSnapshots(before, next);
  assert.equal(result.sources[0].observedAt, next.generatedAt);
  assert.equal(
    result.items.find((i) => i.id === before.items[1].id).observedAt,
    before.sources[0].observedAt,
  );
  assert.equal(
    result.items.find((i) => i.id === before.items[0].id).observedAt,
    next.generatedAt,
  );
  assert.equal(before.items[1].observedAt, undefined);
});

test("new disconnected source is visible without overwriting an existing source", () => {
  const before = example();
  const s = {
    id: "mail:new",
    label: "Not yet selected",
    detail: "No reader",
    state: "not_connected",
    observedAt: null,
    freshUntil: null,
  };
  const next = { ...before, sources: [s], items: [] };
  const merged = mergeSnapshots(before, next);
  assert.deepEqual(
    merged.sources.find((x) => x.id === s.id),
    s,
  );
  const noDisable = mergeSnapshots(before, {
    ...next,
    sources: [{ ...s, id: before.sources[0].id }],
  });
  assert.deepEqual(noDisable.sources[0], before.sources[0]);
  assert.equal(noDisable.items.length, before.items.length);
});

test("agenda display sorts merged sources chronologically, all-day first, undated last", async () => {
  const { sortAgenda } = await import("../src/core/model.mjs");
  const records = [
    { id: "fri", startsAt: "2026-09-25T09:00:00+01:00" },
    { id: "wed-late", startsAt: "2026-09-23T15:00:00+01:00" },
    { id: "unknown" },
    { id: "wed-early", startsAt: "2026-09-23T10:00:00+02:00" },
    { id: "wed-all", allDayStart: "2026-09-23", allDayEnd: "2026-09-24" },
  ];
  assert.deepEqual(
    sortAgenda(records, "Europe/London").map((x) => x.id),
    ["wed-all", "wed-early", "wed-late", "fri", "unknown"],
  );
  assert.equal(records[0].id, "fri");
});

test("saving or exporting selected modules preserves imported order", async () => {
  const { retainModuleOrder } = await import("../src/core/model.mjs");
  assert.deepEqual(
    retainModuleOrder(["briefing", "sports", "agenda"], ["agenda", "sports"]),
    ["briefing", "sports", "agenda"],
  );
  assert.deepEqual(
    retainModuleOrder(
      ["briefing", "sports", "agenda"],
      ["agenda", "messages", "sports", "radar"],
    ),
    ["briefing", "sports", "agenda", "messages", "radar"],
  );
  assert.deepEqual(
    retainModuleOrder(["briefing", "sports", "agenda"], ["agenda"]),
    ["briefing", "agenda"],
  );
});

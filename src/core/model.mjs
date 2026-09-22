export const MODULES = [
  "briefing",
  "agenda",
  "messages",
  "deliveries",
  "newsletters",
  "sports",
  "radar",
  "meeting",
];
export const SOURCE_STATES = [
  "checked",
  "partial",
  "unavailable",
  "not_connected",
];
const itemModules = [
  "agenda",
  "needs",
  "messages",
  "deliveries",
  "newsletters",
  "sports",
  "radar",
  "meeting",
];
const timestamp = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T/.test(value) &&
  Number.isFinite(Date.parse(value));
const text = (value, max = 20000) =>
  typeof value === "string" && value.length <= max;
const own = (obj, key) => Object.hasOwn(obj, key);

export function safeUrl(value) {
  if (!value) return "";
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password
      ? parsed.href
      : "";
  } catch {
    return "";
  }
}

export function validateSnapshot(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Snapshot must be an object.");
  if (input.schemaVersion !== 1 || !["demo", "connected"].includes(input.mode))
    throw new Error("Unsupported snapshot version or mode.");
  if (!timestamp(input.generatedAt))
    throw new Error("A real generatedAt timestamp is required.");
  if (!text(input.timeZone, 100) || !input.timeZone)
    throw new Error("Time zone is required.");
  try {
    new Intl.DateTimeFormat("en", { timeZone: input.timeZone }).format();
  } catch {
    throw new Error("Use a valid IANA time zone.");
  }
  if (
    !Array.isArray(input.sources) ||
    input.sources.length > 100 ||
    !Array.isArray(input.items) ||
    input.items.length > 5000
  )
    throw new Error("Invalid source or item list.");
  const sourceIds = new Set();
  for (const s of input.sources) {
    if (!s || !text(s.id, 100) || !s.id || sourceIds.has(s.id))
      throw new Error("Source IDs must be unique.");
    sourceIds.add(s.id);
    if (
      !text(s.label, 200) ||
      !text(s.detail, 2000) ||
      !SOURCE_STATES.includes(s.state)
    )
      throw new Error("Invalid source fields.");
    for (const key of ["observedAt", "freshUntil", "lastAttemptAt"])
      if (s[key] != null && !timestamp(s[key]))
        throw new Error("Invalid source timestamp.");
    if (
      ["checked", "partial"].includes(s.state) &&
      (!s.observedAt || !s.freshUntil)
    )
      throw new Error(
        "Checked sources require observation and freshness times.",
      );
    if (
      s.observedAt &&
      Date.parse(s.observedAt) > Date.parse(input.generatedAt)
    )
      throw new Error("Observation cannot follow snapshot generation.");
    if (
      s.observedAt &&
      s.freshUntil &&
      Date.parse(s.freshUntil) < Date.parse(s.observedAt)
    )
      throw new Error("Freshness cannot end before the observation.");
  }
  const ids = new Set();
  for (const item of input.items) {
    if (!item || !text(item.id, 200) || !item.id || ids.has(item.id))
      throw new Error("Item IDs must be unique.");
    ids.add(item.id);
    if (!sourceIds.has(item.sourceId) || !itemModules.includes(item.module))
      throw new Error("Item has an unknown source or module.");
    if (!text(item.title, 500) || !text(item.summary, 10000))
      throw new Error("Item needs a title and summary.");
    for (const key of [
      "timeLabel",
      "meta",
      "person",
      "nextAction",
      "unreadLabel",
      "result",
      "details",
      "publishedAt",
    ]) {
      if (own(item, key) && !text(item[key]))
        throw new Error(`Invalid item field: ${key}`);
    }
    for (const key of ["startsAt", "endsAt", "observedAt", "publishedAt"])
      if (item[key] != null && !timestamp(item[key]))
        throw new Error("Invalid item timestamp.");
    if (
      item.observedAt &&
      Date.parse(item.observedAt) > Date.parse(input.generatedAt)
    )
      throw new Error("Item observation cannot follow generation.");
    if (item.url && (!text(item.url, 3000) || !safeUrl(item.url)))
      throw new Error(
        "Source links must use HTTPS without embedded credentials.",
      );
    if (item.module === "needs" && !item.nextAction)
      throw new Error("Needs You items require a concrete next action.");
  }
  // Return a clone so caller mutation cannot change a previously validated object.
  return structuredClone(input);
}

export function sourceHealth(source, now = new Date()) {
  if (source.state === "not_connected") return "Not connected";
  if (source.state === "unavailable") return "Unavailable";
  if (!source.observedAt || !source.freshUntil) return "Unverified";
  if (Date.parse(source.observedAt) > +now) return "Unverified";
  if (Date.parse(source.freshUntil) <= +now)
    return source.state === "partial" ? "Stale · partial" : "Stale";
  return source.state === "partial" ? "Partial" : "Checked";
}

export function localDate(iso, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const read = (type) => parts.find((p) => p.type === type).value;
  return `${read("year")}-${read("month")}-${read("day")}`;
}

export function mergeSnapshots(previous, candidate) {
  const before = validateSnapshot(previous),
    next = validateSnapshot(candidate);
  if (before.mode !== next.mode || before.timeZone !== next.timeZone)
    throw new Error("Cannot merge different modes or time zones.");
  const sources = new Map(before.sources.map((s) => [s.id, s]));
  const items = new Map(before.items.map((i) => [i.id, i]));
  for (const s of next.sources) {
    const old = sources.get(s.id);
    if (
      old?.observedAt &&
      s.observedAt &&
      Date.parse(s.observedAt) < Date.parse(old.observedAt)
    )
      throw new Error("Observation would move backwards.");
    if (s.state === "not_connected") continue;
    if (s.state === "unavailable") {
      sources.set(s.id, {
        ...s,
        observedAt: old?.observedAt ?? null,
        freshUntil: old?.freshUntil ?? null,
      });
      continue;
    }
    sources.set(s.id, s);
    if (s.state === "checked")
      for (const [id, item] of items)
        if (item.sourceId === s.id) items.delete(id);
    for (const item of next.items.filter((i) => i.sourceId === s.id)) {
      if (items.has(item.id) && items.get(item.id).sourceId !== item.sourceId)
        throw new Error("Item identity collides across sources.");
      items.set(item.id, item);
    }
  }
  return validateSnapshot({
    ...next,
    sources: [...sources.values()],
    items: [...items.values()],
  });
}

export function visibleItems(items, hidden = []) {
  const ids = new Set(hidden);
  return items.filter((item) => !ids.has(item.id));
}

export function validatePreferences(value) {
  if (
    !value ||
    typeof value !== "object" ||
    !text(value.displayName, 60) ||
    !value.displayName.trim()
  )
    throw new Error("Enter a name of 1–60 characters.");
  if (!text(value.hubName, 80) || !value.hubName.trim())
    throw new Error("Enter a Hub name of 1–80 characters.");
  if (!["gold", "sage", "blue"].includes(value.accent))
    throw new Error("Choose a supported accent.");
  if (
    !Array.isArray(value.modules) ||
    !value.modules.includes("briefing") ||
    value.modules.some((m) => !MODULES.includes(m))
  )
    throw new Error("Choose supported sections; Briefing is required.");
  return {
    displayName: value.displayName.trim(),
    hubName: value.hubName.trim(),
    accent: value.accent,
    modules: [...new Set(value.modules)],
  };
}

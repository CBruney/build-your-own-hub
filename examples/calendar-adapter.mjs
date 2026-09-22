import { readFile, mkdir, open } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateSnapshot } from "../src/core/model.mjs";

// This shape is a fictional teaching input, not a vendor API response.
// A real reader must obtain consent and map its provider's fields separately.
export function normalizeExampleCalendar(input) {
  if (input.fictional !== true || !Array.isArray(input.events))
    throw new Error("This example accepts only its fictional calendar input.");
  const sourceId = `calendar:${input.calendarId}`;
  const complete =
    input.coverage?.complete === true && input.coverage?.allPagesRead === true;
  return validateSnapshot({
    schemaVersion: 1,
    mode: "demo",
    generatedAt: input.observedAt,
    timeZone: input.timeZone,
    sources: [
      {
        id: sourceId,
        label: "Fictional example calendar",
        state: complete ? "checked" : "partial",
        observedAt: input.observedAt,
        freshUntil: new Date(
          Date.parse(input.observedAt) + 120 * 60 * 1000,
        ).toISOString(),
        detail: `Fictional window ${input.coverage.windowStart} through ${input.coverage.windowEndExclusive} (exclusive); all pages read: ${complete}.`,
        coverage: input.coverage,
      },
    ],
    items: input.events.map((event) => ({
      id: `${sourceId}:${event.id}`,
      sourceId,
      module: "agenda",
      title: event.title,
      summary: event.summary,
      observedAt: input.observedAt,
      url: event.url || "",
      meta: "Fictional adapter example",
      ...(event.startDate
        ? {
            allDayStart: event.startDate,
            allDayEnd: event.endDateExclusive,
            timeLabel: "All day",
          }
        : {
            startsAt: event.start,
            endsAt: event.end,
            timeLabel: new Intl.DateTimeFormat("en-GB", {
              timeZone: input.timeZone,
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(event.start)),
          }),
    })),
  });
}

export async function saveAndReadBackExample(snapshot, directory) {
  const valid = validateSnapshot(snapshot);
  if (valid.mode !== "demo")
    throw new Error("The example writer only accepts demonstration data.");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const filename = `calendar-${randomUUID()}.json`;
  const path = join(directory, filename);
  const bytes = JSON.stringify(valid, null, 2) + "\n";
  const handle = await open(path, "wx", 0o600);
  try {
    await handle.writeFile(bytes);
    await handle.sync();
  } finally {
    await handle.close();
  }
  const returned = await readFile(path, "utf8");
  if (returned !== bytes)
    throw new Error("Saved content did not match the candidate.");
  validateSnapshot(JSON.parse(returned));
  return {
    filename,
    sha256: createHash("sha256").update(returned).digest("hex"),
    readback: "verified",
    mode: "demo",
    itemCount: valid.items.length,
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const input = JSON.parse(
    await readFile(
      new URL("../fixtures/calendar-provider.example.json", import.meta.url),
      "utf8",
    ),
  );
  const directory = fileURLToPath(
    new URL("../private/adapter-example/", import.meta.url),
  );
  const receipt = await saveAndReadBackExample(
    normalizeExampleCalendar(input),
    directory,
  );
  console.log(
    JSON.stringify(
      { ...receipt, location: `private/adapter-example/${receipt.filename}` },
      null,
      2,
    ),
  );
  console.log(
    "Fictional snapshot only. Import the printed file through Connections to inspect it; reload clears that UI import. No live service was read.",
  );
}

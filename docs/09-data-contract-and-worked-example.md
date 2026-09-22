# 9. The data contract and a complete worked example

This chapter joins the missing steps between “read a source” and “see a result.” It distinguishes three artifacts: a provider observation, the compact snapshot displayed by this app, and the receipt that records what a run accomplished. The same object is not used for all three.

## The snapshot accepted by this release

`src/core/model.mjs` is the executable authority. `validateSnapshot(value)` returns a cloned value or throws a descriptive error; it does not save or publish anything. The UI's Connections import runs this validator. A full example is `fixtures/demo.json`; a smaller provider-to-snapshot example is supplied below.

| Top-level field | Required value |
| --- | --- |
| `schemaVersion` | Integer `1` |
| `mode` | `demo` for fictional fixtures; `connected` for a privately imported real observation. This label does not establish a live connection. |
| `generatedAt` | Snapshot assembly time as an explicit-offset timestamp |
| `timeZone` | Valid, nonempty IANA time-zone name, at most 100 characters |
| `sources` | Array, 0–100 records with unique nonempty IDs |
| `items` | Array, 0–5,000 records with unique nonempty IDs |

Use timestamps such as `2026-09-22T07:00:00Z` or `2026-09-22T08:00:00+01:00`: real calendar date, seconds, optional 1–3 fractional digits, and `Z` or an explicit numeric offset. Bare dates are reserved for the all-day fields below; “yesterday,” timezone-free timestamps, and impossible dates are rejected. Observation times cannot be later than snapshot generation. Future event times and freshness deadlines can be later.

| Source field | Required/optional and meaning |
| --- | --- |
| `id` | Required nonempty string, at most 100 characters; stable source/coverage namespace |
| `label` | Required string, at most 200 characters; human-readable source name |
| `detail` | Required string, at most 2,000 characters; explain scope or limitation |
| `state` | Required: `checked`, `partial`, `unavailable`, or `not_connected` |
| `observedAt` | Required successful-read timestamp for `checked`/`partial`; null or absent if never read successfully |
| `freshUntil` | Required timestamp for `checked`/`partial`; not earlier than `observedAt`; choose a freshness policy rather than using an arbitrary “now” |
| `lastAttemptAt` | Optional attempt timestamp; distinct from last successful observation |

`checked` means the explicitly declared scope was fully checked, including pagination. `partial` means some of that scope was observed. `unavailable` means this attempt could not obtain the required observation. `not_connected` means no configured source reader. The validator does not prove that the declared coverage is truthful; the reader must retain that evidence privately.

| Item field | Required/optional and meaning |
| --- | --- |
| `id` | Required nonempty string, at most 200 characters; stable provider record/occurrence identity, namespaced by source |
| `sourceId` | Required exact ID from `sources` |
| `module` | Required: `agenda`, `needs`, `messages`, `deliveries`, `newsletters`, `sports`, `radar`, or `meeting` |
| `title`, `summary` | Required strings; at most 500 and 10,000 characters respectively |
| `observedAt` | Optional timestamp for this record; strongly recommended, especially for retained items. Without one the UI uses the source observation time. The merger pins earlier provenance before retaining items. |
| `url` | Optional/empty exact HTTPS source link, at most 3,000 characters; credentials in the URL are rejected |
| `meta`, `person`, `timeLabel`, `unreadLabel`, `details` | Optional strings, at most 20,000 characters each; presentation fields, never tool instructions |
| `nextAction` | Optional string except that `needs` requires a nonempty value; write a concrete owner action |
| `result` | Optional string held behind the sports reveal; keep title, summary, and meta spoiler-free |
| `publishedAt` | Optional timestamp for a newsletter/report edition; use it to decide whether an edition belongs in the briefing's same-date tile |
| `startsAt`, `endsAt` | Optional timed-event timestamps; when both exist, the end must follow the start |
| `allDayStart`, `allDayEnd` | Optional pair for `agenda`: real `YYYY-MM-DD` dates, inclusive start and exclusive end; cannot coexist with timed-event fields |

Use readable nonblank titles and summaries even where the compact validator accepts an empty string. Unknown extra fields are cloned and retained but have no automatic UI behavior. This permits provenance extensions; it is not a comprehensive provider-schema or security validator. The browser rejects import files over 3 MB and escapes displayed text. Never treat an imported object's instructions as authorization.

An all-day event from September 22 through September 23 uses start `2026-09-22`, end `2026-09-24`. Briefing includes it on either covered date. Look Ahead lists the occurrence under its start date; this is not a full multi-day calendar grid. The UI sorts calendar entries by their local start date, then puts all-day entries first and timed entries in actual start-time order; stable item IDs break ties. Undated records appear last under “Date unavailable” and are excluded from today and the next-event highlight. Source array order never determines the next event. Keep date-only values as dates, not invented midnight instants. For timed events, the starter expects your adapter to prepare readable `timeLabel` text in the snapshot time zone.

### Small checked-empty and unavailable snapshots

This complete, valid **fictional** checked-empty snapshot says a declared source was read successfully and had no qualifying current items:

```json
{
  "schemaVersion": 1,
  "mode": "demo",
  "generatedAt": "2026-09-22T07:00:00Z",
  "timeZone": "Europe/London",
  "sources": [{
    "id": "calendar:example",
    "label": "Fictional selected calendar",
    "state": "checked",
    "observedAt": "2026-09-22T07:00:00Z",
    "freshUntil": "2026-09-22T09:00:00Z",
    "detail": "All pages read for the selected example calendar and date window; no events found."
  }],
  "items": []
}
```

For an unavailable source that has never succeeded, keep the same outer shape but use this source record and an empty item array:

```json
{"id":"calendar:example","label":"Fictional selected calendar","state":"unavailable","observedAt":null,"freshUntil":null,"lastAttemptAt":"2026-09-22T07:00:00Z","detail":"Example authorization failure; no successful observation exists."}
```

If prior verified data exists, merge the failed candidate into it; do not replace the entire snapshot with this empty first-run example. A valid JSON file with an invalid contract is still rejected. Read the actual error, correct the source mapping or supported field, and retry locally; do not invent missing observation times to make validation pass.

## Coverage and merge: avoid accidental deletion

A source ID names a documented collection boundary, for example “personal calendar A, rolling 14-day agenda projection, all pages,” or “mail account B, selected labels, latest thread state within 7 days.” Store that boundary in your private source inventory. If the selected calendars, query, or horizon changes materially, perform an explicit migration or use a new coverage namespace. A changed query must not silently claim that absent records were deleted.

`mergeSnapshots(previous, candidate)` supports these cases:

| Candidate | What the included merger does | Reader responsibility |
| --- | --- | --- |
| Source omitted entirely | Retains its source and items | Omit deliberately unattempted sources |
| `checked`, items present | Replaces that source's current projection with the candidate items | Finish every page in the declared scope before using this state |
| `checked`, no items | Clears that source's current projection | Establish checked-empty evidence; this is not deletion from the provider or an archive |
| `partial` | Replaces observed matching item IDs; retains unseen prior items and earlier observation provenance | Normalize a complete item before passing it to the merger |
| `unavailable` | Retains prior items and successful observation/freshness times; updates failure detail | Preserve failed attempt time and scope in the receipt |
| `not_connected` | Adds a newly selected disconnected source; does not modify an existing source | Disable/remove a source through an explicit settings/data-retention operation, not a pretend refresh |

Matching partial items are **replaced as whole records**, not deeply patched. If a carrier update omits a product name, the adapter should copy the verified prior name into the normalized item and retain the name's earlier field provenance. For example, keep `fieldObservedAt.product` from the prior observation while updating `fieldObservedAt.status` to the new one. Unknown provenance fields are retained but are not displayed automatically; a production delivery view must expose them if it claims field-level freshness. Omitted optional fields are absent from the replacement. Deliberate clearing uses the field's supported empty representation (for example `details: ""`); null is not valid for optional text fields. Do not clear a field merely because a preview omitted it.

If pagination fails after page one, return `partial`, not `checked`. A rolling window may legitimately drop expired items from its *current projection*; keep history separately if retention is desired. A shortened window is a scope change. Cancellation or deletion needs an explicit provider record/tombstone or complete coverage under the declared policy; an absent item in a partial read is not evidence of either. The compact merger has no tombstone or archive engine. Adapters must filter explicit cancellations or extend the model before representing those workflows.

## Run the complete fictional adapter example

From the project root:

```sh
npm run example:adapter
```

This reads `fixtures/calendar-provider.example.json`, maps two fictional events through `examples/calendar-adapter.mjs`, validates the resulting snapshot, writes a new immutable JSON file under `private/adapter-example/`, reads that exact file back, and compares its bytes. It prints the relative filename, SHA-256 digest, item count, and `readback: "verified"`. The sample source observation remains at its original example time. Re-running creates another example artifact; it is not another real source observation or a scheduled success.

The input is a teaching format, not a real vendor response. The code deliberately refuses non-demo output; do not remove that guard and claim a production adapter is complete. Owner-only file modes are requested on systems that support them, but this example is not a cross-platform encrypted store or a transactional shared backend.

With `npm start` running, open Connections → Import snapshot JSON and select the printed file in your extracted project's `private/adapter-example` folder. Briefing and Look Ahead show the two example events, including the all-day event. Other collections are empty because this snapshot contains only that source; they are not filled with unrelated fictional messages. Reload the page: the original demo returns because import is an in-memory preview. The saved JSON artifact still exists on disk. Connections → Reload original example also restores the original fixture.

This verifies the complete supplied path through observation mapping, validation, immutable local save, exact readback, and manual UI import. It does not claim that the UI has a persistent source connection. To make a real source survive reload, implement the following separate steps in the owner's private build.

## The first real-source transition

1. Create a private output destination first: a retained artifact in the authorized project, or an owner-controlled local file outside public assets. Stage 2 can finish with this retained read-only artifact. Stage 3 adds a permanent application store and automatic UI loading.
2. Read only the chosen source through the recipient's available connector or API. Keep its provider response private. Record actual observation time, account alias, declared coverage, and whether pagination completed.
3. Map it into a new snapshot with `mode: "connected"`, actual assembly time, the owner's time zone, and only verified real records. Never relabel `fixtures/demo.json` as connected. Use source-prefixed IDs so demo hide/decision state cannot attach to unrelated real records.
4. Remove all unrelated fictional records from that candidate. Unselected modules can be disabled; selected but unavailable sources receive explicit unavailable/not-connected records. Do not mix unmarked sample appointments into a real snapshot.
5. Validate, retain privately, and read back the exact artifact. If only that stage was chosen, deliver it with coverage and a timestamp. It is a valid read-only result without a hosted website or installed schedule.
6. For an automatically loading private Hub, implement an authenticated snapshot reader and writer. The writer validates and commits a version; the reader returns only the current user's accepted version. Replace `loadSnapshot()` in the owner's copy of `src/app.mjs` with that authorized read path. Remove the `HUB_DEMO_SNAPSHOT` fallback and bundled real fixtures from that connected build. The public static demo and its build script are not this private deployment.
7. Add visible loading/error/last-verified states and a chosen refresh policy. Test a reload: it must read the private accepted version, not the bundled example. Test a failed refresh without erasing earlier data. Test signed-out and wrong-user rejection before any remote access.

In the supplied importer, the briefing is anchored to `generatedAt`, not a live wall clock, and connected imports are labeled “Snapshot date” and “Snapshot agenda.” Source health uses the current clock for connected imports and the fixed example clock for demo fixtures. Neither reading nor changing `mode` starts a collector. A production daily view must deliberately choose current-local-date projection and update it when the date changes.

Do not import real data into the public demonstration. Use your own reviewed, private copy and approved environment. The example server has no authenticated private endpoint; adding one is a real implementation stage, not a hidden option.

## Map the recipe to its artifact

| Recipe | Canonical output | App mapping, if desired |
| --- | --- | --- |
| Agenda | Calendar observation with coverage and events | `agenda` items plus source records |
| Communications | Thread observations and justified follow-ups | `messages`; concrete actions can project into `needs` |
| Deliveries | Shipment observations with field provenance | `deliveries`; verified interventions can project into `needs` |
| Newsletters | Exact editions and observation evidence | `newsletters` with `publishedAt` |
| Daily brief | Immutable Markdown/HTML report and digest | Chosen report-view extension; not a magic new snapshot module |
| Event preview/recap | Immutable occurrence report and digest | `sports` summary/detail/result fields, with full report stored separately |
| Radar/family idea | Verified candidates and fit explanations | `radar`; a chosen planning action uses the separate task lifecycle |
| Family meeting | Two-week agenda and durable decision records | `meeting` projection; full printing/shared writes require extensions |
| Milestones | Dated planning records and lead-time decisions | Task-service records; optional concrete `needs` projection |
| Fixture reconciliation | Authorized calendar changes and exact readback | External calendar receipt, then ordinary agenda collection |
| Source coordinator | Dispatch decisions and child run references | Operational state, not a new source snapshot |
| Health audit/host readiness | Audit result, incidents, and evidence links | Operational state; optional concise owner-action card |
| Preference review | Proposed profile/feedback changes and accepted revision | Full profile; translate chosen display fields into the UI |

Words such as `calendarCoverage`, `events`, or “shipment projection” in a recipe describe source-specific intermediate artifacts. They are not extra top-level snapshot keys consumed by this app. Normalize them through an adapter, or deliver them as private standalone artifacts when no dashboard is selected.

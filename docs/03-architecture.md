# 3. Architecture and reusable code

The important separation is between reading a source, deciding what the observation means, storing an accepted snapshot, and displaying it. A dashboard should not invent evidence to compensate for a failed reader.

```text
Owner's choices + authorized source inventory
                    |
             read-only collector
                    |
     candidate snapshot + observation receipt
                    |
          validation and merge rules
                    |
       private durable store / publication
                    |
             exact readback
                    |
       Hub view + per-source health

Optional external actions use a separate authorized action path.
```

## What the starter implements

`src/core/model.mjs` validates a compact JSON snapshot, derives freshness without changing timestamps, merges independent source results, rejects dangerous URL schemes, and filters hidden items for display. It is shared by the browser and tests. `src/core/delivery-guard.mjs` uses an exclusive filesystem claim per delivery key; it demonstrates a real durable first-attempt boundary for one local host. Its tests use temporary directories and fake content, never email.

`src/app.mjs` renders all demo sections from one normalized snapshot. `src/styles.css` holds the design tokens and responsive layout. `scripts/server.mjs` is a read-only loopback development server with an explicit path allowlist and no account connector. `scripts/build.mjs` embeds styles, fonts, code, and fictional data into `preview.html`. `scripts/verify.mjs` checks the packaged files and their references.

The demo is deliberately dependency-free at runtime. A team can move the UI into React or another stack without changing the observation and action contracts. The original installed Hub uses a larger frontend, worker, and native runtime. Copying that installation would carry household-specific readers, routes, IDs, and service assumptions. This kit extracts its reusable design and rules into a smaller working foundation.

The exact field contract, runnable calendar example, and first connected-data transition are in [chapter 9](09-data-contract-and-worked-example.md). Operational state, recipe inputs, ownership, and recovery are in [chapter 10](10-install-operate-and-recover.md).

## Snapshot shape

The example JSON contains `schemaVersion`, `mode`, `generatedAt`, `timeZone`, `sources`, and `items`. Every source has an ID, state, observation timestamp, freshness deadline, and detail. Every item has a stable ID, source ID, module, title, summary, and source URL if available. Type-specific optional fields include event times, next actions, original unread labels, publication times, and spoiler-protected details.

`generatedAt` describes when a snapshot was assembled. `observedAt` describes when a source was actually read. `publishedAt` describes an edition or report. `startsAt` describes an event. These are distinct facts and must not be substituted for one another. If there is no successful observation, the source can be unavailable with a null timestamp; it must not masquerade as an empty successful read.

Stable item identity should derive from the provider's immutable record ID or a documented occurrence key. A meeting recurrence needs an occurrence date as well as a series ID. A package needs a shipment identity, not a title. A newsletter needs an edition identity, not only a publication name. Namespace IDs by account or source in a connected system to prevent collisions.

## Merge semantics

For a fully checked source, its current items replace the previous current set. Retention rules may preserve selected completed items in an archive or separate history. For a partial source, fresh observed items update matching IDs while unseen prior items remain, with their earlier observation provenance. For an unavailable source, preserve prior items and its last successful observation; update only the failure detail and attempt time. An unattempted source is not changed.

The included merger is a reference implementation for these rules at source level. More complex sources must subdivide coverage by account, channel, calendar, team, or publication. Do not use a successful sibling to refresh every source clock. Reconcile explicit deletions with tombstones or complete source coverage; absence in a partial read cannot prove deletion.

## Production persistence

A connected implementation needs a real database or durable private file store for preferences, accepted snapshots, immutable reports, action claims, and run receipts. Use revision checks or transactions for concurrent writes. A single-host filesystem claim is not a distributed lock; for multiple workers, use a database uniqueness constraint and transaction around the delivery key.

Keep an immutable report body and content digest before publication. A convenience “latest” pointer can change while another run is active, so the canonical artifact returned by the writer is the readback target. Keep destination states independent: local save, Hub acceptance, email acceptance, and verified Sent content are different milestones.

## Authentication and hosting

The included server is for localhost demo use only. It has no user authentication, account isolation, or public write API. Before hosting real data, implement sign-in, per-user authorization on every data endpoint, private storage, secret management, request validation, logging that excludes message bodies and credentials, and an explicit retention policy. Test a signed-out user and a different signed-in user against the same data paths.

Keep public install icons or demo assets separate from private content. If offline reading is later added, cache only authorized read views after a successful online load. Clear private caches on sign-out or access rejection. Never queue an email, home action, purchase, or calendar mutation offline for automatic replay.

## Composer integration

The demo composer produces text the owner can copy into ChatGPT. A real embedded assistant requires a separately designed authenticated execution path, current API or supported plugin tools, a scoped tool catalog, and an action receipt. Connecting an account to ChatGPT does not give an arbitrary webpage that account's tokens. Do not scrape tokens from the desktop app or invent internal RPC integrations.

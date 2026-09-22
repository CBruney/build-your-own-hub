# 10. Install, operate, and recover a chosen automation

The catalog is a menu, not an installer. A connected automation needs an available execution surface, an approved reader, persistent state it can read next time, a destination, and a saved schedule. This chapter specifies those decisions without pretending that every recipient has the same tools.

## Who reads each source?

Define ownership at the **declared source scope**, identified by service, account alias, and coverage partition. A module name alone is not an ownership boundary. Two mailbox queries that overlap in thread IDs may be the same collection scope even if one result is called Messages and another Deliveries.

For example, one mailbox collector can read the owner's selected labels and retain an accepted mail observation. Messages, shipment extraction, and newsletter extraction then derive their projections from that observation. One calendar collector can supply Agenda, Family Meeting, and activity planning. Derived recipes record which accepted source version they used and its age. They do not independently refresh the same account on their own schedules.

| Collection owner | Selected scope | Dependent work |
| --- | --- | --- |
| Mail reader | One account and agreed labels/lookback, including required latest thread state | Messages, Deliveries, Newsletters |
| Calendar reader | Selected calendars and stated date window | Agenda, Family Meeting, Radar/family-fit checks |
| Event reader | Selected official event/fixture sources | Event preview, recap, fixture reconciliation |
| Public discovery reader | Chosen venue/publication scope | Radar or daily brief |

This is a sample dependency map, not four installed jobs. Nonoverlapping account/label scopes can have separate owners if the inventory documents the partition. If separate service APIs supply genuinely different records, give them separate source IDs. A recipe may be its source's collection owner when no other collector owns that scope; decide that before scheduling it.

When dependent work needs fresher data, request a refresh from the existing owner through a supported mechanism. If no such mechanism exists, wait for its next slot, produce a partial result using the retained observation with its age disclosed, or let the user request a manual refresh. Do not quietly start a second background reader. A manual request has manual provenance and still must avoid a simultaneous duplicate collection.

## Prefer the simple scheduling route first

For one or two sources, give each source one ordinary supported scheduled task. The `source-refresh` coordinator recipe is for a separately implemented runtime with an authoritative inventory, due-time evaluator, concurrency control, durable leases/run IDs, and a supported dispatch mechanism. Ordinary task scheduling does not by itself implement that runtime. If the environment cannot dispatch and track child work, leave the coordinator disabled and use individual owners.

On supported ChatGPT surfaces, ask the assistant to create the chosen schedule and then inspect it in Scheduled. Web tasks need their files and state in accessible uploaded/connected sources; local tasks need the computer, app, and selected folder available. CLI/editor use alone is not the Scheduled management interface. Verify the exact recipient environment rather than copying another installation's IDs. [Official scheduled-task guidance](https://learn.chatgpt.com/docs/automations).

## The private state that survives the next run

Choose concrete paths or service object IDs for each row before enabling the first task. A chat transcript alone is not an atomic lock or durable delivery ledger. A worktree is a code checkout, not necessarily the shared state destination.

| Record | What it contains | Writer and reader |
| --- | --- | --- |
| Profile + brief | Agreed choices and revision | Owner/assistant writes; readers consume approved revision |
| Source inventory | Account aliases, coverage rules, ownership, freshness policy, dependencies | Operator writes; every collector/derived job reads |
| Current snapshots | Accepted version/pointer per source | Collection owner writes; UI and dependent jobs read |
| Canonical reports | Immutable body, subject, recipients if any, digest, occurrence key | Report writer writes; publisher/sender reads exact version |
| Run ownership | Source, slot/run key, owner process/job, lease or terminal state | Coordinator/transactional store; never a copied chat assertion |
| Run receipts | Invocation, actual source evidence, outcome, publication/readback references | Each run writes; audit reads |
| Delivery claims | Stable key, frozen identity/hash, attempted provider call and reconciliation evidence | Action worker writes atomically; recovery operator reads |
| Incidents | Stable incident ID, original failure, latest observation, recovery state | Audit/runtime updates; UI reads |
| Tasks/decisions | Owner edits, outcomes, follow-up dates, revisions | Authorized task writer; collection only supplies source context |

For a local one-owner build, a possible layout is a dedicated private directory containing `profile.json`, `sources.json`, `snapshots/`, `reports/`, `runs/`, `claims/`, `incidents/`, and `decisions/`. It must be outside public build assets, protected by the owner's OS permissions, and explicitly available to the scheduled task. Add locking/version checks around shared writes. For a web-only workflow, use a chosen private connected store with object IDs and atomic operations where needed. If the tools cannot maintain an atomic claim or reconcile an external action, keep that action disabled and use a read-only retained report.

The example files `config/source-inventory.example.json`, `config/automation-plan.example.json`, and `config/run-receipt.example.json` provide planning shapes. Their `null`, false, and example values must be resolved or retained as explicit blockers; they are not credentials or operational evidence.

## A worked installation request

After a manual read and private readback work, give your assistant an instruction like this, substituting your actual agreed choices:

```text
Configure my agenda recipe using my approved profile revision and the shared
automation contract. Use only the selected calendar scope in my source inventory.
Its collection owner is this agenda task; dependent planning tasks reuse its
accepted snapshot. The destination is my chosen private project artifact/store.

Before installing, resolve and show the actual profile, inventory, source-reader,
snapshot, and run-receipt references that a future run can access. Confirm that
none is merely a local path unavailable to this execution surface. Confirm no
other active task already owns this scope.

Use my chosen time zone, cadence, quiet hours, and notification preference.
Reads only; no email, calendar edits, or purchases. Save the full contract,
selected recipe, and those references with the task. Use the supported scheduling
tool, then read back the saved prompt, schedule, active state, and project scope.
Record its actual task ID in my private automation plan. Observe three distinct
eligible scheduled slots before marking unattended source operation verified.
```

This is a setup request, not a ready-to-install anonymous task: “my chosen” values must be bound to actual owner choices and accessible objects first. Never schedule a prompt with unresolved placeholders. If the current session lacks a scheduling tool or an administrator-required connection, complete the prompt/configuration and report that specific dependency. Do not claim installation from a local JSON edit.

The installed run prompt should contain or attach the entire shared contract and selected recipe, plus the actual state references, expected source scope, time zone, quiet hours, destination, and stop rule. A standalone task cannot rely on an earlier chat it does not receive. For a task returning to the same chat, keep those critical instructions in durable files or the saved prompt as well.

## Receipt outcomes and what they prove

Use `null` for inapplicable fields and say why. A run that did not collect a source must not fabricate an observation time or advance that source's health clock.

| Run kind | Required persisted evidence | Publication/readback | Counts toward which acceptance? |
| --- | --- | --- | --- |
| Source update, including checked-empty | Source scope, actual observation, accepted candidate, slot and run identity | Read back the accepted source snapshot | One source slot, if all required coverage and destination checks passed |
| Verified event-gate no-op | Actual occurrence check, sources, gate decision, eligible slot, `outcome: no_action` | No content report; persist/read the receipt, mark report destination not applicable | Evidence that the event gate executes; not evidence that a qualifying report can be delivered |
| Dispatch-only coordinator run | Due decisions, lease/child run references, skips and reasons | Dispatch receipt only; child results remain independent | Coordinator behavior only; never a source success by itself |
| Health/host audit | Existing receipt/inventory versions inspected, findings, incident change or no change | Audit receipt and any actual incident update | Audit behavior only; not a new source read or repaired delivery |
| Authorized report delivery | Frozen report identity, unique attempt, provider response, exact destination readback | Each destination keeps its own status | Delivery path for that qualifying occurrence, not recipient readership |

A short fictional gate receipt may have `publicationId: null`, `readbackState: "not_applicable_to_report"`, `outcome: "no_action"`, and a retained `gateDecision: "no_qualifying_event"`. Its receipt-store readback is recorded separately as `receiptReadback: "verified"`. A dispatch or audit receipt likewise uses null source-observation fields and its own result reference. The app snapshot validator does not validate run receipts; a production runtime must define and validate its chosen receipt schema.

Three different no-event days do not test report delivery. Before calling that path ready, use a permitted simulated delivery test or an explicitly authorized qualifying send and exact readback, and distinguish it from gate-only evidence. A source marked partial does not count as a complete source slot. “Three scheduled successes” is an acceptance threshold, not a guarantee of future reliability.

Use a scheduler occurrence ID or normalized UTC slot plus task ID for `runKey`, and retain the local date/time zone for explanation. During a daylight-saving repeated hour, two real scheduler occurrences must remain distinguishable. If a local time does not occur, follow the chosen scheduler's documented behavior and record the skipped slot; do not invent an extra run. Quiet hours crossing midnight refer to the owner's local clock. After sleep/downtime, take the next allowed slot and do not replay a backlog.

## Per-recipe setup questions

Resolve these before installing the corresponding recipe. Parentheses contain optional starting examples, not active settings. The owner can choose a different value. If a decision is irrelevant because the module is omitted, record “not selected.”

| Recipe | Required additional choices |
| --- | --- |
| Source refresh | Inventory location, supported child dispatch mechanism, ownership/lease store, due policy, concurrency limits; otherwise leave disabled |
| Agenda | Calendar IDs, inclusive start/exclusive end window (for example today through 14 local days), all-day handling, calendar-week boundary, tomorrow/weekend preference |
| Communications | Accounts/channels, lookback (for example 7 days), latest-reply check, permitted preview/full-thread scope, what counts as a follow-up, per-channel owner |
| Deliveries | Source filters and shared mailbox owner, shipment identity, carrier sources, delivered-item retention (for example 7 days), intervention criteria |
| Newsletters | Exact publication/edition identities, selected mailbox labels or official source, fallback edition pages, retention and today's local-date rule |
| Daily brief | Topics, geography, input freshness limits, length (for example 5 items), written/spoken style, private report destination; email only if separately selected |
| Event preview | Teams/events, official occurrence source, local-date gate, lead time and cutoff, postponed/canceled policy; default to no report when timing is uncertain |
| Event recap | Completion source, following-morning window, late-completion policy and final retry cutoff, spoiler preference, report retention |
| Radar | Activity categories, travel range, availability window, party/access constraints when relevant, budget, candidate limit, accepted calendar source version |
| Family idea | Participants' relevant constraints, available period, travel range, budget, calendar owner, one-idea limit or a chosen alternative |
| Family meeting | Shared topic destination, read/write permissions, 14-day window/week boundary, allowed decision editors, handoff/follow-up rule, whether printing is wanted |
| Milestones | Source of dates, exact date/year precision, lead times, timezone, recurrence and leap-day rule, task destination; ask before substituting a non-leap-year date |
| Fixture reconciliation | Chosen calendar, managed-event ID namespace, permitted fields and action scope, official fixture source, conflict rule for manual edits; unresolved conflicts become review items |
| Health audit | Expected task/source inventory, eligible slots, freshness policies, receipt locations, incident destination and notification rule |
| Host readiness | Local host identity, required app/files/services, permitted read-only checks, operator, ready/not-ready criteria; omit for a web-only build |
| Preference review | Retained explicit-feedback source, profile revision, what can be proposed versus applied, who approves changes, and rollback copy |

For event recipes, a retry before the owner's cutoff may recheck an uncertain gate without replaying a send. Once a send could have happened, the existing attempt controls recovery. For calendar reconciliation, do not overwrite owner edits merely because a fixture refresh differs; use the agreed field-ownership/conflict policy and exact event readback.

## Durable decisions and planning items

The demo keeps notes and resolved flags only in its browser. A connected build should keep owner-written state in a separate task/list service or private decision store, then project it into the UI. Do not overwrite decisions when a source refresh regenerates titles or context.

```json
{
  "id": "example-owner:decision:weekend-plan",
  "sourceRefs": ["calendar:example:event-42"],
  "title": "Choose a weekend plan",
  "createdBy": "owner",
  "owner": "owner",
  "status": "open",
  "outcome": "",
  "followUpDate": "2026-09-24",
  "revision": 1,
  "updatedAt": "2026-09-22T07:00:00Z"
}
```

Use an explicit lifecycle: open → completed with a written outcome, or open → canceled with a reason. Reopening is an explicit owner action that increments the revision. Hide affects only presentation. A new message may justify a new follow-up with a new occurrence identity; it must not silently reopen the completed record. Before writing, compare the stored revision; on conflict, reread and reconcile instead of overwriting another person's decision. Retain the original author and source links. “Plan this” in the demo only prepares a prompt; a real task destination and this lifecycle are additional implementation.

## Inspect a held delivery attempt without sending

The helper `src/core/delivery-guard.mjs` exports `digest`, `claimDelivery`, `readClaim`, and `verifySent`. It does not send mail, record provider IDs, finalize delivery state, or perform recovery. Use it only as the first-attempt component of a complete private action path.

For example, construct the stable key `owner-17|event-recap|provider-event-42|email:work-alias`. It identifies the logical delivery, not the current body hash. If the same report is regenerated with a new body, it must still encounter the existing key rather than make a second send automatically. Keep the exact body privately alongside the claim; the claim records only its digest, subject, and recipients.

Call `claimDelivery(privateClaimsDirectory, {key, subject, body, recipients})` once. Only `permitted: true` allows the caller to proceed to its authorized provider call. Any exception or `permitted: false` stops that path. Use `readClaim(returnedPath)` to inspect the reservation; validate its key and compare `digest(frozenBody)` with `bodyHash`. For a simulated Sent object, `verifySent(frozen, simulatedSent)` requires the exact subject/body and recipient set. The automated tests demonstrate a concurrent claim and a mismatched readback without a real email.

If a process crashes after reservation, the file remains held. It does not prove whether the provider call occurred. Inspect the original run trace/provider ID and search the authorized destination for the exact subject, recipients, and full content. Save the evidence and a separate reconciliation record. If the content is found, mark the logical delivery verified in that record and keep the claim. If the result remains unknown or readback is unavailable, retain `reconciliation_required` and do not send. Absence from one search alone is not proof that nothing was sent.

The helper has no automatic “unlock” operation. A human-directed recovery needs evidence that resolves the prior attempt, explicit authorization for any new action, and a durable decision linked to the original claim. Do not delete or edit the claim to bypass it. If your chosen provider supports idempotency keys, preserve the same key under that provider's documented retry contract; do not assume a generic email connector offers it. Recovery cannot be completed by this kit without the recipient's actual provider evidence.

## Pause, resume, and restore

To stop unattended work, use the supported scheduler to pause the actual task and read back its paused state. Pausing does not necessarily cancel a running task: inspect it and preserve any ambiguous action attempt. Retain its task ID, prompt, source ownership, state references, and last successful receipts.

Before resuming, confirm that the profile, credentials, state location, and collector ownership still match; run a bounded manual read if needed. Resume at the next eligible slot, preserve earlier failures, and gather fresh scheduled evidence after a material change. Never reset verification counters by relabeling old receipts as new.

Back up the private profile, inventory, accepted data, immutable reports, decisions, claims, and receipts according to the owner's chosen retention and storage protections. To test restoration, restore into an isolated private location with schedules and sends disabled, compare versions/digests, and read the UI. Code rollback restores an earlier release while keeping private operational state; it must not restore an old ledger in a way that re-enables an already attempted send. A lost or untrusted delivery ledger is a stop condition for sending until reconciled.

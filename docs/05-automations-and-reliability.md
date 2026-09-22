# 5. Automations that can be trusted

Automations are reusable work instructions plus a schedule, authorized sources, a destination, and evidence of completion. Copying an automation prompt does not install its connections or make its future runs reliable.

`automations/catalog.json` lists the available recipes and example cadences. Every recipe starts disabled. The cadences are suggestions for a new owner, not an export of Craig's live schedule. The owner chooses frequency, time zone, quiet hours, and notification destination before activation.

## One owner per collection

Give each source one scheduling owner. Avoid a central refresh and a separate recurring task both collecting the same source. Manual refresh should join or deduplicate with an active run. In a local multi-source runtime, admit bounded work: prioritize Agenda and Messages, limit overall concurrency, and keep background readers from occupying every slot. Tune from measured queue delays rather than adding more collectors reflexively.

Routine quiet hours pause new reads and retries. Let already started reads finish safely. Resume at the next allowed source slot; do not replay every missed interval after sleep, downtime, or quiet hours. User-requested refresh can be a separate authorized path, with manual provenance and no claim that it proves a schedule worked.

## Each run has a contract

Record the automation ID, stable run or occurrence key, expected schedule slot, invocation kind, actual start/end, source coverage, candidate identity, publication receipt, readback result, and any destination IDs. Keep failure classification and history. If a source is deliberately unattempted, say so.

Use specific outcomes:

- **No action:** a successful source or event gate found nothing qualifying. This is not a failed read.
- **Partial:** useful verified information exists, but specified source coverage is missing.
- **Blocked:** the required result could not be established. State the exact missing layer.
- **Action needed:** a specific owner decision, authentication, or external action is required.
- **Complete:** all required destination and content checks passed.

Do not flatten these states into success because a tool returned without an exception.

## Freshness and schedule health

Freshness describes the last verified observation and its allowed next check. Schedule health describes whether expected runs actually started and completed. A cached item can still be useful when a run was missed. Conversely, a clock ticking on schedule does not prove a source was read.

Keep `lastAttemptAt`, `observedAt`, `nextDueAt`, and `freshUntil` separate. Planned pauses can extend the next deadline without changing the observed timestamp. An incident already due before a pause remains an incident. Do not allow a code upgrade to reset evidence history.

Before calling a source's unattended behavior verified, observe at least three distinct expected scheduled slots with actual source evidence, accepted publication, and readback. Same-slot retries and manual tests do not count as separate slots. This is an acceptance rule for the Hub, not a guarantee against later failures.

## Delivery: one content artifact, independent destinations

First research and freeze the report. Save its exact body, subject, recipient set, occurrence key, and content digest privately. Local saving should not depend on email availability. Then publish to the Hub and send only through an authorized delivery path. Preserve the success of either destination if the other is blocked.

Before sending, check for an existing attempt and the exact Sent record when available. Claim the stable delivery key atomically before the external call. Once a provider call could have happened, uncertain results require reconciliation, not another send. Read back the exact Sent message and compare recipient, subject, and full content. A provider's accepted status is weaker than verified content in Sent, and neither proves the recipient opened it.

The included filesystem guard demonstrates at-most-one attempt, not exactly-once delivery. A process can claim and crash before sending; that state must remain held until an explicit, evidence-based recovery decision. For multiple hosts, use transactional central storage. Never clear a claim simply because a report is important or the network timed out.

## Event gates

A pre-event recipe first checks an official occurrence for the owner's local date and confirms time remains before start. A post-event recipe confirms the relevant event completed. No qualifying event means a quiet no-op. Postponed, cancelled, already attempted, or uncertain occurrences stay explicit. Use occurrence IDs and dates rather than a daily subject alone to prevent duplicates and mistaken reports.

## Useful failures

Create one unresolved incident for a genuine terminal problem. Update it on repeated observations. Include the task, effect, known cause or “unknown,” next step, and owner. Retain the original failure after recovery. A scheduled pause, successful no-op, safe transient retry, or requested cancellation should not create a false failure card.

## Efficiency without lost coverage

Send a collector only the relevant retained source, compact preference fields, and necessary cross-source context. Keep complete verification evidence outside its working prompt. Measure input size, elapsed time, and actual usage separately. A smaller JSON file is not proof of lower account usage. Model changes should use a bounded trial on ordinary scheduled work with unchanged source coverage and readback requirements, never duplicate shadow collection.

## Installation and rollback

Use supported task creation and management tools for the recipient's environment. Do not copy private scheduler files or edit hidden app databases. Save the agreed prompt and schedule in versioned project documentation. For a separate local runtime, use one clearly owned service, versioned releases, a stable launcher, hash validation, and a tested rollback. Keep data, credentials, evidence history, and schedule state outside disposable application releases.

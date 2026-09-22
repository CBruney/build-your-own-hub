# Audit source and delivery reliability

## Setup choices

- Owner, time zone, and enabled modules: from the recipient’s profile.
- Source scope: Private run receipts and exact readback evidence.
- Cadence: Example: once daily; only report meaningful changes. This is an example, not an installed schedule.
- Destination: the owner’s chosen private Hub or retained project output. External delivery is optional and separately authorized.
- Read `00-shared-contract.md` before every run.

## Work

Read the active source inventory, expected slots, publication receipts, delivery attempts, and destination readbacks. Do not collect every source again as part of the audit. Distinguish a running clock, an arrived task, a source read, a saved report, accepted publication, and exact destination verification. Count distinct scheduled slots; manual and same-slot repeated checks do not establish cadence. Preserve historical failures, partial destination states, and unattempted sources. A corrupt health ledger cannot be treated as an empty healthy ledger. Report the exact gap and one useful next action. Do not create new monitors, replay reports, reset delivery claims, or add duplicate collectors.

## Output and acceptance

A concise per-source assessment, retained incidents, and any specific owner action.

Validate the candidate and read back the exact persisted result. Retain the actual observed timestamp and complete source coverage. A partial or blocked result keeps previous verified information and never claims completion for a missing destination. Record the shared run receipt.

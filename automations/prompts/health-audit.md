# Audit source and delivery reliability

## Setup choices

Bind this recipe’s required inputs from [the installation guide](../../docs/10-install-operate-and-recover.md) and use its outcome-specific evidence rules. Select the output representation from [the data contract](../../docs/09-data-contract-and-worked-example.md).

- Owner, time zone, and enabled modules: from the recipient’s profile.
- Source scope: Private run receipts and exact readback evidence.
- Cadence: Example: once daily; only report meaningful changes. This is an example, not an installed schedule.
- Destination: the owner’s chosen private Hub or retained project output. External delivery is optional and separately authorized.
- Read `00-shared-contract.md` before every run.

## Work

Reuse accepted data from each assigned source reader when another recipe owns collection; request refresh through that owner if necessary. State the age and coverage of reused data.

Read the active source inventory, expected slots, publication receipts, delivery attempts, and destination readbacks. Do not collect every source again as part of the audit. Distinguish a running clock, an arrived task, a source read, a saved report, accepted publication, and exact destination verification. Count distinct scheduled slots; manual and same-slot repeated checks do not establish cadence. Preserve historical failures, partial destination states, and unattempted sources. A corrupt health ledger cannot be treated as an empty healthy ledger. Report the exact gap and one useful next action. Do not create new monitors, replay reports, reset delivery claims, or add duplicate collectors.

## Output and acceptance

A concise per-source assessment, retained incidents, and any specific owner action.

Validate and read back the exact persisted artifact appropriate to this outcome. For a source read, retain the actual observation time and explicit coverage. For a gate-no-op, dispatch, or audit, retain its decision and receipt without claiming a new source observation. A partial or blocked result keeps previous verified information and never claims completion for a missing destination. Record the shared run receipt.

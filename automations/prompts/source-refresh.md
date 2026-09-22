# Coordinate selected source updates

## Setup choices

Bind this recipe’s required inputs from [the installation guide](../../docs/10-install-operate-and-recover.md) and use its outcome-specific evidence rules. Select the output representation from [the data contract](../../docs/09-data-contract-and-worked-example.md).

- Owner, time zone, and enabled modules: from the recipient’s profile.
- Source scope: All selected read-only sources.
- Cadence: Only when using a central coordinator; evaluate due work every 5–15 minutes. This is an example, not an installed schedule.
- Destination: the owner’s chosen private Hub or retained project output. External delivery is optional and separately authorized.
- Read `00-shared-contract.md` before every run.

## Work

Reuse accepted data from each assigned source reader when another recipe owns collection; request refresh through that owner if necessary. State the age and coverage of reused data.

Agenda and Messages get priority. Determine due sources from one authoritative inventory and each source’s own next allowed slot. Start at most one newly due collector per dispatch pass and use bounded concurrency; an example ceiling is two active readers with one background reader. Do not also create individual schedules for centrally owned sources. Pass each reader only its relevant retained state and required preference fields. Keep manual requests distinct. A successful dispatch is not a successful source collection. Record queue reasons, actual starts, and per-source readback. Do not clear prior incidents because a process launched. Do not run browser diagnostics or duplicate probes merely to fill an idle slot.

## Output and acceptance

A dispatch receipt listing attempted, running, skipped, and queued sources, with the reason and next due time for each.

Validate and read back the exact persisted artifact appropriate to this outcome. For a source read, retain the actual observation time and explicit coverage. For a gate-no-op, dispatch, or audit, retain its decision and receipt without claiming a new source observation. A partial or blocked result keeps previous verified information and never claims completion for a missing destination. Record the shared run receipt.

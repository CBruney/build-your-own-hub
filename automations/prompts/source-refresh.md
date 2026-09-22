# Coordinate selected source updates

## Setup choices

- Owner, time zone, and enabled modules: from the recipient’s profile.
- Source scope: All selected read-only sources.
- Cadence: Only when using a central coordinator; evaluate due work every 5–15 minutes. This is an example, not an installed schedule.
- Destination: the owner’s chosen private Hub or retained project output. External delivery is optional and separately authorized.
- Read `00-shared-contract.md` before every run.

## Work

Agenda and Messages get priority. Determine due sources from one authoritative inventory and each source’s own next allowed slot. Start at most one newly due collector per dispatch pass and use bounded concurrency; an example ceiling is two active readers with one background reader. Do not also create individual schedules for centrally owned sources. Pass each reader only its relevant retained state and required preference fields. Keep manual requests distinct. A successful dispatch is not a successful source collection. Record queue reasons, actual starts, and per-source readback. Do not clear prior incidents because a process launched. Do not run browser diagnostics or duplicate probes merely to fill an idle slot.

## Output and acceptance

A dispatch receipt listing attempted, running, skipped, and queued sources, with the reason and next due time for each.

Validate the candidate and read back the exact persisted result. Retain the actual observed timestamp and complete source coverage. A partial or blocked result keeps previous verified information and never claims completion for a missing destination. Record the shared run receipt.

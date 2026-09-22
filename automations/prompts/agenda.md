# Refresh the agenda

## Setup choices

Bind this recipe’s required inputs from [the installation guide](../../docs/10-install-operate-and-recover.md) and use its outcome-specific evidence rules. Select the output representation from [the data contract](../../docs/09-data-contract-and-worked-example.md).

- Owner, time zone, and enabled modules: from the recipient’s profile.
- Source scope: Selected calendars.
- Cadence: Example: hourly during the owner’s active hours. This is an example, not an installed schedule.
- Destination: the owner’s chosen private Hub or retained project output. External delivery is optional and separately authorized.
- Read `00-shared-contract.md` before every run.

## Work

Reuse accepted data from each assigned source reader when another recipe owns collection; request refresh through that owner if necessary. State the age and coverage of reused data.

Enumerate every selected calendar, including shared and subscribed sources. Read the chosen planning horizon and preserve the provider event and occurrence IDs, exact start/end, all-day date fields, calendar identity, people, location, and event URL. Normalize display in the owner’s IANA time zone. Deduplicate the same occurrence appearing on multiple calendars without losing people or provenance. Keep work summaries useful without inventing locations. Show tomorrow on ordinary days and the upcoming weekend when the owner prefers it. Preserve canceled-event evidence and avoid turning a partially read calendar into an empty day. Calendar writes are outside this recipe.

## Output and acceptance

An agenda projection with calendarCoverage and events, plus the actual source observation times.

Validate and read back the exact persisted artifact appropriate to this outcome. For a source read, retain the actual observation time and explicit coverage. For a gate-no-op, dispatch, or audit, retain its decision and receipt without claiming a new source observation. A partial or blocked result keeps previous verified information and never claims completion for a missing destination. Record the shared run receipt.

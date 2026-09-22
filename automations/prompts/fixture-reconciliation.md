# Keep chosen event calendars accurate

## Setup choices

Bind this recipe’s required inputs from [the installation guide](../../docs/10-install-operate-and-recover.md) and use its outcome-specific evidence rules. Select the output representation from [the data contract](../../docs/09-data-contract-and-worked-example.md).

- Owner, time zone, and enabled modules: from the recipient’s profile.
- Source scope: Official fixtures and selected managed calendar.
- Cadence: Example: daily for a selected calendar, only if calendar writes are chosen. This is an example, not an installed schedule.
- Destination: the owner’s chosen private Hub or retained project output. External delivery is optional and separately authorized.
- Read `00-shared-contract.md` before every run.

## Work

Reuse accepted data from each assigned source reader when another recipe owns collection; request refresh through that owner if necessary. State the age and coverage of reused data.

Compare the owner’s managed event calendar with official fixtures for the selected teams or interests. Match exact occurrence identity and detect reschedules, cancellations, missing items, and duplicates. Produce a proposed change set first. Calendar mutation requires separate explicit scope: which calendar, allowed fields, and whether unattended changes are permitted. Keep manually edited user content and unrelated events intact. For each authorized change, use the provider’s supported API and read back the actual event. Never recreate all events merely to fix one time. A source outage yields a blocked comparison, not mass deletions.

## Output and acceptance

A comparison report; optionally individually authorized event changes with provider readback.

Validate and read back the exact persisted artifact appropriate to this outcome. For a source read, retain the actual observation time and explicit coverage. For a gate-no-op, dispatch, or audit, retain its decision and receipt without claiming a new source observation. A partial or blocked result keeps previous verified information and never claims completion for a missing destination. Record the shared run receipt.

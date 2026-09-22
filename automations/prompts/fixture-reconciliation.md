# Keep chosen event calendars accurate

## Setup choices

- Owner, time zone, and enabled modules: from the recipient’s profile.
- Source scope: Official fixtures and selected managed calendar.
- Cadence: Example: daily for a selected calendar, only if calendar writes are chosen. This is an example, not an installed schedule.
- Destination: the owner’s chosen private Hub or retained project output. External delivery is optional and separately authorized.
- Read `00-shared-contract.md` before every run.

## Work

Compare the owner’s managed event calendar with official fixtures for the selected teams or interests. Match exact occurrence identity and detect reschedules, cancellations, missing items, and duplicates. Produce a proposed change set first. Calendar mutation requires separate explicit scope: which calendar, allowed fields, and whether unattended changes are permitted. Keep manually edited user content and unrelated events intact. For each authorized change, use the provider’s supported API and read back the actual event. Never recreate all events merely to fix one time. A source outage yields a blocked comparison, not mass deletions.

## Output and acceptance

A comparison report; optionally individually authorized event changes with provider readback.

Validate the candidate and read back the exact persisted result. Retain the actual observed timestamp and complete source coverage. A partial or blocked result keeps previous verified information and never claims completion for a missing destination. Record the shared run receipt.

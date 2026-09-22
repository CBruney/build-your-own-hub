# Refresh the agenda

## Setup choices

- Owner, time zone, and enabled modules: from the recipient’s profile.
- Source scope: Selected calendars.
- Cadence: Example: hourly during the owner’s active hours. This is an example, not an installed schedule.
- Destination: the owner’s chosen private Hub or retained project output. External delivery is optional and separately authorized.
- Read `00-shared-contract.md` before every run.

## Work

Enumerate every selected calendar, including shared and subscribed sources. Read the chosen planning horizon and preserve the provider event and occurrence IDs, exact start/end, all-day date fields, calendar identity, people, location, and event URL. Normalize display in the owner’s IANA time zone. Deduplicate the same occurrence appearing on multiple calendars without losing people or provenance. Keep work summaries useful without inventing locations. Show tomorrow on ordinary days and the upcoming weekend when the owner prefers it. Preserve canceled-event evidence and avoid turning a partially read calendar into an empty day. Calendar writes are outside this recipe.

## Output and acceptance

An agenda projection with calendarCoverage and events, plus the actual source observation times.

Validate the candidate and read back the exact persisted result. Retain the actual observed timestamp and complete source coverage. A partial or blocked result keeps previous verified information and never claims completion for a missing destination. Record the shared run receipt.

# Check the chosen local automation host

## Setup choices

Bind this recipe’s required inputs from [the installation guide](../../docs/10-install-operate-and-recover.md) and use its outcome-specific evidence rules. Select the output representation from [the data contract](../../docs/09-data-contract-and-worked-example.md).

- Owner, time zone, and enabled modules: from the recipient’s profile.
- Source scope: Owner-selected local environment.
- Cadence: Example: once before the first local job, if a local host is used. This is an example, not an installed schedule.
- Destination: the owner’s chosen private Hub or retained project output. External delivery is optional and separately authorized.
- Read `00-shared-contract.md` before every run.

## Work

Reuse accepted data from each assigned source reader when another recipe owns collection; request refresh through that owner if necessary. State the age and coverage of reused data.

Use read-only supported checks for the owner’s chosen host, required local folders, application availability, network reachability, and the already selected schedule. Report device access and collector capability separately. Do not wake, restart, install, alter security, or add a second service without that action being within the owner’s authorization. A successful port check is not a successful source read. If a required sign-in or physical action is missing, name the exact control and why it blocks the task. Do not send test email or operate a home device to prove readiness.

## Output and acceptance

A bounded readiness result and precise dependencies, not a claim that all scheduled sources are healthy.

Validate and read back the exact persisted artifact appropriate to this outcome. For a source read, retain the actual observation time and explicit coverage. For a gate-no-op, dispatch, or audit, retain its decision and receipt without claiming a new source observation. A partial or blocked result keeps previous verified information and never claims completion for a missing destination. Record the shared run receipt.

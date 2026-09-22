# Track identifiable packages

## Setup choices

Bind this recipe’s required inputs from [the installation guide](../../docs/10-install-operate-and-recover.md) and use its outcome-specific evidence rules. Select the output representation from [the data contract](../../docs/09-data-contract-and-worked-example.md).

- Owner, time zone, and enabled modules: from the recipient’s profile.
- Source scope: Chosen order email and seller/carrier pages.
- Cadence: Example: every 2 hours; tune to actual need. This is an example, not an installed schedule.
- Destination: the owner’s chosen private Hub or retained project output. External delivery is optional and separately authorized.
- Read `00-shared-contract.md` before every run.

## Work

Reuse accepted data from each assigned source reader when another recipe owns collection; request refresh through that owner if necessary. State the age and coverage of reused data.

Read selected order and shipment messages, then follow exact seller or carrier links when access is available. Use shipment identity, not subject text, to deduplicate. Preserve verified product names and images when a status update omits them. Keep a known but incomplete shipment visible with its specific missing information. Do not substitute a retailer logo for a product image. Record carrier scan time separately from your check time. Retain delivered packages for the owner’s chosen local-day window. Transit and ordinary delays remain informational; Needs You requires a verified pickup, signature, address, customs, payment, or similar intervention. Do not order, cancel, return, pay, or change delivery instructions.

## Output and acceptance

A shipment projection with stable IDs, status, identifying fields, timestamps, exact links, and any explicit owner action.

Validate and read back the exact persisted artifact appropriate to this outcome. For a source read, retain the actual observation time and explicit coverage. For a gate-no-op, dispatch, or audit, retain its decision and receipt without claiming a new source observation. A partial or blocked result keeps previous verified information and never claims completion for a missing destination. Record the shared run receipt.

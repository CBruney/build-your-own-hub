# 4. Connect your own sources

Choose integrations only after reading the recipient's actual capability inventory. The same service name can expose different tools in different accounts, workspaces, or surfaces. A template cannot transfer a login, device permission, or the original owner's consent.

## Platform choice

ChatGPT projects can hold shared files, instructions, and connected sources. A web project does not directly expose a local computer folder; upload the context or connect an accessible source. A local project in the desktop app can point to extracted code. Confirm which files, connectors, and scheduling tools are actually available in the selected product. These distinctions are described in the official [Projects and chats guide](https://learn.chatgpt.com/codex/projects).

Scheduled web tasks use their available uploaded context and connected tools; local scheduled tasks require the computer, app, and project files to be available. Task availability and permissions depend on the recipient's environment. Start by testing the prompt interactively and inspecting its real outputs. A successful interactive read does not establish that a scheduled run can access the same context; test that separately. See the official [Scheduled tasks guide](https://learn.chatgpt.com/codex/automations).

Plugins supply supported skills and connections; some are desktop-only and may require authentication or device permissions. Inspect the recipient's installed capabilities rather than copying tool names from the creator's environment. See the official [Plugins guide](https://learn.chatgpt.com/codex/plugins). These links were read while preparing this release; recheck them when implementing because products and availability change.

## Integration matrix

| Source | First path to investigate | Initial permission | Completion evidence |
| --- | --- | --- | --- |
| Calendar | Available Calendar connector | Read selected calendars | Enumerated calendars and exact event readback |
| Email | Available mailbox connector | Read chosen accounts/labels | Thread IDs, exact dates, latest replies, preserved unread state |
| Native messages | Supported device plugin | Read permitted conversations | Real conversation data and permission coverage |
| Web messaging | Supported browser route if permitted | Read-only bounded previews | Actual page read; exact channel check time |
| Deliveries | Order email then exact seller/carrier links | Read source records | Shipment identity, status, product, source and scan dates |
| Newsletters | Mailbox or official edition pages | Read selected publications | Exact newest edition, timestamp, usable edition link |
| Sports / interests | Official teams, competitions, venues, publishers | Public reads | Exact occurrence or edition and current source timestamp |
| Radar | Venue/event pages, selected calendars, owner preferences | Public discovery + authorized calendar reads | Verified date/availability, fit explanation, direct source |
| Shared lists | Available list service API/connector | Read before optional writes | Stable topic IDs, author attribution, revision-aware updates |
| Home | Owner's supported home platform | Status first | Device registry, current state, individual action/readback contract |

This matrix specifies how to evaluate an integration; it does not assert that every named class of tool is installed. A missing source should be disabled or marked unavailable with a useful explanation. Never replace missing access with a fabricated “connected” badge.

## Build one adapter

1. Identify the exact account and selected source records. Save no credentials in the profile.
2. Read a small representative sample through the supported connector or direct API.
3. Normalize it into the snapshot contract. Preserve IDs, original timestamps, and unread indicators.
4. Validate the candidate. Treat missing required fields as a limitation or rejection, not a reason to invent values.
5. Publish to the owner's private store, then read back the exact stored candidate.
6. Display it and click its actual source link. Check empty and failed states.
7. Only then define its scheduled owner, cadence, quiet hours, and notification behavior.

The kit does not ship connector wrappers because authentication and available tools must be established in the recipient's own environment. Use the prompt recipes as instructions to that recipient's assistant; use the JSON model as the application boundary.

## Browser rules

Prefer a purpose-built connector when it can complete the work. For browser-dependent sources, use the supported route and its current documentation. Distinguish a policy check that could not complete from an explicit denial. Respect denials and extension pauses; do not switch tools or profiles to evade them. After a timeout, inspect the resulting state before repeating an action. Close only the tabs opened for this work.

## Source-specific details

Calendar enumeration matters: a primary calendar alone may omit school, team, family, subscribed, or shared calendars. Preserve all-day dates separately from timed events. Calculate “today” and “tomorrow” in the selected IANA time zone and handle daylight-saving changes.

Message triage must reconcile later replies before deciding an answer is still due. A preview badge is not permission to read a whole conversation and is not an exact unread count unless the source says so. Display verified contact names while keeping routing identities out of the headline.

Newsletter checks must distinguish actual editions from promotions, subscription confirmations, homepages, and archives. A successful read that finds no new edition is useful evidence. A new check does not make an old edition “new today.”

Delivery collection should retain an identifying card when a known shipment lacks some fields. Preserve previously verified product details when a partial status update omits them. Ordinary transit belongs in Deliveries; only verified interventions belong in Needs You.

Home actions deserve separate implementation. Start with read-only state. Classify each device and action; exclude locks, garage doors, alarm changes, and other sensitive controls from a generic on/off pathway. Use the owner's chosen authorization and verify resulting state before reporting success.

# 8. Your choices, their effects, and where they live

## Two different preference files

The **demo export** contains `schemaVersion`, `displayName`, `hubName`, `accent`, and `modules`. Personalize saves those display settings in this browser and can export/import them. Editing `config/profile.example.json` does not automatically change the running demo: the app does not read that file. Use Personalize to change the demo now, or ask your assistant to implement profile loading in your own copy.

The **full build profile** is a planning document for your assistant and future adapters. Copy `config/profile.example.json` to `config/profile.local.json` in a private local copy, or keep it as a private project attachment when working on the web. The `.local.json` file is ignored by this starter's Git rules, but an ignore rule is not access control or a safe-publishing guarantee. Keep credentials in a secret store, never in either profile.

Treat the full profile as the source of truth for a connected build. Import a deliberate demo export into only its four display fields; keep its time zone, source inventory, permissions, and other fields intact. Choose one owner to edit it, or add version checks before collaborative editing. Record changes with a profile revision in the personal brief. In this starter, browser preferences remain a separate demonstration until you implement that synchronization.

## Field guide

| Field | Meaning and allowed planning shape | Used by this demo now? |
| --- | --- | --- |
| `schemaVersion` | `1` for this example profile | Export marker only |
| `displayName` | Nonblank string, at most 60 characters | Yes, through Personalize/import |
| `hubName` | Nonblank string, at most 80 characters | Yes, through Personalize/import |
| `timeZone` | IANA name such as `America/New_York` or `Europe/London`; choose yours | No; the displayed snapshot supplies its time zone |
| `locale` | Language/region tag such as `en-US`; a desired future format | No; interface text and formatting are English in this release |
| `accent` | `gold`, `sage`, or `blue` for the included UI | Yes, through Personalize/import |
| `modules` | Ordered, unique IDs from `briefing`, `agenda`, `messages`, `deliveries`, `newsletters`, `sports`, `radar`, `meeting`; include `briefing` | Yes for navigation; the briefing's tile order is fixed in code |
| `people` | Objects with stable `id`, display `label`, and optional `role`; omit birthdays/contact routes unless a chosen feature needs them | Planning only |
| `interests` | Strings naming desired categories | Planning only |
| `teams`, `publications` | Objects with `id`, `label`, and optional verified `sourceUrl` | Planning only |
| `sourceAccounts` | Objects with `id`, service `provider`, and readable `label`; these are aliases, not logins or tokens | Planning only; use a separate private source inventory for access scope |
| `quietHours` | Local-time windows with `start` and `end` as `HH:MM`; start later than end crosses midnight; an empty array means none | Planning only |
| `notifications` | `mode`: `meaningful_changes`, `every_run`, or `silent`; `destinations`: selected private destination aliases | Planning only |
| `authorization` | `sourceReads`, `outboundActions`, `homeControls`: lists of plain-language owner-approved scopes | Planning only; text in a file does not bypass current tool permissions |
| `deployment` | `mode`: `demo`, `guided`, `local`, or `private_hosted`; `privateStorage` and `host`: selected implementation descriptions or null while undecided | Planning only |

The profile is not a connector SDK or a scheduler configuration format. Only `validatePreferences` is implemented for the four browser display fields. A connected build must validate the additional fields and translate approved choices into the chosen platform's actual configuration. Recipe names, provider aliases, and these planning fields do not create installed resources by themselves.

`needs` is an item category in the snapshot, not a selectable navigation section. Connections and Personalize are always available. Home and full calendar printing are extensions; adding `home` to this demo's `modules` array is invalid until you implement that section. To omit sports or household planning, remove `sports` or `meeting`; the product does not require either.

## A worked first version

For a fictional individual who wants calendar clarity and focused reading:

```json
{
  "schemaVersion": 1,
  "displayName": "Jordan",
  "hubName": "My Day",
  "timeZone": "Europe/London",
  "locale": "en-GB",
  "accent": "sage",
  "modules": ["briefing", "agenda", "newsletters"],
  "people": [{"id": "owner", "label": "Jordan", "role": "owner"}],
  "interests": ["design", "local arts"],
  "teams": [],
  "publications": [],
  "sourceAccounts": [],
  "quietHours": [{"start": "20:30", "end": "07:00"}],
  "notifications": {"mode": "meaningful_changes", "destinations": []},
  "authorization": {"sourceReads": [], "outboundActions": [], "homeControls": []},
  "deployment": {"mode": "demo", "privateStorage": null, "host": null}
}
```

This is a fictional planning example, not permission to connect Jordan's accounts. Personalize can apply the name, title, accent, and sections; the date and example events remain in the fixture's original time zone until a new snapshot is built. To localize the entire UI, implement translated labels and locale-aware formatting; changing `locale` in this planning JSON alone does neither.

## Make unresolved choices explicit

| Decision | A useful starting choice | Change it when |
| --- | --- | --- |
| First source | One calendar or one selected mailbox label, read-only | Another available source solves the user's highest-priority problem |
| First destination | Retained private chat/project artifact | A dashboard or cross-device access is a chosen requirement |
| Local storage | Private owner-only files for one writer | Multiple writers/users require a transactional store |
| Hosting | None while exploring | The owner wants access beyond that local environment |
| External actions | Disabled | The owner selects an exact action and authorization scope |
| Notifications | Meaningful changes in the originating task | A specific email or other destination is chosen |
| Scheduling | None until one manual source result works | Source scope, destination, and cadence have been agreed |
| Quiet hours | Ask for the owner's active hours | The source genuinely needs overnight operation and the owner chooses it |
| Retention | Keep only the data needed for the selected function; choose a period before real collection | Operational history or applicable workspace requirements require another period |

These are starter recommendations, not live settings. Keep work and personal sources in separate copies/projects if they should have different audiences or rules. A public fork is still public: use a private repository or a private local copy for your connected version. Do not assume you can make a public fork private later. Decide the storage and repository visibility before adding real data.

## What a connected build must decide

The assistant should produce one short deployment decision: runtime location; collector execution surface; source-access method; private storage location; authentication and allowed viewers; refresh mechanism; backup/restore method; retention; and operator. It should name any cost or administrator approval that is actually required. Do not select a cloud vendor merely because the template mentions hosting.

For one owner on one machine, a supported local connector plus private files may be enough. For multiple viewers or concurrent workers, choose authenticated hosting and a transactional datastore after checking the available services and budget. There is no universal one-click backend in this release. If the environment cannot support the selected source, deliver the highest completed stage and name the missing dependency precisely.

Saving or exporting display preferences preserves the order of still-selected modules. Newly selected sections append in the catalog’s stable order. The demo has no drag-to-reorder control; edit the `modules` array in an exported display-preferences JSON file and import it when you want a different navigation order. Briefing remains required.

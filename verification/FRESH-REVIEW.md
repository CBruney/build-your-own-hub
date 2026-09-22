# Fresh-reader review and answers

This record explains how the shared guide was checked for someone arriving without the creator's conversation. The review covers a reusable, fictional starter and instructions for an owner-specific connected build. It does not certify a recipient's accounts, production security, or future scheduled execution.

Each round used a separate reviewer with no prior conversation or earlier findings. The reviewer read the shared context first, then could inspect companion files. Findings were answered in the source documents and, where needed, code; the combined context was regenerated before the next review. The original published 1.0.0 edition remains unchanged. The revised edition is 1.1.0.

## Round 1 — original public shared context

The reviewer read the public 1.0.0 context and checked access to its companion links. Fourteen substantive groups of questions remained. The answers below are now part of the shared context.

| Missing information or question | Answer supplied | Where to find it |
| --- | --- | --- |
| How does a read become data visible in the Hub? | Complete fictional calendar input → normalization → validation → immutable save → exact readback → UI import; separate steps for a persistent real reader | [Data contract and worked example](../docs/09-data-contract-and-worked-example.md), `examples/calendar-adapter.mjs` |
| How can stage 2 publish before stage 3 adds storage? | Choose a minimal private file/artifact before the first real read; stage 3 adds permanent storage and an automatically loading UI | [Build stages](../docs/06-build-and-acceptance.md), starting prompt and integration guide |
| What exact JSON and recipe output should a builder produce? | Required/optional fields, enums, limits, dates, checked-empty/unavailable samples, and per-recipe output mapping | [Data contract](../docs/09-data-contract-and-worked-example.md) |
| What makes a read complete, and how are partial fields retained? | Declared query/window and pagination rules; whole-record replacement; explicit field provenance; no deletion inference from partial absence | [Coverage and merge](../docs/09-data-contract-and-worked-example.md) |
| Which preferences are authoritative and actually loaded? | Full build profile versus display-only export; precedence, types, consumer, and limitations | [Preferences](../docs/08-preferences-and-decisions.md) |
| How do fictional records become real records safely? | Create a separate real snapshot, remove demo records, namespace IDs, replace the private loader, remove demo fallback, verify reload and access rejection | [First real-source transition](../docs/09-data-contract-and-worked-example.md) |
| What storage and hosting must be chosen? | Separate guided, local, and private connected routes; identify writer/reader and minimum destination before implementation | [First use](../docs/00-start-here.md), [decisions](../docs/08-preferences-and-decisions.md), [operations](../docs/10-install-operate-and-recover.md) |
| Do overlapping recipes duplicate source readers? | One owner per declared account/coverage scope; derived jobs reuse accepted versions or request the owner to refresh | [Source ownership](../docs/10-install-operate-and-recover.md), every recipe and shared contract |
| Where does state live across runs, and who dispatches work? | Inventory of durable records, concrete accessible references, local/web constraints, and explicit coordinator prerequisites | [Private state and installation](../docs/10-install-operate-and-recover.md), example configuration |
| Must a no-op or audit pretend to publish a source snapshot? | Outcome-specific receipt and readback rules; gate, dispatch, audit, source, and delivery evidence remain separate | [Receipt outcomes](../docs/10-install-operate-and-recover.md), revised shared contract |
| Which recipe-specific inputs must the recipient supply? | A setup table for all sixteen recipes; every recipe points to it before scheduling | [Per-recipe setup questions](../docs/10-install-operate-and-recover.md) |
| How do tasks and decisions persist without being overwritten? | Separate revision-aware owner state, open/completed/canceled lifecycle, explicit reopening, Hide remains presentation | [Durable decisions](../docs/10-install-operate-and-recover.md) |
| What happens after a held or uncertain delivery attempt? | Inspect the actual claim and exact provider evidence; retain uncertainty, preserve claims, never automatically resend | [Delivery inspection and recovery](../docs/10-install-operate-and-recover.md) |
| How should a recipient update and maintain a personalized copy? | Source/generated file map, reset/export limits, backup and rollback boundaries, tagged versus moving links, private-copy upgrade procedure | [Maintenance and common questions](../docs/11-maintenance-and-common-questions.md) |

Implementation checks while answering these questions found and corrected retained-item timestamp drift after a partial refresh. They also added explicit all-day dates and stricter timestamp validation. A new reader can now reproduce the supplied data path without account access.

## Round 2 — expanded guide and companion implementation

The fresh reviewer read the complete revised context and implementation, ran the then-current 28 tests, and found three remaining inconsistencies. The reviewer distinguished personal setup choices from missing instructions and did not require an invented universal backend.

| Question or mismatch | Correction | Regression evidence |
| --- | --- | --- |
| Why does a newly selected disconnected source vanish after merging? | Add new `not_connected` records; keep an existing source unchanged until an explicit settings operation | New-source and existing-source preservation test |
| Why can Friday appear before Wednesday in the agenda? | Sort by local start date, all-day first, then actual timed start; put undated entries last and exclude them from the next-event highlight | Unordered merged-calendar test; documented convention |
| Why does saving a name or exporting reset imported section order? | Preserve the order of still-selected modules; append newly selected sections in stable catalog order | Preference-order regression test for save/export transformation |

These corrections are in `src/core/model.mjs`, `src/app.mjs`, and the preferences/data chapters. The shared context includes the updated instructions.

## Round 3 — fresh final consistency review

The third reviewer read the complete shared context, all twelve chapters, all sixteen recipes, configuration, and the companion UI, model, delivery guard, server, build scripts, and tests. All 31 local tests passed. The reviewer reported **no further material gaps within the documented starter scope**.

The review confirmed that a new recipient can obtain the files, select a scope, distinguish the two preference formats, understand the data path, assign collection ownership, configure a recipe, and follow the recovery and maintenance rules. It explicitly distinguished recipient choices and disclosed future implementation work from missing context. It did not read prior review findings, private state, memories, or the creator’s conversation.

The review loop stopped after three independent rounds: 14 question groups in round 1, 3 implementation inconsistencies in round 2, and no new material findings in round 3. This is a bounded editorial and code-consistency conclusion, not a guarantee that no future user could ask another question. Publication availability and downloadable bytes are checked separately in the release process.

## Remaining owner choices

No reusable starter can select another person's accounts, priorities, time zone, budget, privacy requirements, hosting, or permissions. Those are explicit inputs, with questions and acceptance steps in the guide. A documented dependency is not a claim that the recipient already has it. The release checks identify the evidence actually obtained for this starter.

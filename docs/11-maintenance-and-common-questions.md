# 11. Maintain your copy and understand its limits

## What to edit, and what gets regenerated

| Change | Edit this source | Then run |
| --- | --- | --- |
| Copy, screens, interactions | `src/app.mjs` | Tests, build, verification, browser checks |
| Colors, type, spacing, breakpoints | `src/styles.css` | Build, verification, visual and keyboard checks |
| Fictional demonstration content | `fixtures/demo.json` | Tests, build, verification |
| Data validation, merge, dates, freshness | `src/core/model.mjs` | Add a meaningful regression case; tests, build, verification |
| Recipe instructions or example cadence | `automations/prompts/` and `automations/catalog.json` | Build and verification; separately update any installed task |
| Guide text | `README.md`, `START-PROMPT.md`, `AGENTS.md`, or `docs/*.md` | Build and verification |
| PDF wording | `scripts/build-guide.py` | PDF generator; render and inspect every page |
| Screenshots | Capture the running fictional app into `docs/screenshots/` | Inspect images; rebuild the PDF if its images changed |

`preview.html`, `index.html`, and `SHARED-CONTEXT.md` are generated. Direct edits to them will disappear on the next build. `npm run build` does not regenerate screenshots or the PDF. The optional PDF build needs Python, ReportLab, and Pillow; the app and ordinary checks do not. Install those only in an environment you choose for PDF authoring.

Run these commands from the folder containing `package.json`, one at a time:

```sh
npm test
npm run build
npm run verify
npm run example:adapter
```

The last command writes a new fictional snapshot under ignored `private/adapter-example/` and prints its filename and readback digest. It does not start a schedule or connect an account. Keep it out of your public release. The verifier checks distributable files and recognizable private-data patterns; it is not a guarantee that arbitrary content is safe to publish. Review every file in the final archive.

## Local state, reset, and backup

The demo stores preferences, hidden-card choices, interest feedback, meeting-note text, and resolved flags in browser local storage. Storage belongs to that browser profile and origin. `localhost`, `127.0.0.1`, another port, the public website, and an offline file can each have separate state. Private browsing, browser cleanup, or blocked storage can remove or prevent it. There is no account sync or backup service.

Export preferences before changing browser or origin. That export contains display settings only. Copy any meeting notes you want to retain separately; they are not in that export. Snapshot imports are in memory and clear on reload. A file saved by the example adapter remains on disk until you remove it.

Restore a hidden item by expanding “Hidden from this Hub” on Briefing or a collection page and choosing its Restore button. Spoiler reveals reset when their detail dialog is rebuilt; they are not persisted. For a complete demo reset, use your browser’s site-data controls for only the demo’s exact origin after saving any notes you need. This removes that origin’s demo state. Do not clear unrelated sites or the entire browser profile. A reset never modifies a source account.

For a connected version, implement and test backup and restore of the private store before relying on it. Retain delivery claims and receipts during restore; rolling application code back must not make a past send eligible again. Chapter 10 describes the recovery sequence. Choose retention periods based on your own needs; this kit does not set one silently or implement automatic deletion.

## Upgrade without publishing your private version

The public repository is a reusable starter. Your connected copy contains your choices and should be private. Download a tagged release into a separate folder, compare its changelog and files with your copy, then deliberately apply the changes you want. Do not replace your profile, source inventory, operational state, or delivery history with example files.

Use a private repository or private folder for personal modifications. A public fork remains a public sharing surface; never put real profiles or records there. The `.gitignore` provides useful exclusions, but ignored files can still be copied manually or forced into Git. Review the exact staged files and the final ZIP. Make release archives from an explicit list or a reviewed Git commit, not from the whole working folder.

The `main` branch and `releases/latest` links move as the starter improves. A tag such as `v1.1.0` identifies a particular edition. Record the edition used in your personal brief. An older emailed link pinned to `v1.0.0` continues to show that older edition; it does not silently change. For an assistant to use an updated attachment, replace the old attachment or clearly identify the new authoritative one and verify the assistant read it.

Changing a recipe file does not change an already installed task. Review the task’s saved prompt, state references, schedule, permissions, and pause state separately. Preserve its identity and history when updating it. Run a manual acceptance check, then collect new scheduled evidence for any materially changed path.

## Questions a first-time reader may have

**Is “ChatGPT Work” a required subscription or a separate backend?** No subscription is included. This guide uses the name for the work surface in which you choose to read, build, or schedule. Product naming, account access, and enterprise controls vary. Inventory your actual tools first. Ordinary Markdown and the local demo remain usable independently of an OpenAI connection.

**Does reading the link install anything?** No. It gives an assistant context. Code execution, account connections, hosting, and schedules are separate actions in the environment you choose. All catalog recipes start disabled.

**Can I put my real snapshot in the public demo?** Use a private local or authenticated copy for real data. The public demonstration is for fictional files. The starter does not upload imports, but a public origin and its future code are not your private application boundary.

**Can I use a different design or omit family and sports?** Yes. Select the modules and appearance you want. “Family Meeting” can become a personal or team planning worksheet. The eight module identifiers in chapter 8 are the current code contract; a new type of module requires an implementation change.

**Does the Hub automatically answer messages or manage my home?** No. The demo prepares prompts and displays fictional records. Actual sends, calendar writes, purchases, and device operations each need an explicit action path and owner authorization in your version.

**How much will it cost?** There is no paid service dependency in the local demo. A connected implementation may use paid model access, hosting, storage, APIs, or scheduling. Ask the builder to identify each proposed paid dependency, its current price, usage limits, and an estimated monthly range before choosing it. Start with one useful schedule. An example cadence is not a cost recommendation.

**Which devices and operating systems are proven?** Release evidence records the actual browser checks. The app is responsive, but a narrow desktop viewport is not physical phone testing. The Node scripts use portable APIs; each recipient should run the tests in their chosen OS and browser. Phone access to a desktop server needs a separately secured hosting arrangement; the supplied loopback server is intentionally not a LAN service.

**Why is there no project license?** The creator requested a repository for friends without a project license file. The code is visible and the instructions support adaptation, but do not describe it as a permissively licensed package. Bundled fonts retain their own notices. Broader redistribution or organizational adoption may need a separate permission decision.

## Small glossary

| Term | Meaning here |
| --- | --- |
| Adapter / collector / reader | Code or an authorized task that reads a selected service and translates its output |
| Snapshot | A validated set of source states and display items at an assembly time |
| Coverage | Exactly which accounts, records, dates, and pages were checked |
| Source owner | The one job responsible for collecting a particular source scope |
| Derived recipe | A job that uses accepted observations to prepare a report or decision |
| Publication | Saving an accepted artifact at a particular private destination |
| Readback | Reading that exact saved artifact again and comparing its content |
| Run key | The durable identity of a scheduled slot or event occurrence |
| Delivery claim | A stored exclusive first-attempt record that prevents automatic duplicate sends |
| Quiet hours | The owner’s chosen period in which work or notifications are suppressed as configured |
| Fixture | Fictional, fixed input used for demonstrations and tests |
| Origin | A browser’s scheme, host, and port combination that separates stored site data |

When something is unclear, ask the builder to name the file, field, actor, destination, and proof of success. Those details should be recorded in your personal brief and acceptance notes so another person can maintain your Hub without this conversation.

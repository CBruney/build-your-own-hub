# Release checks — 1.1.0

The revised starter passed 31 local Node.js tests, including the fictional adapter’s immutable save/readback, all-day date handling, strict timestamps, retained observation provenance, disconnected-source preservation, calendar ordering, and preference ordering. The package build and verifier passed. The working example produced a verified two-item JSON artifact without reading an account.

The revised app was opened through the supported in-app browser on localhost. The saved adapter artifact imported successfully: its timed event and all-day event appeared with the original date and London time zone, and unrelated collections stayed empty. A 390-pixel viewport had a 390-pixel document width; the layout was inspected visually. Reload restored the original fictional demo, as documented. A separate preference import placed Sports before Look Ahead; changing the display name, saving, and reloading preserved that order. The final calendar screenshot confirms all-day entries appear first. A separate fictional test file exercised `connected` mode: the page showed Snapshot date, Snapshot agenda, no live connection, reload-clears-import, and current-clock stale health. This was a label test, not a real connection.

The six-page 1.1.0 PDF was regenerated, rendered, and inspected on every page. The existing nine fictional screenshots remain applicable to the unchanged demo views; a tenth screenshot shows the calendar adapter output. These are responsive desktop-browser checks, not physical-device or screen-reader certification.

See [the fresh-review record](FRESH-REVIEW.md) for the questions raised and their answers. Public CI and release-download results are recorded in the tagged release notes. The original 1.0.0 evidence below is preserved as historical evidence, not presented as a test of the changed code.

No live source, schedule, send, home action, or connected production backend is included or tested by this starter. The direct `file://` browser-policy limitation recorded below still applies to this release session; the standalone bundle is tested through permitted HTTP/HTTPS serving.

---

## Preserved baseline — 1.0.0

Prepared September 22, 2026. These checks describe the supplied starter. They do not certify anyone's future connected Hub.

## Automated checks

Run from the folder containing `package.json`:

```sh
npm test
npm run build
npm run verify
```

The 22 Node.js tests cover snapshot validation, time zones and calendar-day boundaries, freshness, partial-source retention, successful replacement, invalid URLs, preferences, hidden-item presentation, first-attempt delivery claims, ambiguous attempts, exact sent-content matching, and the development server's file and Host boundaries. They passed locally on Node.js 24.20.0. The repository workflow also runs the commands on Node.js 22 and 24; its result is recorded by GitHub Actions for each commit.

The release verifier checks all 16 recipes are disabled and have prompt files, validates the example profile and snapshot, checks required artifacts and local Markdown links, checks the offline build, and scans text for selected credential and personal-path patterns. A pattern scan is limited; the release also received a content review.

## Browser checks

The running application was checked in the Codex in-app browser:

| Behavior | Observed result |
| --- | --- |
| Navigation and detail dialogs | Correct page or item appeared; dialogs closed normally |
| Preference save and reload | Changed name, accent, and sections persisted; defaults then restored |
| Hide and restore | Card disappeared and returned; controls stated that the source was unchanged |
| Sports result | Hidden initially; appeared after explicit reveal |
| Meeting decision | Written outcome and resolved state survived reload |
| Interest feedback | Like and undo changed the local state independently of hiding |
| Plan an idea | Prepared a prompt; no assistant task or external action was executed |
| Snapshot import | Example JSON loaded with an import notice; original example could be restored |
| Source coverage | Partial source and literal observation/freshness times remained visible |
| Phone, tablet, desktop | No document-wide horizontal overflow at 390, 900, 1280, and 1440 CSS pixels |
| Briefing newsletter tile | Today's two editions appeared; Monday's retained edition remained in Newsletters |

Nine screenshots were captured from the fictional demo and reviewed for layout, legibility, and private content. See the [screenshot tour](../docs/screenshots/README.md).

The six-page PDF guide was rendered and visually reviewed on every page. The standalone HTML was checked for embedded code, fonts, and fixtures. Direct `file://` opening was blocked by the browser's URL policy, so direct local-file execution was not browser-verified in this release session.

## Publication review

The public package was assembled separately from the personal Hub. It contains fictional fixtures, generic configuration, documentation, source code, fonts with their notices, and release artifacts. It does not contain the creator's account access, private source snapshots, scheduler identifiers, private deployment settings, or original screenshots.

There is no project license file. Third-party font licenses remain with their assets. GitHub confirmed that [the repository](https://github.com/CBruney/build-your-own-hub) is public. The first published source commit passed [both Node.js CI jobs](https://github.com/CBruney/build-your-own-hub/actions/runs/35738196593) and [GitHub Pages deployment](https://github.com/CBruney/build-your-own-hub/actions/runs/35738249168). The [public demonstration](https://cbruney.github.io/build-your-own-hub/) was opened in the browser and its fictional briefing read back. The generated standalone bundle ran on that HTTPS page; direct local-file execution remains subject to the separate limit above.

The release notes record final distribution checks. A successful local build or CI run alone does not prove that a release download is accessible or intact.

## Limits

No recipient's account connection, scheduler, live send, shared-list write, home control, private hosting, backup recovery, or production security has been tested by this release. The delivery guard is a reusable single-host component, not an email integration or a guarantee of exactly-once delivery. A real integration must implement the rest of the contract and verify the destination.

Browser checks used responsive viewports, not physical phones or tablets. Keyboard focus, labels, and native dialogs are provided, but a full assistive-technology audit and cross-browser matrix remain work for a production build. Local browser notes are not a durable shared database.

# 6. Build it in useful stages

## Stage 1: Make it yours

Run the original fictional demo before changing it. Set the display name, accent, and section choices. Use the onboarding questions to produce a profile and a short personal brief. Keep choices separate from code. Verify phone and desktop navigation, detail dialogs, Hide/Restore, spoiler reveal, and preference reload.

The first finished result is a personalized demonstration. It must still say it uses example data. Do not label connections active just because their cards are visible.

## Stage 2: Add one read-only source

Select the source with the clearest benefit and available access, usually one calendar or mailbox. Follow the adapter steps in chapter 4. Preserve the original source timestamp, show coverage, and click through to the actual record. Test success, empty response, partial response, expired authorization, and malformed data.

If working only in ChatGPT Work on the web, the first source output can be a retained briefing or structured file. A separately hosted dashboard is optional. Do not promise access to a local folder from a web task.

## Stage 3: Add private persistence

Choose durable storage and authentication appropriate to the owner's environment. Keep secrets in the runtime's secret store and use scoped credentials. Implement revision-aware preferences and immutable reports. Verify cross-device readback only if that behavior is part of the build. A browser-storage demo does not establish shared persistence.

## Stage 4: Schedule one useful update

Define exactly one owner for the source, then create the chosen schedule with its source scope, time zone, quiet hours, and failure behavior. Inspect a manual run first. Observe distinct scheduled arrivals, actual reads, accepted publications, and readbacks separately. Keep the source marked provisionally connected until scheduled evidence exists.

## Stage 5: Expand with evidence

Add the next module and source, preserving the existing data and history. Introduce external sends or other mutations only after the owner chooses recipients, content scope, and authorization. Test duplicates and ambiguous outcomes without sending real test messages unless that test is explicitly authorized. Add Home and device-based integrations last if they are desired.

## Acceptance checklist

| Layer | Evidence to retain | What it does not prove |
| --- | --- | --- |
| Unit checks | Passing model, merge, and delivery-guard tests | Live source access |
| Local application | Actual browser interactions and reload | Hosting or cross-device state |
| Source connection | Fresh read with account and source coverage | Scheduled execution |
| Publication | Accepted object ID/version/hash | Visible content is correct |
| Readback | Exact returned object and visible UI | Future unattended reliability |
| Scheduled execution | Three distinct eligible runs with complete receipts | Permanent reliability |
| Email | Exact Sent content and recipient | Recipient opened or read it |
| Shared artifact | Permission readback; public starter readable, private Hub rejects unauthorized users | Every colleague's enterprise connector can fetch it |

For visual acceptance, check approximately 1440-pixel desktop, 900-pixel tablet, and 390-pixel phone widths. Use keyboard navigation, open and close dialogs, and inspect long titles and empty lists. Verify no document-level sideways overflow. Test source-link schemes, HTML-like text in source fields, and invalid imported JSON.

For privacy acceptance, sign out of the connected production app and verify its data endpoints reject access. Use a second account to test owner isolation. Inspect built assets for bundled private data and secrets. If offline support exists, test sign-out cache removal and absence of queued actions.

## Release workflow

Keep code and documentation in the recipient's own repository if they want version control. Record the version, changes, source assumptions, known limits, and test evidence. Build a fresh ZIP from an allowlist of distributable files. Do not copy a whole personal working folder, history directory, browser profile, or installed runtime.

The starter's `npm run build` creates the portable preview and combined context; `npm run verify` checks local package references and privacy patterns. These scripts are inspected code within the kit. Running them does not activate integrations or install background jobs.

## Troubleshooting

**The shared link opens, but ChatGPT cannot read it.** Download `SHARED-CONTEXT.md` and attach it directly. For implementation, extract the ZIP and add that folder to a local Codex project. Ask the assistant to name the files it read before continuing.

**Node is unavailable.** Open `preview.html` to explore. Use ChatGPT to review the Markdown guide. Install an appropriate supported Node runtime only if you want to run the modular source and tests; no account key is required.

**The local port is in use.** Start with `PORT=4174 npm start` in a shell that supports that syntax, or set the `PORT` environment variable using your shell's equivalent. Do not terminate unrelated processes.

**Preferences do not survive reload.** Browser storage may be unavailable or blocked. The app must report this rather than say Saved. Export demo preferences to keep the name, appearance, and selected sections; maintain the full integration profile separately. Meeting notes stay in the original browser, and snapshot imports clear on reload.

**A source looks empty after an error.** Check coverage state before removing records. Restore last verified data with its old timestamp. An unavailable source cannot establish deletion.

**An email result is unknown.** Inspect the exact attempt and Sent state. Do not send again from another tool or account.

**A browser policy check fails.** Retain the exact failing layer. Follow only the documented bounded recovery for that route. Do not disable the check or switch routes to access a denied target.

# 2. Design and format

## The visual language

Preserve the feeling of a useful daily briefing: warm ivory space, strong navy text, quiet rules, restrained color, and readable rows. Keep the top of the page focused on the date, agenda, and decisions. Avoid a wall of metrics or a generated summary that repeats everything below it.

| Token | Starting value | Role |
| --- | --- | --- |
| Paper | `#fbfaf6` | Main background |
| Navy | `#102b4d` | Main text and primary controls |
| Navy soft | `#3f526b` | Supporting text |
| Muted | `#657078` | Secondary metadata |
| Line | `#d8d6cc` | Section rules and borders |
| Line soft | `#e8e5dc` | Row dividers |
| Gold | `#b57d15` | Accent and active marker |
| Gold deep | `#805207` | Readable gold text |
| Sage | `#426a4e` | Positive or interest state |
| Sage soft | `#e6eee7` | Light supporting surfaces |

Cormorant Garamond supplies the editorial headings; Manrope supplies body text and controls. Licensed font files are bundled so the demo makes no font-network requests. Use a serif and system-sans fallback if replacing the fonts. Palette alternatives are choices, not promises of accessibility; recheck contrast when changing colors.

## Page structure

At wide desktop sizes use a persistent left navigation rail of about 242 pixels, a generous but bounded main column, and a contextual right column when it helps. Use 48-68 pixel display type for the primary greeting, approximately 28-36 pixels for section titles, and readable body text. The starter increases small production metadata sizes to make the shared demo easier to read.

On a tablet, reduce the navigation footprint and stack crowded content. On a phone, use a bottom navigation strip with visible labels, large touch targets, and space above it for the composer. Allow the navigation itself to scroll when necessary; do not let the whole document overflow sideways. Preserve event details instead of squeezing seven dense calendar columns onto a small screen.

The starter uses 44-pixel minimum primary targets, native dialog focus behavior, visible keyboard focus, a skip link, reduced-motion support, and live status feedback. Test keyboard access and screen-reader names after any new interaction. Color must never be the only way to identify a status or person.

## Card anatomy

A useful card has a specific title, enough context to decide what to do, a meaningful date or status, an exact source when available, and one clear primary action. Secondary controls should not compete with the title.

Needs You uses an action verb: “Choose a pickup time,” “Reply about Friday,” or “Reconnect calendar access.” A package in transit, a newsletter, and a normal event are informational until there is an actual owner action. Show why the action is needed and who must take it. A failed background check should explain its effect in plain language; technical logs belong in details.

## Interaction contracts

- **Hide from Hub:** reversible presentation only. It never archives, deletes, marks read, replies, or changes the source. Restore works on the same stable item ID.
- **Like / Not for me:** explicit preference feedback, separate from Hide. Undo removes the feedback event.
- **Plan this:** in a connected build, creates one tracked planning task with a stable ID. In the starter, prepares a prompt and labels it as a draft.
- **Saved:** appears only after storage accepts the write. If storage fails, retain the unsaved text in the form and say so.
- **Refresh:** in a connected build, requests one deduplicated collection. It does not reset a timestamp while waiting. The starter's reload control only reloads its example snapshot and is labeled accordingly.
- **Open source:** opens the exact source record. Do not substitute a homepage or search result for a verified edition, event, or package.
- **Result reveal:** subjects, cards, previews, and collapsed sports reports remain spoiler-free. Put outcomes below “Match details and result below.”

## Empty, stale, and partial states

“No events found in the calendars checked” is different from “No events.” “No new edition” is different from “Could not check the publication.” Keep the last useful verified item during an outage, label the actual check time, and disclose which source is missing. Do not turn a successful app load into a claim that its data is current.

When all required sources were checked and nothing needs action, use a calm empty state. When only one channel is unavailable, keep the other channels usable. Dates must identify the user's time zone where ambiguity matters. Preserve literal source dates when an exact timestamp cannot be established.

## Format recipes

**Daily briefing:** date; immediate decisions; agenda; selected messages; interest highlights; source limitations. Keep source links next to their claims.

**Event briefing:** verified occurrence and local start time; viewing/listening availability; what to watch for; source-backed analysis; uncertainty. After an event, keep the result behind the reveal boundary.

**Family meeting:** first week; following week; decisions with context and a written outcome; owner and follow-up date. In a production print version, every weekday must remain represented and all printed pages must be inspected before calling the packet ready.

**Failure notice:** what could not be completed; what remains usable; the precise next step; the responsible person. Do not repeatedly surface the same notice as a new incident.

# Build Your Own Hub

A personal dashboard and automation starter, adapted from Craig's Hub.

**Start with your choices.** Keep the parts that help you, replace the parts that do not, and connect only your own accounts. You can use this kit with ChatGPT Work or Codex. The included application runs locally with fictional data and requires no API key, account, paid service, or package installation.

[Shared context](SHARED-CONTEXT.md) · [Starting prompt](START-PROMPT.md) · [Visual guide (PDF)](output/pdf/Build-Your-Own-Hub-Guide.pdf) · [Screenshot tour](docs/screenshots/README.md)

![The fictional Hub briefing on desktop](docs/screenshots/briefing-desktop.png)

## Three ways to start

1. **Have ChatGPT guide you.** Add `SHARED-CONTEXT.md` to your own project or chat and paste `START-PROMPT.md`. Ask it to confirm which files it actually read. A link alone may not make the linked files available; download and attach the Markdown file if necessary.
2. **Try the design.** Download and extract the release ZIP, then open `preview.html` in a browser that permits local HTML files. This is a self-contained interactive demo. Use Personalize to change the name, accent, and sections. Changes stay in that browser; Export preferences downloads a portable file. If your environment blocks local files, use the public demo or the local server below.
3. **Build from the code.** Extract the ZIP into your own folder. Open a terminal in the extracted folder containing `package.json`. With Node.js 22 or later installed, run `npm test`, then `npm start`, and open `http://127.0.0.1:4173`. No `npm install` is required. Stop the server with Ctrl+C.

## What is included

| File or folder | Use |
| --- | --- |
| `START-PROMPT.md` | The first prompt to give ChatGPT or Codex |
| `SHARED-CONTEXT.md` | The complete portable guide, assembled from the documents and automation prompts |
| `docs/` | Product behavior, design, architecture, integration, operation, and build instructions |
| `config/profile.example.json` | Your choices, separate from the implementation |
| `automations/catalog.json` | Selectable recipes; all disabled until configured |
| `automations/prompts/` | Complete reusable instructions for the recipes |
| `src/` | The responsive application and reusable validation/reliability functions |
| `fixtures/demo.json` | Fictional source observations, with a fixed example date |
| `tests/` | Tests for privacy boundaries, freshness, partial reads, and duplicate delivery handling |
| `preview.html` | An offline, single-file version of the application |
| `verification/` | Release checks and their limits |
| `THIRD-PARTY-NOTICES.md` | Attribution and licenses for the included fonts |

## Read in the order you need

| Your question | Guide |
| --- | --- |
| What should my Hub do? | [Product behavior and choices](docs/01-product-and-choices.md) |
| How do I keep or change the look? | [Design system](docs/02-design-system.md) |
| How do the pieces fit together? | [Architecture and data contracts](docs/03-architecture.md) |
| How do I connect my own services? | [Integrations and platform capabilities](docs/04-integrations-and-platforms.md) |
| How should scheduled work behave? | [Automation and reliability](docs/05-automations-and-reliability.md) |
| How do I build and check my version? | [Build sequence and acceptance](docs/06-build-and-acceptance.md) |
| What is safe to share? | [Sharing and provenance](docs/07-sharing-and-provenance.md) |

## What works now

The demo includes Briefing, Agenda, Needs You, Messages, Deliveries, Newsletters, Sports, Opportunity Radar, Family Meeting, Connections, and Personalize. Navigation, detail dialogs, source inspection, reversible hiding, interest feedback, spoiler reveal, meeting notes, preference export/import, and snapshot import work locally. The code includes a validator for supported snapshot fields, merge rules, freshness calculation, and a durable first-attempt delivery guard that can be integrated into a future server.

**Connecting real services is a separate build stage.** The kit does not sign in to any account, send email, control a home, install schedules, or provide a hosted private backend. Importing a JSON snapshot does not create a live connection. The composer prepares a prompt to copy into your own ChatGPT; it does not pretend to execute an assistant task. The guide explains how to add these capabilities and what to verify before calling them ready.

## Share it

Share this original starter and its fictional examples. Keep your own connected copy private. Before forwarding a customized copy, remove personal profiles, source snapshots, notes, history, credentials, and screenshots that reveal real information. The recipient supplies their own authorization; the kit does not transfer anyone else's account access or approvals.

No project license file is included, as requested by the creator. The bundled fonts retain their own license notices. See [contribution guidance](CONTRIBUTING.md) before sending changes or issues.

Version 1.0.0. Prepared September 22, 2026. This is a personal project starter, not an official OpenAI product or supported integration bundle.

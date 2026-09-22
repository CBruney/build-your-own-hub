# 1. What you are building

A Hub is a private place to understand the day, notice what needs a decision, and act on selected information from the services you already use. The dashboard gives information a stable home. Automations keep chosen sections current. The assistant helps interpret information and carry out work within your authorization.

The starting design comes from Craig's Hub: a briefing-first interface with warm paper colors, navy type, serif headings, compact information rows, and optional household and interest modules. This kit carries forward the design and operating rules. It uses new fictional examples and a smaller portable implementation so a recipient can run it without the original household's systems.

## Decide what would be useful

Begin with three outcomes, such as “show my day without opening four calendars,” “surface messages that need an answer,” and “find a few activities that fit the weekend.” Outcomes make it easier to decide which sections earn space.

| Module | What the user sees | What makes it trustworthy |
| --- | --- | --- |
| Briefing | Today's agenda, specific decisions, selected items | Each section retains its own source status |
| Agenda / Look Ahead | Today, tomorrow or weekend, and upcoming days | Actual event dates, people, locations, and source links |
| Needs You | A short queue of actions only the owner can take | A concrete next action, reason, owner, and relevant deadline |
| Messages | Selected conversations across connected channels | Real sender identity, literal unread state, per-channel coverage |
| Deliveries | Identifiable packages and current delivery state | Source-verified product, carrier, scan time, and exact package link |
| Newsletters | Exact editions from selected publications | Publication time is separate from the time the source was checked |
| Sports / interests | Selected events, briefings, or analysis | Official occurrence links, local date logic, spoiler controls |
| Opportunity Radar | A small set of relevant things to do | Availability and timing checked against primary sources |
| Family Meeting | Two-week planning and written decisions | A shared source of topics and durable, attributable outcomes |
| Home | Optional device status and narrow controls | Live state readback and individual action authorization |
| Source health | What's connected, stale, partial, or blocked | Evidence for each source, not a single reassuring green badge |

Home controls and full two-week calendar printing are extension specifications in this release. The runnable demo illustrates the other modules; it is not a copy of every production feature.

## Personalization interview

Round one should establish the three desired outcomes, selected modules, time zone, and intended environment. Round two covers the people and accounts that belong in the Hub, source priorities, notification destination, and privacy boundaries. Round three covers interests, density, colors, quiet hours, and which actions may run unattended.

Do not ask for passwords or a complete personal dossier. Explain why a detail is needed. A single-person work Hub need not have children, sports, a smart home, or a family calendar. A household Hub need not ingest confidential work material. Keep work and household sources separate when the user wants that boundary.

## Preferences that should remain easy to change

Record the display name, time zone, locale, enabled modules, section order, people, interest categories, selected teams or publications, and notification choices. Distinguish explicit likes and dislikes from a one-time dismissal. Keep each feedback event reversible. Do not infer attendance or enjoyment from planning an outing.

The included `config/profile.example.json` is the portable starting shape. The Personalize screen implements the small subset needed to explore the demo: name, accent, and section selection. Additional fields guide the next implementation stage. Do not imply that changing a schedule in a JSON file installs a scheduled task.

## Three sensible scopes

**A guided workspace** uses ChatGPT, connected sources, and recurring briefings without a custom website. It is a valid finished outcome if that solves the user's needs.

**A local personal Hub** adds this interface and a local source pipeline. The computer, app, and required connections must be available for local jobs. Device-specific sources may make this the best first connected version.

**A private hosted Hub** adds authentication, durable storage, access control, and a supported way for source collectors to publish. It lets authorized users view the Hub from other devices. A public static site containing private snapshots is not an acceptable substitute.

Start with the smallest useful scope. Add a second source only after the first source can be collected, published, and read back correctly.

# 0. Start here: from this file to your own Hub

You do not need to know Craig, read his conversations, or use his services. This kit explains a pattern: put the useful parts of your day on one page, keep their sources visible, and automate only the work you choose. The original public example is fictional. Your finished version can be a briefing inside ChatGPT, a dashboard on your computer, or a private website.

## Choose your first result

| What you want now | Use this route | What counts as finished |
| --- | --- | --- |
| Understand the idea | Open the public demo and screenshot tour | You can name the sections and behaviors you want |
| Have an assistant help you choose | Attach this shared context and paste the starting prompt below | A personal brief, a profile, and a concrete next step; no website required |
| Change the runnable interface | Download and extract the full kit into your own local folder | A fictional preview with your name, style, and chosen sections, tested after reload |
| Bring in one real source | Follow chapters 4, 6, and 9 in your own private environment | An authorized read, validated output, retained artifact, and explicit coverage |
| Use a connected Hub every day | Add private persistence and a verified schedule after the first source works | The chosen destination updates and scheduled evidence is recorded |

If unsure, choose the guided route first. No personal account connection, API key, GitHub account, or package installation is needed to read this kit or try its public demonstration. An account with the capabilities you choose is needed to work with an assistant. Paid services are not required by the demo; a future assistant plan, API, data provider, or hosting service may have its own costs. Choose a budget before adding one. The starter itself does not call an AI API.

## Get the right files

- **Current handoff:** [SHARED-CONTEXT.md on the main branch](https://github.com/CBruney/build-your-own-hub/blob/main/SHARED-CONTEXT.md). This changes when the starter is improved.
- **Complete download:** [latest release](https://github.com/CBruney/build-your-own-hub/releases/latest). Download the named `build-your-own-hub-v…zip` asset, then extract it. The folder containing `package.json` is the project root. The automatically generated GitHub source ZIP also contains the repository files; its outer folder name can differ.
- **Only using ChatGPT:** download the release's `SHARED-CONTEXT.md` and `START-PROMPT.md` assets. The context includes the starting prompt, so one attachment is enough for planning.
- **Visual reference:** [live fictional demo](https://cbruney.github.io/build-your-own-hub/) and [screenshot tour](https://github.com/CBruney/build-your-own-hub/blob/main/docs/screenshots/README.md). For a particular version, use its release and the version printed at the top of the context.

On a GitHub file page, use its download/raw-file control; save the actual `.md` file, not the surrounding GitHub HTML page. If downloads or GitHub are unavailable in your workspace, ask the person who shared the kit for those same files. Do not bypass an organization restriction. File links are navigation, not proof that an assistant has read their contents.

## Start with ChatGPT Work on the web

1. Choose the account/workspace permitted to hold the material you will use. Start with the fictional kit; decide separately whether any future work or household data belongs there.
2. Create or open a project for your Hub. Add `SHARED-CONTEXT.md` to its Sources, or attach it directly to a new chat for a one-time trial. Start the chat within that project if you want its shared context.
3. Paste the complete starting prompt included next in this document. Say whether you want guidance, a fictional demo, or a connected build.
4. Ask the assistant to confirm the document title and version, identify your selected scope, and list which files and tools it actually accessed. If it cannot read the attachment, resolve that before implementation.
5. Answer its short preference interview. Save the resulting personal brief and profile in your private project. Ask it to perform the authorized work, not merely describe a plan.

A web chat can use uploaded files and available connected tools, but it does not directly work in a folder on your computer. If the session can create files, it may produce a downloadable app; if it cannot execute or preview it, that remains an untested artifact. Switch to an authorized local coding environment for local execution, or finish with a useful retained briefing if that is your chosen scope. Current product guidance: [Projects and chats](https://learn.chatgpt.com/docs/projects).

## Start with local code

1. Extract the release ZIP into a new folder you control. Do not put it inside the original creator's Hub or a directory that automatically publishes every file.
2. Add that extracted folder as a local project in your desktop coding app, or open it in your editor. Confirm that the assistant can see `package.json`, `README.md`, and `src/`. In the ChatGPT desktop app, project folder controls are under Edit project; select the extracted folder as the primary folder. In Codex CLI, start `codex` from the project folder. These are different ways to provide file access; none grants account access. [Official project instructions](https://learn.chatgpt.com/docs/projects).
3. If you only want to explore, open `preview.html` in a browser that allows local HTML. If that route is blocked, use the public fictional demo or the local server through your permitted environment; do not bypass a policy denial.
4. For source development, use an installed Node.js 22 or later. Run `node --version` and `npm --version`. If missing, use your organization's approved installation or the [official Node.js download](https://nodejs.org/en/download). No `npm install` is required for this starter.
5. Open a terminal in the folder containing `package.json` and run these commands one at a time:

```sh
npm test
npm run build
npm run verify
npm start
```

The last command stays running and prints `http://127.0.0.1:4173`. Open that exact address in a browser on the same computer. Stop the server with Ctrl+C. After editing source, reload the local page; rebuild before using `preview.html` or distributing the package. A phone cannot reach your computer through the phone's own `127.0.0.1` address. Use the public fictional demo on a phone; a private cross-device Hub requires separate hosting and authentication.

On macOS/Linux, an alternate port is `PORT=4174 npm start`. In PowerShell, run `$env:PORT = '4174'`, then `npm start`; in Command Prompt, run `set PORT=4174`, then `npm start`. Open the address printed for that port. If the terminal says it cannot find `package.json`, change into the extracted project root. Do not stop unrelated processes to free the default port.

## What you should see

The unmodified demo opens with “Good morning, Taylor,” a visibly fictional example date, an agenda, and three decisions. Personalize changes the name, accent, and section selection. Connections displays seven fictional source records, including a partial Messages example. The clock does not make the sample data current. There is no sign-in flow and no live refresh connection.

For a simple acceptance walk, change your display name in Personalize, save, reload, and confirm it persisted. Open a detail dialog, close it, hide and restore a decision, then inspect Connections. The full checks and tested limits are in the release's verification document. If storage is blocked, the app reports that saving failed; export display preferences instead.

## Your first brief

Ask your assistant to complete this before choosing services or schedules:

```text
My Hub name:
Three jobs it should make easier:
First result: guidance / fictional demo / one source / private daily Hub
Audience: me / named people with their own access
Time zone and preferred language/date format:
First sections; sections to omit:
Visual direction and preferred information density:
First source and exact permitted account/scope:
Where the result should live:
Actions allowed now: none by default
Quiet hours and desired notifications:
Budget or approved services, if any:
How we will know this stage worked:
```

Unknown answers are allowed. Record them as undecided; do not invent a preference. The profile and decision guide below explain which choices affect the demo now and which belong to later implementation.

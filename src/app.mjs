import {
  MODULES,
  validateSnapshot,
  sourceHealth,
  safeUrl,
  localDate,
  visibleItems,
  validatePreferences,
} from "./core/model.mjs";

const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const labels = {
  briefing: "Briefing",
  agenda: "Look Ahead",
  messages: "Messages",
  deliveries: "Deliveries",
  newsletters: "Newsletters",
  sports: "Sports",
  radar: "Opportunity Radar",
  meeting: "Family Meeting",
  connections: "Connections",
  personalize: "Personalize",
};
const symbols = {
  briefing: "☷",
  agenda: "▦",
  messages: "✉",
  deliveries: "□",
  newsletters: "▤",
  sports: "◉",
  radar: "◇",
  meeting: "◎",
  connections: "⤓",
  personalize: "⚙",
};
const storageKey = "build-your-own-hub-demo-v1";
const defaultPreferences = {
  displayName: "Taylor",
  hubName: "My Hub",
  accent: "gold",
  modules: [...MODULES],
};
let snapshot,
  page = "briefing",
  statusTimer,
  imported = false,
  persistenceWarning = "";
let state = {
  preferences: defaultPreferences,
  hidden: [],
  feedback: {},
  notes: {},
  resolved: [],
};
const app = document.querySelector("#app"),
  dialog = document.querySelector("#detail"),
  detail = document.querySelector("#dialog-content");
dialog.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  }
});

function announce(message) {
  clearTimeout(statusTimer);
  const el = document.querySelector("#status");
  el.textContent = message;
  el.classList.add("show");
  statusTimer = setTimeout(() => el.classList.remove("show"), 6500);
}
function save(next, message) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
    state = next;
    if (message) announce(message);
    return true;
  } catch {
    announce(
      "Not saved. Browser storage is unavailable. Your form is still here; export preferences if needed.",
    );
    return false;
  }
}
function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (stored) {
      const preferences = validatePreferences(stored.preferences);
      state = {
        preferences,
        hidden: Array.isArray(stored.hidden)
          ? stored.hidden.filter((x) => typeof x === "string")
          : [],
        feedback:
          stored.feedback && typeof stored.feedback === "object"
            ? stored.feedback
            : {},
        notes:
          stored.notes && typeof stored.notes === "object" ? stored.notes : {},
        resolved: Array.isArray(stored.resolved)
          ? stored.resolved.filter((x) => typeof x === "string")
          : [],
      };
    }
  } catch {
    persistenceWarning =
      "Saved settings could not be read. The original example is shown.";
  }
}
function all(module) {
  return snapshot.items.filter((i) => i.module === module);
}
function items(module) {
  return visibleItems(all(module), state.hidden);
}
function button(label, attrs = "", kind = "text-button") {
  return `<button class="${kind}" ${attrs}>${escape(label)}</button>`;
}
function row(item) {
  return `<button class="row-button" data-open="${escape(item.id)}"><strong>${escape(item.title)}</strong><small>${escape(item.meta || item.summary)}</small></button>`;
}
function heading(title, sub) {
  return `<div class="eyebrow">${snapshot.mode === "demo" ? "YOUR DAY, IN ONE PLACE" : "YOUR IMPORTED SNAPSHOT"}</div><h1>${escape(title)}</h1><p class="page-subtitle">${escape(sub)}</p>`;
}
function sourceNote() {
  return snapshot.mode === "demo"
    ? "Fictional demo · No accounts connected"
    : `Imported snapshot · No live connection${imported ? " · Reload clears import" : ""}`;
}
function agendaRow(item) {
  return `<button class="agenda-row" data-open="${escape(item.id)}"><time>${escape(item.timeLabel || "Time unavailable")}</time><span class="person">${escape(item.person || "")}</span><span><strong>${escape(item.title)}</strong><small>${escape(item.meta || "")}</small></span></button>`;
}
function needCard(item) {
  return `<article class="need"><div class="need-title">${escape(item.title)}</div><p>${escape(item.summary)}</p><small>${escape(item.meta || "")}</small><div class="actions">${button("Review →", `data-open="${escape(item.id)}"`)}${button("Hide", `data-hide="${escape(item.id)}"`, "text-button hide")}</div></article>`;
}
function hiddenControls() {
  const hidden = snapshot.items.filter((i) => state.hidden.includes(i.id));
  return hidden.length
    ? `<details class="hidden-items"><summary>Hidden from this Hub (${hidden.length})</summary><p class="help">Hiding changes this view only. It never changes a source.</p>${hidden.map((i) => button(`Restore: ${i.title}`, `data-restore="${escape(i.id)}"`, "secondary")).join("")}</details>`
    : "";
}
function showBriefing() {
  const today = localDate(snapshot.generatedAt, snapshot.timeZone);
  const feature = items("radar")[0];
  const tileItems = (module) =>
    module === "newsletters"
      ? items(module).filter(
          (i) =>
            i.publishedAt &&
            localDate(i.publishedAt, snapshot.timeZone) === today,
        )
      : items(module);
  const todayAgenda = items("agenda").filter(
    (i) => !i.startsAt || localDate(i.startsAt, snapshot.timeZone) === today,
  );
  const ahead = items("agenda").find(
    (i) => i.startsAt && localDate(i.startsAt, snapshot.timeZone) > today,
  );
  return `<div class="hero"><section><div class="eyebrow">${snapshot.mode === "demo" ? "EXAMPLE · " : ""}${escape(new Intl.DateTimeFormat("en-US", { timeZone: snapshot.timeZone, weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(snapshot.generatedAt)))}</div><h1>Good morning,<br>${escape(state.preferences.displayName)}.</h1><div class="heading-rule"></div><header class="section-title"><h2>Today’s agenda</h2><small>${escape(snapshot.timeZone.split("/").pop().replaceAll("_", " "))}</small></header>${todayAgenda.length ? todayAgenda.map(agendaRow).join("") : '<div class="empty">No events in this snapshot.</div>'}${ahead ? `<div class="ahead"><div class="ahead-label">Looking ahead</div><p>${escape(ahead.timeLabel || "")} · ${escape(ahead.title)} <span class="help">${escape(ahead.meta || "")}</span></p></div>` : ""}</section><section class="needs"><header class="section-title"><h2>Needs you</h2><small>Decisions, not notifications</small></header>${items("needs").length ? items("needs").map(needCard).join("") : '<p class="empty">Nothing here needs a decision.</p>'}${hiddenControls()}</section></div>${state.preferences.modules.includes("radar") && feature ? `<section class="feature"><div><div class="eyebrow">A little room for something good</div><h3>${escape(feature.title)}</h3><p>${escape(feature.summary)}</p></div>${button("Explore the idea →", 'data-page="radar"')}</section>` : ""}<div class="tiles">${[
    "messages",
    "deliveries",
    "newsletters",
    "sports",
  ]
    .filter((m) => state.preferences.modules.includes(m))
    .map(
      (m) =>
        `<section class="tile"><button class="tile-head" data-page="${m}">${escape(labels[m])}<span aria-hidden="true">↗</span></button><div class="tile-list">${tileItems(m).slice(0, 3).map(row).join("") || '<p class="help">No items in this snapshot.</p>'}</div></section>`,
    )
    .join("")}</div>`;
}
function showAgenda() {
  const groups = new Map();
  for (const i of items("agenda")) {
    const key = i.startsAt
      ? localDate(i.startsAt, snapshot.timeZone)
      : "Date unavailable";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(i);
  }
  return (
    heading(
      "A look ahead",
      "A useful view of the days ahead, with the original event details close at hand.",
    ) +
    `<div class="meeting-grid">${[...groups].map(([day, events]) => `<section class="card"><div class="eyebrow">${escape(day)}</div>${events.map(agendaRow).join("")}</section>`).join("")}</div>`
  );
}
function showCollection(module) {
  const subtitles = {
    messages:
      "Keep the context, the sender, and the original unread state. No message is sent or marked read here.",
    deliveries:
      "Know what is coming, what has arrived, and which deliveries actually need your help.",
    newsletters:
      "The latest exact editions, with publication dates separate from check times.",
    sports:
      "Your selected interests, useful analysis, and results that wait until you choose to see them.",
    radar:
      "A few things you might enjoy, with interest feedback kept separate from hiding an item.",
  };
  return (
    heading(labels[module], subtitles[module]) +
    `<div class="grid">${
      items(module)
        .map(
          (i) =>
            `<article class="card"><div class="meta">${escape(i.meta || "Example item")}</div>${i.unreadLabel ? `<span class="pill">${escape(i.unreadLabel)}</span>` : ""}<h3>${escape(i.title)}</h3><p>${escape(i.summary)}</p><div class="actions">${button(i.result ? "Open spoiler-free recap →" : "Read details →", `data-open="${escape(i.id)}"`)}</div>${module === "radar" ? `<div class="actions">${button(state.feedback[i.id] === "like" ? "Liked · Undo" : "Like", `data-feedback="like" data-id="${escape(i.id)}"`, `secondary ${state.feedback[i.id] === "like" ? "selected" : ""}`)}${button(state.feedback[i.id] === "dislike" ? "Not for me · Undo" : "Not for me", `data-feedback="dislike" data-id="${escape(i.id)}"`, `secondary ${state.feedback[i.id] === "dislike" ? "selected" : ""}`)}</div><div class="actions">${button("Plan this", `data-plan="${escape(i.id)}"`)}${button("Hide", `data-hide="${escape(i.id)}"`)}</div>` : ""}</article>`,
        )
        .join("") || '<p class="empty">No items in this snapshot.</p>'
    }</div>${hiddenControls()}`
  );
}
function showMeeting() {
  return (
    heading(
      "Plan the next two weeks",
      "Bring the open questions together. Record a decision, its owner, and the next step.",
    ) +
    `<div class="week-band"><strong>Decisions and handoffs</strong><span>${snapshot.mode === "demo" ? "Example topics" : "Snapshot topics"} · ${items("meeting").filter((i) => !state.resolved.includes(i.id)).length} open<br>Notes stay in this browser; they are not shared-list sync.</span></div><div class="grid">${items(
      "meeting",
    )
      .map(
        (i) =>
          `<article class="card meeting-rail ${state.resolved.includes(i.id) ? "resolved" : ""}"><div class="meta">${escape(i.meta)} · Added by ${escape(i.person)}</div><h3>${escape(i.title)}</h3><p>${escape(i.summary)}</p>${state.notes[i.id] ? `<p><strong>Recorded outcome:</strong> ${escape(state.notes[i.id])}</p>` : ""}<div class="actions">${button(state.notes[i.id] ? "Edit decision" : "Record decision", `data-decision="${escape(i.id)}"`, "secondary")}${state.resolved.includes(i.id) ? '<span class="pill">Resolved locally</span>' : ""}</div></article>`,
      )
      .join("")}</div>`
  );
}
function showConnections() {
  return (
    heading(
      "What the Hub knows",
      "Every source keeps its own evidence. Importing a snapshot is a local preview, not a live account connection.",
    ) +
    `<div class="actions" style="margin-bottom:24px"><label class="secondary upload-label">Import snapshot JSON<input id="snapshot-import" type="file" accept=".json,application/json" aria-label="Import snapshot JSON"></label>${button("Reload original example", "data-reload", "secondary")}</div><div class="grid">${snapshot.sources.map((s) => `<article class="card"><span class="pill ${s.state === "partial" || s.state === "unavailable" ? "partial" : ""}">${snapshot.mode === "demo" ? "Example · " : ""}${escape(sourceHealth(s, snapshot.mode === "demo" ? new Date(snapshot.generatedAt) : new Date()))}</span><h3>${escape(s.label)}</h3><p>${escape(s.detail)}</p><div class="source-detail"><strong>Observed:</strong> ${escape(s.observedAt || "No successful read")}<br><strong>Fresh until:</strong> ${escape(s.freshUntil || "Not established")}<br><strong>Coverage:</strong> ${escape(s.state)}</div></article>`).join("")}</div><p class="help">A connected production build also needs an authorized reader, private storage, publication readback, and distinct scheduled-run evidence. See the integration and automation guides.</p>`
  );
}
function showPersonalize() {
  const p = state.preferences;
  return (
    heading(
      "Make room for your life",
      "Choose the parts that matter to you. These settings change this demo and can be exported to your own project.",
    ) +
    `<form id="preferences-form" class="form"><label class="field">Your display name<input name="displayName" maxlength="60" value="${escape(p.displayName)}" required></label><label class="field">Hub name<input name="hubName" maxlength="80" value="${escape(p.hubName)}" required></label><label class="field">Accent<select name="accent">${[
      ["gold", "Warm gold"],
      ["sage", "Quiet sage"],
      ["blue", "Slate blue"],
    ]
      .map(
        ([key, label]) =>
          `<option value="${key}" ${p.accent === key ? "selected" : ""}>${label}</option>`,
      )
      .join(
        "",
      )}</select></label><div class="field">Your sections</div><div class="checkgrid">${MODULES.map((m) => `<label><input type="checkbox" name="modules" value="${m}" ${p.modules.includes(m) ? "checked" : ""} ${m === "briefing" ? "disabled" : ""}>${escape(labels[m])}${m === "briefing" ? " (always on)" : ""}</label>`).join("")}</div><div class="actions"><button class="primary" type="submit">Save in this browser</button>${button("Export preferences", 'type="button" data-export', "secondary")}<label class="secondary upload-label">Import preferences<input id="preferences-import" type="file" accept=".json,application/json" aria-label="Import preferences"></label></div><p class="help">Export includes only the display name, Hub name, accent, and section selection. Notes, hidden items, feedback, and source snapshots are not exported. Accounts, time zone, interests, schedules, and action permissions belong in your full build profile.</p></form>`
  );
}

function render() {
  const p = state.preferences;
  document.title = `${p.hubName} · Hub starter`;
  document.documentElement.style.setProperty(
    "--accent",
    p.accent === "sage"
      ? "#426a4e"
      : p.accent === "blue"
        ? "#315d83"
        : "#805207",
  );
  document.documentElement.style.setProperty(
    "--accent-light",
    p.accent === "sage"
      ? "#e6eee7"
      : p.accent === "blue"
        ? "#e8eff5"
        : "#f4eddd",
  );
  const pages = [...p.modules, "connections", "personalize"];
  if (!pages.includes(page)) page = "briefing";
  const content =
    page === "briefing"
      ? showBriefing()
      : page === "agenda"
        ? showAgenda()
        : page === "meeting"
          ? showMeeting()
          : page === "connections"
            ? showConnections()
            : page === "personalize"
              ? showPersonalize()
              : showCollection(page);
  app.innerHTML = `<aside class="sidebar"><button class="brand" data-page="briefing">${escape(p.hubName)}</button><div class="brand-rule"></div><nav class="nav" aria-label="Main navigation">${pages.map((m) => `<button data-page="${m}" class="${page === m ? "active" : ""} ${m === "connections" ? "divider" : ""}" ${page === m ? 'aria-current="page"' : ""}><span class="symbol" aria-hidden="true">${symbols[m]}</span><span>${escape(labels[m])}</span></button>`).join("")}</nav><div class="sidebar-foot"><strong>Built around your choices</strong>A starter to shape with your own<br>ChatGPT or Codex.</div></aside><main class="main" id="main" tabindex="-1"><div class="topline"><span class="demo-label">${escape(sourceNote())}</span>${button("About this starter", "data-about", "quiet-button")}</div>${content}<p class="footer-note">Build Your Own Hub · Adapted from Craig’s Hub · ${snapshot.mode === "demo" ? "All people, events, messages, and results shown are fictional." : "Imported content remains in this page’s memory until reload."}</p></main><form class="composer" id="composer"><span class="composer-label">A little help</span><input aria-label="Prepare a prompt for your assistant" name="request" maxlength="2000" placeholder="What would you like your Hub to help with?" required><button class="primary">Prepare prompt ↗</button></form>`;
  bind();
}
function openDialog(html) {
  detail.innerHTML = html;
  if (!dialog.open) dialog.showModal();
}
function openItem(id) {
  const i = snapshot.items.find((i) => i.id === id);
  if (!i) return;
  const s = snapshot.sources.find((s) => s.id === i.sourceId);
  const result = i.result
    ? `<details class="result"><summary>Match details and result below</summary><p>${escape(i.result)}</p></details>`
    : "";
  openDialog(
    `<div class="eyebrow">${escape(labels[i.module] || "Needs you")}</div><h2>${escape(i.title)}</h2><p class="dialog-body">${escape(i.summary)}</p>${i.details ? `<p class="dialog-body">${escape(i.details)}</p>` : ""}${i.nextAction ? `<p class="dialog-body"><strong>Next action:</strong> ${escape(i.nextAction)}</p><p class="help">This starter prepares context. It does not send, book, or change the source.</p>` : ""}${result}<div class="dialog-meta">${escape(i.meta || "")}<br>Source: ${escape(s.label)} · ${escape(s.state)}<br>Observed: ${escape(i.observedAt || s.observedAt || "Unavailable")}<br>${snapshot.mode === "demo" ? "Fictional example. No live account is connected." : "Imported snapshot. No live account connection is established."}</div>${safeUrl(i.url) ? `<a class="secondary" href="${escape(safeUrl(i.url))}" target="_blank" rel="noopener noreferrer">Open exact source ↗</a>` : ""}`,
  );
}
function preparePrompt(request) {
  const title = state.preferences.hubName;
  const prompt = `I am building ${title} from the Build Your Own Hub starter. Please help with this request: ${request}\n\nMy selected sections: ${state.preferences.modules.map((m) => labels[m]).join(", ")}. The starter is a demonstration; its fictional data is not evidence about my real life. Use my actual preferences and the tools available in this chat. Explain any source you cannot read. Prepare a concrete result and verify it. Do not send, purchase, book, or change an external account unless I authorize that action.`;
  openDialog(
    `<div class="eyebrow">Ready for your assistant</div><h2>A useful starting point.</h2><p class="help">Copy this into your own ChatGPT or Codex with the shared context file. Nothing has been sent.</p><textarea class="prompt-area" id="prepared-prompt" aria-label="Prepared prompt" readonly>${escape(prompt)}</textarea><div class="actions">${button("Copy prompt", 'id="copy-prompt"', "primary")}</div>`,
  );
  document.querySelector("#copy-prompt").onclick = async () => {
    const field = document.querySelector("#prepared-prompt");
    try {
      await navigator.clipboard.writeText(field.value);
      announce("Prompt copied.");
    } catch {
      field.select();
      announce("Select and copy the prompt using your browser.");
    }
  };
}
function editDecision(id) {
  const item = snapshot.items.find((i) => i.id === id);
  openDialog(
    `<div class="eyebrow">Decision · Added by ${escape(item.person)}</div><h2>${escape(item.title)}</h2><p class="dialog-body">${escape(item.summary)}</p><form id="decision-form"><label class="field">What did you decide? Include the owner and next step.<textarea name="outcome" maxlength="3000" required>${escape(state.notes[id] || "")}</textarea></label><label class="help"><input type="checkbox" name="resolved" ${state.resolved.includes(id) ? "checked" : ""}> Mark resolved with this written outcome</label><p class="help">Saved in this browser only. A connected version writes to your chosen shared source.</p><button class="primary">Save decision</button></form>`,
  );
  document.querySelector("#decision-form").onsubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target),
      outcome = String(form.get("outcome") || "").trim();
    if (!outcome) {
      announce("Write an outcome before saving or resolving.");
      return;
    }
    const next = structuredClone(state);
    next.notes[id] = outcome;
    next.resolved = next.resolved.filter((x) => x !== id);
    if (form.get("resolved")) next.resolved.push(id);
    if (save(next, "Decision saved in this browser.")) {
      dialog.close();
      render();
    }
  };
}
function download(name, value) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2) + "\n"], {
      type: "application/json",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function readJsonFile(file) {
  if (!file) return null;
  if (file.size > 3 * 1024 * 1024)
    throw new Error("Choose a JSON file smaller than 3 MB.");
  return JSON.parse(await file.text());
}
function bind() {
  app.querySelectorAll("[data-page]").forEach(
    (el) =>
      (el.onclick = () => {
        page = el.dataset.page;
        render();
        document.querySelector("#main").focus({ preventScroll: true });
        window.scrollTo(0, 0);
      }),
  );
  app
    .querySelectorAll("[data-open]")
    .forEach((el) => (el.onclick = () => openItem(el.dataset.open)));
  app.querySelectorAll("[data-hide]").forEach(
    (el) =>
      (el.onclick = () => {
        const next = structuredClone(state);
        if (!next.hidden.includes(el.dataset.hide))
          next.hidden.push(el.dataset.hide);
        if (save(next, "Hidden from this Hub. The source is unchanged."))
          render();
      }),
  );
  app.querySelectorAll("[data-restore]").forEach(
    (el) =>
      (el.onclick = () => {
        const next = {
          ...state,
          hidden: state.hidden.filter((id) => id !== el.dataset.restore),
        };
        if (save(next, "Restored to this Hub.")) render();
      }),
  );
  app.querySelectorAll("[data-feedback]").forEach(
    (el) =>
      (el.onclick = () => {
        const next = structuredClone(state);
        if (next.feedback[el.dataset.id] === el.dataset.feedback)
          delete next.feedback[el.dataset.id];
        else next.feedback[el.dataset.id] = el.dataset.feedback;
        if (save(next, "Interest feedback saved locally.")) render();
      }),
  );
  app
    .querySelectorAll("[data-plan]")
    .forEach(
      (el) =>
        (el.onclick = () =>
          preparePrompt(
            `Help me adapt the idea “${snapshot.items.find((i) => i.id === el.dataset.plan).title}” to my real preferences and schedule. Check actual details before suggesting a plan.`,
          )),
    );
  app
    .querySelectorAll("[data-decision]")
    .forEach((el) => (el.onclick = () => editDecision(el.dataset.decision)));
  app.querySelector("[data-about]").onclick = () =>
    openDialog(
      '<div class="eyebrow">Build Your Own Hub · 1.0.0</div><h2>A foundation for your own version.</h2><p class="dialog-body">This starter adapts the design and operating patterns of Craig’s Hub. The supplied people, messages, events, teams, and results are fictional. No accounts are connected and no automations are installed.</p><p class="dialog-body">Use the shared context and source code with your own ChatGPT or Codex. Personalize the design first, then connect and verify one source at a time.</p><p class="help">Preferences and meeting notes remain in this browser. The original kit is meant to be shared; keep your personalized, connected copy private.</p>',
    );
  app.querySelector("#composer").onsubmit = (event) => {
    event.preventDefault();
    preparePrompt(new FormData(event.target).get("request"));
  };
  const pf = app.querySelector("#preferences-form");
  if (pf)
    pf.onsubmit = (event) => {
      event.preventDefault();
      const data = new FormData(pf);
      try {
        const preferences = validatePreferences({
          displayName: data.get("displayName"),
          hubName: data.get("hubName"),
          accent: data.get("accent"),
          modules: ["briefing", ...data.getAll("modules")],
        });
        if (
          save({ ...state, preferences }, "Preferences saved in this browser.")
        )
          render();
      } catch (error) {
        announce(error.message);
      }
    };
  const exportButton = app.querySelector("[data-export]");
  if (exportButton)
    exportButton.onclick = () => {
      const form = new FormData(pf);
      try {
        const preferences = validatePreferences({
          displayName: form.get("displayName"),
          hubName: form.get("hubName"),
          accent: form.get("accent"),
          modules: ["briefing", ...form.getAll("modules")],
        });
        download("hub-demo-preferences.json", {
          schemaVersion: 1,
          ...preferences,
        });
        announce(
          "Preferences exported. Notes and snapshots were not included.",
        );
      } catch (error) {
        announce(error.message);
      }
    };
  const pi = app.querySelector("#preferences-import");
  if (pi)
    pi.onchange = async () => {
      try {
        const data = await readJsonFile(pi.files[0]);
        if (!data) return;
        const preferences = validatePreferences(data);
        if (
          save(
            { ...state, preferences },
            "Demo preferences imported and saved locally.",
          )
        )
          render();
      } catch (error) {
        announce(`Preferences not imported: ${error.message}`);
      }
    };
  const si = app.querySelector("#snapshot-import");
  if (si)
    si.onchange = async () => {
      try {
        const data = await readJsonFile(si.files[0]);
        if (!data) return;
        snapshot = validateSnapshot(data);
        imported = true;
        render();
        announce(
          "Snapshot imported for this page only. No live connection was created.",
        );
      } catch (error) {
        announce(`Snapshot not imported: ${error.message}`);
      }
    };
  const reload = app.querySelector("[data-reload]");
  if (reload)
    reload.onclick = async () => {
      try {
        snapshot = await loadSnapshot();
        imported = false;
        render();
        announce(
          "Original fictional snapshot reloaded. Observation times are unchanged.",
        );
      } catch (error) {
        announce(error.message);
      }
    };
}
async function loadSnapshot() {
  if (globalThis.HUB_DEMO_SNAPSHOT)
    return validateSnapshot(globalThis.HUB_DEMO_SNAPSHOT);
  const response = await fetch("/fixtures/demo.json");
  if (!response.ok) throw new Error("Example snapshot could not be loaded.");
  return validateSnapshot(await response.json());
}
try {
  snapshot = await loadSnapshot();
  loadState();
  render();
  if (persistenceWarning) announce(persistenceWarning);
} catch (error) {
  app.innerHTML = `<main class="fatal"><h1>The example could not load.</h1><p>${escape(error.message)}</p><p>Open preview.html for the self-contained version, or run npm start from the extracted project folder.</p></main>`;
}

"""Optional visual-guide build: Python 3 with ReportLab installed.

The application and its Node.js checks do not depend on Python or ReportLab.
Run this script from any directory after generating the screenshots.
"""

from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "Build-Your-Own-Hub-Guide.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)
REPO = "https://github.com/CBruney/build-your-own-hub"
INK = colors.HexColor("#17253d")
GOLD = colors.HexColor("#805207")
MUTED = colors.HexColor("#516057")
PAPER = colors.HexColor("#faf9f5")
RULE = colors.HexColor("#d9d9cf")
C = canvas.Canvas(str(OUT), pagesize=(612, 792), invariant=1)
C.setTitle("Build Your Own Hub - A visual starting guide")
C.setAuthor("Build Your Own Hub")
C.setSubject("A fictional demonstration and reusable guide adapted from Craig's Hub")
STYLE = ParagraphStyle("body", fontName="Helvetica", fontSize=10.5,
                       leading=15, textColor=INK)


def text(body, y, size=10.5, leading=15, width=504, x=54, color=INK):
    style = ParagraphStyle("p", parent=STYLE, fontSize=size, leading=leading,
                           textColor=color)
    p = Paragraph(body, style)
    _, height = p.wrap(width, 1000)
    if y - height < 52:
        raise ValueError("Text would overflow the page: " + body[:60])
    p.drawOn(C, x, y - height)
    return y - height - 12


def start(number, eyebrow, title, subtitle=None):
    C.setFillColor(PAPER)
    C.rect(0, 0, 612, 792, fill=1, stroke=0)
    C.setFillColor(GOLD)
    C.setFont("Helvetica-Bold", 9)
    C.drawString(54, 741, eyebrow.upper())
    C.setFillColor(INK)
    C.setFont("Times-Roman", 31)
    C.drawString(54, 700, title)
    C.setStrokeColor(RULE)
    C.line(54, 682, 558, 682)
    C.setFont("Helvetica", 8)
    C.setFillColor(MUTED)
    C.drawString(54, 31, "BUILD YOUR OWN HUB  /  1.0.0  /  SEPTEMBER 22, 2026")
    C.drawRightString(558, 31, str(number))
    return text(subtitle, 663) if subtitle else 663


def shot(name, y, width=504, x=54):
    from PIL import Image
    path = ROOT / "docs" / "screenshots" / name
    with Image.open(path) as im:
        height = width * im.height / im.width
    C.drawImage(str(path), x, y - height, width=width, height=height,
                preserveAspectRatio=True, mask="auto")
    return y - height - 12


def section(title, body, y):
    y = text(escape(title), y, size=15, leading=18, color=GOLD)
    return text(body, y)


y = start(1, "Adapted from Craig's Hub", "Build something around your life.",
          "A personal dashboard, a set of useful habits, and a starting point for your own ChatGPT Work or Codex. Choose what belongs in your version.")
y = shot("briefing-desktop.png", y)
y = text("<b>A real starter with fictional content.</b> The interface works locally. Your accounts, private storage, and schedules are a separate build stage.", y, size=10, leading=14)
text(f'<link href="{REPO}" color="#805207">Open the repository and complete shared context</link>', y, size=10)
C.showPage()

y = start(2, "Begin with choices", "Give your assistant a useful brief.")
y = section("1. Read the shared context", "Download <b>SHARED-CONTEXT.md</b> from the repository. Add it to your own chat or project, then paste <b>START-PROMPT.md</b>. Ask the assistant to list the files it actually read. Attach the file if it cannot open the link.", y)
y = section("2. Pick the first version", "Choose the sections that would help most: an agenda, messages, deliveries, reading, sports, ideas, or shared decisions. A small useful Hub is a good first release. You can add more later.", y)
y = section("3. Record your preferences", "Name the Hub; choose your time zone, people, interests, accent, and section order. Use <b>config/profile.example.json</b> as the fuller profile. The demo's export contains only its display settings.", y)
y = section("4. Confirm the actual tools", "Ask the assistant which accounts, files, browser access, coding tools, and scheduling capabilities are available in that environment. A feature described in this kit does not establish access in your session.", y)
y = text("<b>A prompt you can use now</b>", y)
y = text("Read the attached Build Your Own Hub context. Help me choose the smallest useful version for my life. Ask about my priorities, sources, visual preferences, and desired actions. Then build a fictional preview with the tools actually available here. Keep real connections and scheduling as explicit, verified steps.", y, size=11, leading=16)
text("The full starting prompt adds implementation stages, evidence requirements, and a handoff checklist. Use it when beginning the build.", y, color=MUTED)
C.showPage()

y = start(3, "Design you can change", "Make the page feel like yours.",
          "The example uses warm ivory, dark navy, restrained gold, serif headings, and clear source details. Keep the parts you like and change the rest.")
y = shot("personalize-desktop.png", y)
text("<b>In the demo:</b> Personalize changes the display name, Hub name, accent, and sections. Save locally or export a preference file. The design guide documents colors, type, spacing, responsive behavior, and interaction rules.", y, size=10, leading=14)
C.showPage()

y = start(4, "Trust the evidence", "A page load is only one step.",
          "A useful Hub distinguishes what was read, what was saved, what reached the screen, and what ran on schedule.")
stages = [
    ("Authorized source", "Read only the accounts and source scope the new owner has chosen."),
    ("Literal observation", "Keep the source ID, observation time, publication time, and coverage."),
    ("Validated snapshot", "Validate data and retain earlier verified items when a read is partial."),
    ("Private publication", "Write the accepted snapshot, then read back the actual destination."),
    ("Visible interface", "Show the right items, dates, source states, and reversible controls."),
    ("Scheduled operation", "Observe separate scheduled runs; a manual success is not schedule proof."),
]
for name, detail in stages:
    C.setStrokeColor(RULE)
    C.line(54, y + 3, 558, y + 3)
    y = text(f"<b>{escape(name)}</b>", y - 7, size=11)
    y = text(escape(detail), y + 5, size=10, leading=14)
y = text("<b>If a source fails:</b> preserve earlier evidence, show partial or unavailable coverage, and avoid invented freshness. If a send has an uncertain outcome, reconcile the existing attempt; do not resend automatically.", y - 4)
text("The starter includes validation, merge, freshness, and first-attempt delivery functions. It does not include a connected backend or an email sender.", y, color=MUTED)
C.showPage()

y = start(5, "16 reusable recipes", "Choose a few. Configure them well.",
          "Every recipe is disabled in the original catalog. Each has a complete prompt and shares an operating contract. Cadences are examples for you to change.")
groups = [
    ("Keep the page current", ["Coordinate selected source updates", "Refresh the agenda", "Refresh messages and concrete follow-ups", "Track identifiable packages", "Refresh selected newsletter editions"]),
    ("Follow your interests", ["Prepare a daily interest briefing", "Prepare a game or event preview", "Prepare a spoiler-controlled recap", "Find a few good things to do"]),
    ("Plan with other people", ["Suggest one practical shared activity", "Prepare a planning meeting", "Prepare for recurring personal dates", "Keep chosen event calendars accurate"]),
    ("Maintain the system", ["Audit source and delivery reliability", "Check the chosen local automation host", "Review what the Hub should change"]),
]
for title, recipes in groups:
    y = text(escape(title), y, size=15, leading=18, color=GOLD)
    for recipe in recipes:
        y = text("• " + escape(recipe), y + 4, size=10, leading=13)
    y -= 4
text("Assign one scheduling owner per source. Choose time zone, quiet hours, source scope, and destinations explicitly. Verify three distinct scheduled successes before marking unattended operation verified. This does not guarantee future reliability.", y, size=10, leading=14)
C.showPage()

y = start(6, "Build and share", "A clear path from demo to daily use.")
y = section("Try it without installing packages", "Download and extract the release ZIP. Open <b>preview.html</b> in a browser that permits local HTML files. It embeds the example data, code, and fonts. If your environment blocks local files, use the public fictional demo or run the local development server.", y)
y = section("Work from source", "With Node.js 22 or later, open a terminal in the folder containing <b>package.json</b> and run:", y)
for line in ["npm test", "npm run build", "npm run verify", "npm start"]:
    y = text(line, y + 4, size=11, leading=16)
y = text("Open <b>http://127.0.0.1:4173</b>. No npm install is needed. Stop the server with Ctrl+C. Keep your own personalized source copy private.", y)
y = section("Connect one source at a time", "Use your own authorized account access. Add private storage, validate the source observation, and check the published result. Then install and test the chosen schedule in its real execution environment.", y)
y = section("Hand it to the next person", "Share the original repository or release ZIP, the shared context, and the starting prompt. The screenshot tour shows the design without disclosing anyone's real messages or calendar.", y)
y = text("<b>Before calling your own build ready:</b> record what passed, what is partial, what is untested, and how to recover. The included release checks distinguish local tests and browser evidence from live-service operation.", y)
y = text("No project license file is included. Keep the bundled font notices. This is a personal project starter, not an official OpenAI product or supported integration bundle.", y, size=9, leading=13, color=MUTED)
text(f'<link href="{REPO}" color="#805207">{REPO}</link>', y, size=10)
C.save()
print(f"Created {OUT.relative_to(ROOT)}")

# Music Notation Learning Mode — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Music Notation" learning mode with 6 linear chapters, each containing lesson pages with VexFlow-rendered examples followed by a multiple-choice quiz using SM-2 spaced repetition.

**Architecture:** New mode integrates into the existing single-file architecture (`index.html`). Three new screens (chapter list, lesson, notation quiz) are added as hidden `<div>` sections alongside the existing menu and quiz screens. Lesson content and quiz pools are defined as JS data structures. Quiz logic reuses existing SM-2 and progress tracking patterns.

**Tech Stack:** Vanilla JS, VexFlow 4.x (already included), CSS, localStorage

---

### Task 1: Add Notation Mode Card to Main Menu

**Files:**
- Modify: `index.html:519-555` (main menu HTML)
- Modify: `index.html:1661-1679` (updateMenuStats function)
- Modify: `index.html:1744-1754` (event handlers for mode cards)

**Step 1: Add the mode card HTML**

In the `.mode-cards` div (after the keysig card at line 551), add:

```html
<div class="mode-card" id="card-notation">
    <div class="mode-icon">&#x1D11E;</div>
    <h3>Music Notation</h3>
    <div class="mode-level" id="menu-notation-level">Chapter 1 of 6</div>
    <div class="mode-accuracy" id="menu-notation-accuracy">Not started</div>
</div>
```

Note: `&#x1D11E;` is the treble clef Unicode character. If it doesn't render well, fall back to `&#x1F3BC;` (musical score emoji).

**Step 2: Add notation progress tracking to updateMenuStats**

In `updateMenuStats()` (line 1661), after the existing mode loop, add notation-specific stat update:

```javascript
// Update notation mode card
const notProg = getNotationProgress();
const chapNum = getNotationCurrentChapter(notProg);
document.getElementById("menu-notation-level").textContent = `Chapter ${chapNum} of ${NOTATION_CHAPTERS.length}`;
const completedCount = Object.values(notProg.chapters).filter(c => c.quizPassed).length;
document.getElementById("menu-notation-accuracy").textContent = completedCount > 0
    ? `${completedCount}/${NOTATION_CHAPTERS.length} chapters complete`
    : "Not started";
```

**Step 3: Add click handler for notation card**

After the keysig card click handler (line 1754), add:

```javascript
document.getElementById("card-notation").addEventListener("click", () => showNotationChapterList());
```

**Step 4: Verify the card appears on the menu**

Open `index.html` in browser. Confirm the "Music Notation" card appears in the grid alongside the existing 5 modes. The 6 cards should arrange in a 2x3 grid.

**Step 5: Commit**

```bash
git add index.html
git commit -m "Add Music Notation mode card to main menu"
```

---

### Task 2: Add Notation Chapter Data and Progress Storage

**Files:**
- Modify: `index.html` — add after Key Signature data section (after line 697)

**Step 1: Define the 6 chapters as a data structure**

Add the `NOTATION_CHAPTERS` array. Each chapter has `id`, `title`, `subtitle`, `pages` (lesson content), and `quizPool` (quiz questions). Start with the structure and chapter metadata — we'll fill in page content and quiz pools in later tasks.

```javascript
// ============================================================
// Music Notation Learning Data
// ============================================================
const NOTATION_CHAPTERS = [
    {
        id: 1,
        title: "The Staff & Clefs",
        subtitle: "The foundation of written music",
        pages: [], // filled in Task 4
        quizPool: [], // filled in Task 5
    },
    {
        id: 2,
        title: "Notes on the Staff",
        subtitle: "How pitch is represented",
        pages: [],
        quizPool: [],
    },
    {
        id: 3,
        title: "Note Values",
        subtitle: "How long notes last",
        pages: [],
        quizPool: [],
    },
    {
        id: 4,
        title: "Rests",
        subtitle: "The sound of silence",
        pages: [],
        quizPool: [],
    },
    {
        id: 5,
        title: "Time Signatures",
        subtitle: "Organizing beats into measures",
        pages: [],
        quizPool: [],
    },
    {
        id: 6,
        title: "Key Signatures & Accidentals",
        subtitle: "Sharps, flats, and naturals",
        pages: [],
        quizPool: [],
    },
];
```

**Step 2: Add notation progress helpers**

Add after the chapter data:

```javascript
function getNotationProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.notationProgress) return data.notationProgress;
        } catch (e) {}
    }
    return createDefaultNotationProgress();
}

function createDefaultNotationProgress() {
    const chapters = {};
    for (const ch of NOTATION_CHAPTERS) {
        chapters[ch.id] = {
            lessonComplete: false,
            lessonPage: 0,
            quizPassed: false,
            quizStats: {},
            quizMemory: {},
            roundNumber: 0,
            currentStreak: 0,
            longestStreak: 0,
        };
    }
    return { chapters };
}

function getNotationCurrentChapter(progress) {
    for (const ch of NOTATION_CHAPTERS) {
        if (!progress.chapters[ch.id] || !progress.chapters[ch.id].quizPassed) return ch.id;
    }
    return NOTATION_CHAPTERS.length; // all complete
}

function saveNotationProgress(progress) {
    const saved = localStorage.getItem(STORAGE_KEY);
    let data = {};
    if (saved) {
        try { data = JSON.parse(saved); } catch (e) {}
    }
    data.notationProgress = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
```

**Step 3: Integrate with existing save/load**

In the existing `saveProgress()` function (~line 753), the notation progress is saved separately via `saveNotationProgress()`, so no changes needed to the existing save. But ensure `resetProgress()` also clears notation data — it already does since it calls `localStorage.removeItem(STORAGE_KEY)`.

**Step 4: Commit**

```bash
git add index.html
git commit -m "Add notation chapter data structure and progress storage"
```

---

### Task 3: Add Chapter List, Lesson, and Notation Quiz Screen HTML/CSS

**Files:**
- Modify: `index.html` — add HTML after quiz-screen div (after line 597), add CSS in style block

**Step 1: Add CSS for notation screens**

Add before the closing `</style>` tag (before line 513):

```css
/* Notation Learning Mode */
#notation-chapters {
    display: none;
    width: 100%;
    max-width: 500px;
    flex-direction: column;
    align-items: center;
}
#notation-chapters.active { display: flex; }
.chapter-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
}
.chapter-item {
    background: rgba(255,255,255,0.08);
    border: 2px solid #444;
    border-radius: 10px;
    padding: 15px 20px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 15px;
}
.chapter-item:hover { background: rgba(255,255,255,0.12); border-color: #666; }
.chapter-item.locked { opacity: 0.4; cursor: default; }
.chapter-item.locked:hover { background: rgba(255,255,255,0.08); border-color: #444; }
.chapter-item.current { border-color: #4488cc; }
.chapter-item.completed { border-color: #22aa55; }
.chapter-num {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
    flex-shrink: 0;
}
.chapter-item.completed .chapter-num { background: #22aa55; }
.chapter-item.current .chapter-num { background: #4488cc; }
.chapter-info h3 {
    font-size: clamp(0.9rem, 3vw, 1rem);
    font-weight: 400;
    margin-bottom: 3px;
}
.chapter-info p {
    font-size: clamp(0.7rem, 2.2vw, 0.8rem);
    color: #888;
}

#notation-lesson {
    display: none;
    width: 100%;
    max-width: 500px;
    flex-direction: column;
    align-items: center;
}
#notation-lesson.active { display: flex; }
.lesson-content {
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 20px;
    width: 100%;
    margin-bottom: 15px;
    line-height: 1.6;
    font-size: clamp(0.85rem, 2.8vw, 0.95rem);
}
.lesson-content h3 {
    font-size: clamp(1rem, 3.2vw, 1.15rem);
    margin-bottom: 12px;
    font-weight: 400;
    color: #fff;
}
.lesson-content p { margin-bottom: 10px; color: #ccc; }
.lesson-content .staff-example {
    background: #fff;
    border-radius: 8px;
    padding: 10px;
    margin: 12px 0;
    display: flex;
    justify-content: center;
    overflow-x: auto;
}
.lesson-content .highlight { color: #6af; font-weight: bold; }
.lesson-content .mnemonic { color: #fa6; font-style: italic; }
.lesson-nav {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 15px;
}
.lesson-nav button {
    padding: 10px 20px;
    background: #444;
    border: 1px solid #666;
    color: #ccc;
    border-radius: 6px;
    cursor: pointer;
    font-size: clamp(0.8rem, 2.5vw, 0.9rem);
    touch-action: manipulation;
}
.lesson-nav button:hover { background: #555; }
.lesson-nav button.primary { background: #22aa55; border-color: #22aa55; color: #fff; }
.lesson-nav button.primary:hover { background: #2bc462; }
.lesson-page-indicator {
    font-size: clamp(0.75rem, 2.5vw, 0.85rem);
    color: #888;
}

#notation-quiz {
    display: none;
    width: 100%;
    max-width: 500px;
    flex-direction: column;
    align-items: center;
}
#notation-quiz.active { display: flex; }
.mc-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    max-width: 400px;
    padding: 10px 0;
}
.mc-btn {
    padding: 12px 20px;
    background: #333;
    border: 2px solid #555;
    color: #ccc;
    border-radius: 8px;
    cursor: pointer;
    font-size: clamp(0.8rem, 2.5vw, 0.95rem);
    transition: all 0.15s;
    touch-action: manipulation;
    min-width: 120px;
    text-align: center;
}
.mc-btn:hover { background: #444; border-color: #777; }
.mc-btn.correct { background: #2a6; border-color: #3c8; color: #fff; }
.mc-btn.wrong { background: #a33; border-color: #c44; color: #fff; }
```

**Step 2: Add HTML for the three notation screens**

Add after the `<!-- Level Complete Overlay -->` section (after line 611, before `<script>`):

```html
<!-- Notation Chapter List -->
<div id="notation-chapters">
    <button class="back-btn" id="notation-back-menu">&larr; Back to Menu</button>
    <h2 style="font-weight:300;letter-spacing:1px;margin-bottom:5px;">Music Notation</h2>
    <p style="color:#888;font-size:clamp(0.75rem,2.5vw,0.85rem);margin-bottom:10px;">Learn to read sheet music</p>
    <div class="chapter-list" id="chapter-list"></div>
</div>

<!-- Notation Lesson Screen -->
<div id="notation-lesson">
    <button class="back-btn" id="lesson-back-chapters">&larr; Back to Chapters</button>
    <h2 id="lesson-title" style="font-weight:300;letter-spacing:1px;margin-bottom:5px;"></h2>
    <div class="lesson-page-indicator" id="lesson-page-indicator"></div>
    <div class="lesson-content" id="lesson-content"></div>
    <div class="lesson-nav">
        <button id="lesson-prev">Previous</button>
        <button id="lesson-next" class="primary">Next</button>
    </div>
</div>

<!-- Notation Quiz Screen -->
<div id="notation-quiz">
    <button class="back-btn" id="quiz-back-chapters">&larr; Back to Chapters</button>
    <h2 id="nq-title" style="font-weight:300;letter-spacing:1px;margin-bottom:5px;"></h2>
    <div id="nq-level-info" style="margin-bottom:15px;text-align:center;width:100%;">
        <div id="nq-level-progress">
            <div id="nq-progress-bar" style="width:200px;max-width:60vw;height:6px;background:#333;border-radius:3px;margin:0 auto 4px;overflow:hidden;">
                <div id="nq-progress-fill" style="height:100%;background:#22aa55;border-radius:3px;transition:width 0.3s;width:0%;"></div>
            </div>
            <div id="nq-progress-text" style="font-size:clamp(0.65rem,2.2vw,0.75rem);color:#777;"></div>
        </div>
        <div id="nq-streak" style="font-size:clamp(0.75rem,2.5vw,0.85rem);color:#888;margin-top:5px;"></div>
    </div>
    <div id="nq-staff-container" style="background:#fff;border-radius:8px;padding:15px;margin-bottom:15px;box-shadow:0 4px 20px rgba(0,0,0,0.3);overflow-x:auto;width:100%;max-width:min(95vw,400px);display:flex;justify-content:center;">
        <div id="nq-staff"></div>
    </div>
    <div id="nq-prompt" style="font-size:clamp(1rem,3.5vw,1.2rem);margin-bottom:10px;text-align:center;min-height:1.5em;"></div>
    <div class="mc-buttons" id="nq-buttons"></div>
    <div id="nq-feedback" style="font-size:clamp(1rem,3.5vw,1.2rem);min-height:2rem;margin-top:10px;text-align:center;"></div>
    <div id="nq-response-time" style="font-size:clamp(0.7rem,2.4vw,0.8rem);color:#888;margin-top:5px;text-align:center;"></div>
    <div id="nq-stats" style="margin-top:20px;background:rgba(255,255,255,0.1);border-radius:8px;padding:12px 15px;width:100;">
        <h2 style="font-size:clamp(0.85rem,3vw,1rem);font-weight:300;margin-bottom:10px;letter-spacing:1px;text-align:center;">QUIZ ACCURACY</h2>
        <div id="nq-stats-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:5px;max-width:500px;margin:0 auto;"></div>
    </div>
</div>
```

**Step 3: Verify the HTML renders**

Open browser, confirm no layout issues. The notation screens should be hidden (`display: none`).

**Step 4: Commit**

```bash
git add index.html
git commit -m "Add HTML and CSS for notation chapter list, lesson, and quiz screens"
```

---

### Task 4: Write Lesson Content for All 6 Chapters

**Files:**
- Modify: `index.html` — fill in the `pages` arrays in `NOTATION_CHAPTERS`

Each page is an object with `title` (string) and `content` (HTML string). Some pages also have a `render` function that receives a container element and renders VexFlow examples into `.staff-example` divs.

**Step 1: Write Chapter 1 — The Staff & Clefs (4 pages)**

Replace the empty `pages: []` in chapter 1 with:

```javascript
pages: [
    {
        title: "The Musical Staff",
        content: `<p>All written music is built on the <span class="highlight">staff</span> (also called a stave) — a set of <span class="highlight">5 horizontal lines</span> with 4 spaces between them.</p>
<p>Notes are placed on lines or in spaces. Higher positions mean higher pitch, lower positions mean lower pitch.</p>
<div class="staff-example" id="ch1-ex1"></div>
<p>Each line and space represents a specific musical note. But which notes? That depends on the <span class="highlight">clef</span>.</p>`,
        render(container) {
            const el = container.querySelector("#ch1-ex1");
            if (!el) return;
            const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
            const score = factory.EasyScore();
            const system = factory.System({ x: 0, y: 0, width: 260 });
            system.addStave({ voices: [score.voice(score.notes("B4/w/r", { clef: "treble" }))] }).addClef("treble");
            factory.draw();
        }
    },
    {
        title: "The Treble Clef",
        content: `<p>The <span class="highlight">treble clef</span> (also called the G clef) is used for higher-pitched notes. It curls around the second line, marking it as the note G.</p>
<div class="staff-example" id="ch1-ex2"></div>
<p>The treble clef is used for the right hand on piano, as well as for guitar, violin, flute, and most singing voices.</p>
<p>Notes on the <strong>lines</strong> from bottom to top: <span class="mnemonic">Every Good Boy Does Fine</span> (E, G, B, D, F)</p>
<p>Notes in the <strong>spaces</strong> from bottom to top spell: <span class="mnemonic">FACE</span> (F, A, C, E)</p>`,
        render(container) {
            const el = container.querySelector("#ch1-ex2");
            if (!el) return;
            const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
            const score = factory.EasyScore();
            const system = factory.System({ x: 0, y: 0, width: 260 });
            const voice = score.voice(score.notes("E4/q, G4/q, B4/q, D5/q", { clef: "treble" }), { time: "4/4" });
            system.addStave({ voices: [voice] }).addClef("treble");
            factory.draw();
        }
    },
    {
        title: "The Bass Clef",
        content: `<p>The <span class="highlight">bass clef</span> (also called the F clef) is used for lower-pitched notes. Its two dots surround the fourth line, marking it as F.</p>
<div class="staff-example" id="ch1-ex3"></div>
<p>The bass clef is used for the left hand on piano, as well as for bass guitar, cello, and trombone.</p>
<p>Notes on the <strong>lines</strong> from bottom to top: <span class="mnemonic">Good Boys Do Fine Always</span> (G, B, D, F, A)</p>
<p>Notes in the <strong>spaces</strong> from bottom to top: <span class="mnemonic">All Cows Eat Grass</span> (A, C, E, G)</p>`,
        render(container) {
            const el = container.querySelector("#ch1-ex3");
            if (!el) return;
            const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
            const score = factory.EasyScore();
            const system = factory.System({ x: 0, y: 0, width: 260 });
            const voice = score.voice(score.notes("G2/q, B2/q, D3/q, F3/q", { clef: "bass" }), { time: "4/4" });
            system.addStave({ voices: [voice] }).addClef("bass");
            factory.draw();
        }
    },
    {
        title: "The Grand Staff & Ledger Lines",
        content: `<p>In piano music, the treble and bass clefs are joined together into a <span class="highlight">grand staff</span>, connected by a brace on the left.</p>
<div class="staff-example" id="ch1-ex4"></div>
<p><span class="highlight">Middle C</span> (C4) sits on a small line between the two staves — this is called a <span class="highlight">ledger line</span>.</p>
<p>Ledger lines are short lines added above or below the staff for notes that don't fit on the 5 lines. They extend the range of the staff.</p>`,
        render(container) {
            const el = container.querySelector("#ch1-ex4");
            if (!el) return;
            const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 200 } });
            const score = factory.EasyScore();
            const system = factory.System({ x: 0, y: 0, width: 260 });
            const trebleVoice = score.voice(score.notes("C4/w", { clef: "treble" }));
            const bassVoice = score.voice(score.notes("C4/w", { clef: "bass" }));
            system.addStave({ voices: [trebleVoice] }).addClef("treble");
            system.addStave({ voices: [bassVoice] }).addClef("bass");
            system.addConnector("brace");
            system.addConnector("singleLeft");
            factory.draw();
        }
    },
],
```

**Step 2: Write Chapter 2 — Notes on the Staff (4 pages)**

```javascript
pages: [
    {
        title: "Notes Live on Lines and Spaces",
        content: `<p>Every note on the staff sits either <span class="highlight">on a line</span> (the line passes through the middle of the note) or <span class="highlight">in a space</span> (between two lines).</p>
<div class="staff-example" id="ch2-ex1"></div>
<p>Moving up the staff means higher pitch. Moving down means lower. Each step (line to space, or space to line) moves one letter name: A, B, C, D, E, F, G — then it repeats.</p>`,
        render(container) {
            const el = container.querySelector("#ch2-ex1");
            if (!el) return;
            const factory = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
            const score = factory.EasyScore();
            const system = factory.System({ x: 0, y: 0, width: 300 });
            const voice = score.voice(score.notes("C4/q, D4/q, E4/q, F4/q, G4/q, A4/q, B4/q, C5/q", { clef: "treble" }), { time: "8/4" });
            system.addStave({ voices: [voice] }).addClef("treble");
            factory.draw();
        }
    },
    {
        title: "Treble Clef Notes",
        content: `<p>In the treble clef, the notes on the <strong>lines</strong> from bottom to top are:</p>
<p style="text-align:center;font-size:1.2em;"><span class="highlight">E &nbsp; G &nbsp; B &nbsp; D &nbsp; F</span></p>
<p>Remember: <span class="mnemonic">Every Good Boy Does Fine</span></p>
<div class="staff-example" id="ch2-ex2"></div>
<p>The notes in the <strong>spaces</strong> from bottom to top are:</p>
<p style="text-align:center;font-size:1.2em;"><span class="highlight">F &nbsp; A &nbsp; C &nbsp; E</span></p>
<p>They spell the word <span class="mnemonic">FACE</span>!</p>`,
        render(container) {
            const el = container.querySelector("#ch2-ex2");
            if (!el) return;
            const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
            const score = factory.EasyScore();
            const system = factory.System({ x: 0, y: 0, width: 260 });
            const voice = score.voice(score.notes("E4/h, G4/h, B4/h, D5/h", { clef: "treble" }), { time: "8/4" });
            system.addStave({ voices: [voice] }).addClef("treble");
            factory.draw();
        }
    },
    {
        title: "Bass Clef Notes",
        content: `<p>In the bass clef, the notes on the <strong>lines</strong> from bottom to top are:</p>
<p style="text-align:center;font-size:1.2em;"><span class="highlight">G &nbsp; B &nbsp; D &nbsp; F &nbsp; A</span></p>
<p>Remember: <span class="mnemonic">Good Boys Do Fine Always</span></p>
<div class="staff-example" id="ch2-ex3"></div>
<p>The notes in the <strong>spaces</strong> from bottom to top are:</p>
<p style="text-align:center;font-size:1.2em;"><span class="highlight">A &nbsp; C &nbsp; E &nbsp; G</span></p>
<p>Remember: <span class="mnemonic">All Cows Eat Grass</span></p>`,
        render(container) {
            const el = container.querySelector("#ch2-ex3");
            if (!el) return;
            const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
            const score = factory.EasyScore();
            const system = factory.System({ x: 0, y: 0, width: 260 });
            const voice = score.voice(score.notes("G2/h, B2/h, D3/h, F3/h", { clef: "bass" }), { time: "8/4" });
            system.addStave({ voices: [voice] }).addClef("bass");
            factory.draw();
        }
    },
    {
        title: "Octaves and Middle C",
        content: `<p>The musical alphabet (A through G) repeats over and over. Each repetition is called an <span class="highlight">octave</span>. We use numbers to tell octaves apart: C3, C4, C5, etc.</p>
<p><span class="highlight">Middle C (C4)</span> is the note right between the treble and bass clefs. On the piano, it's near the center of the keyboard.</p>
<div class="staff-example" id="ch2-ex4"></div>
<p>In the treble clef, Middle C sits on a ledger line below the staff. In the bass clef, it sits on a ledger line above the staff. Same note, two ways to write it!</p>`,
        render(container) {
            const el = container.querySelector("#ch2-ex4");
            if (!el) return;
            const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 200 } });
            const score = factory.EasyScore();
            const system = factory.System({ x: 0, y: 0, width: 260 });
            system.addStave({ voices: [score.voice(score.notes("C4/w", { clef: "treble" }))] }).addClef("treble");
            system.addStave({ voices: [score.voice(score.notes("C4/w", { clef: "bass" }))] }).addClef("bass");
            system.addConnector("brace");
            system.addConnector("singleLeft");
            factory.draw();
        }
    },
],
```

**Step 3: Write Chapter 3 — Note Values (4 pages)**

```javascript
pages: [
    {
        title: "Notes Have Duration",
        content: `<p>Notes don't just tell you <em>which</em> pitch to play — they also tell you <span class="highlight">how long</span> to hold it.</p>
<p>The shape of a note indicates its duration. The most common note values, from longest to shortest:</p>
<ul style="list-style:none;padding:0;">
<li style="margin:6px 0;"><span class="highlight">Whole note</span> — an open oval, no stem (4 beats)</li>
<li style="margin:6px 0;"><span class="highlight">Half note</span> — an open oval with a stem (2 beats)</li>
<li style="margin:6px 0;"><span class="highlight">Quarter note</span> — a filled oval with a stem (1 beat)</li>
<li style="margin:6px 0;"><span class="highlight">Eighth note</span> — filled with a stem and one flag (1/2 beat)</li>
<li style="margin:6px 0;"><span class="highlight">Sixteenth note</span> — filled with a stem and two flags (1/4 beat)</li>
</ul>`,
    },
    {
        title: "Whole and Half Notes",
        content: `<p>A <span class="highlight">whole note</span> lasts for 4 beats — it fills an entire measure of 4/4 time. It looks like an open (hollow) oval with no stem.</p>
<div class="staff-example" id="ch3-ex1"></div>
<p>A <span class="highlight">half note</span> lasts for 2 beats — two half notes fill one measure. It looks like an open oval with a stem.</p>
<div class="staff-example" id="ch3-ex2"></div>
<p>Each half note is exactly half the duration of a whole note.</p>`,
        render(container) {
            let el = container.querySelector("#ch3-ex1");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("C4/w", { clef: "treble" }))] }).addClef("treble");
                f.draw();
            }
            el = container.querySelector("#ch3-ex2");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("C4/h, E4/h", { clef: "treble" }), { time: "4/4" })] }).addClef("treble");
                f.draw();
            }
        }
    },
    {
        title: "Quarter and Eighth Notes",
        content: `<p>A <span class="highlight">quarter note</span> lasts 1 beat. It looks like a filled (solid) oval with a stem. Four quarter notes fill one measure.</p>
<div class="staff-example" id="ch3-ex3"></div>
<p>An <span class="highlight">eighth note</span> lasts 1/2 beat. It has a filled oval, a stem, and a single flag. When grouped, eighth notes are connected by a beam.</p>
<div class="staff-example" id="ch3-ex4"></div>`,
        render(container) {
            let el = container.querySelector("#ch3-ex3");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q", { clef: "treble" }))] }).addClef("treble");
                f.draw();
            }
            el = container.querySelector("#ch3-ex4");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("C4/8, D4/8, E4/8, F4/8, G4/8, A4/8, B4/8, C5/8", { clef: "treble" }), { time: "4/4" })] }).addClef("treble");
                f.draw();
            }
        }
    },
    {
        title: "The Duration Tree",
        content: `<p>Each note value is exactly <span class="highlight">half the duration</span> of the one above it:</p>
<div style="text-align:center;padding:10px 0;line-height:2;">
<div style="font-size:1.1em;">1 Whole = <span class="highlight">4 beats</span></div>
<div>= 2 Half notes = <span class="highlight">2 beats each</span></div>
<div>= 4 Quarter notes = <span class="highlight">1 beat each</span></div>
<div>= 8 Eighth notes = <span class="highlight">1/2 beat each</span></div>
<div>= 16 Sixteenth notes = <span class="highlight">1/4 beat each</span></div>
</div>
<p>A <span class="highlight">dotted note</span> adds half its value again. For example, a dotted half note = 2 + 1 = 3 beats. A dotted quarter = 1 + 1/2 = 1.5 beats.</p>
<p>A <span class="highlight">tie</span> connects two notes of the same pitch, combining their durations into one longer note.</p>`,
    },
],
```

**Step 4: Write Chapter 4 — Rests (3 pages)**

```javascript
pages: [
    {
        title: "Silence Has Notation Too",
        content: `<p>In music, silence is just as important as sound. <span class="highlight">Rests</span> tell you when <em>not</em> to play — and for how long.</p>
<p>Every note value has a matching rest of the same duration:</p>
<ul style="list-style:none;padding:0;">
<li style="margin:6px 0;"><span class="highlight">Whole rest</span> — hangs from the 4th line (4 beats)</li>
<li style="margin:6px 0;"><span class="highlight">Half rest</span> — sits on the 3rd line (2 beats)</li>
<li style="margin:6px 0;"><span class="highlight">Quarter rest</span> — a zigzag shape (1 beat)</li>
<li style="margin:6px 0;"><span class="highlight">Eighth rest</span> — looks like the number 7 (1/2 beat)</li>
<li style="margin:6px 0;"><span class="highlight">Sixteenth rest</span> — like an eighth rest with two flags (1/4 beat)</li>
</ul>`,
    },
    {
        title: "Whole and Half Rests",
        content: `<p>The <span class="highlight">whole rest</span> and <span class="highlight">half rest</span> look similar — both are small rectangles — but they sit in different positions:</p>
<div class="staff-example" id="ch4-ex1"></div>
<p>The whole rest <strong>hangs down</strong> from the fourth line (think: it's so <em>heavy</em> with 4 beats it hangs). The half rest <strong>sits on top</strong> of the third line (it's lighter with only 2 beats, so it sits up).</p>
<p>Tip: The whole rest looks like a <strong>hole</strong> in the ground. The half rest looks like a <strong>hat</strong>.</p>`,
        render(container) {
            const el = container.querySelector("#ch4-ex1");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("B4/h/r, B4/h/r", { clef: "treble" }), { time: "4/4" })] }).addClef("treble");
                f.draw();
            }
        }
    },
    {
        title: "Quarter, Eighth, and Sixteenth Rests",
        content: `<p>The <span class="highlight">quarter rest</span> looks like a zigzag or lightning bolt. It represents 1 beat of silence.</p>
<div class="staff-example" id="ch4-ex2"></div>
<p>The <span class="highlight">eighth rest</span> looks like the number 7 with a dot. It represents 1/2 beat of silence.</p>
<p>The <span class="highlight">sixteenth rest</span> is similar to the eighth rest but with two flags. It represents 1/4 beat of silence.</p>
<p>Rests follow the same duration tree as notes: each rest is half the length of the one before it.</p>`,
        render(container) {
            const el = container.querySelector("#ch4-ex2");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("C4/q, B4/q/r, E4/q, B4/q/r", { clef: "treble" }))] }).addClef("treble");
                f.draw();
            }
        }
    },
],
```

**Step 5: Write Chapter 5 — Time Signatures (3 pages)**

```javascript
pages: [
    {
        title: "What Is a Time Signature?",
        content: `<p>A <span class="highlight">time signature</span> appears at the beginning of a piece and tells you two things:</p>
<ul style="list-style:none;padding:0;">
<li style="margin:8px 0;"><span class="highlight">Top number</span> — how many beats are in each measure</li>
<li style="margin:8px 0;"><span class="highlight">Bottom number</span> — which note value gets one beat</li>
</ul>
<div class="staff-example" id="ch5-ex1"></div>
<p>A <strong>measure</strong> (or bar) is the space between two vertical bar lines. Measures organize music into groups of beats.</p>`,
        render(container) {
            const el = container.querySelector("#ch5-ex1");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q", { clef: "treble" }))] }).addClef("treble").addTimeSignature("4/4");
                f.draw();
            }
        }
    },
    {
        title: "Common Time Signatures",
        content: `<p><span class="highlight">4/4</span> (Common Time) — 4 quarter-note beats per measure. This is the most common time signature in popular music.</p>
<div class="staff-example" id="ch5-ex2"></div>
<p><span class="highlight">3/4</span> (Waltz Time) — 3 quarter-note beats per measure. Think of a waltz: ONE-two-three, ONE-two-three.</p>
<div class="staff-example" id="ch5-ex3"></div>
<p><span class="highlight">2/4</span> (March Time) — 2 quarter-note beats per measure. Often used in marches: LEFT-right, LEFT-right.</p>`,
        render(container) {
            let el = container.querySelector("#ch5-ex2");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("C4/q, E4/q, G4/q, C5/q", { clef: "treble" }))] }).addClef("treble").addTimeSignature("4/4");
                f.draw();
            }
            el = container.querySelector("#ch5-ex3");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("C4/q, E4/q, G4/q", { clef: "treble" }), { time: "3/4" })] }).addClef("treble").addTimeSignature("3/4");
                f.draw();
            }
        }
    },
    {
        title: "Compound Time: 6/8",
        content: `<p><span class="highlight">6/8</span> — 6 eighth-note beats per measure, typically felt as 2 groups of 3. This gives music a "rolling" or "swaying" feel.</p>
<div class="staff-example" id="ch5-ex4"></div>
<p>The difference between 3/4 and 6/8: both have similar total beats, but 3/4 groups as <strong>3 groups of 2</strong> eighth notes, while 6/8 groups as <strong>2 groups of 3</strong> eighth notes. The emphasis pattern is different.</p>
<p>You can usually tell the difference by listening: 3/4 feels like "ONE-two-three" while 6/8 feels like "ONE-two-three-FOUR-five-six".</p>`,
        render(container) {
            const el = container.querySelector("#ch5-ex4");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 300 });
                sys.addStave({ voices: [s.voice(s.notes("C4/8, D4/8, E4/8, F4/8, G4/8, A4/8", { clef: "treble" }), { time: "6/8" })] }).addClef("treble").addTimeSignature("6/8");
                f.draw();
            }
        }
    },
],
```

**Step 6: Write Chapter 6 — Key Signatures & Accidentals (4 pages)**

```javascript
pages: [
    {
        title: "Accidentals: Sharps, Flats, and Naturals",
        content: `<p><span class="highlight">Accidentals</span> are symbols that change a note's pitch:</p>
<ul style="list-style:none;padding:0;">
<li style="margin:8px 0;"><span class="highlight">Sharp (#)</span> — raises a note by one half step</li>
<li style="margin:8px 0;"><span class="highlight">Flat (b)</span> — lowers a note by one half step</li>
<li style="margin:8px 0;"><span class="highlight">Natural (♮)</span> — cancels a previous sharp or flat</li>
</ul>
<div class="staff-example" id="ch6-ex1"></div>
<p>On the piano, a half step is the distance from one key to the very next key (including black keys). C to C# is a half step up. D to Db is a half step down.</p>`,
        render(container) {
            const el = container.querySelector("#ch6-ex1");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("C4/q, C#4/q, D4/q, Db4/q", { clef: "treble" }))] }).addClef("treble");
                f.draw();
            }
        }
    },
    {
        title: "What Is a Key Signature?",
        content: `<p>Instead of writing sharps or flats next to every note, composers use a <span class="highlight">key signature</span> at the beginning of each line.</p>
<p>A key signature tells you which notes are <em>always</em> sharp or flat throughout the piece (unless cancelled by a natural sign).</p>
<div class="staff-example" id="ch6-ex2"></div>
<p>This is the key of G Major — it has one sharp (F#). Every F in the piece is played as F#, without needing to write the # each time.</p>`,
        render(container) {
            const el = container.querySelector("#ch6-ex2");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("G4/q, A4/q, B4/q, G4/q", { clef: "treble" }))] }).addClef("treble").addKeySignature("G");
                f.draw();
            }
        }
    },
    {
        title: "The Order of Sharps and Flats",
        content: `<p>Sharps and flats in key signatures always appear in a specific order:</p>
<p><span class="highlight">Sharps:</span> <span class="mnemonic">Father Charles Goes Down And Ends Battle</span></p>
<p style="text-align:center;font-size:1.1em;">F# &nbsp; C# &nbsp; G# &nbsp; D# &nbsp; A# &nbsp; E# &nbsp; B#</p>
<p><span class="highlight">Flats:</span> <span class="mnemonic">Battle Ends And Down Goes Charles' Father</span> (reverse order!)</p>
<p style="text-align:center;font-size:1.1em;">Bb &nbsp; Eb &nbsp; Ab &nbsp; Db &nbsp; Gb &nbsp; Cb &nbsp; Fb</p>
<div class="staff-example" id="ch6-ex3"></div>
<p>The key of D Major has 2 sharps (F# and C#). The key of Bb Major has 2 flats (Bb and Eb).</p>`,
        render(container) {
            const el = container.querySelector("#ch6-ex3");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("D4/h, A4/h", { clef: "treble" }), { time: "4/4" })] }).addClef("treble").addKeySignature("D");
                f.draw();
            }
        }
    },
    {
        title: "Identifying Key Signatures",
        content: `<p>Quick tricks for identifying key signatures:</p>
<p><span class="highlight">For sharp keys:</span> The last sharp is always one half step below the key name. If the last sharp is F#, the key is G. If the last sharp is C#, the key is D.</p>
<p><span class="highlight">For flat keys:</span> The key name is the second-to-last flat. If you see Bb and Eb, the key is Bb. If you see Bb, Eb, and Ab, the key is Eb.</p>
<p>Special cases: <span class="highlight">C Major</span> has no sharps or flats. <span class="highlight">F Major</span> has one flat (Bb) — you just have to remember this one.</p>
<div class="staff-example" id="ch6-ex4"></div>
<p>You already practiced identifying key signatures in the Key Signatures mode — now you know <em>why</em> they work!</p>`,
        render(container) {
            const el = container.querySelector("#ch6-ex4");
            if (el) {
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const sys = f.System({ x: 0, y: 0, width: 260 });
                sys.addStave({ voices: [s.voice(s.notes("Eb4/h, Bb4/h", { clef: "treble" }), { time: "4/4" })] }).addClef("treble").addKeySignature("Eb");
                f.draw();
            }
        }
    },
],
```

**Step 7: Verify all chapters have content**

Check that each `NOTATION_CHAPTERS[n].pages.length` is 3-4 pages.

**Step 8: Commit**

```bash
git add index.html
git commit -m "Add lesson content for all 6 notation chapters"
```

---

### Task 5: Write Quiz Pools for All 6 Chapters

**Files:**
- Modify: `index.html` — fill in the `quizPool` arrays in `NOTATION_CHAPTERS`

Each question is: `{ id: string, prompt: string, render: function|null, options: string[], correctIndex: number }`

The `render` function draws VexFlow into the `#nq-staff` element. If null, the staff container is hidden and only the text prompt is shown.

**Step 1: Write Chapter 1 quiz pool (The Staff & Clefs)**

```javascript
quizPool: [
    { id: "1-1", prompt: "How many lines does a musical staff have?", render: null, options: ["4", "5", "6", "3"], correctIndex: 1 },
    { id: "1-2", prompt: "How many spaces are between the lines of a staff?", render: null, options: ["3", "5", "4", "6"], correctIndex: 2 },
    { id: "1-3", prompt: "Which clef is shown?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble");
        f.draw();
    }, options: ["Treble clef", "Bass clef", "Alto clef", "Tenor clef"], correctIndex: 0 },
    { id: "1-4", prompt: "Which clef is shown?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("D3/w/r", { clef: "bass" }))] }).addClef("bass");
        f.draw();
    }, options: ["Alto clef", "Treble clef", "Bass clef", "Tenor clef"], correctIndex: 2 },
    { id: "1-5", prompt: "The treble clef is also known as the:", render: null, options: ["F clef", "G clef", "C clef", "D clef"], correctIndex: 1 },
    { id: "1-6", prompt: "The bass clef is also known as the:", render: null, options: ["G clef", "C clef", "D clef", "F clef"], correctIndex: 3 },
    { id: "1-7", prompt: "What is a ledger line?", render: null, options: ["A short line extending the staff", "A vertical bar line", "A line connecting two staves", "A line showing tempo"], correctIndex: 0 },
    { id: "1-8", prompt: "The grand staff combines:", render: null, options: ["Two treble clefs", "Treble and bass clefs", "Two bass clefs", "Treble and alto clefs"], correctIndex: 1 },
    { id: "1-9", prompt: "Where does Middle C sit on the grand staff?", render: null, options: ["Top of treble staff", "On a ledger line between the staves", "Bottom of bass staff", "Third line of treble staff"], correctIndex: 1 },
    { id: "1-10", prompt: "Higher position on the staff means:", render: null, options: ["Lower pitch", "Louder sound", "Higher pitch", "Faster tempo"], correctIndex: 2 },
],
```

**Step 2: Write Chapter 2 quiz pool (Notes on the Staff)**

```javascript
quizPool: [
    { id: "2-1", prompt: "What note is this?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("E4/w"))] }).addClef("treble");
        f.draw();
    }, options: ["E", "F", "D", "G"], correctIndex: 0 },
    { id: "2-2", prompt: "What note is this?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("A4/w"))] }).addClef("treble");
        f.draw();
    }, options: ["G", "B", "A", "C"], correctIndex: 2 },
    { id: "2-3", prompt: "What note is this?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("F4/w"))] }).addClef("treble");
        f.draw();
    }, options: ["E", "G", "D", "F"], correctIndex: 3 },
    { id: "2-4", prompt: "What note is this?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B2/w", { clef: "bass" }))] }).addClef("bass");
        f.draw();
    }, options: ["A", "C", "B", "D"], correctIndex: 2 },
    { id: "2-5", prompt: "What note is this?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("D3/w", { clef: "bass" }))] }).addClef("bass");
        f.draw();
    }, options: ["C", "E", "D", "F"], correctIndex: 2 },
    { id: "2-6", prompt: "Treble clef line notes from bottom: E, G, B, D, ___", render: null, options: ["A", "F", "C", "E"], correctIndex: 1 },
    { id: "2-7", prompt: "Treble clef space notes spell:", render: null, options: ["FADE", "FACE", "CAGE", "CAFE"], correctIndex: 1 },
    { id: "2-8", prompt: "Bass clef line notes from bottom: G, B, D, F, ___", render: null, options: ["A", "G", "E", "C"], correctIndex: 0 },
    { id: "2-9", prompt: "Bass clef space notes from bottom: A, C, E, ___", render: null, options: ["F", "B", "G", "D"], correctIndex: 2 },
    { id: "2-10", prompt: "Middle C is also known as:", render: null, options: ["C3", "C5", "C4", "C2"], correctIndex: 2 },
],
```

**Step 3: Write Chapter 3 quiz pool (Note Values)**

```javascript
quizPool: [
    { id: "3-1", prompt: "What type of note is this?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("C4/w"))] }).addClef("treble");
        f.draw();
    }, options: ["Whole note", "Half note", "Quarter note", "Eighth note"], correctIndex: 0 },
    { id: "3-2", prompt: "What type of note is this?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("C4/h, B4/h/r"), { time: "4/4" })] }).addClef("treble");
        f.draw();
    }, options: ["Quarter note", "Whole note", "Half note", "Eighth note"], correctIndex: 2 },
    { id: "3-3", prompt: "What type of note is this?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("C4/q, B4/q/r, B4/q/r, B4/q/r"))] }).addClef("treble");
        f.draw();
    }, options: ["Half note", "Eighth note", "Quarter note", "Sixteenth note"], correctIndex: 2 },
    { id: "3-4", prompt: "How many beats does a whole note get in 4/4 time?", render: null, options: ["1", "2", "3", "4"], correctIndex: 3 },
    { id: "3-5", prompt: "How many beats does a half note get?", render: null, options: ["4", "1", "2", "1/2"], correctIndex: 2 },
    { id: "3-6", prompt: "How many beats does a quarter note get?", render: null, options: ["2", "1", "1/2", "4"], correctIndex: 1 },
    { id: "3-7", prompt: "How many quarter notes equal one whole note?", render: null, options: ["2", "8", "3", "4"], correctIndex: 3 },
    { id: "3-8", prompt: "How many eighth notes equal one quarter note?", render: null, options: ["4", "2", "1", "8"], correctIndex: 1 },
    { id: "3-9", prompt: "A dotted half note gets how many beats?", render: null, options: ["2", "3", "4", "2.5"], correctIndex: 1 },
    { id: "3-10", prompt: "What does a tie do?", render: null, options: ["Raises pitch by half step", "Combines duration of two notes", "Separates measures", "Indicates silence"], correctIndex: 1 },
],
```

**Step 4: Write Chapter 4 quiz pool (Rests)**

```javascript
quizPool: [
    { id: "4-1", prompt: "What type of rest is shown? (It hangs from a line)", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble");
        f.draw();
    }, options: ["Half rest", "Whole rest", "Quarter rest", "Eighth rest"], correctIndex: 1 },
    { id: "4-2", prompt: "How many beats of silence does a whole rest get in 4/4?", render: null, options: ["1", "2", "3", "4"], correctIndex: 3 },
    { id: "4-3", prompt: "How many beats does a half rest get?", render: null, options: ["1", "4", "2", "1/2"], correctIndex: 2 },
    { id: "4-4", prompt: "How many beats does a quarter rest get?", render: null, options: ["2", "4", "1/2", "1"], correctIndex: 3 },
    { id: "4-5", prompt: "The whole rest hangs DOWN, the half rest sits UP. True or false?", render: null, options: ["True", "False"], correctIndex: 0 },
    { id: "4-6", prompt: "How many beats does an eighth rest get?", render: null, options: ["1", "1/4", "2", "1/2"], correctIndex: 3 },
    { id: "4-7", prompt: "A rest tells you to:", render: null, options: ["Play louder", "Be silent", "Play faster", "Repeat a note"], correctIndex: 1 },
    { id: "4-8", prompt: "Which rest looks like a zigzag or lightning bolt?", render: null, options: ["Whole rest", "Half rest", "Quarter rest", "Eighth rest"], correctIndex: 2 },
    { id: "4-9", prompt: "How many eighth rests equal one quarter rest?", render: null, options: ["4", "1", "2", "8"], correctIndex: 2 },
    { id: "4-10", prompt: "Every note value has a corresponding:", render: null, options: ["Clef", "Rest of equal duration", "Key signature", "Time signature"], correctIndex: 1 },
],
```

**Step 5: Write Chapter 5 quiz pool (Time Signatures)**

```javascript
quizPool: [
    { id: "5-1", prompt: "What time signature is shown?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble").addTimeSignature("4/4");
        f.draw();
    }, options: ["3/4", "4/4", "2/4", "6/8"], correctIndex: 1 },
    { id: "5-2", prompt: "What time signature is shown?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/h/r, B4/q/r"), { time: "3/4" })] }).addClef("treble").addTimeSignature("3/4");
        f.draw();
    }, options: ["4/4", "6/8", "2/4", "3/4"], correctIndex: 3 },
    { id: "5-3", prompt: "What time signature is shown?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/h/r"), { time: "2/4" })] }).addClef("treble").addTimeSignature("2/4");
        f.draw();
    }, options: ["3/4", "4/4", "2/4", "6/8"], correctIndex: 2 },
    { id: "5-4", prompt: "In 4/4 time, how many beats are in each measure?", render: null, options: ["2", "3", "4", "6"], correctIndex: 2 },
    { id: "5-5", prompt: "In 3/4 time, how many beats are in each measure?", render: null, options: ["2", "3", "4", "6"], correctIndex: 1 },
    { id: "5-6", prompt: "The top number in a time signature tells you:", render: null, options: ["Tempo", "Key", "Beats per measure", "Note value"], correctIndex: 2 },
    { id: "5-7", prompt: "The bottom number 4 means which note gets one beat?", render: null, options: ["Whole note", "Half note", "Quarter note", "Eighth note"], correctIndex: 2 },
    { id: "5-8", prompt: "3/4 time is commonly associated with:", render: null, options: ["March", "Waltz", "Rock music", "Jazz"], correctIndex: 1 },
    { id: "5-9", prompt: "In 6/8 time, beats are typically grouped as:", render: null, options: ["6 groups of 1", "3 groups of 2", "2 groups of 3", "1 group of 6"], correctIndex: 2 },
    { id: "5-10", prompt: "A measure is the space between two:", render: null, options: ["Clefs", "Rests", "Bar lines", "Key signatures"], correctIndex: 2 },
],
```

**Step 6: Write Chapter 6 quiz pool (Key Signatures & Accidentals)**

```javascript
quizPool: [
    { id: "6-1", prompt: "What does a sharp (#) do to a note?", render: null, options: ["Lowers by half step", "Raises by half step", "Doubles duration", "Cancels a flat"], correctIndex: 1 },
    { id: "6-2", prompt: "What does a flat (b) do to a note?", render: null, options: ["Raises by half step", "Cancels a sharp", "Lowers by half step", "Halves duration"], correctIndex: 2 },
    { id: "6-3", prompt: "What does a natural sign do?", render: null, options: ["Raises by half step", "Lowers by half step", "Cancels a sharp or flat", "Doubles the note"], correctIndex: 2 },
    { id: "6-4", prompt: "What key signature is shown?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble").addKeySignature("G");
        f.draw();
    }, options: ["C Major", "D Major", "G Major", "F Major"], correctIndex: 2 },
    { id: "6-5", prompt: "What key signature is shown?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble").addKeySignature("F");
        f.draw();
    }, options: ["G Major", "C Major", "Bb Major", "F Major"], correctIndex: 3 },
    { id: "6-6", prompt: "The order of sharps begins with:", render: null, options: ["C#", "G#", "F#", "B#"], correctIndex: 2 },
    { id: "6-7", prompt: "The order of flats begins with:", render: null, options: ["Eb", "Ab", "Bb", "Db"], correctIndex: 2 },
    { id: "6-8", prompt: "C Major has how many sharps or flats?", render: null, options: ["1 sharp", "1 flat", "None", "2 sharps"], correctIndex: 2 },
    { id: "6-9", prompt: "For sharp keys, the key name is one half step above:", render: null, options: ["The first sharp", "The last sharp", "Middle C", "The clef"], correctIndex: 1 },
    { id: "6-10", prompt: "What key signature is shown?", render(el) {
        const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
        const s = f.EasyScore();
        f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble").addKeySignature("D");
        f.draw();
    }, options: ["A Major", "G Major", "D Major", "E Major"], correctIndex: 2 },
],
```

**Step 7: Commit**

```bash
git add index.html
git commit -m "Add quiz pools for all 6 notation chapters"
```

---

### Task 6: Implement Chapter List Screen Logic

**Files:**
- Modify: `index.html` — add JS functions in script block

**Step 1: Implement showNotationChapterList()**

Add in the screen management section (~after `showQuizScreen`):

```javascript
// ============================================================
// Notation Learning Mode
// ============================================================
let notationProgress = null;
let currentChapterId = null;
let currentLessonPage = 0;
let currentQuizQuestion = null;
let nqFirstAttempt = true;
let nqDisplayTime = null;

function showNotationChapterList() {
    notationProgress = getNotationProgress();
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("active");
    document.getElementById("notation-lesson").classList.remove("active");
    document.getElementById("notation-quiz").classList.remove("active");
    document.getElementById("notation-chapters").classList.add("active");
    buildChapterList();
}

function buildChapterList() {
    const list = document.getElementById("chapter-list");
    list.innerHTML = "";
    const currentCh = getNotationCurrentChapter(notationProgress);

    for (const ch of NOTATION_CHAPTERS) {
        const chProg = notationProgress.chapters[ch.id];
        const isCompleted = chProg && chProg.quizPassed;
        const isCurrent = ch.id === currentCh;
        const isLocked = !allLevelsUnlocked && ch.id > currentCh;

        const item = document.createElement("div");
        item.className = "chapter-item" + (isCompleted ? " completed" : "") + (isCurrent ? " current" : "") + (isLocked ? " locked" : "");

        item.innerHTML = `
            <div class="chapter-num">${isCompleted ? "✓" : ch.id}</div>
            <div class="chapter-info">
                <h3>${ch.title}</h3>
                <p>${ch.subtitle}${chProg && chProg.lessonComplete ? " · Lesson complete" : ""}${isCompleted ? " · Quiz passed" : ""}</p>
            </div>
        `;

        if (!isLocked) {
            item.addEventListener("click", () => startChapter(ch.id));
        }

        list.appendChild(item);
    }
}

function startChapter(chapterId) {
    currentChapterId = chapterId;
    const chProg = notationProgress.chapters[chapterId];

    if (chProg && chProg.lessonComplete) {
        // Lesson already done — let user choose lesson review or quiz
        showNotationLesson(chapterId, 0);
    } else {
        showNotationLesson(chapterId, chProg ? chProg.lessonPage : 0);
    }
}
```

**Step 2: Add back button handler**

In event handlers section, add:

```javascript
document.getElementById("notation-back-menu").addEventListener("click", () => showMainMenu());
```

**Step 3: Update showMainMenu to hide notation screens**

In `showMainMenu()`, add these lines to hide notation screens:

```javascript
document.getElementById("notation-chapters").classList.remove("active");
document.getElementById("notation-lesson").classList.remove("active");
document.getElementById("notation-quiz").classList.remove("active");
```

**Step 4: Verify chapter list renders**

Open browser, click "Music Notation" card, confirm chapter list appears with 6 chapters. Chapter 1 should be highlighted as current, others locked (except if unlockAll is on).

**Step 5: Commit**

```bash
git add index.html
git commit -m "Implement notation chapter list screen"
```

---

### Task 7: Implement Lesson Screen Logic

**Files:**
- Modify: `index.html` — add JS functions

**Step 1: Implement showNotationLesson()**

```javascript
function showNotationLesson(chapterId, pageIndex) {
    currentChapterId = chapterId;
    const chapter = NOTATION_CHAPTERS.find(c => c.id === chapterId);
    if (!chapter) return;

    currentLessonPage = Math.min(pageIndex, chapter.pages.length - 1);

    document.getElementById("notation-chapters").classList.remove("active");
    document.getElementById("notation-quiz").classList.remove("active");
    document.getElementById("notation-lesson").classList.add("active");

    document.getElementById("lesson-title").textContent = chapter.title;
    renderLessonPage(chapter);
}

function renderLessonPage(chapter) {
    const page = chapter.pages[currentLessonPage];
    const content = document.getElementById("lesson-content");
    content.innerHTML = `<h3>${page.title}</h3>${page.content}`;

    // Render VexFlow examples if page has a render function
    if (page.render) {
        // Small delay to ensure DOM is ready
        requestAnimationFrame(() => page.render(content));
    }

    // Update page indicator
    document.getElementById("lesson-page-indicator").textContent =
        `Page ${currentLessonPage + 1} of ${chapter.pages.length}`;

    // Update navigation buttons
    const prevBtn = document.getElementById("lesson-prev");
    const nextBtn = document.getElementById("lesson-next");
    prevBtn.style.display = currentLessonPage > 0 ? "inline-block" : "none";

    const isLastPage = currentLessonPage >= chapter.pages.length - 1;
    nextBtn.textContent = isLastPage ? "Start Quiz" : "Next";
    nextBtn.className = isLastPage ? "primary" : "";

    // Save lesson page progress
    if (!notationProgress.chapters[chapter.id].lessonComplete) {
        notationProgress.chapters[chapter.id].lessonPage = currentLessonPage;
        saveNotationProgress(notationProgress);
    }
}
```

**Step 2: Add lesson navigation handlers**

```javascript
document.getElementById("lesson-prev").addEventListener("click", () => {
    if (currentLessonPage > 0) {
        currentLessonPage--;
        const chapter = NOTATION_CHAPTERS.find(c => c.id === currentChapterId);
        renderLessonPage(chapter);
    }
});

document.getElementById("lesson-next").addEventListener("click", () => {
    const chapter = NOTATION_CHAPTERS.find(c => c.id === currentChapterId);
    if (currentLessonPage >= chapter.pages.length - 1) {
        // Mark lesson complete and start quiz
        notationProgress.chapters[chapter.id].lessonComplete = true;
        saveNotationProgress(notationProgress);
        showNotationQuiz(chapter.id);
    } else {
        currentLessonPage++;
        renderLessonPage(chapter);
    }
});

document.getElementById("lesson-back-chapters").addEventListener("click", () => showNotationChapterList());
```

**Step 3: Verify lesson pages work**

Open browser, navigate to Chapter 1, flip through all pages. Confirm:
- VexFlow examples render correctly in the white boxes
- Page indicator updates
- Previous button appears after page 1
- Last page shows "Start Quiz" button

**Step 4: Commit**

```bash
git add index.html
git commit -m "Implement notation lesson screen with VexFlow rendering"
```

---

### Task 8: Implement Notation Quiz Logic with SM-2

**Files:**
- Modify: `index.html` — add JS functions

**Step 1: Implement showNotationQuiz()**

```javascript
function showNotationQuiz(chapterId) {
    currentChapterId = chapterId;
    const chapter = NOTATION_CHAPTERS.find(c => c.id === chapterId);
    if (!chapter) return;

    document.getElementById("notation-chapters").classList.remove("active");
    document.getElementById("notation-lesson").classList.remove("active");
    document.getElementById("notation-quiz").classList.add("active");

    document.getElementById("nq-title").textContent = `Quiz: ${chapter.title}`;

    // Initialize quiz stats for this chapter if needed
    const chProg = notationProgress.chapters[chapterId];
    if (!chProg.quizStats || Object.keys(chProg.quizStats).length === 0) {
        chProg.quizStats = {};
        chProg.quizMemory = {};
        for (const q of chapter.quizPool) {
            chProg.quizStats[q.id] = { correct: 0, total: 0 };
            chProg.quizMemory[q.id] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
        }
    }

    updateNQStatsDisplay();
    updateNQProgress();
    updateNQStreak();
    pickNextNQQuestion();
}

function pickNextNQQuestion() {
    const chapter = NOTATION_CHAPTERS.find(c => c.id === currentChapterId);
    const chProg = notationProgress.chapters[currentChapterId];
    chProg.roundNumber = (chProg.roundNumber || 0) + 1;

    const candidates = chapter.quizPool
        .filter(q => !currentQuizQuestion || q.id !== currentQuizQuestion.id)
        .map(q => {
            if (!chProg.quizMemory[q.id]) {
                chProg.quizMemory[q.id] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
            }
            const mem = chProg.quizMemory[q.id];
            const roundsSince = chProg.roundNumber - mem.lastSeen;
            const isDue = roundsSince >= mem.interval;
            let score = mem.priority;
            if (isDue) score += 10;
            if (roundsSince > mem.interval * 2) score += 5;
            score += Math.random() * 0.5;
            return { question: q, score };
        })
        .sort((a, b) => b.score - a.score);

    currentQuizQuestion = candidates[0].question;
    nqFirstAttempt = true;
    renderNQQuestion();
}

function renderNQQuestion() {
    const q = currentQuizQuestion;

    // Render staff if question has a render function
    const staffContainer = document.getElementById("nq-staff-container");
    const staffEl = document.getElementById("nq-staff");
    staffEl.innerHTML = "";
    if (q.render) {
        staffContainer.style.display = "flex";
        q.render(staffEl);
    } else {
        staffContainer.style.display = "none";
    }

    // Show prompt
    document.getElementById("nq-prompt").textContent = q.prompt;

    // Build answer buttons
    const btnContainer = document.getElementById("nq-buttons");
    btnContainer.innerHTML = "";
    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "mc-btn";
        btn.textContent = opt;
        btn.addEventListener("click", () => handleNQAnswer(idx, btn));
        btn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            handleNQAnswer(idx, btn);
        }, { passive: false });
        btnContainer.appendChild(btn);
    });

    // Clear feedback
    document.getElementById("nq-feedback").textContent = "";
    document.getElementById("nq-feedback").className = "";
    document.getElementById("nq-response-time").textContent = "";

    nqDisplayTime = Date.now();
}

function handleNQAnswer(selectedIndex, btnElement) {
    if (isProcessingClick || !currentQuizQuestion) return;

    const q = currentQuizQuestion;
    const isCorrect = selectedIndex === q.correctIndex;
    const responseTime = Date.now() - nqDisplayTime;
    const chProg = notationProgress.chapters[currentChapterId];

    if (isCorrect) {
        isProcessingClick = true;
        btnElement.classList.add("correct");

        // Record stats
        if (nqFirstAttempt) {
            if (!chProg.quizStats[q.id]) chProg.quizStats[q.id] = { correct: 0, total: 0 };
            chProg.quizStats[q.id].total++;
            chProg.quizStats[q.id].correct++;
            chProg.currentStreak = (chProg.currentStreak || 0) + 1;
            chProg.longestStreak = Math.max(chProg.longestStreak || 0, chProg.currentStreak);
        }

        // SM-2 update
        const quality = calculateQuality(responseTime, true, nqFirstAttempt);
        updateNQSpacedRepetition(q.id, quality, chProg);

        // Feedback
        const feedback = document.getElementById("nq-feedback");
        feedback.textContent = "Correct!";
        feedback.style.color = "#8f8";
        const rtDisplay = document.getElementById("nq-response-time");
        const timeStr = (responseTime / 1000).toFixed(1);
        const speedLabel = responseTime < 1500 ? "Fast!" : responseTime < 3000 ? "Good" : "Keep practicing";
        rtDisplay.textContent = `${timeStr}s - ${speedLabel}`;

        saveNotationProgress(notationProgress);
        updateNQStatsDisplay();
        updateNQProgress();
        updateNQStreak();

        // Check for chapter completion
        if (checkNQChapterComplete()) {
            setTimeout(() => {
                isProcessingClick = false;
                showNQChapterComplete();
            }, 500);
            return;
        }

        setTimeout(() => {
            btnElement.classList.remove("correct");
            pickNextNQQuestion();
            isProcessingClick = false;
        }, 500);
    } else {
        btnElement.classList.add("wrong");

        if (nqFirstAttempt) {
            if (!chProg.quizStats[q.id]) chProg.quizStats[q.id] = { correct: 0, total: 0 };
            chProg.quizStats[q.id].total++;
            chProg.currentStreak = 0;
            updateNQSpacedRepetition(q.id, 0, chProg);
        }
        nqFirstAttempt = false;

        const feedback = document.getElementById("nq-feedback");
        feedback.textContent = `Wrong — ${q.options[q.correctIndex]}`;
        feedback.style.color = "#f88";

        saveNotationProgress(notationProgress);
        updateNQStatsDisplay();
        updateNQProgress();
        updateNQStreak();

        setTimeout(() => btnElement.classList.remove("wrong"), 200);
    }
}

function updateNQSpacedRepetition(questionId, quality, chProg) {
    if (!chProg.quizMemory[questionId]) {
        chProg.quizMemory[questionId] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
    }
    const mem = chProg.quizMemory[questionId];

    if (quality >= 3) {
        if (mem.repetitions === 0) mem.interval = 1;
        else if (mem.repetitions === 1) mem.interval = 3;
        else mem.interval = Math.round(mem.interval * mem.easiness);
        mem.repetitions++;
    } else {
        mem.repetitions = 0;
        mem.interval = 1;
    }

    mem.easiness = Math.max(1.3, mem.easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    mem.lastSeen = chProg.roundNumber;
    mem.priority = Math.max(0.1, 1 / mem.easiness);
}
```

**Step 2: Implement progress display helpers**

```javascript
function updateNQProgress() {
    const chapter = NOTATION_CHAPTERS.find(c => c.id === currentChapterId);
    const chProg = notationProgress.chapters[currentChapterId];
    const pool = chapter.quizPool;

    let totalCorrect = 0, totalAttempts = 0, itemsReady = 0;
    const minAttempts = 2;
    const threshold = 0.80;

    for (const q of pool) {
        const stat = chProg.quizStats[q.id];
        if (!stat) continue;
        totalCorrect += stat.correct;
        totalAttempts += stat.total;
        if (stat.total >= minAttempts) itemsReady++;
    }

    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;
    const accuracyPct = Math.round(accuracy * 100);
    const attemptProgress = itemsReady / pool.length;
    const accuracyProgress = Math.min(1, accuracy / threshold);
    const overallProgress = Math.min(1, attemptProgress * 0.4 + accuracyProgress * 0.6);

    const fill = document.getElementById("nq-progress-fill");
    fill.style.width = `${Math.round(overallProgress * 100)}%`;
    fill.style.background = accuracy >= threshold && itemsReady === pool.length ? "#22aa55" :
        accuracy >= threshold ? "#cc8800" : "#4488cc";

    document.getElementById("nq-progress-text").textContent =
        `${accuracyPct}% accuracy (need 80%) · ${itemsReady}/${pool.length} questions practiced (need ${minAttempts} each)`;
}

function updateNQStreak() {
    const chProg = notationProgress.chapters[currentChapterId];
    document.getElementById("nq-streak").textContent =
        `Streak: ${chProg.currentStreak || 0} | Best: ${chProg.longestStreak || 0}`;
}

function updateNQStatsDisplay() {
    const chapter = NOTATION_CHAPTERS.find(c => c.id === currentChapterId);
    const chProg = notationProgress.chapters[currentChapterId];
    const grid = document.getElementById("nq-stats-grid");
    grid.innerHTML = "";

    for (const q of chapter.quizPool) {
        const stat = chProg.quizStats[q.id];
        if (!stat) continue;
        const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;

        const div = document.createElement("div");
        div.className = "note-stat";
        if (accuracy !== null) {
            if (accuracy === 100) div.classList.add("perfect");
            else if (accuracy >= 80) div.classList.add("good");
            else if (accuracy >= 50) div.classList.add("struggling");
            else div.classList.add("bad");
        }

        // Truncate prompt for display
        const shortPrompt = q.prompt.length > 20 ? q.prompt.substring(0, 18) + "…" : q.prompt;
        div.innerHTML = `
            <div class="note-name" style="font-size:clamp(0.6rem,2vw,0.7rem);">${shortPrompt}</div>
            <div class="note-accuracy">${accuracy !== null ? `${accuracy}%` : '-'}</div>
        `;
        grid.appendChild(div);
    }
}

function checkNQChapterComplete() {
    const chapter = NOTATION_CHAPTERS.find(c => c.id === currentChapterId);
    const chProg = notationProgress.chapters[currentChapterId];
    const minAttempts = 2;
    const threshold = 0.80;

    let totalCorrect = 0, totalAttempts = 0;
    let allHaveMinAttempts = true;

    for (const q of chapter.quizPool) {
        const stat = chProg.quizStats[q.id];
        if (!stat) continue;
        totalCorrect += stat.correct;
        totalAttempts += stat.total;
        if (stat.total < minAttempts) allHaveMinAttempts = false;
    }

    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;
    return accuracy >= threshold && allHaveMinAttempts;
}

function showNQChapterComplete() {
    const chProg = notationProgress.chapters[currentChapterId];
    chProg.quizPassed = true;
    saveNotationProgress(notationProgress);

    const isLastChapter = currentChapterId >= NOTATION_CHAPTERS.length;
    const nextChapter = NOTATION_CHAPTERS.find(c => c.id === currentChapterId + 1);

    document.getElementById("next-level-name").textContent = isLastChapter || !nextChapter
        ? "You've completed all chapters!"
        : `Next: ${nextChapter.title}`;
    document.getElementById("level-complete").style.display = "flex";

    document.getElementById("continue-btn").style.display = (!isLastChapter && nextChapter) ? "inline-block" : "none";
    document.getElementById("stay-btn").style.display = "inline-block";
    document.getElementById("reset-stay-btn").style.display = "inline-block";

    // Override button behaviors for notation mode
    document.getElementById("continue-btn").onclick = () => {
        document.getElementById("level-complete").style.display = "none";
        if (nextChapter) startChapter(nextChapter.id);
    };
    document.getElementById("stay-btn").onclick = () => {
        document.getElementById("level-complete").style.display = "none";
        showNotationQuiz(currentChapterId);
    };
    document.getElementById("reset-stay-btn").onclick = () => {
        const cp = notationProgress.chapters[currentChapterId];
        cp.quizPassed = false;
        cp.quizStats = {};
        cp.quizMemory = {};
        cp.currentStreak = 0;
        cp.longestStreak = 0;
        cp.roundNumber = 0;
        const chapter = NOTATION_CHAPTERS.find(c => c.id === currentChapterId);
        for (const q of chapter.quizPool) {
            cp.quizStats[q.id] = { correct: 0, total: 0 };
            cp.quizMemory[q.id] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
        }
        saveNotationProgress(notationProgress);
        document.getElementById("level-complete").style.display = "none";
        showNotationQuiz(currentChapterId);
    };
    document.getElementById("menu-btn").onclick = () => {
        document.getElementById("level-complete").style.display = "none";
        showMainMenu();
    };
}
```

**Step 3: Add quiz back button handler**

```javascript
document.getElementById("quiz-back-chapters").addEventListener("click", () => showNotationChapterList());
```

**Step 4: Commit**

```bash
git add index.html
git commit -m "Implement notation quiz with SM-2 spaced repetition"
```

---

### Task 9: Restore Original Level Complete Handlers for Existing Modes

**Files:**
- Modify: `index.html` — ensure notation mode's button overrides don't break existing modes

**Step 1: Ensure level complete buttons work for both modes**

The issue: Task 8 overrides `onclick` on the level-complete buttons for notation mode. The existing modes use `addEventListener`. We need to make sure the original handlers still work when returning to non-notation modes.

Refactor: Save original handlers and restore them when entering non-notation modes. The simplest approach is to check `quizMode` state in the handler and adjust:

Change the level complete button handlers to be set up once, checking if we're in notation mode:

```javascript
// Replace the existing continue-btn, stay-btn, reset-stay-btn, menu-btn handlers
// with a unified approach that checks for notation mode
```

Actually, the cleaner approach: instead of overriding `onclick`, have the notation quiz use a separate overlay, OR use a flag. Let's use a flag:

Add a state variable:
```javascript
let isNotationQuizActive = false;
```

Set it to `true` in `showNotationQuiz()` and `false` in `showQuizScreen()` and `showMainMenu()`.

Then modify the existing handlers to check:

```javascript
document.getElementById("continue-btn").addEventListener("click", () => {
    if (isNotationQuizActive) {
        document.getElementById("level-complete").style.display = "none";
        const nextChapter = NOTATION_CHAPTERS.find(c => c.id === currentChapterId + 1);
        if (nextChapter) startChapter(nextChapter.id);
        return;
    }
    document.getElementById("level-complete").style.display = "none";
    beginQuiz();
});
```

Similarly for stay-btn, reset-stay-btn, menu-btn. Remove the `onclick` overrides from Task 8's `showNQChapterComplete()`.

**Step 2: Test both flows**

Verify:
- Existing quiz modes still work with level complete overlay
- Notation quiz chapter complete works correctly

**Step 3: Commit**

```bash
git add index.html
git commit -m "Fix level complete handlers for both quiz and notation modes"
```

---

### Task 10: Polish and Integration Testing

**Files:**
- Modify: `index.html`

**Step 1: Ensure notation progress shows on main menu**

Verify `updateMenuStats()` correctly calls the notation progress display. The notation card should show "Chapter X of 6" and completion count.

**Step 2: Test complete flow**

Walk through the entire flow manually:
1. Click "Music Notation" on main menu
2. Chapter list appears with Chapter 1 highlighted
3. Click Chapter 1 → lesson pages appear
4. Navigate through all pages → "Start Quiz" on last page
5. Quiz starts with multiple choice
6. Answer enough questions correctly to pass
7. Chapter complete overlay appears
8. Continue to Chapter 2
9. Verify Chapter 1 shows checkmark in chapter list
10. Test "Reset & Stay" and "Back to Menu" buttons
11. Go back to main menu and verify progress is shown
12. Restart the app (refresh) and verify progress persists

**Step 3: Test VexFlow rendering edge cases**

- Verify all VexFlow examples in lessons render without errors
- Verify all quiz questions with `render` functions work
- Check on narrow viewport (mobile width)

**Step 4: Fix any issues found**

Address any rendering, navigation, or state management issues.

**Step 5: Update service worker version**

In `sw.js`, bump `APP_VERSION` to include the new feature.

**Step 6: Commit**

```bash
git add index.html sw.js
git commit -m "Polish notation learning mode and bump version"
```

# Piano Training App PoC — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page web app that renders a grand staff with "Mary Had a Little Lamb" and an interactive piano keyboard.

**Architecture:** Single `index.html` file with embedded CSS and JS. VexFlow (CDN) renders the grand staff as SVG. Piano keyboard is built with HTML divs styled via CSS. No build tools or framework.

**Tech Stack:** VexFlow 4.2.6 (CDN), vanilla JS, CSS

---

### Task 1: Scaffold the HTML page

**Files:**
- Create: `index.html`

**Step 1: Create the base HTML file**

Create `index.html` with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Piano Trainer</title>
    <script src="https://cdn.jsdelivr.net/npm/vexflow@4.2.6/build/cjs/vexflow.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #1a1a2e;
            color: #eee;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        h1 {
            font-size: 1.5rem;
            margin-bottom: 20px;
            font-weight: 300;
            letter-spacing: 2px;
        }
        #staff-container {
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        #keyboard-container {
            display: flex;
            justify-content: center;
        }
    </style>
</head>
<body>
    <h1>PIANO TRAINER</h1>
    <div id="staff-container">
        <div id="staff"></div>
    </div>
    <div id="keyboard-container">
        <div id="keyboard"></div>
    </div>
    <script>
        // JS will go here in subsequent tasks
    </script>
</body>
</html>
```

**Step 2: Verify it loads in a browser**

Run: `open index.html` (or use a local server)
Expected: Dark page with "PIANO TRAINER" heading, white box for staff, empty keyboard area.

**Step 3: Commit**

```bash
git add index.html
git commit -m "Scaffold piano trainer HTML page"
```

---

### Task 2: Render the grand staff with VexFlow

**Files:**
- Modify: `index.html` (the `<script>` section)

**Step 1: Add the grand staff rendering code**

Replace the `<script>` comment block with:

```javascript
// ============================================================
// Staff Rendering
// ============================================================
const { Factory, StaveConnector } = Vex.Flow;

function renderStaff() {
    const MEASURE_WIDTH = 250;
    const FIRST_MEASURE_EXTRA = 70; // extra width for clef + time sig
    const STAVE_Y_TREBLE = 10;
    const STAVE_Y_BASS = 120;
    const STAVE_PADDING = 20;

    // "Mary Had a Little Lamb" in C major, 4/4
    // Treble: melody (quarter notes)
    // Bass: whole note chords per measure
    const song = {
        title: "Mary Had a Little Lamb",
        timeSignature: "4/4",
        treble: [
            ["E4/q", "D4", "C4", "D4"],
            ["E4/q", "E4", "E4/h"],
            ["D4/q", "D4", "D4/h"],
            ["E4/q", "G4", "G4/h"],
            ["E4/q", "D4", "C4", "D4"],
            ["E4/q", "E4", "E4", "E4"],
            ["D4/q", "D4", "E4", "D4"],
            ["C4/w"],
        ],
        bass: [
            ["(C3 E3 G3)/w"],
            ["(C3 E3 G3)/w"],
            ["(G2 B2 D3)/w"],
            ["(C3 E3 G3)/w"],
            ["(C3 E3 G3)/w"],
            ["(C3 E3 G3)/w"],
            ["(G2 B2 D3)/w"],
            ["(C3 E3 G3)/w"],
        ],
    };

    const numMeasures = song.treble.length;
    const totalWidth = FIRST_MEASURE_EXTRA + MEASURE_WIDTH * numMeasures + STAVE_PADDING;
    const totalHeight = STAVE_Y_BASS + 100;

    const factory = new Factory({
        renderer: { elementId: "staff", width: totalWidth, height: totalHeight },
    });
    const score = factory.EasyScore();

    for (let i = 0; i < numMeasures; i++) {
        const isFirst = i === 0;
        const x = isFirst ? 0 : FIRST_MEASURE_EXTRA + MEASURE_WIDTH * i;
        const width = isFirst ? MEASURE_WIDTH + FIRST_MEASURE_EXTRA : MEASURE_WIDTH;

        const system = factory.System({ x, y: 0, width });

        // Treble staff
        const trebleVoice = score.voice(
            score.notes(song.treble[i].join(", "))
        );
        const trebleStave = system.addStave({ voices: [trebleVoice] });
        if (isFirst) {
            trebleStave.addClef("treble").addTimeSignature(song.timeSignature);
        }

        // Bass staff
        const bassVoice = score.voice(
            score.notes(song.bass[i].join(", "), { clef: "bass" })
        );
        const bassStave = system.addStave({ voices: [bassVoice] });
        if (isFirst) {
            bassStave.addClef("bass").addTimeSignature(song.timeSignature);
        }

        system.addConnector("brace");
        system.addConnector("singleLeft");
        system.addConnector("singleRight");
    }

    factory.draw();
}

renderStaff();
```

**Step 2: Verify in browser**

Run: `open index.html`
Expected: Grand staff with treble and bass clef, brace connector, 8 measures of "Mary Had a Little Lamb" rendered inside the white box.

**Step 3: Debug and adjust if needed**

If the VexFlow EasyScore API doesn't accept the connector strings directly, try alternative connector types. The Factory `system.addConnector()` may need specific type names. Check the browser console for errors and adjust.

**Step 4: Commit**

```bash
git add index.html
git commit -m "Render grand staff with Mary Had a Little Lamb"
```

---

### Task 3: Build the piano keyboard with CSS

**Files:**
- Modify: `index.html` (CSS + new `<script>` code)

**Step 1: Add keyboard CSS**

Add these styles inside the `<style>` tag, after the existing styles:

```css
#keyboard {
    display: flex;
    position: relative;
    cursor: pointer;
    user-select: none;
}
.key {
    position: relative;
    border: 1px solid #333;
    border-radius: 0 0 6px 6px;
    transition: background 0.08s;
}
.key.white {
    width: 50px;
    height: 180px;
    background: linear-gradient(to bottom, #f8f8f8, #fff);
    z-index: 1;
}
.key.white:hover {
    background: linear-gradient(to bottom, #e8e8e8, #f0f0f0);
}
.key.white.active {
    background: linear-gradient(to bottom, #c8d8f8, #d8e8ff);
}
.key.black {
    width: 30px;
    height: 110px;
    background: linear-gradient(to bottom, #333, #111);
    margin-left: -15px;
    margin-right: -15px;
    z-index: 2;
    border-color: #000;
}
.key.black:hover {
    background: linear-gradient(to bottom, #555, #333);
}
.key.black.active {
    background: linear-gradient(to bottom, #446, #335);
}
.key-label {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: #999;
    pointer-events: none;
}
.key.black .key-label {
    color: #888;
}
```

**Step 2: Add keyboard generation JavaScript**

Add this code inside the `<script>` tag after the staff code:

```javascript
// ============================================================
// Piano Keyboard
// ============================================================
const NUM_OCTAVES = 2;
const START_OCTAVE = 4;

const NOTE_NAMES = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_KEY_MAP = {
    C: "C#", D: "D#", F: "F#", G: "G#", A: "A#",
};
const HAS_BLACK_AFTER = new Set(["C", "D", "F", "G", "A"]);

function buildKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";

    for (let oct = START_OCTAVE; oct < START_OCTAVE + NUM_OCTAVES; oct++) {
        for (const note of NOTE_NAMES) {
            // White key
            const whiteKey = document.createElement("div");
            whiteKey.className = "key white";
            whiteKey.dataset.note = `${note}${oct}`;

            const label = document.createElement("span");
            label.className = "key-label";
            label.textContent = `${note}${oct}`;
            whiteKey.appendChild(label);

            whiteKey.addEventListener("mousedown", () => whiteKey.classList.add("active"));
            whiteKey.addEventListener("mouseup", () => whiteKey.classList.remove("active"));
            whiteKey.addEventListener("mouseleave", () => whiteKey.classList.remove("active"));

            keyboard.appendChild(whiteKey);

            // Black key (if applicable)
            if (HAS_BLACK_AFTER.has(note)) {
                const blackNote = BLACK_KEY_MAP[note];
                const blackKey = document.createElement("div");
                blackKey.className = "key black";
                blackKey.dataset.note = `${blackNote}${oct}`;

                const bLabel = document.createElement("span");
                bLabel.className = "key-label";
                bLabel.textContent = `${blackNote}${oct}`;
                blackKey.appendChild(bLabel);

                blackKey.addEventListener("mousedown", () => blackKey.classList.add("active"));
                blackKey.addEventListener("mouseup", () => blackKey.classList.remove("active"));
                blackKey.addEventListener("mouseleave", () => blackKey.classList.remove("active"));

                keyboard.appendChild(blackKey);
            }
        }
    }
}

buildKeyboard();
```

**Step 3: Verify in browser**

Run: `open index.html`
Expected: 2-octave keyboard (C4-B5) below the staff. 14 white keys with 10 black keys overlaid. Keys highlight on hover and turn blue-ish on click. Labels visible at bottom of white keys.

**Step 4: Commit**

```bash
git add index.html
git commit -m "Add interactive piano keyboard with configurable octaves"
```

---

### Task 4: Polish layout and visual refinements

**Files:**
- Modify: `index.html` (CSS tweaks)

**Step 1: Fine-tune spacing and responsiveness**

Adjust CSS to ensure:
- Staff SVG is horizontally centered with `overflow-x: auto` on the container for small screens
- Keyboard is centered and doesn't overflow
- Add subtle shadow under black keys for depth
- Adjust vertical spacing between staff and keyboard

Add/modify these styles:

```css
#staff-container {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    overflow-x: auto;
    max-width: 95vw;
}
.key.black {
    box-shadow: 2px 2px 5px rgba(0,0,0,0.4);
}
```

**Step 2: Verify everything looks good**

Run: `open index.html`
Expected: Polished look — staff centered in white card, keyboard centered below, clean dark background, good spacing.

**Step 3: Commit**

```bash
git add index.html
git commit -m "Polish layout and visual styling"
```

---

### Task 5: Final verification and cleanup

**Step 1: Full visual inspection**

Open `index.html` in browser and verify:
- [ ] Grand staff renders with treble and bass clef
- [ ] Brace connector joins the two staves
- [ ] "Mary Had a Little Lamb" melody is visible in treble clef
- [ ] Bass clef has whole-note chords
- [ ] Piano keyboard shows 2 octaves (C4-B5)
- [ ] White and black keys are properly positioned
- [ ] Keys highlight on hover and click
- [ ] Note labels are visible
- [ ] Overall layout looks clean and professional

**Step 2: Check browser console for errors**

Open DevTools console, verify no JS errors.

**Step 3: Final commit if any changes**

```bash
git add index.html
git commit -m "Final PoC cleanup"
```

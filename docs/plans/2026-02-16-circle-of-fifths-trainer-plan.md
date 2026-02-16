# Circle of Fifths Trainer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a new "Circle of Fifths" practice mode that drills key relationships through mixed question types (fifths up/down, sharp/flat counts, relative minors, I-IV-V chords) with button-grid answers and progressive levels.

**Architecture:** Integrates into the existing practice mode infrastructure by adding a `"circle"` mode to the shared quiz screen. Uses the same progress tracking, spaced repetition, level system, and level-complete overlay as existing modes. Text-only prompts (no VexFlow), button-grid answers (like Key Signatures mode). A `COF_DATA` lookup table drives question generation, and a `COF_LEVELS` array defines progressive difficulty by question type.

**Tech Stack:** Vanilla JS, existing quiz infrastructure (SM-2 spaced repetition, `recordAttempt`, `checkLevelUp`).

**Design doc:** `docs/plans/2026-02-16-circle-of-fifths-trainer-design.md`

---

### Task 1: Add Circle of Fifths Data & Levels

**Files:**
- Modify: `index.html` — add data structures after `KEYSIG_LEVELS` / `ALL_KEYSIGS` (around line 895)

**Step 1: Add COF_DATA lookup table and COF_LEVELS**

Insert after `ALL_KEYSIGS` (line 895). This data drives all question generation.

```javascript
        // ── Circle of Fifths Trainer Data ──
        const COF_DATA = {
            "C":  { sharps: 0, flats: 0, fifthUp: "G",  fourthUp: "F",  relMinor: "Am",  I: "C",  IV: "F",  V: "G" },
            "G":  { sharps: 1, flats: 0, fifthUp: "D",  fourthUp: "C",  relMinor: "Em",  I: "G",  IV: "C",  V: "D" },
            "D":  { sharps: 2, flats: 0, fifthUp: "A",  fourthUp: "G",  relMinor: "Bm",  I: "D",  IV: "G",  V: "A" },
            "A":  { sharps: 3, flats: 0, fifthUp: "E",  fourthUp: "D",  relMinor: "F#m", I: "A",  IV: "D",  V: "E" },
            "E":  { sharps: 4, flats: 0, fifthUp: "B",  fourthUp: "A",  relMinor: "C#m", I: "E",  IV: "A",  V: "B" },
            "B":  { sharps: 5, flats: 0, fifthUp: "F#", fourthUp: "E",  relMinor: "G#m", I: "B",  IV: "E",  V: "F#" },
            "F#": { sharps: 6, flats: 0, fifthUp: "Db", fourthUp: "B",  relMinor: "D#m", I: "F#", IV: "B",  V: "C#" },
            "Db": { sharps: 0, flats: 5, fifthUp: "Ab", fourthUp: "Gb", relMinor: "Bbm", I: "Db", IV: "Gb", V: "Ab" },
            "Ab": { sharps: 0, flats: 4, fifthUp: "Eb", fourthUp: "Db", relMinor: "Fm",  I: "Ab", IV: "Db", V: "Eb" },
            "Eb": { sharps: 0, flats: 3, fifthUp: "Bb", fourthUp: "Ab", relMinor: "Cm",  I: "Eb", IV: "Ab", V: "Bb" },
            "Bb": { sharps: 0, flats: 2, fifthUp: "F",  fourthUp: "Eb", relMinor: "Gm",  I: "Bb", IV: "Eb", V: "F" },
            "F":  { sharps: 0, flats: 1, fifthUp: "C",  fourthUp: "Bb", relMinor: "Dm",  I: "F",  IV: "Bb", V: "C" },
        };

        const COF_KEYS = Object.keys(COF_DATA);

        const COF_LEVELS = [
            { name: "Fifths Up",       items: COF_KEYS.map(k => `fifth_up_${k}`),    threshold: 0.80, minAttempts: 3 },
            { name: "Fourths Up",      items: COF_KEYS.map(k => `fourth_up_${k}`),   threshold: 0.80, minAttempts: 3 },
            { name: "Sharps & Flats",  items: COF_KEYS.map(k => `sig_${k}`),         threshold: 0.80, minAttempts: 3 },
            { name: "Relative Minors", items: COF_KEYS.flatMap(k => [`rel_minor_${k}`, `rel_major_${k}`]), threshold: 0.80, minAttempts: 3 },
            { name: "I-IV-V Chords",   items: ["C","G","D","A","F","Bb","Eb"].flatMap(k => [`chord_I_${k}`, `chord_IV_${k}`, `chord_V_${k}`]), threshold: 0.80, minAttempts: 3 },
            { name: "Full Circle",     items: null, threshold: 0.80, minAttempts: 2 }, // null = all items from levels 0-4 combined
        ];

        // For level 6 (Full Circle), combine all items from levels 0-4
        COF_LEVELS[5].items = COF_LEVELS.slice(0, 5).flatMap(l => l.items);

        const ALL_COF_ITEMS = [...new Set(COF_LEVELS.flatMap(l => l.items))];
```

**Step 2: Add circle to modeProgress initialization**

Find the `modeProgress` object (around line 2792) and add circle:

```javascript
        const modeProgress = {
            visual: createDefaultProgress(ALL_NOTES),
            audio: createDefaultProgress(ALL_NOTES),
            reverse: createDefaultProgress(ALL_NOTES),
            interval: createDefaultProgress(ALL_INTERVALS),
            keysig: createDefaultProgress(ALL_KEYSIGS),
            circle: createDefaultProgress(ALL_COF_ITEMS),
        };
```

**Step 3: Commit**

```bash
git add index.html
git commit -m "Add Circle of Fifths data structures and levels"
```

---

### Task 2: Add Mode Card HTML & Button Container

**Files:**
- Modify: `index.html` — add card HTML (after keysig card, before notation card, around line 696) and button container (after keysig-buttons in the quiz-screen)

**Step 1: Add mode card**

Insert after the keysig card (line 696), before the notation card (line 697):

```html
            <div class="mode-card" id="card-circle">
                <div class="mode-icon">&#x1F504;</div>
                <h3>Circle of Fifths</h3>
                <div class="mode-level" id="menu-circle-level">Level 1</div>
                <div class="mode-accuracy" id="menu-circle-accuracy">No attempts yet</div>
            </div>
```

**Step 2: Add button container**

Find `<div class="button-grid" id="keysig-buttons"></div>` in the quiz-screen HTML and add after it:

```html
                <div class="button-grid" id="circle-buttons" style="display:none"></div>
```

**Step 3: Commit**

```bash
git add index.html
git commit -m "Add Circle of Fifths mode card and button container"
```

---

### Task 3: Wire Up Mode Infrastructure

**Files:**
- Modify: `index.html` — update `getLevelsForMode`, `getLevelItems`, `getActiveNotes`, `showQuizScreen`, `showMainMenu`, `updateMenuStats`, `loadProgress`, `pickNextNote`, `renderQuizNote`, and add card click handler

**Step 1: Update getLevelsForMode** (around line 2766)

Change:
```javascript
        function getLevelsForMode(mode) {
            if (mode === "interval") return INTERVAL_LEVELS;
            if (mode === "keysig") return KEYSIG_LEVELS;
            return DIFFICULTY_LEVELS;
        }
```
To:
```javascript
        function getLevelsForMode(mode) {
            if (mode === "interval") return INTERVAL_LEVELS;
            if (mode === "keysig") return KEYSIG_LEVELS;
            if (mode === "circle") return COF_LEVELS;
            return DIFFICULTY_LEVELS;
        }
```

**Step 2: Update getLevelItems** (around line 3006)

Change:
```javascript
        function getLevelItems(level) {
            return quizMode === "interval" ? level.intervals : quizMode === "keysig" ? level.keys : level.notes;
        }
```
To:
```javascript
        function getLevelItems(level) {
            return quizMode === "interval" ? level.intervals : quizMode === "keysig" ? level.keys : quizMode === "circle" ? level.items : level.notes;
        }
```

**Step 3: Update getActiveNotes** (around line 2931)

Add before the default return:
```javascript
            if (quizMode === "circle") {
                return COF_LEVELS[progress.currentLevel].items;
            }
```

**Step 4: Update showQuizScreen** (around line 3760)

Add the circle-buttons hide at line 3775:
```javascript
            document.getElementById("circle-buttons").style.display = "none";
```

Add the circle branch in the if/else chain (around line 3779):
```javascript
            if (mode === "interval") {
                buildIntervalButtons();
            } else if (mode === "keysig") {
                buildKeySigButtons();
            } else if (mode === "circle") {
                // Buttons are built per-question, just show container
                document.getElementById("circle-buttons").style.display = "flex";
            } else {
                document.getElementById("keyboard-container").style.display = "flex";
                rebuildKeyboard();
            }
```

**Step 5: Update showMainMenu** (around line 3747)

Add after the keysig-buttons hide:
```javascript
            document.getElementById("circle-buttons").style.display = "none";
```

**Step 6: Update updateMenuStats** (around line 3718)

Change the modes array:
```javascript
            const modes = ["visual", "audio", "reverse", "interval", "keysig", "circle"];
```

**Step 7: Update loadProgress** (around line 2815)

Change the mode loop (around line 2824):
```javascript
                    for (const mode of ["visual", "audio", "reverse", "interval", "keysig", "circle"]) {
```

Update the allItems ternary (around line 2827):
```javascript
                            const allItems = mode === "interval" ? ALL_INTERVALS : mode === "keysig" ? ALL_KEYSIGS : mode === "circle" ? ALL_COF_ITEMS : ALL_NOTES;
```

**Step 8: Update pickNextNote** (around line 3491)

Add before the keysig branch:
```javascript
            if (quizMode === "circle") {
                return generateCofQuestion();
            }
```

**Step 9: Update renderQuizNote** (around line 3217)

Add a branch after the keysig branch (after the `return;` at line 3247):
```javascript
                if (quizMode === "circle") {
                    document.getElementById("replay-btn").style.display = "none";
                    staffDiv.innerHTML = `<div id="note-prompt">${currentCofPrompt}</div>`;
                    noteDisplayTime = Date.now();
                    return;
                }
```

**Step 10: Add card click handler** (around line 4218)

After the keysig click handler:
```javascript
        document.getElementById("card-circle").addEventListener("click", () => showQuizScreen("circle"));
```

**Step 11: Commit**

```bash
git add index.html
git commit -m "Wire Circle of Fifths into mode infrastructure"
```

---

### Task 4: Implement Question Generation & Answer Handling

**Files:**
- Modify: `index.html` — add `generateCofQuestion`, `buildCofAnswerButtons`, `handleCofClick` functions

**Step 1: Add state variables**

Near the existing state variables (around where `currentKeySig` is declared, search for `let currentKeySig`):

```javascript
        let currentCofItem = null;
        let currentCofAnswer = null;
        let currentCofPrompt = "";
```

**Step 2: Add generateCofQuestion function**

Add near the `generateKeySig` function. This function picks the next item using spaced repetition, generates the prompt text and correct answer, then builds answer buttons.

```javascript
        function generateCofQuestion() {
            const progress = getCurrentProgress();
            const activeItems = getActiveNotes();
            progress.roundNumber++;

            // Spaced repetition selection (same algorithm as other modes)
            const candidates = activeItems
                .filter(item => item !== currentCofItem)
                .map(item => {
                    if (!progress.noteMemory[item]) {
                        progress.noteMemory[item] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
                    }
                    const mem = progress.noteMemory[item];
                    const roundsSince = progress.roundNumber - mem.lastSeen;
                    const isDue = roundsSince >= mem.interval;
                    let score = mem.priority;
                    if (isDue) score += 10;
                    if (roundsSince > mem.interval * 2) score += 5;
                    score += Math.random() * 0.5;
                    return { item, score };
                })
                .sort((a, b) => b.score - a.score);

            currentCofItem = candidates[0].item;
            firstAttempt = true;

            // Parse the item key to determine question type and target key
            const parts = currentCofItem.split("_");
            const type = parts.slice(0, -1).join("_"); // e.g. "fifth_up", "rel_minor", "chord_IV"
            const key = parts[parts.length - 1]; // e.g. "C", "G", "Bb"
            const data = COF_DATA[key];

            let prompt, answer, distractorPool;

            if (type === "fifth_up") {
                prompt = `What key is a 5th above ${key}?`;
                answer = data.fifthUp;
                distractorPool = COF_KEYS.filter(k => k !== answer);
            } else if (type === "fourth_up") {
                prompt = `What key is a 4th above ${key}?`;
                answer = data.fourthUp;
                distractorPool = COF_KEYS.filter(k => k !== answer);
            } else if (type === "sig") {
                if (data.sharps > 0) {
                    prompt = `How many sharps in ${key} major?`;
                    answer = String(data.sharps);
                    distractorPool = ["0","1","2","3","4","5","6"].filter(n => n !== answer);
                } else if (data.flats > 0) {
                    prompt = `How many flats in ${key} major?`;
                    answer = String(data.flats);
                    distractorPool = ["0","1","2","3","4","5","6"].filter(n => n !== answer);
                } else {
                    prompt = `How many sharps or flats in ${key} major?`;
                    answer = "0";
                    distractorPool = ["1","2","3","4","5","6"];
                }
            } else if (type === "rel_minor") {
                prompt = `What is the relative minor of ${key} major?`;
                answer = data.relMinor;
                distractorPool = COF_KEYS.map(k => COF_DATA[k].relMinor).filter(m => m !== answer);
            } else if (type === "rel_major") {
                // Reverse: given a minor key, find its relative major
                const minorName = data.relMinor;
                prompt = `What is the relative major of ${minorName}?`;
                answer = key;
                distractorPool = COF_KEYS.filter(k => k !== answer);
            } else if (type === "chord_I") {
                prompt = `In ${key} major, what is the I chord?`;
                answer = key;
                distractorPool = COF_KEYS.filter(k => k !== answer);
            } else if (type === "chord_IV") {
                prompt = `In ${key} major, what is the IV chord?`;
                answer = data.IV;
                distractorPool = COF_KEYS.filter(k => k !== answer);
            } else if (type === "chord_V") {
                prompt = `In ${key} major, what is the V chord?`;
                answer = data.V;
                distractorPool = COF_KEYS.filter(k => k !== answer);
            }

            currentCofAnswer = answer;
            currentCofPrompt = prompt;

            // Build answer buttons with 1 correct + 3 distractors
            const distractors = [];
            const shuffled = distractorPool.sort(() => Math.random() - 0.5);
            for (let i = 0; i < 3 && i < shuffled.length; i++) {
                distractors.push(shuffled[i]);
            }
            const options = [answer, ...distractors].sort(() => Math.random() - 0.5);
            buildCofAnswerButtons(options);

            currentNote = currentCofItem; // for renderQuizNote compatibility
            return currentCofItem;
        }
```

**Step 3: Add buildCofAnswerButtons function**

```javascript
        function buildCofAnswerButtons(options) {
            const container = document.getElementById("circle-buttons");
            container.innerHTML = "";
            container.style.display = "flex";

            for (const opt of options) {
                const btn = document.createElement("button");
                btn.className = "interval-btn";
                btn.textContent = opt;
                btn.addEventListener("click", () => handleCofClick(opt, btn));
                btn.addEventListener("touchstart", (e) => {
                    e.preventDefault();
                    handleCofClick(opt, btn);
                }, { passive: false });
                container.appendChild(btn);
            }
        }
```

**Step 4: Add handleCofClick function**

```javascript
        function handleCofClick(selected, btnElement) {
            if (isProcessingClick || !currentCofAnswer) return;

            const responseTime = Date.now() - noteDisplayTime;

            if (selected === currentCofAnswer) {
                isProcessingClick = true;
                recordAttempt(currentCofItem, true, responseTime);
                btnElement.classList.add("correct");
                showFeedback(true, currentCofAnswer);
                setTimeout(() => {
                    btnElement.classList.remove("correct");
                    generateCofQuestion();
                    renderQuizNote(currentNote);
                    isProcessingClick = false;
                }, 400);
            } else {
                recordAttempt(currentCofItem, false, responseTime);
                btnElement.classList.add("wrong");
                showFeedback(false, currentCofAnswer);
                setTimeout(() => btnElement.classList.remove("wrong"), 200);
            }
        }
```

**Step 5: Commit**

```bash
git add index.html
git commit -m "Implement Circle of Fifths question generation and answer handling"
```

---

### Task 5: Polish, Review & Version Bump

**Step 1: Verify balanced braces/brackets/parens**

Run the Python check.

**Step 2: Verify integration**

- Check that `COF_DATA` has all 12 keys
- Check that `COF_LEVELS` has 6 levels with correct item counts
- Check that all integration points are connected (grep for `"circle"` to verify)
- Check that `currentCofItem`, `currentCofAnswer`, `currentCofPrompt` are used correctly
- Verify distractor generation doesn't crash for edge cases (C major with 0 sharps/flats)

**Step 3: Bump version**

In `sw.js`, change:
```javascript
const APP_VERSION = '2.3.0';
// to
const APP_VERSION = '2.4.0';
```

**Step 4: Commit and push**

```bash
git add index.html sw.js
git commit -m "Polish Circle of Fifths trainer, bump to 2.4.0"
git push
```

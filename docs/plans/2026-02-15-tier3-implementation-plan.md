# Tier 3 Chapters (15-17) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 3 advanced theory chapters (Intervals in Depth, Circle of Fifths, Seventh Chords) to the Music Notation learning mode.

**Architecture:** Same as chapters 1-14 — add chapter objects to the `NOTATION_CHAPTERS` array in `index.html`. Each chapter has `pages[]` with HTML content and optional VexFlow `render` functions, plus `quizPool[]` with multiple-choice questions. VexFlow renders intervals as note pairs, key signatures for Circle of Fifths, and 4-note stacked chords for seventh chords.

**Tech Stack:** Vanilla JS, VexFlow 4.x (Factory/EasyScore/System API, `.addKeySignature()`, parenthesized chord syntax `(C4 E4 G4 B4)/w`).

**Design doc:** `docs/plans/2026-02-15-tier3-chapters-design.md`

---

### Task 1: Add Chapter 15 — Intervals in Depth

**Files:**
- Modify: `index.html` — insert chapter 15 into `NOTATION_CHAPTERS` array before the closing `];`

**Step 1: Add Chapter 15 data**

Insert before the `];` that closes `NOTATION_CHAPTERS`. Follow the exact same structure as chapters 1-14.

```javascript
            // ── Chapter 15: Intervals in Depth ──
            {
                id: 15,
                title: "Intervals in Depth",
                subtitle: "Measuring the distance between notes",
                pages: [
                    {
                        title: "What Is an Interval?",
                        content: `<h3>What Is an Interval?</h3>
<p>An <span class="highlight">interval</span> is the distance between two notes, measured by both <span class="highlight">quantity</span> (a number) and <span class="highlight">quality</span> (a type).</p>
<p>We touched on half steps and whole steps in Chapter 7 — intervals give us a richer, more precise vocabulary for describing distances.</p>
<p>The <b>number</b> comes from counting letter names inclusively. C to E = a <span class="highlight">3rd</span> (C‑D‑E — three letter names).</p>
<div class="staff-example" id="ch15-ex1"></div>
<p>Above: C and E on the staff — an interval of a 3rd.</p>`,
                        render(container) {
                            const el = container.querySelector("#ch15-ex1");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
                            const s = f.EasyScore();
                            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("C4/h, E4/h"))] }).addClef("treble");
                            f.draw();
                        }
                    },
                    {
                        title: "Interval Numbers",
                        content: `<h3>Interval Numbers</h3>
<p>Count inclusively from the bottom note to the top:</p>
<table style="width:100%; text-align:left; border-collapse:collapse; margin:0.5em 0;">
<tr><td style="padding:3px 8px;"><b>C → C</b></td><td>Unison (1st)</td></tr>
<tr><td style="padding:3px 8px;"><b>C → D</b></td><td>2nd</td></tr>
<tr><td style="padding:3px 8px;"><b>C → E</b></td><td>3rd</td></tr>
<tr><td style="padding:3px 8px;"><b>C → F</b></td><td>4th</td></tr>
<tr><td style="padding:3px 8px;"><b>C → G</b></td><td>5th</td></tr>
<tr><td style="padding:3px 8px;"><b>C → A</b></td><td>6th</td></tr>
<tr><td style="padding:3px 8px;"><b>C → B</b></td><td>7th</td></tr>
<tr><td style="padding:3px 8px;"><b>C → C</b></td><td>Octave (8th)</td></tr>
</table>
<p>The number tells you the general size, but not the <em>exact</em> size in half steps — that's where <span class="highlight">quality</span> comes in (next page).</p>
<div class="staff-example" id="ch15-ex2"></div>`,
                        render(container) {
                            const el = container.querySelector("#ch15-ex2");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                            const s = f.EasyScore();
                            f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/h, E4/h, G4/h, C5/h"), { time: "4/2" })] }).addClef("treble");
                            f.draw();
                            const ctx = f.getContext();
                            ctx.setFont("Times", 11, "bold");
                            ctx.fillText("3rd", 70, 110);
                            ctx.fillText("5th", 140, 110);
                            ctx.fillText("8ve", 210, 110);
                        }
                    },
                    {
                        title: "Interval Quality — Major and Minor",
                        content: `<h3>Interval Quality — Major and Minor</h3>
<p>The <span class="highlight">quality</span> tells you the exact number of half steps:</p>
<p>For <b>2nds, 3rds, 6ths, and 7ths</b>, the quality is either <span class="highlight">major</span> (M) or <span class="highlight">minor</span> (m). Minor is always one half step smaller than major.</p>
<table style="width:100%; text-align:left; border-collapse:collapse; margin:0.5em 0;">
<tr><td style="padding:3px 8px;"><b>m2</b> = 1 half step</td><td><b>M2</b> = 2 half steps</td></tr>
<tr><td style="padding:3px 8px;"><b>m3</b> = 3 half steps</td><td><b>M3</b> = 4 half steps</td></tr>
<tr><td style="padding:3px 8px;"><b>m6</b> = 8 half steps</td><td><b>M6</b> = 9 half steps</td></tr>
<tr><td style="padding:3px 8px;"><b>m7</b> = 10 half steps</td><td><b>M7</b> = 11 half steps</td></tr>
</table>
<p><span class="mnemonic">Quick trick: If both notes are in the major scale of the lower note, it's a major interval.</span></p>`,
                        render: null
                    },
                    {
                        title: "Perfect Intervals",
                        content: `<h3>Perfect Intervals</h3>
<p><b>4ths, 5ths, unisons, and octaves</b> use <span class="highlight">"perfect"</span> instead of major/minor:</p>
<table style="width:100%; text-align:left; border-collapse:collapse; margin:0.5em 0;">
<tr><td style="padding:3px 8px;"><b>P1</b> (perfect unison)</td><td>0 half steps</td></tr>
<tr><td style="padding:3px 8px;"><b>P4</b> (perfect 4th)</td><td>5 half steps</td></tr>
<tr><td style="padding:3px 8px;"><b>P5</b> (perfect 5th)</td><td>7 half steps</td></tr>
<tr><td style="padding:3px 8px;"><b>P8</b> (perfect octave)</td><td>12 half steps</td></tr>
</table>
<p>These are called "perfect" because they sound especially <span class="highlight">stable and consonant</span>.</p>
<p><span class="highlight">Augmented</span> = one half step wider than perfect. <span class="highlight">Diminished</span> = one half step narrower.</p>
<div class="staff-example" id="ch15-ex3"></div>
<p>Above: a perfect 4th (C–F) and a perfect 5th (C–G).</p>`,
                        render(container) {
                            const el = container.querySelector("#ch15-ex3");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                            const s = f.EasyScore();
                            f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/h, F4/h, C4/h, G4/h"), { time: "4/2" })] }).addClef("treble");
                            f.draw();
                            const ctx = f.getContext();
                            ctx.setFont("Times", 11, "bold");
                            ctx.fillText("P4", 85, 110);
                            ctx.fillText("P5", 195, 110);
                        }
                    },
                    {
                        title: "Why Intervals Matter",
                        content: `<h3>Why Intervals Matter</h3>
<p>Intervals are the <span class="highlight">building blocks of everything</span> in music:</p>
<p>Melodies move by intervals — a tune is just a sequence of intervals. Chords are stacked intervals — a major triad is M3 + m3 (from Chapter 10, now you know the precise names).</p>
<p>Recognizing intervals helps you:</p>
<ul>
<li><b>Sight-read</b> faster — you see a 3rd on the staff and know the distance instantly</li>
<li><b>Train your ear</b> — the app's Interval Training mode builds this skill</li>
<li><b>Transpose</b> music — shift every interval by the same amount to change key</li>
</ul>
<p><span class="mnemonic">Everything in music — scales, chords, melodies, harmony — is built from intervals.</span></p>`
                    }
                ],
                quizPool: [
                    { id: "15-1", prompt: "C to E is what interval number?", render: null, options: ["2nd", "3rd", "4th", "5th"], correctIndex: 1 },
                    { id: "15-2", prompt: "C to G is what interval number?", render: null, options: ["4th", "5th", "6th", "7th"], correctIndex: 1 },
                    { id: "15-3", prompt: "How many half steps in a minor 3rd?", render: null, options: ["2", "3", "4", "5"], correctIndex: 1 },
                    { id: "15-4", prompt: "How many half steps in a major 3rd?", render: null, options: ["2", "3", "4", "5"], correctIndex: 2 },
                    { id: "15-5", prompt: "How many half steps in a perfect 5th?", render: null, options: ["5", "6", "7", "8"], correctIndex: 2 },
                    { id: "15-6", prompt: "How many half steps in a perfect 4th?", render: null, options: ["4", "5", "6", "7"], correctIndex: 1 },
                    { id: "15-7", prompt: "A major triad is built from which two intervals?", render: null, options: ["P4 + P5", "M3 + m3", "m3 + M3", "M2 + M2"], correctIndex: 1 },
                    { id: "15-8", prompt: "What quality do 4ths and 5ths use?", render: null, options: ["Major/minor", "Perfect", "Augmented", "Diminished"], correctIndex: 1 },
                    { id: "15-9", prompt: "C to A is what interval?", render: null, options: ["Minor 6th", "Major 6th", "Minor 7th", "Major 7th"], correctIndex: 1 },
                    { id: "15-10", prompt: "If a perfect 5th is 7 half steps, a diminished 5th is:", render: null, options: ["6 half steps", "7 half steps", "8 half steps", "5 half steps"], correctIndex: 0 }
                ]
            },
```

**Step 2: Verify balanced braces**

Run: `python3 -c "..."` brace check

**Step 3: Commit**

```bash
git add index.html
git commit -m "Add chapter 15: Intervals in Depth"
```

---

### Task 2: Add Chapter 16 — Circle of Fifths

**Files:**
- Modify: `index.html` — insert chapter 16 after chapter 15 in `NOTATION_CHAPTERS`

**Step 1: Add Chapter 16 data**

```javascript
            // ── Chapter 16: Circle of Fifths ──
            {
                id: 16,
                title: "Circle of Fifths",
                subtitle: "The map of all keys",
                pages: [
                    {
                        title: "What Is the Circle of Fifths?",
                        content: `<h3>What Is the Circle of Fifths?</h3>
<p>The <span class="highlight">Circle of Fifths</span> is a visual diagram that arranges all 12 major keys in a circle.</p>
<p>Moving <b>clockwise</b>, each key is a <span class="highlight">perfect 5th</span> (7 half steps) higher than the last:</p>
<p style="text-align:center;">C → G → D → A → E → B → F♯/G♭ → D♭ → A♭ → E♭ → B♭ → F → C</p>
<p>It's the single most useful diagram in music theory — a <span class="highlight">"map"</span> of how all keys relate to each other.</p>
<p><span class="mnemonic">Think of it as a clock: C is at 12 o'clock, and every hour clockwise adds a sharp.</span></p>`,
                        render: null
                    },
                    {
                        title: "Sharps Go Clockwise",
                        content: `<h3>Sharps Go Clockwise</h3>
<p>Starting at C (no sharps or flats) and moving clockwise, each key adds <span class="highlight">one sharp</span>:</p>
<table style="width:100%; text-align:left; border-collapse:collapse; margin:0.5em 0;">
<tr><td style="padding:3px 8px;"><b>C</b></td><td>0 sharps</td></tr>
<tr><td style="padding:3px 8px;"><b>G</b></td><td>1 sharp (F♯)</td></tr>
<tr><td style="padding:3px 8px;"><b>D</b></td><td>2 sharps (F♯ C♯)</td></tr>
<tr><td style="padding:3px 8px;"><b>A</b></td><td>3 sharps (F♯ C♯ G♯)</td></tr>
<tr><td style="padding:3px 8px;"><b>E</b></td><td>4 sharps</td></tr>
<tr><td style="padding:3px 8px;"><b>B</b></td><td>5 sharps</td></tr>
<tr><td style="padding:3px 8px;"><b>F♯</b></td><td>6 sharps</td></tr>
</table>
<p>Order of sharps: <span class="highlight">F♯ C♯ G♯ D♯ A♯ E♯</span></p>
<div class="staff-example" id="ch16-ex1"></div>
<p>Above: G major (1 sharp) and D major (2 sharps) key signatures.</p>`,
                        render(container) {
                            const el = container.querySelector("#ch16-ex1");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                            const s = f.EasyScore();
                            const sys = f.System({ x: 0, y: 0, width: 260 });
                            sys.addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble").addKeySignature("G");
                            f.draw();
                            // Draw second staff with D major
                            const el2 = document.createElement("div");
                            el2.id = "ch16-ex1b";
                            el.parentNode.insertBefore(el2, el.nextSibling);
                            const f2 = new Factory({ renderer: { elementId: el2.id, width: 300, height: 120 } });
                            const s2 = f2.EasyScore();
                            f2.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s2.voice(s2.notes("B4/w/r"))] }).addClef("treble").addKeySignature("D");
                            f2.draw();
                        }
                    },
                    {
                        title: "Flats Go Counter-Clockwise",
                        content: `<h3>Flats Go Counter-Clockwise</h3>
<p>Moving <b>counter-clockwise</b> from C, each key adds <span class="highlight">one flat</span>:</p>
<table style="width:100%; text-align:left; border-collapse:collapse; margin:0.5em 0;">
<tr><td style="padding:3px 8px;"><b>C</b></td><td>0 flats</td></tr>
<tr><td style="padding:3px 8px;"><b>F</b></td><td>1 flat (B♭)</td></tr>
<tr><td style="padding:3px 8px;"><b>B♭</b></td><td>2 flats (B♭ E♭)</td></tr>
<tr><td style="padding:3px 8px;"><b>E♭</b></td><td>3 flats</td></tr>
<tr><td style="padding:3px 8px;"><b>A♭</b></td><td>4 flats</td></tr>
<tr><td style="padding:3px 8px;"><b>D♭</b></td><td>5 flats</td></tr>
<tr><td style="padding:3px 8px;"><b>G♭</b></td><td>6 flats</td></tr>
</table>
<p>Order of flats: <span class="highlight">B♭ E♭ A♭ D♭ G♭ C♭</span> — it's the order of sharps <em>reversed</em>!</p>
<div class="staff-example" id="ch16-ex2"></div>
<p>Above: F major (1 flat) and B♭ major (2 flats) key signatures.</p>`,
                        render(container) {
                            const el = container.querySelector("#ch16-ex2");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                            const s = f.EasyScore();
                            f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble").addKeySignature("F");
                            f.draw();
                            const el2 = document.createElement("div");
                            el2.id = "ch16-ex2b";
                            el.parentNode.insertBefore(el2, el.nextSibling);
                            const f2 = new Factory({ renderer: { elementId: el2.id, width: 300, height: 120 } });
                            const s2 = f2.EasyScore();
                            f2.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s2.voice(s2.notes("B4/w/r"))] }).addClef("treble").addKeySignature("Bb");
                            f2.draw();
                        }
                    },
                    {
                        title: "Relative Minors on the Circle",
                        content: `<h3>Relative Minors on the Circle</h3>
<p>Each major key has a <span class="highlight">relative minor</span> that shares the same key signature (from Chapter 9).</p>
<p>On the Circle of Fifths, the relative minor sits on an inner ring — or equivalently, <b>3 positions clockwise</b> from the major key:</p>
<table style="width:100%; text-align:left; border-collapse:collapse; margin:0.5em 0;">
<tr><td style="padding:3px 8px;"><b>C major</b> → A minor</td><td>(0 sharps/flats)</td></tr>
<tr><td style="padding:3px 8px;"><b>G major</b> → E minor</td><td>(1 sharp)</td></tr>
<tr><td style="padding:3px 8px;"><b>F major</b> → D minor</td><td>(1 flat)</td></tr>
<tr><td style="padding:3px 8px;"><b>D major</b> → B minor</td><td>(2 sharps)</td></tr>
<tr><td style="padding:3px 8px;"><b>B♭ major</b> → G minor</td><td>(2 flats)</td></tr>
</table>
<p><span class="mnemonic">Now you can see ALL relative major/minor pairs at once — the circle connects everything from Chapters 9, 11, and 15.</span></p>`,
                        render: null
                    },
                    {
                        title: "Using the Circle",
                        content: `<h3>Using the Circle</h3>
<p>The Circle of Fifths is a practical tool you'll use constantly:</p>
<ul>
<li><b>Find a key signature:</b> count clockwise for sharps, counter-clockwise for flats</li>
<li><b>Find related keys:</b> neighbors on the circle differ by just one sharp or flat — they share the most notes</li>
<li><b>Understand progressions:</b> the V→I resolution is one step <em>counter-clockwise</em>; chord progressions often move around the circle</li>
<li><b>I‑IV‑V chords:</b> in any key, IV is one step counter-clockwise, V is one step clockwise — they're always neighbors!</li>
</ul>
<p><span class="mnemonic">The Circle of Fifths is your "map" of music. Keys, scales, chords, progressions — it shows how everything connects.</span></p>`,
                        render: null
                    }
                ],
                quizPool: [
                    { id: "16-1", prompt: "Moving clockwise on the Circle of Fifths, each key is a ___ higher:", render: null, options: ["Perfect 4th", "Perfect 5th", "Major 3rd", "Minor 3rd"], correctIndex: 1 },
                    { id: "16-2", prompt: "How many sharps does G major have?", render: null, options: ["0", "1", "2", "3"], correctIndex: 1 },
                    { id: "16-3", prompt: "How many sharps does D major have?", render: null, options: ["1", "2", "3", "4"], correctIndex: 1 },
                    { id: "16-4", prompt: "How many flats does F major have?", render: null, options: ["0", "1", "2", "3"], correctIndex: 1 },
                    { id: "16-5", prompt: "How many flats does B\u266d major have?", render: null, options: ["1", "2", "3", "4"], correctIndex: 1 },
                    { id: "16-6", prompt: "The order of sharps begins with:", render: null, options: ["B\u266d E\u266d A\u266d", "F\u266f C\u266f G\u266f", "C\u266f F\u266f G\u266f", "G\u266f D\u266f A\u266f"], correctIndex: 1 },
                    { id: "16-7", prompt: "The relative minor of G major is:", render: null, options: ["B minor", "D minor", "E minor", "A minor"], correctIndex: 2 },
                    { id: "16-8", prompt: "On the circle, keys that are neighbors differ by:", render: null, options: ["3 sharps or flats", "2 sharps or flats", "1 sharp or flat", "No sharps or flats"], correctIndex: 2 },
                    { id: "16-9", prompt: "Which key has 3 sharps?", render: null, options: ["G major", "D major", "A major", "E major"], correctIndex: 2 },
                    { id: "16-10", prompt: "Moving counter-clockwise from C, the first key is:", render: null, options: ["G major", "F major", "D major", "B\u266d major"], correctIndex: 1 }
                ]
            },
```

**Step 2: Verify balanced braces**

**Step 3: Commit**

```bash
git add index.html
git commit -m "Add chapter 16: Circle of Fifths"
```

---

### Task 3: Add Chapter 17 — Seventh Chords

**Files:**
- Modify: `index.html` — insert chapter 17 after chapter 16 in `NOTATION_CHAPTERS`

**Step 1: Add Chapter 17 data**

```javascript
            // ── Chapter 17: Seventh Chords ──
            {
                id: 17,
                title: "Seventh Chords",
                subtitle: "Adding color to your chords",
                pages: [
                    {
                        title: "Beyond Triads",
                        content: `<h3>Beyond Triads</h3>
<p>In Chapter 10, we built <span class="highlight">triads</span> — three-note chords (root, 3rd, 5th).</p>
<p>A <span class="highlight">seventh chord</span> adds one more note: the <b>7th above the root</b> — four notes total.</p>
<p>Seventh chords sound richer, more colorful, and often more "tense" than triads. They're essential in jazz, pop, blues, and classical music.</p>
<div class="staff-example" id="ch17-ex1a"></div>
<p>Above: C major triad (3 notes).</p>
<div class="staff-example" id="ch17-ex1b"></div>
<p>Above: C major seventh chord (4 notes) — hear how much richer it sounds?</p>`,
                        render(container) {
                            const el1 = container.querySelector("#ch17-ex1a");
                            if (el1) {
                                const f = new Factory({ renderer: { elementId: el1.id, width: 200, height: 120 } });
                                const s = f.EasyScore();
                                f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("(C4 E4 G4)/w"))] }).addClef("treble");
                                f.draw();
                            }
                            const el2 = container.querySelector("#ch17-ex1b");
                            if (el2) {
                                const f = new Factory({ renderer: { elementId: el2.id, width: 200, height: 120 } });
                                const s = f.EasyScore();
                                f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("(C4 E4 G4 B4)/w"))] }).addClef("treble");
                                f.draw();
                            }
                        }
                    },
                    {
                        title: "Major Seventh Chords",
                        content: `<h3>Major Seventh Chords</h3>
<p>A <span class="highlight">major seventh chord</span> (Cmaj7) = major triad + <b>major 7th</b> on top.</p>
<p>Formula: Root + M3 + m3 + M3</p>
<p><b>Cmaj7 = C–E–G–B</b> (the B is 11 half steps above C — a major 7th)</p>
<p>Sound: <em>dreamy, smooth, sophisticated</em> — common in jazz and bossa nova.</p>
<div class="staff-example" id="ch17-ex2"></div>
<p>Above: Cmaj7 — notice the B sitting just a half step below the octave C.</p>`,
                        render(container) {
                            const el = container.querySelector("#ch17-ex2");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
                            const s = f.EasyScore();
                            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("(C4 E4 G4 B4)/w"))] }).addClef("treble");
                            f.draw();
                        }
                    },
                    {
                        title: "Dominant Seventh Chords",
                        content: `<h3>Dominant Seventh Chords</h3>
<p>A <span class="highlight">dominant seventh chord</span> (C7) = major triad + <b>minor 7th</b> on top.</p>
<p>Formula: Root + M3 + m3 + m3</p>
<p><b>C7 = C–E–G–B♭</b> (the B♭ is 10 half steps above C — a minor 7th)</p>
<p>Sound: <em>strong, tense, wants to resolve</em> — the "engine" of V→I progressions.</p>
<p>The <span class="highlight">V7→I</span> progression is the strongest resolution in music (e.g., G7→C in the key of C).</p>
<div class="staff-example" id="ch17-ex3"></div>
<p>Above: C7 — compare with Cmaj7: only one note different (B♭ vs B).</p>`,
                        render(container) {
                            const el = container.querySelector("#ch17-ex3");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
                            const s = f.EasyScore();
                            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("(C4 E4 G4 Bb4)/w"))] }).addClef("treble");
                            f.draw();
                        }
                    },
                    {
                        title: "Minor Seventh Chords",
                        content: `<h3>Minor Seventh Chords</h3>
<p>A <span class="highlight">minor seventh chord</span> (Cm7) = minor triad + <b>minor 7th</b> on top.</p>
<p>Formula: Root + m3 + M3 + m3</p>
<p><b>Cm7 = C–E♭–G–B♭</b></p>
<p><b>Am7 = A–C–E–G</b> (all white keys — try it on the piano!)</p>
<p>Sound: <em>mellow, warm</em> — the workhorse of jazz and R&amp;B.</p>
<p>The <span class="highlight">ii–V–I</span> progression in jazz uses all seventh chords: <b>Dm7 → G7 → Cmaj7</b></p>
<div class="staff-example" id="ch17-ex4"></div>
<p>Above: Am7 — four white keys, one of the easiest seventh chords to play.</p>`,
                        render(container) {
                            const el = container.querySelector("#ch17-ex4");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
                            const s = f.EasyScore();
                            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("(A3 C4 E4 G4)/w"))] }).addClef("treble");
                            f.draw();
                        }
                    },
                    {
                        title: "Recognizing Seventh Chords",
                        content: `<h3>Recognizing Seventh Chords</h3>
<p>Here are the three main types to know:</p>
<table style="width:100%; text-align:left; border-collapse:collapse; margin:0.5em 0;">
<tr><td style="padding:4px 8px;"><b>maj7</b></td><td>Major triad + major 7th</td><td><em>Dreamy</em></td><td>Cmaj7 or CΔ7</td></tr>
<tr><td style="padding:4px 8px;"><b>7</b> (dom.)</td><td>Major triad + minor 7th</td><td><em>Tense, resolves</em></td><td>C7</td></tr>
<tr><td style="padding:4px 8px;"><b>m7</b></td><td>Minor triad + minor 7th</td><td><em>Mellow</em></td><td>Cm7 or C–7</td></tr>
</table>
<p>There's also the <b>dim7</b> (diminished seventh) — we'll save that for later.</p>
<p><span class="mnemonic">When you see chord symbols like Dm7–G7–Cmaj7, you now know exactly what notes to play!</span></p>`,
                        render: null
                    }
                ],
                quizPool: [
                    { id: "17-1", prompt: "A seventh chord has how many notes?", render: null, options: ["2", "3", "4", "5"], correctIndex: 2 },
                    { id: "17-2", prompt: "What notes make up Cmaj7?", render: null, options: ["C–E–G–B\u266d", "C–E\u266d–G–B\u266d", "C–E–G–B", "C–E\u266d–G–B"], correctIndex: 2 },
                    { id: "17-3", prompt: "What notes make up C7 (dominant seventh)?", render: null, options: ["C–E–G–B", "C–E–G–B\u266d", "C–E\u266d–G–B\u266d", "C–E\u266d–G–B"], correctIndex: 1 },
                    { id: "17-4", prompt: "A dominant seventh chord has a ___ 7th on top:", render: null, options: ["Major", "Minor", "Perfect", "Diminished"], correctIndex: 1 },
                    { id: "17-5", prompt: "A major seventh chord has a ___ 7th on top:", render: null, options: ["Major", "Minor", "Perfect", "Augmented"], correctIndex: 0 },
                    { id: "17-6", prompt: "Which chord wants to resolve most strongly?", render: null, options: ["Cmaj7", "Cm7", "C7 (dominant)", "C minor triad"], correctIndex: 2 },
                    { id: "17-7", prompt: "What notes make up Am7?", render: null, options: ["A–C\u266f–E–G", "A–C–E–G\u266f", "A–C–E–G", "A–C\u266f–E–G\u266f"], correctIndex: 2 },
                    { id: "17-8", prompt: "The ii–V–I in C major is:", render: null, options: ["Dm–G–C", "Dm7–G7–Cmaj7", "Cm7–F7–B\u266dmaj7", "Em7–A7–Dmaj7"], correctIndex: 1 },
                    { id: "17-9", prompt: "How many half steps from C to B (major 7th)?", render: null, options: ["10", "11", "12", "9"], correctIndex: 1 },
                    { id: "17-10", prompt: "How many half steps from C to B\u266d (minor 7th)?", render: null, options: ["9", "10", "11", "12"], correctIndex: 1 }
                ]
            },
```

**Step 2: Verify balanced braces**

**Step 3: Commit**

```bash
git add index.html
git commit -m "Add chapter 17: Seventh Chords"
```

---

### Task 4: Update Chapter Count & Polish

**Files:**
- Modify: `index.html` line 700 — change "Chapter 1 of 14" to "Chapter 1 of 17"

**Step 1: Update initial HTML**

```html
<!-- Change -->
<div class="mode-level" id="menu-notation-level">Chapter 1 of 14</div>
<!-- To -->
<div class="mode-level" id="menu-notation-level">Chapter 1 of 17</div>
```

**Step 2: Verify all braces balanced**

**Step 3: Verify no hardcoded "14" references remain**

Grep for "of 14" or "14 chapters".

**Step 4: Commit**

```bash
git add index.html
git commit -m "Update chapter count to 17"
```

---

### Task 5: Spec Review & Version Bump

**Step 1: Run code review**

- Verify all 30 quiz answers (10 per chapter) have correct `correctIndex` values
- Verify VexFlow render functions use consistent patterns
- Check 4-note chord syntax `(C4 E4 G4 B4)/w` works
- Verify key signature rendering `.addKeySignature("G")` etc.
- Check for broken HTML in content strings
- Verify chapter IDs are sequential (15, 16, 17)
- Verify quiz IDs follow pattern (15-1 through 17-10)

**Step 2: Bump version**

In `sw.js`, change:
```javascript
const APP_VERSION = '2.2.0';
// to
const APP_VERSION = '2.3.0';
```

**Step 3: Commit and push**

```bash
git add sw.js
git commit -m "Bump version to 2.3.0"
git push
```

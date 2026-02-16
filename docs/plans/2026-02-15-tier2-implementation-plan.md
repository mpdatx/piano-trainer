# Tier 2 Chapters (12-14) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 3 new theory chapters (Dynamics & Expression, Tempo Markings, Repeat Signs & Navigation) to the Music Notation learning mode.

**Architecture:** Same as chapters 1-11 — add chapter objects to the `NOTATION_CHAPTERS` array in `index.html`. Each chapter has `pages[]` with HTML content and optional VexFlow `render` functions, plus `quizPool[]` with multiple-choice questions. Visual rendering uses VexFlow for staff-based examples and inline SVG for isolated symbols (hairpins). Update initial HTML chapter count from 11 to 14, bump version.

**Tech Stack:** Vanilla JS, VexFlow 4.x (Factory/EasyScore/System API, TextDynamics, Articulation, repeat barlines, VoltaBracket), inline SVG for hairpin symbols.

**Design doc:** `docs/plans/2026-02-15-tier2-chapters-design.md`

---

### Task 1: Add Chapter 12 — Dynamics & Expression

**Files:**
- Modify: `index.html` — insert chapter 12 into `NOTATION_CHAPTERS` array before the closing `];` (currently at line 2039)

**Step 1: Add Chapter 12 data**

Insert before the `];` that closes `NOTATION_CHAPTERS` (line 2039). Follow the exact same structure as chapters 1-11.

```javascript
            // ── Chapter 12: Dynamics & Expression ──
            {
                id: 12,
                title: "Dynamics & Expression",
                subtitle: "How loud and how soft",
                pages: [
                    {
                        title: "Volume in Music",
                        content: `<h3>Volume in Music</h3>
<p>Music isn't all the same volume — composers indicate how loud or soft to play using <span class="highlight">dynamic markings</span>.</p>
<p>These markings are Italian abbreviations written <span class="highlight">below the staff</span>. They range from very soft to very loud.</p>
<p>The basic range from softest to loudest:</p>
<p style="text-align:center; font-size:1.3em; font-style:italic; letter-spacing:0.3em;"><span class="highlight">pp &nbsp; p &nbsp; mp &nbsp; mf &nbsp; f &nbsp; ff</span></p>
<div class="staff-example" id="ch12-ex1"></div>
<p>Above: a staff with a <span class="highlight">p</span> (piano / soft) marking below.</p>`,
                        render(container) {
                            const el = container.querySelector("#ch12-ex1");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 140 } });
                            const s = f.EasyScore();
                            const voice = s.voice(s.notes("C4/q, E4/q, G4/q, C5/q"));
                            const stave = f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [voice] }).addClef("treble");
                            f.draw();
                            // Add "p" text below the staff manually
                            const ctx = f.getContext();
                            ctx.setFont("Times", 16, "bold italic");
                            ctx.fillText("p", 60, 130);
                        }
                    },
                    {
                        title: "The Dynamic Markings",
                        content: `<h3>The Dynamic Markings</h3>
<p>Here are the six standard dynamic levels, from softest to loudest:</p>
<table style="width:100%; text-align:left; border-collapse:collapse; margin:0.5em 0;">
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>pp</b></td><td>pianissimo — <span class="highlight">very soft</span></td></tr>
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>p</b></td><td>piano — <span class="highlight">soft</span></td></tr>
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>mp</b></td><td>mezzo piano — <span class="highlight">moderately soft</span></td></tr>
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>mf</b></td><td>mezzo forte — <span class="highlight">moderately loud</span></td></tr>
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>f</b></td><td>forte — <span class="highlight">loud</span></td></tr>
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>ff</b></td><td>fortissimo — <span class="highlight">very loud</span></td></tr>
</table>
<p><span class="mnemonic">Fun fact: The instrument "piano" is short for "pianoforte" — meaning "soft-loud" — because it was the first keyboard that could play both!</span></p>`,
                        render: null
                    },
                    {
                        title: "Gradual Changes — Crescendo & Decrescendo",
                        content: `<h3>Gradual Changes</h3>
<p>Music often changes volume gradually rather than jumping from one level to another.</p>
<p><span class="highlight">Crescendo</span> (cresc. or hairpin opening to the right): get <b>gradually louder</b></p>
<svg width="120" height="30" style="display:block; margin:0.3em auto;"><line x1="5" y1="15" x2="115" y2="5" stroke="currentColor" stroke-width="2"/><line x1="5" y1="15" x2="115" y2="25" stroke="currentColor" stroke-width="2"/></svg>
<p><span class="highlight">Decrescendo</span> (decresc. or dim., hairpin opening to the left): get <b>gradually softer</b></p>
<svg width="120" height="30" style="display:block; margin:0.3em auto;"><line x1="5" y1="5" x2="115" y2="15" stroke="currentColor" stroke-width="2"/><line x1="5" y1="25" x2="115" y2="15" stroke="currentColor" stroke-width="2"/></svg>
<p>These hairpin symbols appear below the staff, spanning the notes where the change happens.</p>
<div class="staff-example" id="ch12-ex2"></div>`,
                        render(container) {
                            const el = container.querySelector("#ch12-ex2");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 140 } });
                            const s = f.EasyScore();
                            const voice = s.voice(s.notes("C4/q, D4/q, E4/q, F4/q"));
                            f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [voice] }).addClef("treble");
                            f.draw();
                            // Draw crescendo hairpin below staff
                            const ctx = f.getContext();
                            ctx.beginPath();
                            ctx.moveTo(55, 120); ctx.lineTo(230, 110);
                            ctx.moveTo(55, 120); ctx.lineTo(230, 130);
                            ctx.stroke();
                        }
                    },
                    {
                        title: "Other Expression Marks",
                        content: `<h3>Other Expression Marks</h3>
<p>Beyond dynamics, composers use other symbols to shape how individual notes are played:</p>
<p><span class="highlight">sfz</span> (sforzando) — a sudden strong accent on one note</p>
<p><span class="highlight">fp</span> (fortepiano) — loud, then immediately soft</p>
<p><span class="highlight">Accent (&gt;)</span> — emphasize this particular note</p>
<p><span class="highlight">Fermata (𝄐)</span> — hold this note longer than its written value; the performer decides how long</p>
<p>These marks add character and emotion to music — they're the difference between playing <em>notes</em> and playing <em>music</em>.</p>
<div class="staff-example" id="ch12-ex3"></div>
<p>Above: a note with a fermata — hold it as long as you feel is right.</p>`,
                        render(container) {
                            const el = container.querySelector("#ch12-ex3");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 140 } });
                            const s = f.EasyScore();
                            const notes = s.notes("C4/w");
                            notes[0].addModifier(new VexFlow.Articulation("a@a").setPosition(VexFlow.Modifier.Position.ABOVE));
                            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(notes)] }).addClef("treble");
                            f.draw();
                        }
                    }
                ],
                quizPool: [
                    { id: "12-1", prompt: "What does f mean?", render: null, options: ["Soft", "Moderately loud", "Loud", "Very loud"], correctIndex: 2 },
                    { id: "12-2", prompt: "What does p mean?", render: null, options: ["Soft", "Loud", "Moderately soft", "Very soft"], correctIndex: 0 },
                    { id: "12-3", prompt: "What does pp mean?", render: null, options: ["Moderately soft", "Very soft", "Soft", "Silent"], correctIndex: 1 },
                    { id: "12-4", prompt: "What does ff mean?", render: null, options: ["Moderately loud", "Loud", "Very loud", "As loud as possible"], correctIndex: 2 },
                    { id: "12-5", prompt: "What does mp mean?", render: null, options: ["Very soft", "Soft", "Moderately soft", "Moderately loud"], correctIndex: 2 },
                    { id: "12-6", prompt: "What does mf mean?", render: null, options: ["Moderately soft", "Moderately loud", "Loud", "Very loud"], correctIndex: 1 },
                    { id: "12-7", prompt: "This symbol means:", render(el) {
                        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        svg.setAttribute("width", "120"); svg.setAttribute("height", "30");
                        svg.innerHTML = `<line x1="5" y1="15" x2="115" y2="5" stroke="currentColor" stroke-width="2"/><line x1="5" y1="15" x2="115" y2="25" stroke="currentColor" stroke-width="2"/>`;
                        el.appendChild(svg);
                    }, options: ["Get softer", "Get louder", "Stay the same", "Accent"], correctIndex: 1 },
                    { id: "12-8", prompt: "This symbol means:", render(el) {
                        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        svg.setAttribute("width", "120"); svg.setAttribute("height", "30");
                        svg.innerHTML = `<line x1="5" y1="5" x2="115" y2="15" stroke="currentColor" stroke-width="2"/><line x1="5" y1="25" x2="115" y2="15" stroke="currentColor" stroke-width="2"/>`;
                        el.appendChild(svg);
                    }, options: ["Get louder", "Get softer", "Pause", "Repeat"], correctIndex: 1 },
                    { id: "12-9", prompt: "Order from softest to loudest: pp, f, mp, ff", render: null, options: ["pp, mp, f, ff", "mp, pp, f, ff", "pp, f, mp, ff", "f, mp, pp, ff"], correctIndex: 0 },
                    { id: "12-10", prompt: "What does sfz mean?", render: null, options: ["Very soft", "Gradually louder", "A sudden strong accent", "Slowly"], correctIndex: 2 }
                ]
            },
```

**Step 2: Verify balanced braces**

Run: `python3 -c "...check braces..."` (same pattern as before)
Expected: All balanced

**Step 3: Commit**

```bash
git add index.html
git commit -m "Add chapter 12: Dynamics & Expression"
```

---

### Task 2: Add Chapter 13 — Tempo Markings

**Files:**
- Modify: `index.html` — insert chapter 13 after chapter 12 in `NOTATION_CHAPTERS`

**Step 1: Add Chapter 13 data**

```javascript
            // ── Chapter 13: Tempo Markings ──
            {
                id: 13,
                title: "Tempo Markings",
                subtitle: "How fast or slow",
                pages: [
                    {
                        title: "What Is Tempo?",
                        content: `<h3>What Is Tempo?</h3>
<p><span class="highlight">Tempo</span> is the speed of the music — how fast the beats go by.</p>
<p>Tempo is measured in <span class="highlight">BPM</span> (beats per minute). At 60 BPM, there's one beat per second. At 120 BPM, two beats per second.</p>
<p>Tempo markings are written <span class="highlight">above the staff</span> at the beginning of a piece, or wherever the tempo changes.</p>
<p>Composers indicate tempo two ways: Italian terms (like <em>Allegro</em>) or exact BPM (like ♩ = 120), or both.</p>
<div class="staff-example" id="ch13-ex1"></div>`,
                        render(container) {
                            const el = container.querySelector("#ch13-ex1");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 140 } });
                            const s = f.EasyScore();
                            f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q"))] }).addClef("treble");
                            f.draw();
                            const ctx = f.getContext();
                            ctx.setFont("Times", 13, "bold italic");
                            ctx.fillText("Allegro  ♩ = 120", 50, 15);
                        }
                    },
                    {
                        title: "Common Tempo Terms",
                        content: `<h3>Common Tempo Terms</h3>
<p>From slowest to fastest:</p>
<table style="width:100%; text-align:left; border-collapse:collapse; margin:0.5em 0;">
<tr><td style="padding:3px 8px;"><b>Grave</b></td><td>~40 BPM — very slow, solemn</td></tr>
<tr><td style="padding:3px 8px;"><b>Largo</b></td><td>~50 BPM — slow, broad</td></tr>
<tr><td style="padding:3px 8px;"><b>Adagio</b></td><td>~70 BPM — slow, at ease</td></tr>
<tr><td style="padding:3px 8px;"><b>Andante</b></td><td>~80 BPM — walking pace</td></tr>
<tr><td style="padding:3px 8px;"><b>Moderato</b></td><td>~100 BPM — moderate speed</td></tr>
<tr><td style="padding:3px 8px;"><b>Allegro</b></td><td>~130 BPM — fast, lively</td></tr>
<tr><td style="padding:3px 8px;"><b>Vivace</b></td><td>~160 BPM — very fast, vivid</td></tr>
<tr><td style="padding:3px 8px;"><b>Presto</b></td><td>~180 BPM — extremely fast</td></tr>
</table>
<p><span class="mnemonic">You don't need to memorize exact BPMs — just know the relative order from slow to fast.</span></p>`,
                        render: null
                    },
                    {
                        title: "Changing Tempo",
                        content: `<h3>Changing Tempo</h3>
<p>Music doesn't always stay at one speed. Composers indicate gradual changes:</p>
<p><span class="highlight">rit.</span> (ritardando) — gradually <b>slow down</b></p>
<p><span class="highlight">accel.</span> (accelerando) — gradually <b>speed up</b></p>
<p><span class="highlight">a tempo</span> — return to the <b>original tempo</b> after a rit. or accel.</p>
<p><span class="highlight">rubato</span> — flexible tempo with slight push and pull (common in Romantic piano music like Chopin)</p>
<p>These markings appear above or below the staff where the change begins.</p>`,
                        render: null
                    },
                    {
                        title: "Tempo in Practice",
                        content: `<h3>Tempo in Practice</h3>
<p>When you see a tempo marking, set your metronome to that BPM before playing.</p>
<p><span class="mnemonic">Pro tip: Always start slower than the written tempo and work your way up. Speed comes from accuracy, not the other way around.</span></p>
<p>Italian terms give the <em>character</em> and mood. BPM gives the exact speed. Many pieces use both: <b>"Allegro (♩ = 132)"</b> — the word sets the mood, the number sets the speed.</p>
<p>The existing practice modes in this app can be played at different speeds to build your tempo control.</p>`,
                        render: null
                    }
                ],
                quizPool: [
                    { id: "13-1", prompt: "What does Allegro mean?", render: null, options: ["Slow", "Walking pace", "Fast and lively", "Extremely fast"], correctIndex: 2 },
                    { id: "13-2", prompt: "What does Adagio mean?", render: null, options: ["Fast", "Moderate", "Slow, at ease", "Walking pace"], correctIndex: 2 },
                    { id: "13-3", prompt: "What does Presto mean?", render: null, options: ["Slow", "Moderate", "Fast", "Extremely fast"], correctIndex: 3 },
                    { id: "13-4", prompt: "What does Andante mean?", render: null, options: ["Very slow", "Walking pace", "Fast", "Very fast"], correctIndex: 1 },
                    { id: "13-5", prompt: "What does rit. mean?", render: null, options: ["Speed up", "Slow down gradually", "Return to tempo", "Play freely"], correctIndex: 1 },
                    { id: "13-6", prompt: "What does accel. mean?", render: null, options: ["Slow down", "Speed up gradually", "Hold the note", "Return to tempo"], correctIndex: 1 },
                    { id: "13-7", prompt: "What does a tempo mean?", render: null, options: ["Play faster", "Play slower", "Return to the original tempo", "End the piece"], correctIndex: 2 },
                    { id: "13-8", prompt: "Order from slowest to fastest: Allegro, Largo, Presto, Andante", render: null, options: ["Largo, Andante, Allegro, Presto", "Andante, Largo, Allegro, Presto", "Largo, Allegro, Andante, Presto", "Presto, Allegro, Andante, Largo"], correctIndex: 0 },
                    { id: "13-9", prompt: "BPM stands for:", render: null, options: ["Bars per measure", "Beats per minute", "Bass per measure", "Beats per melody"], correctIndex: 1 },
                    { id: "13-10", prompt: "What does Moderato mean?", render: null, options: ["Very slow", "Moderate speed", "Fast", "Extremely fast"], correctIndex: 1 }
                ]
            },
```

**Step 2: Verify balanced braces**

**Step 3: Commit**

```bash
git add index.html
git commit -m "Add chapter 13: Tempo Markings"
```

---

### Task 3: Add Chapter 14 — Repeat Signs & Navigation

**Files:**
- Modify: `index.html` — insert chapter 14 after chapter 13 in `NOTATION_CHAPTERS`

**Step 1: Add Chapter 14 data**

Note: VexFlow repeat barlines use `setBegBarType(VexFlow.Barline.type.REPEAT_BEGIN)` and `setEndBarType(VexFlow.Barline.type.REPEAT_END)` on staves. Volta brackets use `VoltaBracket`. For the quiz, use Unicode symbols for segno (𝄋) and coda (𝄌).

```javascript
            // ── Chapter 14: Repeat Signs & Navigation ──
            {
                id: 14,
                title: "Repeat Signs & Navigation",
                subtitle: "Finding your way through the music",
                pages: [
                    {
                        title: "Repeat Barlines",
                        content: `<h3>Repeat Barlines</h3>
<p>The most common navigation symbol in music: <span class="highlight">repeat barlines</span> tell you to play a section again.</p>
<p>A <span class="highlight">start repeat</span> has two dots on the right side of a thick barline. An <span class="highlight">end repeat</span> has two dots on the left side.</p>
<p>When you reach an end repeat, go back to the matching start repeat. If there's no start repeat, go back to the very beginning.</p>
<div class="staff-example" id="ch14-ex1"></div>
<p>Above: a passage enclosed in repeat barlines — play it, then play it again.</p>`,
                        render(container) {
                            const el = container.querySelector("#ch14-ex1");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                            const s = f.EasyScore();
                            const stave = f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q"))] }).addClef("treble");
                            stave.setBegBarType(VexFlow.Barline.type.REPEAT_BEGIN);
                            stave.setEndBarType(VexFlow.Barline.type.REPEAT_END);
                            f.draw();
                        }
                    },
                    {
                        title: "First and Second Endings",
                        content: `<h3>First and Second Endings</h3>
<p>Sometimes you repeat a section but <span class="highlight">change the ending</span> the second time through.</p>
<p><span class="highlight">1st ending</span> (bracket labeled "1."): play this ending the first time.</p>
<p><span class="highlight">2nd ending</span> (bracket labeled "2."): on the repeat, skip the 1st ending and play this instead.</p>
<p>These are called <span class="highlight">volta brackets</span>.</p>
<p>Flow: Play measures → 1st ending → repeat back → play measures → skip to 2nd ending → continue.</p>
<div class="staff-example" id="ch14-ex2"></div>`,
                        render(container) {
                            const el = container.querySelector("#ch14-ex2");
                            if (!el) return;
                            const f = new Factory({ renderer: { elementId: el.id, width: 340, height: 140 } });
                            const s = f.EasyScore();
                            const stave = f.System({ x: 0, y: 0, width: 300 }).addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q"))] }).addClef("treble");
                            stave.setEndBarType(VexFlow.Barline.type.REPEAT_END);
                            f.draw();
                            // Draw volta bracket text
                            const ctx = f.getContext();
                            ctx.setFont("Times", 11, "bold");
                            ctx.beginPath();
                            ctx.moveTo(200, 12); ctx.lineTo(200, 3); ctx.lineTo(290, 3);
                            ctx.stroke();
                            ctx.fillText("1.", 205, 14);
                        }
                    },
                    {
                        title: "D.C. and D.S.",
                        content: `<h3>D.C. and D.S.</h3>
<p><span class="highlight">D.C.</span> (Da Capo) — go back to the <b>very beginning</b></p>
<p><span class="highlight">D.S.</span> (Dal Segno) — go back to the <b>segno sign</b> <span style="font-size:1.4em;">𝄋</span></p>
<p>Both are usually followed by "al Fine" or "al Coda":</p>
<p><span class="highlight">D.C. al Fine</span> — go to the beginning, play until you see "Fine" (the end)</p>
<p><span class="highlight">D.S. al Coda</span> — go to the segno <span style="font-size:1.2em;">𝄋</span>, play until the coda sign <span style="font-size:1.2em;">𝄌</span>, then jump to the Coda section</p>
<p><span class="mnemonic">Think of D.C. as "go home" and D.S. as "go to the bookmark."</span></p>`,
                        render: null
                    },
                    {
                        title: "The Coda and Fine",
                        content: `<h3>The Coda and Fine</h3>
<p><span class="highlight">Coda</span> <span style="font-size:1.4em;">𝄌</span> — a special ending section, usually at the bottom of the page, separated from the main music.</p>
<p><span class="highlight">Fine</span> (pronounced "FEE-neh") — marks <b>the end</b>, especially when the piece doesn't end at the last measure on the page.</p>
<p>A typical flow with these markings:</p>
<ol>
<li>Play through the piece</li>
<li>See "D.S. al Coda"</li>
<li>Jump back to the segno sign <span style="font-size:1.2em;">𝄋</span></li>
<li>Play until you see the coda sign <span style="font-size:1.2em;">𝄌</span></li>
<li>Jump to the Coda section</li>
<li>Play the Coda to the end</li>
</ol>
<p>This saves page space by avoiding rewriting repeated sections.</p>`,
                        render: null
                    },
                    {
                        title: "Putting It All Together",
                        content: `<h3>Putting It All Together</h3>
<p>Here's how to read through a piece with navigation markings — a "roadmap":</p>
<p><b>Example piece:</b> Measures 1–8 with repeat signs, then a D.S. al Coda.</p>
<ol>
<li>Play measures 1–8</li>
<li>Hit the end repeat → go back and play 1–8 again</li>
<li>Continue to "D.S. al Coda" → jump back to <span style="font-size:1.2em;">𝄋</span></li>
<li>Play until <span style="font-size:1.2em;">𝄌</span> → jump to the Coda</li>
<li>Play the Coda section to the end</li>
</ol>
<p><span class="mnemonic">Practice tip: Before playing a new piece, trace the roadmap with your finger first so you know where you're going. No surprises!</span></p>
<p>Priority order when you see multiple markings: repeat signs first, then D.C./D.S., then check for endings and codas.</p>`,
                        render: null
                    }
                ],
                quizPool: [
                    { id: "14-1", prompt: "What do repeat barlines tell you to do?", render: null, options: ["Play louder", "Play the section again", "Skip ahead", "Slow down"], correctIndex: 1 },
                    { id: "14-2", prompt: "When you see a 2nd ending bracket, you should:", render: null, options: ["Play it both times", "Play it the first time only", "Skip the 1st ending and play this on the repeat", "Go back to the beginning"], correctIndex: 2 },
                    { id: "14-3", prompt: "What does D.C. stand for?", render: null, options: ["Da Coda", "Dal Capo", "Da Capo", "Dal Coda"], correctIndex: 2 },
                    { id: "14-4", prompt: "What does D.C. al Fine mean?", render: null, options: ["Go to the coda", "Go to the beginning and play until Fine", "Play the ending", "Repeat the last measure"], correctIndex: 1 },
                    { id: "14-5", prompt: "What does D.S. mean?", render: null, options: ["Go to the beginning", "Go to the coda", "Go back to the segno sign", "Go to the fine"], correctIndex: 2 },
                    { id: "14-6", prompt: "The segno sign (𝄋) is used with:", render: null, options: ["D.C.", "D.S.", "Fine", "Repeat barlines"], correctIndex: 1 },
                    { id: "14-7", prompt: "What is a Coda?", render: null, options: ["A repeat sign", "The beginning of a piece", "A special ending section", "A tempo marking"], correctIndex: 2 },
                    { id: "14-8", prompt: "What does Fine mean?", render: null, options: ["Fast", "The end", "Repeat", "The beginning"], correctIndex: 1 },
                    { id: "14-9", prompt: "In a passage with 1st and 2nd endings, how many times do you play the main section?", render: null, options: ["1", "2", "3", "4"], correctIndex: 1 },
                    { id: "14-10", prompt: "D.S. al Coda means:", render: null, options: ["Go to the beginning, play to coda sign, jump to coda", "Go to the segno, play to coda sign, jump to coda", "Go to the coda and play to the end", "Repeat from the coda sign"], correctIndex: 1 }
                ]
            },
```

**Step 2: Verify balanced braces**

**Step 3: Commit**

```bash
git add index.html
git commit -m "Add chapter 14: Repeat Signs & Navigation"
```

---

### Task 4: Update Chapter Count & Polish

**Files:**
- Modify: `index.html` line 700 — change "Chapter 1 of 11" to "Chapter 1 of 14"

**Step 1: Update initial HTML**

```html
<!-- Change -->
<div class="mode-level" id="menu-notation-level">Chapter 1 of 11</div>
<!-- To -->
<div class="mode-level" id="menu-notation-level">Chapter 1 of 14</div>
```

**Step 2: Verify all braces balanced**

Run: `python3 -c "..."` brace check

**Step 3: Verify no hardcoded "11" references remain**

Grep for "of 11" or "11 chapters" to make sure nothing was missed.

**Step 4: Commit**

```bash
git add index.html
git commit -m "Update chapter count to 14"
```

---

### Task 5: Spec Review & Version Bump

**Step 1: Run code review**

- Verify all 30 quiz answers (10 per chapter) have correct `correctIndex` values
- Verify all VexFlow render functions use consistent patterns (Factory, EasyScore, System, draw)
- Verify quiz render functions for hairpin SVGs work correctly
- Check for any broken HTML in content strings
- Verify chapter IDs are sequential (12, 13, 14)
- Verify quiz IDs follow pattern (12-1 through 12-10, 13-1 through 13-10, 14-1 through 14-10)

**Step 2: Bump version**

In `sw.js`, change:
```javascript
const APP_VERSION = '2.1.0';
// to
const APP_VERSION = '2.2.0';
```

**Step 3: Commit and push**

```bash
git add sw.js
git commit -m "Bump version to 2.2.0"
git push
```

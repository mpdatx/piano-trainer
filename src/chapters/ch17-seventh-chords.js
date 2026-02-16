const { Factory } = Vex.Flow;

export default {
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
<p><b>C7 = C–E–G–B\u266D</b> (the B\u266D is 10 half steps above C — a minor 7th)</p>
<p>Sound: <em>strong, tense, wants to resolve</em> — the "engine" of V→I progressions.</p>
<p>The <span class="highlight">V7→I</span> progression is the strongest resolution in music (e.g., G7→C in the key of C).</p>
<div class="staff-example" id="ch17-ex3"></div>
<p>Above: C7 — compare with Cmaj7: only one note different (B\u266D vs B).</p>`,
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
<p><b>Cm7 = C–E\u266D–G–B\u266D</b></p>
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
<tr><td style="padding:4px 8px;"><b>maj7</b></td><td>Major triad + major 7th</td><td><em>Dreamy</em></td><td>Cmaj7 or C\u03947</td></tr>
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
        { id: "17-2", prompt: "What notes make up Cmaj7?", render: null, options: ["C–E–G–B\u266D", "C–E\u266D–G–B\u266D", "C–E–G–B", "C–E\u266D–G–B"], correctIndex: 2 },
        { id: "17-3", prompt: "What notes make up C7 (dominant seventh)?", render: null, options: ["C–E–G–B", "C–E–G–B\u266D", "C–E\u266D–G–B\u266D", "C–E\u266D–G–B"], correctIndex: 1 },
        { id: "17-4", prompt: "A dominant seventh chord has a ___ 7th on top:", render: null, options: ["Major", "Minor", "Perfect", "Diminished"], correctIndex: 1 },
        { id: "17-5", prompt: "A major seventh chord has a ___ 7th on top:", render: null, options: ["Major", "Minor", "Perfect", "Augmented"], correctIndex: 0 },
        { id: "17-6", prompt: "Which chord wants to resolve most strongly?", render: null, options: ["Cmaj7", "Cm7", "C7 (dominant)", "C minor triad"], correctIndex: 2 },
        { id: "17-7", prompt: "What notes make up Am7?", render: null, options: ["A–C\u266F–E–G", "A–C–E–G\u266F", "A–C–E–G", "A–C\u266F–E–G\u266F"], correctIndex: 2 },
        { id: "17-8", prompt: "The ii–V–I in C major is:", render: null, options: ["Dm–G–C", "Dm7–G7–Cmaj7", "Cm7–F7–B\u266Dmaj7", "Em7–A7–Dmaj7"], correctIndex: 1 },
        { id: "17-9", prompt: "How many half steps from C to B (major 7th)?", render: null, options: ["10", "11", "12", "9"], correctIndex: 1 },
        { id: "17-10", prompt: "How many half steps from C to B\u266D (minor 7th)?", render: null, options: ["9", "10", "11", "12"], correctIndex: 1 }
    ]
};

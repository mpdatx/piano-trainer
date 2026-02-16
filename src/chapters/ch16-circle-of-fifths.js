const { Factory } = Vex.Flow;

export default {
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
<li><b>I\u2011IV\u2011V chords:</b> in any key, IV is one step counter-clockwise, V is one step clockwise — they're always neighbors!</li>
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
        { id: "16-5", prompt: "How many flats does B\u266D major have?", render: null, options: ["1", "2", "3", "4"], correctIndex: 1 },
        { id: "16-6", prompt: "The order of sharps begins with:", render: null, options: ["B\u266D E\u266D A\u266D", "F\u266F C\u266F G\u266F", "C\u266F F\u266F G\u266F", "G\u266F D\u266F A\u266F"], correctIndex: 1 },
        { id: "16-7", prompt: "The relative minor of G major is:", render: null, options: ["B minor", "D minor", "E minor", "A minor"], correctIndex: 2 },
        { id: "16-8", prompt: "On the circle, keys that are neighbors differ by:", render: null, options: ["3 sharps or flats", "2 sharps or flats", "1 sharp or flat", "No sharps or flats"], correctIndex: 2 },
        { id: "16-9", prompt: "Which key has 3 sharps?", render: null, options: ["G major", "D major", "A major", "E major"], correctIndex: 2 },
        { id: "16-10", prompt: "Moving counter-clockwise from C, the first key is:", render: null, options: ["G major", "F major", "D major", "B\u266D major"], correctIndex: 1 }
    ]
};

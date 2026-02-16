const { Factory } = Vex.Flow;

export default {
    id: 15,
    title: "Intervals in Depth",
    subtitle: "Measuring the distance between notes",
    pages: [
        {
            title: "What Is an Interval?",
            content: `<h3>What Is an Interval?</h3>
<p>An <span class="highlight">interval</span> is the distance between two notes, measured by both <span class="highlight">quantity</span> (a number) and <span class="highlight">quality</span> (a type).</p>
<p>We touched on half steps and whole steps in Chapter 7 — intervals give us a richer, more precise vocabulary for describing distances.</p>
<p>The <b>number</b> comes from counting letter names inclusively. C to E = a <span class="highlight">3rd</span> (C\u2011D\u2011E — three letter names).</p>
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
};

const { Factory } = Vex.Flow;

export default {
    id: 3,
    title: "Note Values",
    subtitle: "How long notes last",
    pages: [
        {
            title: "Notes Have Duration",
            content: `<h3>Notes Have Duration</h3>
<p>A note on the staff tells you two things: <span class="highlight">which pitch</span> to play (its position) and <span class="highlight">how long</span> to hold it (its shape).</p>
<p>Here are the most common note values, measured in beats (in 4/4 time):</p>
<p><span class="highlight">Whole note</span> — 4 beats (open oval, no stem)</p>
<p><span class="highlight">Half note</span> — 2 beats (open oval with stem)</p>
<p><span class="highlight">Quarter note</span> — 1 beat (filled oval with stem)</p>
<p><span class="highlight">Eighth note</span> — 1/2 beat (filled oval, stem, flag)</p>
<p><span class="highlight">Sixteenth note</span> — 1/4 beat (filled oval, stem, double flag)</p>
<p>Each value is exactly <strong>half</strong> the duration of the one above it.</p>`,
            render: null
        },
        {
            title: "Whole and Half Notes",
            content: `<h3>Whole and Half Notes</h3>
<p>The <span class="highlight">whole note</span> is an open (hollow) oval with no stem. It lasts <span class="highlight">4 beats</span> — a full measure in 4/4 time.</p>
<div class="staff-example" id="ch3-ex1"></div>
<p>The <span class="highlight">half note</span> looks similar but adds a stem. It lasts <span class="highlight">2 beats</span>, so two half notes fill one measure.</p>
<div class="staff-example" id="ch3-ex2"></div>
<p><span class="mnemonic">Tip: "whole" = whole measure, "half" = half a measure.</span></p>`,
            render(container) {
                let el = container.querySelector("#ch3-ex1");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/w"))] }).addClef("treble");
                    f.draw();
                }
                el = container.querySelector("#ch3-ex2");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/h, E4/h"), { time: "4/4" })] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "Quarter and Eighth Notes",
            content: `<h3>Quarter and Eighth Notes</h3>
<p>The <span class="highlight">quarter note</span> has a filled (solid) oval and a stem. It gets <span class="highlight">1 beat</span>. Four quarter notes fill a 4/4 measure.</p>
<div class="staff-example" id="ch3-ex3"></div>
<p>The <span class="highlight">eighth note</span> adds a flag (or beam when grouped) to the stem. It gets <span class="highlight">half a beat</span>, so two eighths equal one quarter.</p>
<div class="staff-example" id="ch3-ex4"></div>
<p><span class="mnemonic">Look for the flag! More flags = shorter note.</span></p>`,
            render(container) {
                let el = container.querySelector("#ch3-ex3");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q"))] }).addClef("treble");
                    f.draw();
                }
                el = container.querySelector("#ch3-ex4");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/8, D4/8, E4/8, F4/8, G4/8, A4/8, B4/8, C5/8"), { time: "4/4" })] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "The Duration Tree",
            content: `<h3>The Duration Tree</h3>
<p>Note values form a neat hierarchy — each one is <span class="highlight">half the length</span> of the one above:</p>
<p>1 whole = 2 halves = 4 quarters = 8 eighths = 16 sixteenths</p>
<p><strong>Dotted notes:</strong> A <span class="highlight">dot</span> after a note adds half its value. A dotted half note = 2 + 1 = <span class="highlight">3 beats</span>. A dotted quarter = 1 + 0.5 = 1.5 beats.</p>
<p><strong>Ties:</strong> A curved line connecting two notes of the same pitch <span class="highlight">adds their durations together</span>. A half note tied to a quarter note = 3 beats (same result as a dotted half).</p>
<p><span class="mnemonic">Dots add half, ties add everything.</span></p>`,
            render: null
        },
    ],
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
};

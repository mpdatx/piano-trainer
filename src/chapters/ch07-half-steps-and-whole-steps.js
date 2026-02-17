const { Factory } = Vex.Flow;

export default {
    id: 7,
    title: "Half Steps & Whole Steps",
    subtitle: "The building blocks of music",
    pages: [
        {
            title: "What Is a Half Step?",
            content: `<h3>What Is a Half Step?</h3>
<p>A <span class="highlight">half step</span> is the smallest distance between two notes in Western music. On the piano, it's from one key to the <em>very next key</em> — white or black.</p>
<p>Most white keys have a black key between them, making the distance from one white key to the next a whole step. But <span class="highlight">E→F</span> and <span class="highlight">B→C</span> are natural half steps — there's no black key between them.</p>
<p><span class="mnemonic">Remember: E-F and B-C are the "no-gap" pairs.</span></p>
<div class="staff-example" id="ch7-ex1"></div>
<p>Above: C to C# (white to black key) — a half step.</p>
<div class="staff-example" id="ch7-ex2"></div>
<p>Above: E to F (two white keys, no black key between) — also a half step.</p>`,
            render(container) {
                const el1 = container.querySelector("#ch7-ex1");
                if (el1) {
                    const f = new Factory({ renderer: { elementId: el1.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/h, C#4/h"))] }).addClef("treble");
                    f.draw();
                }
                const el2 = container.querySelector("#ch7-ex2");
                if (el2) {
                    const f = new Factory({ renderer: { elementId: el2.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("E4/h, F4/h"))] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "What Is a Whole Step?",
            content: `<h3>What Is a Whole Step?</h3>
<p>A <span class="highlight">whole step</span> equals <span class="highlight">two half steps</span>. On the keyboard, a whole step always skips exactly one key.</p>
<p>C→D is a whole step (skips C#). D→E is a whole step (skips D#).</p>
<p>Think of it this way: if you can fit one key in between, it's a whole step.</p>
<div class="staff-example" id="ch7-ex3"></div>
<p>Above: C to D, then D to E — both whole steps.</p>`,
            render(container) {
                const el = container.querySelector("#ch7-ex3");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/h, D4/h"))] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "The Piano Keyboard Pattern",
            content: `<h3>The Piano Keyboard Pattern</h3>
<p>The pattern of whole and half steps creates the distinctive layout of the piano keyboard. Between white keys:</p>
<p style="text-align:center; font-size:1.1em; letter-spacing:2px; margin:12px 0;">
<strong>C</strong> <span style="color:#2196F3">W</span> <strong>D</strong> <span style="color:#2196F3">W</span> <strong>E</strong> <span style="color:#e53935">H</span> <strong>F</strong> <span style="color:#2196F3">W</span> <strong>G</strong> <span style="color:#2196F3">W</span> <strong>A</strong> <span style="color:#2196F3">W</span> <strong>B</strong> <span style="color:#e53935">H</span> <strong>C</strong>
</p>
<p><span style="color:#2196F3"><strong>W</strong></span> = Whole step (black key between) &nbsp; <span style="color:#e53935"><strong>H</strong></span> = Half step (no black key)</p>
<p>This <span class="highlight">W-W-H-W-W-W-H</span> pattern repeats every octave — it's the foundation of the major scale (Chapter 8).</p>
<p><span class="mnemonic">The half steps always land between E-F and B-C.</span></p>`
        },
        {
            title: "Counting Half Steps",
            content: `<h3>Counting Half Steps</h3>
<p>To count half steps between two notes, count every key (black and white) from the starting note to the target — don't count the starting note itself.</p>
<p><span class="highlight">C to E</span> = 4 half steps (C→C#→D→D#→E)</p>
<p><span class="highlight">C to G</span> = 7 half steps (C→C#→D→D#→E→F→F#→G)</p>
<p>This skill is essential: intervals, scales, and chords are all defined by specific half-step distances.</p>`
        },
    ],
    quizPool: [
        { id: "7-1", prompt: "What is a half step?", render: null, options: ["The smallest distance between two notes", "A skip of two keys", "The distance between C and E", "The distance between octaves"], correctIndex: 0 },
        { id: "7-2", prompt: "How many half steps from E to F?", render: null, options: ["1", "2", "3", "0"], correctIndex: 0 },
        { id: "7-3", prompt: "How many half steps from B to C?", render: null, options: ["2", "3", "0", "1"], correctIndex: 3 },
        { id: "7-4", prompt: "What is a whole step?", render: null, options: ["Three half steps", "One half step", "Two half steps", "Four half steps"], correctIndex: 2 },
        { id: "7-5", prompt: "How many half steps from C to D?", render: null, options: ["1", "2", "3", "4"], correctIndex: 1 },
        { id: "7-6", prompt: "Which pair of white keys has NO black key between them?", render: null, options: ["C and D", "D and E", "E and F", "G and A"], correctIndex: 2 },
        { id: "7-7", prompt: "How many half steps from C to E?", render: null, options: ["2", "3", "4", "5"], correctIndex: 2 },
        { id: "7-8", prompt: "How many half steps from C to G?", render: null, options: ["5", "6", "7", "8"], correctIndex: 2 },
        { id: "7-9", prompt: "A whole step on the piano always skips ___ key(s):", render: null, options: ["0", "1", "2", "3"], correctIndex: 1 },
        { id: "7-10", prompt: "Which of these is a half step?", render: null, options: ["C to D", "D to F", "F to F#", "G to B"], correctIndex: 2 },
    ],
};

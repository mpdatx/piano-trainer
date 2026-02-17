const { Factory } = Vex.Flow;

export default {
    id: 5,
    title: "Time Signatures",
    subtitle: "Organizing beats into measures",
    pages: [
        {
            title: "What Is a Time Signature?",
            content: `<h3>What Is a Time Signature?</h3>
<p>At the start of every piece you'll see two numbers stacked on the staff. This is the <span class="highlight">time signature</span>.</p>
<p>The <span class="highlight">top number</span> tells you how many beats are in each measure.</p>
<p>The <span class="highlight">bottom number</span> tells you which note value gets one beat (4 = quarter note, 8 = eighth note).</p>
<p>Vertical lines called <span class="highlight">bar lines</span> divide the staff into measures. Each measure must contain exactly the number of beats the time signature specifies.</p>
<div class="staff-example" id="ch5-ex1"></div>
<p>Above: 4/4 time — four quarter-note beats per measure. This is the most common time signature.</p>`,
            render(container) {
                const el = container.querySelector("#ch5-ex1");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q"))] }).addClef("treble").addTimeSignature("4/4");
                    f.draw();
                }
            }
        },
        {
            title: "Common Time Signatures",
            content: `<h3>Common Time Signatures</h3>
<p><span class="highlight">4/4</span> — Four quarter-note beats. Called "common time." Used in most pop, rock, and classical music.</p>
<p><span class="highlight">3/4</span> — Three quarter-note beats. The feel of a <span class="highlight">waltz</span>: ONE-two-three, ONE-two-three.</p>
<p><span class="highlight">2/4</span> — Two quarter-note beats. Often used in marches: LEFT-right, LEFT-right.</p>
<div class="staff-example" id="ch5-ex2"></div>
<p>Above: 4/4 — four quarter notes per measure.</p>
<div class="staff-example" id="ch5-ex3"></div>
<p>Above: 3/4 — three quarter notes per measure (waltz feel).</p>`,
            render(container) {
                let el = container.querySelector("#ch5-ex2");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/q, E4/q, G4/q, C5/q"))] }).addClef("treble").addTimeSignature("4/4");
                    f.draw();
                }
                el = container.querySelector("#ch5-ex3");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/q, E4/q, G4/q"), { time: "3/4" })] }).addClef("treble").addTimeSignature("3/4");
                    f.draw();
                }
            }
        },
        {
            title: "Compound Time: 6/8",
            content: `<h3>Compound Time: 6/8</h3>
<p><span class="highlight">6/8 time</span> has six eighth-note beats per measure, but they are felt as <span class="highlight">two groups of three</span>.</p>
<p>This gives the music a swinging, lilting feel — think of "Row, Row, Row Your Boat" or an Irish jig.</p>
<p>How is 6/8 different from 3/4? Both have six eighth notes per measure, but 3/4 groups them as <strong>three groups of two</strong>, while 6/8 groups them as <strong>two groups of three</strong>. The emphasis pattern is different.</p>
<div class="staff-example" id="ch5-ex4"></div>
<p>Above: 6/8 time — six eighth notes grouped in two sets of three.</p>`,
            render(container) {
                const el = container.querySelector("#ch5-ex4");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 300 }).addStave({ voices: [s.voice(s.notes("C4/8, D4/8, E4/8, F4/8, G4/8, A4/8"), { time: "6/8" })] }).addClef("treble").addTimeSignature("6/8");
                    f.draw();
                }
            }
        },
    ],
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
};

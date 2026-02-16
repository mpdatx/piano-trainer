const { Factory } = Vex.Flow;

export default {
    id: 4,
    title: "Rests",
    subtitle: "The sound of silence",
    pages: [
        {
            title: "Silence Has Notation Too",
            content: `<h3>Silence Has Notation Too</h3>
<p>Music isn't just about sound — the silences between notes are just as important. <span class="highlight">Rests</span> tell you when <em>not</em> to play.</p>
<p>Every note value has a matching rest of equal duration:</p>
<p><span class="highlight">Whole rest</span> — 4 beats of silence</p>
<p><span class="highlight">Half rest</span> — 2 beats of silence</p>
<p><span class="highlight">Quarter rest</span> — 1 beat of silence</p>
<p><span class="highlight">Eighth rest</span> — 1/2 beat of silence</p>
<p><span class="highlight">Sixteenth rest</span> — 1/4 beat of silence</p>
<p>Rests follow the same duration tree as notes — each is half the value of the one above.</p>`,
            render: null
        },
        {
            title: "Whole and Half Rests",
            content: `<h3>Whole and Half Rests</h3>
<p>These two look similar — both are small rectangles — but their position tells them apart:</p>
<p>The <span class="highlight">whole rest</span> hangs <em>down</em> from the fourth line (like a hole in the ground).</p>
<p>The <span class="highlight">half rest</span> sits <em>up</em> on the third line (like a hat on a head).</p>
<p><span class="mnemonic">Remember: the Whole rest hangs like it fell in a Hole. The Half rest sits up like a Hat.</span></p>
<div class="staff-example" id="ch4-ex1"></div>
<p>Above: two half rests filling one measure. Each represents 2 beats of silence.</p>`,
            render(container) {
                const el = container.querySelector("#ch4-ex1");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("B4/h/r, B4/h/r"), { time: "4/4" })] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "Quarter, Eighth, and Sixteenth Rests",
            content: `<h3>Quarter, Eighth, and Sixteenth Rests</h3>
<p>The <span class="highlight">quarter rest</span> looks like a zigzag or lightning bolt. It gets 1 beat of silence.</p>
<p>The <span class="highlight">eighth rest</span> resembles the number 7 with a dot. It gets half a beat.</p>
<p>The <span class="highlight">sixteenth rest</span> has two flags and gets a quarter of a beat.</p>
<div class="staff-example" id="ch4-ex2"></div>
<p>Above: a quarter rest, an eighth rest, and a sixteenth rest side by side. Notice how each shorter rest has more flags.</p>
<div class="staff-example" id="ch4-ex2b"></div>
<p>Above: a mix of quarter notes and quarter rests in action — play, rest, play, rest.</p>
<p><span class="mnemonic">More flags on a rest = shorter silence, just like notes.</span></p>`,
            render(container) {
                const el = container.querySelector("#ch4-ex2");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("B4/q/r, B4/8/r, B4/16/r, B4/16/r, B4/h/r"))] }).addClef("treble");
                    f.draw();
                }
                const el2 = container.querySelector("#ch4-ex2b");
                if (el2) {
                    const f = new Factory({ renderer: { elementId: el2.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/q, B4/q/r, E4/q, B4/q/r"))] }).addClef("treble");
                    f.draw();
                }
            }
        },
    ],
    quizPool: [
        { id: "4-1", prompt: "What type of rest is shown? (It hangs from a line)", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble");
            f.draw();
        }, options: ["Half rest", "Whole rest", "Quarter rest", "Eighth rest"], correctIndex: 1 },
        { id: "4-2", prompt: "How many beats of silence does a whole rest get in 4/4?", render: null, options: ["1", "2", "3", "4"], correctIndex: 3 },
        { id: "4-3", prompt: "How many beats does a half rest get?", render: null, options: ["1", "4", "2", "1/2"], correctIndex: 2 },
        { id: "4-4", prompt: "How many beats does a quarter rest get?", render: null, options: ["2", "4", "1/2", "1"], correctIndex: 3 },
        { id: "4-5", prompt: "The whole rest hangs DOWN, the half rest sits UP. True or false?", render: null, options: ["True", "False"], correctIndex: 0 },
        { id: "4-6", prompt: "How many beats does an eighth rest get?", render: null, options: ["1", "1/4", "2", "1/2"], correctIndex: 3 },
        { id: "4-7", prompt: "A rest tells you to:", render: null, options: ["Play louder", "Be silent", "Play faster", "Repeat a note"], correctIndex: 1 },
        { id: "4-8", prompt: "Which rest looks like a zigzag or lightning bolt?", render: null, options: ["Whole rest", "Half rest", "Quarter rest", "Eighth rest"], correctIndex: 2 },
        { id: "4-9", prompt: "How many eighth rests equal one quarter rest?", render: null, options: ["4", "1", "2", "8"], correctIndex: 2 },
        { id: "4-10", prompt: "Every note value has a corresponding:", render: null, options: ["Clef", "Rest of equal duration", "Key signature", "Time signature"], correctIndex: 1 },
    ],
};

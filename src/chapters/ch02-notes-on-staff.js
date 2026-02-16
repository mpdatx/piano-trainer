const { Factory } = Vex.Flow;

export default {
    id: 2,
    title: "Notes on the Staff",
    subtitle: "How pitch is represented",
    pages: [
        {
            title: "Notes Live on Lines and Spaces",
            content: `<h3>Notes Live on Lines and Spaces</h3>
<p>Every note sits either <span class="highlight">on a line</span> or <span class="highlight">in a space</span>. Moving up one position (line to space, or space to line) moves one letter name forward in the musical alphabet.</p>
<p>The musical alphabet uses only seven letters: <span class="highlight">A B C D E F G</span>, then repeats. After G comes A again.</p>
<p>As notes move up the staff, the pitch gets higher.</p>
<div class="staff-example" id="ch2-ex1"></div>
<p>Here is a C major scale — C D E F G A B C — climbing from Middle C up to the next C.</p>`,
            render(container) {
                const el = container.querySelector("#ch2-ex1");
                if (!el) return;
                const factory = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
                const score = factory.EasyScore();
                const system = factory.System({ x: 0, y: 0, width: 300 });
                const voice = score.voice(score.notes("C4/q, D4/q, E4/q, F4/q, G4/q, A4/q, B4/q, C5/q", { clef: "treble" }), { time: "8/4" });
                system.addStave({ voices: [voice] }).addClef("treble");
                factory.draw();
            }
        },
        {
            title: "Treble Clef Notes",
            content: `<h3>Treble Clef Notes</h3>
<p>Let's lock in the treble clef notes you'll see most often.</p>
<p><strong>Lines</strong> (bottom to top): <span class="highlight">E  G  B  D  F</span></p>
<p><span class="mnemonic">"Every Good Boy Does Fine"</span></p>
<p><strong>Spaces</strong> (bottom to top): <span class="highlight">F  A  C  E</span></p>
<p><span class="mnemonic">They spell FACE</span></p>
<div class="staff-example" id="ch2-ex2"></div>
<p>Above are the five line notes. Notice how each one sits directly <em>on</em> a line.</p>`,
            render(container) {
                const el = container.querySelector("#ch2-ex2");
                if (!el) return;
                const factory = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
                const score = factory.EasyScore();
                const system = factory.System({ x: 0, y: 0, width: 300 });
                const voice = score.voice(score.notes("E4/h, G4/h, B4/h, D5/h, F5/h", { clef: "treble" }), { time: "10/4" });
                system.addStave({ voices: [voice] }).addClef("treble");
                factory.draw();
            }
        },
        {
            title: "Bass Clef Notes",
            content: `<h3>Bass Clef Notes</h3>
<p>The bass clef has its own set of line and space notes.</p>
<p><strong>Lines</strong> (bottom to top): <span class="highlight">G  B  D  F  A</span></p>
<p><span class="mnemonic">"Good Boys Do Fine Always"</span></p>
<p><strong>Spaces</strong> (bottom to top): <span class="highlight">A  C  E  G</span></p>
<p><span class="mnemonic">"All Cows Eat Grass"</span></p>
<div class="staff-example" id="ch2-ex3"></div>
<p>Here are the five bass clef line notes. They are different from the treble clef lines — don't mix them up!</p>`,
            render(container) {
                const el = container.querySelector("#ch2-ex3");
                if (!el) return;
                const factory = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
                const score = factory.EasyScore();
                const system = factory.System({ x: 0, y: 0, width: 300 });
                const voice = score.voice(score.notes("G2/h, B2/h, D3/h, F3/h, A3/h", { clef: "bass" }), { time: "10/4" });
                system.addStave({ voices: [voice] }).addClef("bass");
                factory.draw();
            }
        },
        {
            title: "Octaves and Middle C",
            content: `<h3>Octaves and Middle C</h3>
<p>Since the alphabet repeats (A-G over and over), we use <span class="highlight">octave numbers</span> to tell notes apart. C4 is one octave higher than C3, and one octave lower than C5.</p>
<p><span class="highlight">Middle C (C4)</span> is the most important landmark. On the piano, it is near the center of the keyboard. On the grand staff, it sits on a ledger line between the two staves.</p>
<div class="staff-example" id="ch2-ex4"></div>
<p>Middle C written in both clefs. In the treble clef it hangs just below the staff; in the bass clef it sits just above.</p>`,
            render(container) {
                const el = container.querySelector("#ch2-ex4");
                if (!el) return;
                const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 200 } });
                const score = factory.EasyScore();
                const system = factory.System({ x: 0, y: 0, width: 260 });
                system.addStave({ voices: [score.voice(score.notes("C4/w", { clef: "treble" }))] }).addClef("treble");
                system.addStave({ voices: [score.voice(score.notes("C4/w", { clef: "bass" }))] }).addClef("bass");
                system.addConnector("brace");
                system.addConnector("singleLeft");
                factory.draw();
            }
        },
    ],
    quizPool: [
        { id: "2-1", prompt: "What note is this?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("E4/w"))] }).addClef("treble");
            f.draw();
        }, options: ["E", "F", "D", "G"], correctIndex: 0 },
        { id: "2-2", prompt: "What note is this?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("A4/w"))] }).addClef("treble");
            f.draw();
        }, options: ["G", "B", "A", "C"], correctIndex: 2 },
        { id: "2-3", prompt: "What note is this?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("F4/w"))] }).addClef("treble");
            f.draw();
        }, options: ["E", "G", "D", "F"], correctIndex: 3 },
        { id: "2-4", prompt: "What note is this?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B2/w", { clef: "bass" }))] }).addClef("bass");
            f.draw();
        }, options: ["A", "C", "B", "D"], correctIndex: 2 },
        { id: "2-5", prompt: "What note is this?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("D3/w", { clef: "bass" }))] }).addClef("bass");
            f.draw();
        }, options: ["C", "E", "D", "F"], correctIndex: 2 },
        { id: "2-6", prompt: "Treble clef line notes from bottom: E, G, B, D, ___", render: null, options: ["A", "F", "C", "E"], correctIndex: 1 },
        { id: "2-7", prompt: "Treble clef space notes spell:", render: null, options: ["FADE", "FACE", "CAGE", "CAFE"], correctIndex: 1 },
        { id: "2-8", prompt: "Bass clef line notes from bottom: G, B, D, F, ___", render: null, options: ["A", "G", "E", "C"], correctIndex: 0 },
        { id: "2-9", prompt: "Bass clef space notes from bottom: A, C, E, ___", render: null, options: ["F", "B", "G", "D"], correctIndex: 2 },
        { id: "2-10", prompt: "Middle C is also known as:", render: null, options: ["C3", "C5", "C4", "C2"], correctIndex: 2 },
    ],
};

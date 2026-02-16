const { Factory } = Vex.Flow;

export default {
    id: 1,
    title: "The Staff & Clefs",
    subtitle: "The foundation of written music",
    pages: [
        {
            title: "The Musical Staff",
            content: `<h3>The Musical Staff</h3>
<p>All written music lives on a <span class="highlight">staff</span> (or stave) — a set of <span class="highlight">5 horizontal lines</span> with <span class="highlight">4 spaces</span> between them.</p>
<p>Notes placed higher on the staff sound higher in pitch; notes placed lower sound lower. Think of it like a ladder for sound.</p>
<p>By itself the staff is just a grid — we need a <span class="highlight">clef</span> at the beginning to tell us which notes the lines and spaces represent.</p>
<div class="staff-example" id="ch1-ex1"></div>
<p>Above is an empty treble-clef staff. The curly symbol on the left is the clef.</p>`,
            render(container) {
                const el = container.querySelector("#ch1-ex1");
                if (!el) return;
                const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const score = factory.EasyScore();
                const system = factory.System({ x: 0, y: 0, width: 260 });
                system.addStave({ voices: [score.voice(score.notes("B4/w/r", { clef: "treble" }))] }).addClef("treble");
                factory.draw();
            }
        },
        {
            title: "The Treble Clef",
            content: `<h3>The Treble Clef</h3>
<p>The <span class="highlight">treble clef</span> is also called the <span class="highlight">G clef</span> because its shape is actually a stylized letter G. The curl wraps around the second line of the staff, telling you that line is the note <span class="highlight">G</span>. That's how the clef got its name — it literally points to G.</p>
<p><strong>Line notes</strong> from bottom to top: <span class="highlight">E  G  B  D  F</span></p>
<p><span class="mnemonic">Remember: "Every Good Boy Does Fine"</span></p>
<p><strong>Space notes</strong> from bottom to top: <span class="highlight">F  A  C  E</span></p>
<p><span class="mnemonic">They spell the word FACE!</span></p>
<div class="staff-example" id="ch1-ex2"></div>
<p>Here are the four line notes E, G, B, and D on the treble staff.</p>`,
            render(container) {
                const el = container.querySelector("#ch1-ex2");
                if (!el) return;
                const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const score = factory.EasyScore();
                const system = factory.System({ x: 0, y: 0, width: 260 });
                const voice = score.voice(score.notes("E4/q, G4/q, B4/q, D5/q", { clef: "treble" }), { time: "4/4" });
                system.addStave({ voices: [voice] }).addClef("treble");
                factory.draw();
            }
        },
        {
            title: "The Bass Clef",
            content: `<h3>The Bass Clef</h3>
<p>The <span class="highlight">bass clef</span> is also called the <span class="highlight">F clef</span> because its shape evolved from a stylized letter F. The two dots sit on either side of the fourth line, telling you that line is the note <span class="highlight">F</span>. Just like the treble clef points to G, the bass clef points to F — that's why it's the F clef.</p>
<p><strong>Line notes</strong> from bottom to top: <span class="highlight">G  B  D  F  A</span></p>
<p><span class="mnemonic">Remember: "Good Boys Do Fine Always"</span></p>
<p><strong>Space notes</strong> from bottom to top: <span class="highlight">A  C  E  G</span></p>
<p><span class="mnemonic">Remember: "All Cows Eat Grass"</span></p>
<div class="staff-example" id="ch1-ex3"></div>
<p>Here are the bass clef line notes G, B, D, and F.</p>`,
            render(container) {
                const el = container.querySelector("#ch1-ex3");
                if (!el) return;
                const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const score = factory.EasyScore();
                const system = factory.System({ x: 0, y: 0, width: 260 });
                const voice = score.voice(score.notes("G2/q, B2/q, D3/q, F3/q", { clef: "bass" }), { time: "4/4" });
                system.addStave({ voices: [voice] }).addClef("bass");
                factory.draw();
            }
        },
        {
            title: "The Grand Staff & Ledger Lines",
            content: `<h3>The Grand Staff &amp; Ledger Lines</h3>
<p>Piano music uses both clefs at once, joined by a bracket. This is called the <span class="highlight">grand staff</span>. The treble staff sits on top and the bass staff below.</p>
<p><span class="highlight">Middle C</span> (C4) sits on a small <span class="highlight">ledger line</span> right between the two staves. Ledger lines are short lines that extend the staff when notes go above or below its five lines.</p>
<div class="staff-example" id="ch1-ex4"></div>
<p>Notice how Middle C appears on a ledger line below the treble staff and above the bass staff — it is the same note written two ways.</p>`,
            render(container) {
                const el = container.querySelector("#ch1-ex4");
                if (!el) return;
                const factory = new Factory({ renderer: { elementId: el.id, width: 300, height: 200 } });
                const score = factory.EasyScore();
                const system = factory.System({ x: 0, y: 0, width: 260 });
                const trebleVoice = score.voice(score.notes("C4/w", { clef: "treble" }));
                const bassVoice = score.voice(score.notes("C4/w", { clef: "bass" }));
                system.addStave({ voices: [trebleVoice] }).addClef("treble");
                system.addStave({ voices: [bassVoice] }).addClef("bass");
                system.addConnector("brace");
                system.addConnector("singleLeft");
                factory.draw();
            }
        },
    ],
    quizPool: [
        { id: "1-1", prompt: "How many lines does a musical staff have?", render: null, options: ["4", "5", "6", "3"], correctIndex: 1 },
        { id: "1-2", prompt: "How many spaces are between the lines of a staff?", render: null, options: ["3", "5", "4", "6"], correctIndex: 2 },
        { id: "1-3", prompt: "Which clef is shown?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble");
            f.draw();
        }, options: ["Treble clef", "Bass clef", "Alto clef", "Tenor clef"], correctIndex: 0 },
        { id: "1-4", prompt: "Which clef is shown?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("D3/w/r", { clef: "bass" }))] }).addClef("bass");
            f.draw();
        }, options: ["Alto clef", "Treble clef", "Bass clef", "Tenor clef"], correctIndex: 2 },
        { id: "1-5", prompt: "The treble clef is also known as the:", render: null, options: ["F clef", "G clef", "C clef", "D clef"], correctIndex: 1 },
        { id: "1-6", prompt: "The bass clef is also known as the:", render: null, options: ["G clef", "C clef", "D clef", "F clef"], correctIndex: 3 },
        { id: "1-7", prompt: "What is a ledger line?", render: null, options: ["A short line extending the staff", "A vertical bar line", "A line connecting two staves", "A line showing tempo"], correctIndex: 0 },
        { id: "1-8", prompt: "The grand staff combines:", render: null, options: ["Two treble clefs", "Treble and bass clefs", "Two bass clefs", "Treble and alto clefs"], correctIndex: 1 },
        { id: "1-9", prompt: "Where does Middle C sit on the grand staff?", render: null, options: ["Top of treble staff", "On a ledger line between the staves", "Bottom of bass staff", "Third line of treble staff"], correctIndex: 1 },
        { id: "1-10", prompt: "Higher position on the staff means:", render: null, options: ["Lower pitch", "Louder sound", "Higher pitch", "Faster tempo"], correctIndex: 2 },
    ],
};

const { Factory } = Vex.Flow;

export default {
    id: 9,
    title: "The Minor Scale",
    subtitle: "The other side of the coin",
    pages: [
        {
            title: "Major vs. Minor",
            content: `<h3>Major vs. Minor</h3>
<p><span class="highlight">Major</span> scales sound bright and happy. <span class="highlight">Minor</span> scales sound darker, sadder, or more dramatic.</p>
<p>The natural minor formula: <span class="highlight">W-H-W-W-H-W-W</span></p>
<p>Here's the amazing thing: C major (C D E F G A B C) and A minor (A B C D E F G A) use the <em>exact same white keys</em> — just starting on different notes!</p>
<div class="staff-example" id="ch9-ex1"></div>
<p>Above: A natural minor scale — all white keys from A to A.</p>`,
            render(container) {
                const el = container.querySelector("#ch9-ex1");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 300 }).addStave({ voices: [s.voice(s.notes("A3/q, B3/q, C4/q, D4/q, E4/q, F4/q, G4/q, A4/q", { clef: "bass" }), { time: "8/4" })] }).addClef("bass");
                    f.draw();
                }
            }
        },
        {
            title: "Relative Major and Minor",
            content: `<h3>Relative Major and Minor</h3>
<p>Every major key has a <span class="highlight">relative minor</span> that shares the exact same key signature.</p>
<p>To find the relative minor, start on the <span class="highlight">6th degree</span> of the major scale (or count down 3 half steps from the major key).</p>
<p><strong>Common pairs:</strong></p>
<p>C major → <span class="highlight">A minor</span><br>
G major → <span class="highlight">E minor</span><br>
F major → <span class="highlight">D minor</span></p>
<div class="staff-example" id="ch9-ex2"></div>
<p>Above: C major scale — A minor uses the same notes, starting on A.</p>`,
            render(container) {
                const el = container.querySelector("#ch9-ex2");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 300 }).addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q, G4/q, A4/q, B4/q, C5/q"), { time: "8/4" })] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "Harmonic and Melodic Minor",
            content: `<h3>Harmonic and Melodic Minor</h3>
<p>The natural minor has two important variations:</p>
<p><span class="highlight">Harmonic minor</span>: raise the 7th degree by a half step. This creates a <em>leading tone</em> that pulls strongly back to the tonic, and gives the scale a distinctive, almost exotic sound.</p>
<p>A harmonic minor: A B C D E F <span class="highlight">G#</span> A</p>
<p><span class="highlight">Melodic minor</span>: raise <em>both</em> the 6th and 7th going up; revert to natural minor going down.</p>
<p>For now, just know these variations exist — you'll mostly encounter natural minor.</p>
<div class="staff-example" id="ch9-ex3"></div>
<p>Above: A harmonic minor — notice the G# creating a larger gap before A.</p>`,
            render(container) {
                const el = container.querySelector("#ch9-ex3");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 300 }).addStave({ voices: [s.voice(s.notes("A3/q, B3/q, C4/q, D4/q, E4/q, F4/q, G#4/q, A4/q", { clef: "bass" }), { time: "8/4" })] }).addClef("bass");
                    f.draw();
                }
            }
        },
        {
            title: "Finding Minor Keys",
            content: `<h3>Finding Minor Keys</h3>
<p>A key signature alone doesn't tell you if a piece is major or minor — you have to listen and look at the music.</p>
<p><strong>Clues that a piece is in a minor key:</strong></p>
<p>The melody starts or ends on the minor tonic. The "home" note feels darker. Look for raised 7th degrees (accidentals not in the key signature).</p>
<p><strong>Common major/minor pairs:</strong></p>
<p>C/Am &bull; G/Em &bull; D/Bm &bull; F/Dm &bull; Bb/Gm &bull; Eb/Cm</p>
<p><span class="mnemonic">Same key signature, different home note.</span></p>`
        },
    ],
    quizPool: [
        { id: "9-1", prompt: "The natural minor scale formula is:", render: null, options: ["W-W-H-W-W-W-H", "W-H-W-W-H-W-W", "H-W-W-H-W-W-W", "W-W-H-W-W-H-W"], correctIndex: 1 },
        { id: "9-2", prompt: "Minor scales generally sound:", render: null, options: ["Bright and happy", "Dark or sad", "Fast and energetic", "Loud and bold"], correctIndex: 1 },
        { id: "9-3", prompt: "What is the relative minor of C major?", render: null, options: ["D minor", "E minor", "A minor", "G minor"], correctIndex: 2 },
        { id: "9-4", prompt: "What is the relative minor of G major?", render: null, options: ["B minor", "D minor", "E minor", "A minor"], correctIndex: 2 },
        { id: "9-5", prompt: "The relative minor starts on which degree of the major scale?", render: null, options: ["3rd", "4th", "5th", "6th"], correctIndex: 3 },
        { id: "9-6", prompt: "A minor and C major share the same:", render: null, options: ["Tempo", "Key signature", "Time signature", "Clef"], correctIndex: 1 },
        { id: "9-7", prompt: "In harmonic minor, which degree is raised?", render: null, options: ["3rd", "5th", "6th", "7th"], correctIndex: 3 },
        { id: "9-8", prompt: "What note is raised in A harmonic minor?", render: null, options: ["F", "E", "G", "D"], correctIndex: 2 },
        { id: "9-9", prompt: "How many half steps down from a major key to its relative minor?", render: null, options: ["1", "2", "3", "4"], correctIndex: 2 },
        { id: "9-10", prompt: "What is the relative major of D minor?", render: null, options: ["C major", "D major", "F major", "G major"], correctIndex: 2 },
    ],
};

const { Factory } = Vex.Flow;

export default {
    id: 6,
    title: "Key Signatures & Accidentals",
    subtitle: "Sharps, flats, and naturals",
    pages: [
        {
            title: "Accidentals: Sharps, Flats, and Naturals",
            content: `<h3>Accidentals: Sharps, Flats, and Naturals</h3>
<p>Not every note is a plain A, B, C, etc. Small symbols called <span class="highlight">accidentals</span> modify a note's pitch by a half step:</p>
<p><span class="highlight">Sharp (#)</span> — raises the note by one half step.</p>
<p><span class="highlight">Flat (b)</span> — lowers the note by one half step.</p>
<p><span class="highlight">Natural</span> — cancels a previous sharp or flat, returning to the unmodified pitch.</p>
<p>On the piano, a half step is the distance from any key to the very next key (including black keys).</p>
<div class="staff-example" id="ch6-ex1"></div>
<p>Above: C, C-sharp, D, D-flat. Notice C# and Db are the same piano key — different names for the same sound.</p>`,
            render(container) {
                const el = container.querySelector("#ch6-ex1");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/q, C#4/q, D4/q, Db4/q"))] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "What Is a Key Signature?",
            content: `<h3>What Is a Key Signature?</h3>
<p>If a piece uses certain sharps or flats throughout, writing them on every note would be tedious. Instead, we place them once at the beginning of each line — this is the <span class="highlight">key signature</span>.</p>
<p>A key signature tells you: "Every time you see this note, play it sharp (or flat) unless a natural sign says otherwise."</p>
<p>For example, <span class="highlight">G Major</span> has one sharp — F#. Instead of marking every F with a sharp, the key signature places one sharp on the F line.</p>
<div class="staff-example" id="ch6-ex2"></div>
<p>Above: G major key signature (one sharp: F#), followed by a simple melody.</p>`,
            render(container) {
                const el = container.querySelector("#ch6-ex2");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("G4/q, A4/q, B4/q, G4/q"))] }).addClef("treble").addKeySignature("G");
                    f.draw();
                }
            }
        },
        {
            title: "The Order of Sharps and Flats",
            content: `<h3>The Order of Sharps and Flats</h3>
<p>Sharps and flats always appear in a fixed order:</p>
<p><span class="highlight">Sharps:</span> F C G D A E B</p>
<p><span class="mnemonic">"Father Charles Goes Down And Ends Battle"</span></p>
<p><span class="highlight">Flats:</span> B E A D G C F (the reverse!)</p>
<p><span class="mnemonic">"Battle Ends And Down Goes Charles' Father"</span></p>
<p>If a key has 2 sharps, they will always be F# and C#. If it has 3 flats, they are always Bb, Eb, and Ab.</p>
<div class="staff-example" id="ch6-ex3"></div>
<p>Above: D major — two sharps (F# and C#).</p>`,
            render(container) {
                const el = container.querySelector("#ch6-ex3");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("D4/h, A4/h"), { time: "4/4" })] }).addClef("treble").addKeySignature("D");
                    f.draw();
                }
            }
        },
        {
            title: "Identifying Key Signatures",
            content: `<h3>Identifying Key Signatures</h3>
<p>Quick tricks to name a major key from its signature:</p>
<p><strong>Sharp keys:</strong> Look at the <span class="highlight">last sharp</span> and go up one half step — that's your key. Example: last sharp is C# → key is D major.</p>
<p><strong>Flat keys:</strong> Look at the <span class="highlight">second-to-last flat</span> — that's your key. Example: flats are Bb, Eb, Ab → second-to-last is Eb → key is Eb major.</p>
<p><strong>Special cases:</strong> C major has no sharps or flats. F major has just one flat (Bb) — the "second-to-last" trick doesn't apply, so just memorize it.</p>
<div class="staff-example" id="ch6-ex4"></div>
<p>Above: Eb major — three flats (Bb, Eb, Ab). The second-to-last flat is Eb, confirming the key.</p>`,
            render(container) {
                const el = container.querySelector("#ch6-ex4");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("Eb4/h, Bb4/h"), { time: "4/4" })] }).addClef("treble").addKeySignature("Eb");
                    f.draw();
                }
            }
        },
    ],
    quizPool: [
        { id: "6-1", prompt: "What does a sharp (#) do to a note?", render: null, options: ["Lowers by half step", "Raises by half step", "Doubles duration", "Cancels a flat"], correctIndex: 1 },
        { id: "6-2", prompt: "What does a flat (b) do to a note?", render: null, options: ["Raises by half step", "Cancels a sharp", "Lowers by half step", "Halves duration"], correctIndex: 2 },
        { id: "6-3", prompt: "What does a natural sign do?", render: null, options: ["Raises by half step", "Lowers by half step", "Cancels a sharp or flat", "Doubles the note"], correctIndex: 2 },
        { id: "6-4", prompt: "What key signature is shown?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble").addKeySignature("G");
            f.draw();
        }, options: ["C Major", "D Major", "G Major", "F Major"], correctIndex: 2 },
        { id: "6-5", prompt: "What key signature is shown?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble").addKeySignature("F");
            f.draw();
        }, options: ["G Major", "C Major", "Bb Major", "F Major"], correctIndex: 3 },
        { id: "6-6", prompt: "The order of sharps begins with:", render: null, options: ["C#", "G#", "F#", "B#"], correctIndex: 2 },
        { id: "6-7", prompt: "The order of flats begins with:", render: null, options: ["Eb", "Ab", "Bb", "Db"], correctIndex: 2 },
        { id: "6-8", prompt: "C Major has how many sharps or flats?", render: null, options: ["1 sharp", "1 flat", "None", "2 sharps"], correctIndex: 2 },
        { id: "6-9", prompt: "For sharp keys, the key name is one half step above:", render: null, options: ["The first sharp", "The last sharp", "Middle C", "The clef"], correctIndex: 1 },
        { id: "6-10", prompt: "What key signature is shown?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("B4/w/r"))] }).addClef("treble").addKeySignature("D");
            f.draw();
        }, options: ["A Major", "G Major", "D Major", "E Major"], correctIndex: 2 },
    ],
};

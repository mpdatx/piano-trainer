const { Factory } = Vex.Flow;

export default {
    id: 8,
    title: "The Major Scale",
    subtitle: "The most important pattern in music",
    pages: [
        {
            title: "What Is a Scale?",
            content: `<h3>What Is a Scale?</h3>
<p>A <span class="highlight">scale</span> is a set of notes arranged in order by pitch. Think of it as the "palette" of notes a piece of music draws from.</p>
<p>The <span class="highlight">major scale</span> is the most common — it sounds bright and happy. You've already heard it: Do-Re-Mi-Fa-Sol-La-Ti-Do.</p>
<div class="staff-example" id="ch8-ex1"></div>
<p>Above: The C major scale — all white keys from C to C.</p>`,
            render(container) {
                const el = container.querySelector("#ch8-ex1");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 300 }).addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q, G4/q, A4/q, B4/q, C5/q"), { time: "8/4" })] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "The Major Scale Formula",
            content: `<h3>The Major Scale Formula</h3>
<p>Every major scale follows the same pattern of whole and half steps:</p>
<p style="text-align:center; font-size:1.2em; margin:12px 0;"><span class="highlight">W - W - H - W - W - W - H</span></p>
<p>In C major this is easy to see — all white keys:</p>
<p style="text-align:center;">C <span style="color:#2196F3">W</span> D <span style="color:#2196F3">W</span> E <span style="color:#e53935">H</span> F <span style="color:#2196F3">W</span> G <span style="color:#2196F3">W</span> A <span style="color:#2196F3">W</span> B <span style="color:#e53935">H</span> C</p>
<p>The half steps always fall between degrees <span class="highlight">3-4</span> and <span class="highlight">7-8</span>.</p>
<div class="staff-example" id="ch8-ex2"></div>
<p>C major scale for reference — notice how it uses no sharps or flats.</p>`,
            render(container) {
                const el = container.querySelector("#ch8-ex2");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 300 }).addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q, G4/q, A4/q, B4/q, C5/q"), { time: "8/4" })] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "Building Major Scales",
            content: `<h3>Building Major Scales</h3>
<p>Start on <em>any</em> note and apply <span class="highlight">W-W-H-W-W-W-H</span> — you'll get a major scale.</p>
<p><strong>G major:</strong> G-A-B-C-D-E-F#-G (one sharp)</p>
<p><strong>F major:</strong> F-G-A-Bb-C-D-E-F (one flat)</p>
<p>This is exactly <em>why</em> key signatures exist — they tell you which sharps or flats a scale needs.</p>
<div class="staff-example" id="ch8-ex3"></div>
<p>Above: G major scale. The key signature shows one sharp (F#).</p>`,
            render(container) {
                const el = container.querySelector("#ch8-ex3");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 300 }).addStave({ voices: [s.voice(s.notes("G4/q, A4/q, B4/q, C5/q, D5/q, E5/q, F#5/q, G5/q"), { time: "8/4" })] }).addClef("treble").addKeySignature("G");
                    f.draw();
                }
            }
        },
        {
            title: "Scale Degrees",
            content: `<h3>Scale Degrees</h3>
<p>Each note in a scale has a number and a name:</p>
<p><span class="highlight">1 = Tonic</span> (home base)<br>
2 = Supertonic<br>
3 = Mediant<br>
<span class="highlight">4 = Subdominant</span><br>
<span class="highlight">5 = Dominant</span> (strongest pull to tonic)<br>
6 = Submediant<br>
7 = Leading Tone (wants to resolve up to tonic)</p>
<p>The three most important: <span class="highlight">1 (Tonic)</span>, <span class="highlight">4 (Subdominant)</span>, and <span class="highlight">5 (Dominant)</span>. These form the backbone of harmony.</p>`
        },
        {
            title: "Why Scales Matter",
            content: `<h3>Why Scales Matter</h3>
<p>Scales are the <span class="highlight">foundation</span> of nearly everything in music:</p>
<p><strong>Melodies</strong> — most melodies use notes from a single scale. Knowing the scale helps you predict what comes next.</p>
<p><strong>Chords</strong> — chords are built from scale notes (you'll learn this in Chapter 10).</p>
<p><strong>Sight reading</strong> — when you know a key, you know which notes to expect, making reading much faster.</p>
<p><strong>Improvisation</strong> — scales give you the "safe" notes to play over a chord progression.</p>`
        },
    ],
    quizPool: [
        { id: "8-1", prompt: "The major scale formula (in whole and half steps) is:", render: null, options: ["W-H-W-W-H-W-W", "W-W-H-W-W-W-H", "H-W-W-H-W-W-W", "W-W-W-H-W-W-H"], correctIndex: 1 },
        { id: "8-2", prompt: "How many notes are in a major scale (including the octave)?", render: null, options: ["6", "7", "8", "12"], correctIndex: 2 },
        { id: "8-3", prompt: "In a major scale, the half steps fall between degrees:", render: null, options: ["1-2 and 5-6", "2-3 and 6-7", "3-4 and 7-8", "4-5 and 1-2"], correctIndex: 2 },
        { id: "8-4", prompt: "C major uses:", render: null, options: ["One sharp", "One flat", "No sharps or flats", "Two sharps"], correctIndex: 2 },
        { id: "8-5", prompt: "What note is the 5th degree of C major?", render: null, options: ["E", "F", "G", "A"], correctIndex: 2 },
        { id: "8-6", prompt: "G major has one sharp. Which note is sharp?", render: null, options: ["C#", "G#", "F#", "D#"], correctIndex: 2 },
        { id: "8-7", prompt: "F major has one flat. Which note is flat?", render: null, options: ["Eb", "Ab", "Db", "Bb"], correctIndex: 3 },
        { id: "8-8", prompt: "The 1st degree of a scale is called the:", render: null, options: ["Dominant", "Mediant", "Leading tone", "Tonic"], correctIndex: 3 },
        { id: "8-9", prompt: "The 5th degree of a scale is called the:", render: null, options: ["Tonic", "Dominant", "Subdominant", "Mediant"], correctIndex: 1 },
        { id: "8-10", prompt: "What major scale is shown?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 340, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 300 }).addStave({ voices: [s.voice(s.notes("D4/q, E4/q, F#4/q, G4/q, A4/q, B4/q, C#5/q, D5/q"), { time: "8/4" })] }).addClef("treble").addKeySignature("D");
            f.draw();
        }, options: ["C Major", "D Major", "G Major", "A Major"], correctIndex: 1 },
    ],
};

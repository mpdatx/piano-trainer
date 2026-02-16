const { Factory } = Vex.Flow;

export default {
    id: 10,
    title: "Chords — Major & Minor Triads",
    subtitle: "Playing notes together",
    pages: [
        {
            title: "What Is a Chord?",
            content: `<h3>What Is a Chord?</h3>
<p>A <span class="highlight">chord</span> is three or more notes played at the same time. The simplest chord is a <span class="highlight">triad</span> — three notes stacked in intervals of a third.</p>
<p>Chords provide <span class="highlight">harmony</span>, the vertical dimension of music that supports the melody.</p>
<div class="staff-example" id="ch10-ex1"></div>
<p>Above: A C major chord (C-E-G) — three notes stacked on the staff.</p>`,
            render(container) {
                const el = container.querySelector("#ch10-ex1");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("(C4 E4 G4)/w"))] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "Building Major Triads",
            content: `<h3>Building Major Triads</h3>
<p>A <span class="highlight">major triad</span> is built: Root + <span class="highlight">4 half steps</span> + <span class="highlight">3 half steps</span>.</p>
<p><strong>C major:</strong> C-E-G &nbsp; <strong>G major:</strong> G-B-D &nbsp; <strong>F major:</strong> F-A-C</p>
<p>Major triads sound bright and stable — they're the "happy" chords.</p>
<div class="staff-example" id="ch10-ex2"></div>
<p>Above: C major (C-E-G) and G major (G-B-D) triads.</p>
<div class="staff-example" id="ch10-ex3"></div>
<p>Above: F major triad (F-A-C).</p>`,
            render(container) {
                const el1 = container.querySelector("#ch10-ex2");
                if (el1) {
                    const f = new Factory({ renderer: { elementId: el1.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("(C4 E4 G4)/h, (G3 B3 D4)/h"))] }).addClef("treble");
                    f.draw();
                }
                const el2 = container.querySelector("#ch10-ex3");
                if (el2) {
                    const f = new Factory({ renderer: { elementId: el2.id, width: 200, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("(F3 A3 C4)/w"))] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "Building Minor Triads",
            content: `<h3>Building Minor Triads</h3>
<p>A <span class="highlight">minor triad</span> reverses the intervals: Root + <span class="highlight">3 half steps</span> + <span class="highlight">4 half steps</span>.</p>
<p>Compare: <strong>C major</strong> = C-E-G vs <strong>C minor</strong> = C-Eb-G</p>
<p>The only difference is the <span class="highlight">3rd</span> — it's lowered by one half step. This small change transforms the mood from bright to dark.</p>
<div class="staff-example" id="ch10-ex4"></div>
<p>Above: C major (C-E-G) then C minor (C-Eb-G) — hear how the feel changes with just one note.</p>`,
            render(container) {
                const el = container.querySelector("#ch10-ex4");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("(C4 E4 G4)/h, (C4 Eb4 G4)/h"))] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "Common Triads to Know",
            content: `<h3>Common Triads to Know</h3>
<p><strong>Major triads:</strong></p>
<p>C (C-E-G) &bull; D (D-F#-A) &bull; E (E-G#-B) &bull; F (F-A-C) &bull; G (G-B-D) &bull; A (A-C#-E) &bull; Bb (Bb-D-F)</p>
<p><strong>Minor triads:</strong></p>
<p>Am (A-C-E) &bull; Dm (D-F-A) &bull; Em (E-G-B) &bull; Gm (G-Bb-D)</p>
<p><span class="mnemonic">Minor chords are labeled with a lowercase "m" after the root: Am, Dm, Em.</span></p>
<p>Major chords use just the letter name. "C" means C major; "Cm" means C minor.</p>`
        },
        {
            title: "Inversions",
            content: `<h3>Inversions</h3>
<p>A chord's notes can be rearranged into different <span class="highlight">inversions</span>:</p>
<p><strong>Root position:</strong> C-E-G (root on bottom)<br>
<strong>1st inversion:</strong> E-G-C (3rd on bottom)<br>
<strong>2nd inversion:</strong> G-C-E (5th on bottom)</p>
<p>Same chord, different voicing. Inversions create smoother transitions between chords.</p>
<div class="staff-example" id="ch10-ex5"></div>
<p>Above: C major in root position and 1st inversion.</p>
<div class="staff-example" id="ch10-ex6"></div>
<p>Above: C major in 2nd inversion (G on bottom).</p>`,
            render(container) {
                const el1 = container.querySelector("#ch10-ex5");
                if (el1) {
                    const f = new Factory({ renderer: { elementId: el1.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("(C4 E4 G4)/h, (E4 G4 C5)/h"))] }).addClef("treble");
                    f.draw();
                }
                const el2 = container.querySelector("#ch10-ex6");
                if (el2) {
                    const f = new Factory({ renderer: { elementId: el2.id, width: 200, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("(G3 C4 E4)/w"))] }).addClef("treble");
                    f.draw();
                }
            }
        },
    ],
    quizPool: [
        { id: "10-1", prompt: "A triad is made up of how many notes?", render: null, options: ["2", "3", "4", "5"], correctIndex: 1 },
        { id: "10-2", prompt: "A major triad is built with:", render: null, options: ["Root + 3 half steps + 4 half steps", "Root + 4 half steps + 3 half steps", "Root + 2 half steps + 2 half steps", "Root + 5 half steps + 2 half steps"], correctIndex: 1 },
        { id: "10-3", prompt: "What notes make up a C major triad?", render: null, options: ["C-D-E", "C-Eb-G", "C-E-G", "C-F-A"], correctIndex: 2 },
        { id: "10-4", prompt: "What notes make up a G major triad?", render: null, options: ["G-A-B", "G-Bb-D", "G-B-D", "G-C-E"], correctIndex: 2 },
        { id: "10-5", prompt: "A minor triad is built with:", render: null, options: ["Root + 4 half steps + 3 half steps", "Root + 3 half steps + 3 half steps", "Root + 3 half steps + 4 half steps", "Root + 4 half steps + 4 half steps"], correctIndex: 2 },
        { id: "10-6", prompt: "What notes make up an A minor triad?", render: null, options: ["A-C-E", "A-C#-E", "A-D-F", "A-Cb-E"], correctIndex: 0 },
        { id: "10-7", prompt: "The difference between C major and C minor is:", render: null, options: ["The root", "The 3rd", "The 5th", "The octave"], correctIndex: 1 },
        { id: "10-8", prompt: "What chord is this?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("(C4 E4 G4)/w"))] }).addClef("treble");
            f.draw();
        }, options: ["C minor", "F major", "C major", "G major"], correctIndex: 2 },
        { id: "10-9", prompt: "In first inversion, which note is on the bottom?", render: null, options: ["The root", "The 3rd", "The 5th", "The 7th"], correctIndex: 1 },
        { id: "10-10", prompt: "What chord is this?", render(el) {
            const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 120 } });
            const s = f.EasyScore();
            f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("(A3 C4 E4)/w"))] }).addClef("treble");
            f.draw();
        }, options: ["C major", "A major", "E minor", "A minor"], correctIndex: 3 },
    ],
};

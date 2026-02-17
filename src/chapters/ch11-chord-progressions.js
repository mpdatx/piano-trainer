const { Factory } = Vex.Flow;

export default {
    id: 11,
    title: "Chord Progressions",
    subtitle: "How chords work together",
    pages: [
        {
            title: "Chords in a Key",
            content: `<h3>Chords in a Key</h3>
<p>When you build a triad on each note of a major scale, you get seven chords — some major, some minor, one diminished:</p>
<p style="text-align:center; margin:12px 0;">
<strong>I</strong> &bull; <strong>ii</strong> &bull; <strong>iii</strong> &bull; <strong>IV</strong> &bull; <strong>V</strong> &bull; <strong>vi</strong> &bull; <strong>vii&deg;</strong>
</p>
<p>In C major: <span class="highlight">C(I)</span> &bull; Dm(ii) &bull; Em(iii) &bull; <span class="highlight">F(IV)</span> &bull; <span class="highlight">G(V)</span> &bull; Am(vi) &bull; Bdim(vii&deg;)</p>
<p><span class="mnemonic">Uppercase = major, lowercase = minor. This pattern is the same in every major key.</span></p>`
        },
        {
            title: "The I, IV, and V Chords",
            content: `<h3>The I, IV, and V Chords</h3>
<p>The three most important chords in any key:</p>
<p><span class="highlight">I (Tonic)</span> — home, stability<br>
<span class="highlight">IV (Subdominant)</span> — departure, movement<br>
<span class="highlight">V (Dominant)</span> — tension, wants to resolve back to I</p>
<p>In C major: C, F, G. In G major: G, C, D.</p>
<p>Thousands of songs use <em>only</em> these three chords!</p>
<div class="staff-example" id="ch11-ex1"></div>
<p>Above: I and IV chords in C major (C and F).</p>
<div class="staff-example" id="ch11-ex2"></div>
<p>Above: V chord in C major (G).</p>`,
            render(container) {
                const el1 = container.querySelector("#ch11-ex1");
                if (el1) {
                    const f = new Factory({ renderer: { elementId: el1.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("(C4 E4 G4)/h, (F3 A3 C4)/h"))] }).addClef("treble");
                    f.draw();
                }
                const el2 = container.querySelector("#ch11-ex2");
                if (el2) {
                    const f = new Factory({ renderer: { elementId: el2.id, width: 200, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(s.notes("(G3 B3 D4)/w"))] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "The I-V-vi-IV Progression",
            content: `<h3>The I-V-vi-IV Progression</h3>
<p>The most common chord progression in pop music:</p>
<p style="text-align:center; font-size:1.2em; margin:12px 0;"><span class="highlight">I → V → vi → IV</span></p>
<p>In C major: <strong>C → G → Am → F</strong></p>
<p>You've heard this in "Let It Be," "No Woman No Cry," "Someone Like You," and hundreds more.</p>
<div class="staff-example" id="ch11-ex3"></div>
<p>Above: The I-V-vi-IV progression in C major.</p>`,
            render(container) {
                const el = container.querySelector("#ch11-ex3");
                if (el) {
                    const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                    const s = f.EasyScore();
                    f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("(C4 E4 G4)/q, (G3 B3 D4)/q, (A3 C4 E4)/q, (F3 A3 C4)/q"))] }).addClef("treble");
                    f.draw();
                }
            }
        },
        {
            title: "Other Common Progressions",
            content: `<h3>Other Common Progressions</h3>
<p><span class="highlight">I-IV-V-I</span> — Classic resolution. The foundation of blues, rock, and folk. Ends with a strong return home.</p>
<p><span class="highlight">I-vi-IV-V</span> — The "50s progression." Doo-wop, early rock and roll.</p>
<p><span class="highlight">ii-V-I</span> — The jazz turnaround. The most important progression in jazz harmony.</p>
<p><span class="highlight">12-bar blues</span> — A 12-measure pattern using I, IV, and V that defines blues, early rock, and jazz.</p>
<p>Once you can hear these patterns, you'll start recognizing them everywhere.</p>`
        },
        {
            title: "Reading Chord Symbols",
            content: `<h3>Reading Chord Symbols</h3>
<p>On lead sheets and charts, chords are written above the melody line using shorthand:</p>
<p><span class="highlight">C</span> = C major &nbsp; <span class="highlight">Cm</span> = C minor &nbsp; <span class="highlight">C7</span> = C dominant 7th</p>
<p><span class="highlight">G/B</span> = G major with B in the bass (a "slash chord")</p>
<p>Now you know how to <em>build</em> each of these from the formulas you've learned. When you see "Dm" on a chart, you know it means D-F-A.</p>
<p><span class="mnemonic">Letter alone = major. Letter + "m" = minor. That's the most important distinction.</span></p>`
        },
    ],
    quizPool: [
        { id: "11-1", prompt: "In C major, what is the IV chord?", render: null, options: ["G major", "A minor", "F major", "D minor"], correctIndex: 2 },
        { id: "11-2", prompt: "In C major, what is the V chord?", render: null, options: ["F major", "G major", "A minor", "E minor"], correctIndex: 1 },
        { id: "11-3", prompt: "In G major, what is the I chord?", render: null, options: ["C major", "D major", "G major", "A major"], correctIndex: 2 },
        { id: "11-4", prompt: "Roman numeral 'vi' indicates a:", render: null, options: ["Major chord", "Minor chord", "Diminished chord", "Augmented chord"], correctIndex: 1 },
        { id: "11-5", prompt: "The most common pop progression is:", render: null, options: ["I-IV-V-I", "ii-V-I", "I-V-vi-IV", "I-vi-ii-V"], correctIndex: 2 },
        { id: "11-6", prompt: "In C major, the I-V-vi-IV progression is:", render: null, options: ["C-F-Am-G", "C-G-Am-F", "C-G-Em-F", "C-F-G-Am"], correctIndex: 1 },
        { id: "11-7", prompt: "The V chord naturally wants to resolve to the:", render: null, options: ["IV chord", "vi chord", "I chord", "ii chord"], correctIndex: 2 },
        { id: "11-8", prompt: "In C major, which chord is built on the 2nd degree?", render: null, options: ["C major", "D minor", "E minor", "F major"], correctIndex: 1 },
        { id: "11-9", prompt: "What does 'Cm' mean as a chord symbol?", render: null, options: ["C major", "C minor", "C diminished", "C with a melody"], correctIndex: 1 },
        { id: "11-10", prompt: "In G major, the I-IV-V chords are:", render: null, options: ["G-C-D", "G-B-D", "G-D-A", "G-F-C"], correctIndex: 0 },
    ],
};

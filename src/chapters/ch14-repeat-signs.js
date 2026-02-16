const { Factory } = Vex.Flow;

export default {
    id: 14,
    title: "Repeat Signs & Navigation",
    subtitle: "Finding your way through the music",
    pages: [
        {
            title: "Repeat Barlines",
            content: `<h3>Repeat Barlines</h3>
<p>The most common navigation symbol in music: <span class="highlight">repeat barlines</span> tell you to play a section again.</p>
<p>A <span class="highlight">start repeat</span> has two dots on the right side of a thick barline. An <span class="highlight">end repeat</span> has two dots on the left side.</p>
<p>When you reach an end repeat, go back to the matching start repeat. If there's no start repeat, go back to the very beginning.</p>
<div class="staff-example" id="ch14-ex1"></div>
<p>Above: a passage enclosed in repeat barlines — play it, then play it again.</p>`,
            render(container) {
                const el = container.querySelector("#ch14-ex1");
                if (!el) return;
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 120 } });
                const s = f.EasyScore();
                const stave = f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q"))] }).addClef("treble");
                stave.setBegBarType(VexFlow.Barline.type.REPEAT_BEGIN);
                stave.setEndBarType(VexFlow.Barline.type.REPEAT_END);
                f.draw();
            }
        },
        {
            title: "First and Second Endings",
            content: `<h3>First and Second Endings</h3>
<p>Sometimes you repeat a section but <span class="highlight">change the ending</span> the second time through.</p>
<p><span class="highlight">1st ending</span> (bracket labeled "1."): play this ending the first time.</p>
<p><span class="highlight">2nd ending</span> (bracket labeled "2."): on the repeat, skip the 1st ending and play this instead.</p>
<p>These are called <span class="highlight">volta brackets</span>.</p>
<p>Flow: Play measures → 1st ending → repeat back → play measures → skip to 2nd ending → continue.</p>
<div class="staff-example" id="ch14-ex2"></div>`,
            render(container) {
                const el = container.querySelector("#ch14-ex2");
                if (!el) return;
                const f = new Factory({ renderer: { elementId: el.id, width: 340, height: 140 } });
                const s = f.EasyScore();
                const stave = f.System({ x: 0, y: 0, width: 300 }).addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q"))] }).addClef("treble");
                stave.setEndBarType(VexFlow.Barline.type.REPEAT_END);
                f.draw();
                // Draw volta bracket text
                const ctx = f.getContext();
                ctx.setFont("Times", 11, "bold");
                ctx.beginPath();
                ctx.moveTo(200, 12); ctx.lineTo(200, 3); ctx.lineTo(290, 3);
                ctx.stroke();
                ctx.fillText("1.", 205, 14);
            }
        },
        {
            title: "D.C. and D.S.",
            content: `<h3>D.C. and D.S.</h3>
<p><span class="highlight">D.C.</span> (Da Capo) — go back to the <b>very beginning</b></p>
<p><span class="highlight">D.S.</span> (Dal Segno) — go back to the <b>segno sign</b> <span style="font-size:1.4em;">\u{1D10B}</span></p>
<p>Both are usually followed by "al Fine" or "al Coda":</p>
<p><span class="highlight">D.C. al Fine</span> — go to the beginning, play until you see "Fine" (the end)</p>
<p><span class="highlight">D.S. al Coda</span> — go to the segno <span style="font-size:1.2em;">\u{1D10B}</span>, play until the coda sign <span style="font-size:1.2em;">\u{1D10C}</span>, then jump to the Coda section</p>
<p><span class="mnemonic">Think of D.C. as "go home" and D.S. as "go to the bookmark."</span></p>`,
            render: null
        },
        {
            title: "The Coda and Fine",
            content: `<h3>The Coda and Fine</h3>
<p><span class="highlight">Coda</span> <span style="font-size:1.4em;">\u{1D10C}</span> — a special ending section, usually at the bottom of the page, separated from the main music.</p>
<p><span class="highlight">Fine</span> (pronounced "FEE-neh") — marks <b>the end</b>, especially when the piece doesn't end at the last measure on the page.</p>
<p>A typical flow with these markings:</p>
<ol>
<li>Play through the piece</li>
<li>See "D.S. al Coda"</li>
<li>Jump back to the segno sign <span style="font-size:1.2em;">\u{1D10B}</span></li>
<li>Play until you see the coda sign <span style="font-size:1.2em;">\u{1D10C}</span></li>
<li>Jump to the Coda section</li>
<li>Play the Coda to the end</li>
</ol>
<p>This saves page space by avoiding rewriting repeated sections.</p>`,
            render: null
        },
        {
            title: "Putting It All Together",
            content: `<h3>Putting It All Together</h3>
<p>Here's how to read through a piece with navigation markings — a "roadmap":</p>
<p><b>Example piece:</b> Measures 1–8 with repeat signs, then a D.S. al Coda.</p>
<ol>
<li>Play measures 1–8</li>
<li>Hit the end repeat → go back and play 1–8 again</li>
<li>Continue to "D.S. al Coda" → jump back to <span style="font-size:1.2em;">\u{1D10B}</span></li>
<li>Play until <span style="font-size:1.2em;">\u{1D10C}</span> → jump to the Coda</li>
<li>Play the Coda section to the end</li>
</ol>
<p><span class="mnemonic">Practice tip: Before playing a new piece, trace the roadmap with your finger first so you know where you're going. No surprises!</span></p>
<p>Priority order when you see multiple markings: repeat signs first, then D.C./D.S., then check for endings and codas.</p>`,
            render: null
        }
    ],
    quizPool: [
        { id: "14-1", prompt: "What do repeat barlines tell you to do?", render: null, options: ["Play louder", "Play the section again", "Skip ahead", "Slow down"], correctIndex: 1 },
        { id: "14-2", prompt: "When you see a 2nd ending bracket, you should:", render: null, options: ["Play it both times", "Play it the first time only", "Skip the 1st ending and play this on the repeat", "Go back to the beginning"], correctIndex: 2 },
        { id: "14-3", prompt: "What does D.C. stand for?", render: null, options: ["Da Coda", "Dal Capo", "Da Capo", "Dal Coda"], correctIndex: 2 },
        { id: "14-4", prompt: "What does D.C. al Fine mean?", render: null, options: ["Go to the coda", "Go to the beginning and play until Fine", "Play the ending", "Repeat the last measure"], correctIndex: 1 },
        { id: "14-5", prompt: "What does D.S. mean?", render: null, options: ["Go to the beginning", "Go to the coda", "Go back to the segno sign", "Go to the fine"], correctIndex: 2 },
        { id: "14-6", prompt: "The segno sign (\u{1D10B}) is used with:", render: null, options: ["D.C.", "D.S.", "Fine", "Repeat barlines"], correctIndex: 1 },
        { id: "14-7", prompt: "What is a Coda?", render: null, options: ["A repeat sign", "The beginning of a piece", "A special ending section", "A tempo marking"], correctIndex: 2 },
        { id: "14-8", prompt: "What does Fine mean?", render: null, options: ["Fast", "The end", "Repeat", "The beginning"], correctIndex: 1 },
        { id: "14-9", prompt: "In a passage with 1st and 2nd endings, how many times do you play the main section?", render: null, options: ["1", "2", "3", "4"], correctIndex: 1 },
        { id: "14-10", prompt: "D.S. al Coda means:", render: null, options: ["Go to the beginning, play to coda sign, jump to coda", "Go to the segno, play to coda sign, jump to coda", "Go to the coda and play to the end", "Repeat from the coda sign"], correctIndex: 1 }
    ]
};

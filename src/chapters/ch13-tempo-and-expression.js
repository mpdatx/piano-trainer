const { Factory } = Vex.Flow;

export default {
    id: 13,
    title: "Tempo Markings",
    subtitle: "How fast or slow",
    pages: [
        {
            title: "What Is Tempo?",
            content: `<h3>What Is Tempo?</h3>
<p><span class="highlight">Tempo</span> is the speed of the music — how fast the beats go by.</p>
<p>Tempo is measured in <span class="highlight">BPM</span> (beats per minute). At 60 BPM, there's one beat per second. At 120 BPM, two beats per second.</p>
<p>Tempo markings are written <span class="highlight">above the staff</span> at the beginning of a piece, or wherever the tempo changes.</p>
<p>Composers indicate tempo two ways: Italian terms (like <em>Allegro</em>) or exact BPM (like ♩ = 120), or both.</p>
<div class="staff-example" id="ch13-ex1"></div>`,
            render(container) {
                const el = container.querySelector("#ch13-ex1");
                if (!el) return;
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 140 } });
                const s = f.EasyScore();
                f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [s.voice(s.notes("C4/q, D4/q, E4/q, F4/q"))] }).addClef("treble");
                f.draw();
                const ctx = f.getContext();
                ctx.setFont("Times", 13, "bold italic");
                ctx.fillText("Allegro  ♩ = 120", 50, 15);
            }
        },
        {
            title: "Common Tempo Terms",
            content: `<h3>Common Tempo Terms</h3>
<p>From slowest to fastest:</p>
<table style="width:100%; text-align:left; border-collapse:collapse; margin:0.5em 0;">
<tr><td style="padding:3px 8px;"><b>Grave</b></td><td>~40 BPM — very slow, solemn</td></tr>
<tr><td style="padding:3px 8px;"><b>Largo</b></td><td>~50 BPM — slow, broad</td></tr>
<tr><td style="padding:3px 8px;"><b>Adagio</b></td><td>~70 BPM — slow, at ease</td></tr>
<tr><td style="padding:3px 8px;"><b>Andante</b></td><td>~80 BPM — walking pace</td></tr>
<tr><td style="padding:3px 8px;"><b>Moderato</b></td><td>~100 BPM — moderate speed</td></tr>
<tr><td style="padding:3px 8px;"><b>Allegro</b></td><td>~130 BPM — fast, lively</td></tr>
<tr><td style="padding:3px 8px;"><b>Vivace</b></td><td>~160 BPM — very fast, vivid</td></tr>
<tr><td style="padding:3px 8px;"><b>Presto</b></td><td>~180 BPM — extremely fast</td></tr>
</table>
<p><span class="mnemonic">You don't need to memorize exact BPMs — just know the relative order from slow to fast.</span></p>`,
            render: null
        },
        {
            title: "Changing Tempo",
            content: `<h3>Changing Tempo</h3>
<p>Music doesn't always stay at one speed. Composers indicate gradual changes:</p>
<p><span class="highlight">rit.</span> (ritardando) — gradually <b>slow down</b></p>
<p><span class="highlight">accel.</span> (accelerando) — gradually <b>speed up</b></p>
<p><span class="highlight">a tempo</span> — return to the <b>original tempo</b> after a rit. or accel.</p>
<p><span class="highlight">rubato</span> — flexible tempo with slight push and pull (common in Romantic piano music like Chopin)</p>
<p>These markings appear above or below the staff where the change begins.</p>`,
            render: null
        },
        {
            title: "Tempo in Practice",
            content: `<h3>Tempo in Practice</h3>
<p>When you see a tempo marking, set your metronome to that BPM before playing.</p>
<p><span class="mnemonic">Pro tip: Always start slower than the written tempo and work your way up. Speed comes from accuracy, not the other way around.</span></p>
<p>Italian terms give the <em>character</em> and mood. BPM gives the exact speed. Many pieces use both: <b>"Allegro (♩ = 132)"</b> — the word sets the mood, the number sets the speed.</p>
<p>The existing practice modes in this app can be played at different speeds to build your tempo control.</p>`,
            render: null
        }
    ],
    quizPool: [
        { id: "13-1", prompt: "What does Allegro mean?", render: null, options: ["Slow", "Walking pace", "Fast and lively", "Extremely fast"], correctIndex: 2 },
        { id: "13-2", prompt: "What does Adagio mean?", render: null, options: ["Fast", "Moderate", "Slow, at ease", "Walking pace"], correctIndex: 2 },
        { id: "13-3", prompt: "What does Presto mean?", render: null, options: ["Slow", "Moderate", "Fast", "Extremely fast"], correctIndex: 3 },
        { id: "13-4", prompt: "What does Andante mean?", render: null, options: ["Very slow", "Walking pace", "Fast", "Very fast"], correctIndex: 1 },
        { id: "13-5", prompt: "What does rit. mean?", render: null, options: ["Speed up", "Slow down gradually", "Return to tempo", "Play freely"], correctIndex: 1 },
        { id: "13-6", prompt: "What does accel. mean?", render: null, options: ["Slow down", "Speed up gradually", "Hold the note", "Return to tempo"], correctIndex: 1 },
        { id: "13-7", prompt: "What does a tempo mean?", render: null, options: ["Play faster", "Play slower", "Return to the original tempo", "End the piece"], correctIndex: 2 },
        { id: "13-8", prompt: "Order from slowest to fastest: Allegro, Largo, Presto, Andante", render: null, options: ["Largo, Andante, Allegro, Presto", "Andante, Largo, Allegro, Presto", "Largo, Allegro, Andante, Presto", "Presto, Allegro, Andante, Largo"], correctIndex: 0 },
        { id: "13-9", prompt: "BPM stands for:", render: null, options: ["Bars per measure", "Beats per minute", "Bass per measure", "Beats per melody"], correctIndex: 1 },
        { id: "13-10", prompt: "What does Moderato mean?", render: null, options: ["Very slow", "Moderate speed", "Fast", "Extremely fast"], correctIndex: 1 }
    ]
};

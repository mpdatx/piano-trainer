const { Factory } = Vex.Flow;

export default {
    id: 12,
    title: "Dynamics & Expression",
    subtitle: "How loud and how soft",
    pages: [
        {
            title: "Volume in Music",
            content: `<h3>Volume in Music</h3>
<p>Music isn't all the same volume — composers indicate how loud or soft to play using <span class="highlight">dynamic markings</span>.</p>
<p>These markings are Italian abbreviations written <span class="highlight">below the staff</span>. They range from very soft to very loud.</p>
<p>The basic range from softest to loudest:</p>
<p style="text-align:center; font-size:1.3em; font-style:italic; letter-spacing:0.3em;"><span class="highlight">pp &nbsp; p &nbsp; mp &nbsp; mf &nbsp; f &nbsp; ff</span></p>
<div class="staff-example" id="ch12-ex1"></div>
<p>Above: a staff with a <span class="highlight">p</span> (piano / soft) marking below.</p>`,
            render(container) {
                const el = container.querySelector("#ch12-ex1");
                if (!el) return;
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 140 } });
                const s = f.EasyScore();
                const voice = s.voice(s.notes("C4/q, E4/q, G4/q, C5/q"));
                f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [voice] }).addClef("treble");
                f.draw();
                // Add "p" text below the staff manually
                const ctx = f.getContext();
                ctx.setFont("Times", 16, "bold italic");
                ctx.fillText("p", 60, 130);
            }
        },
        {
            title: "The Dynamic Markings",
            content: `<h3>The Dynamic Markings</h3>
<p>Here are the six standard dynamic levels, from softest to loudest:</p>
<table style="width:100%; text-align:left; border-collapse:collapse; margin:0.5em 0;">
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>pp</b></td><td>pianissimo — <span class="highlight">very soft</span></td></tr>
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>p</b></td><td>piano — <span class="highlight">soft</span></td></tr>
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>mp</b></td><td>mezzo piano — <span class="highlight">moderately soft</span></td></tr>
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>mf</b></td><td>mezzo forte — <span class="highlight">moderately loud</span></td></tr>
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>f</b></td><td>forte — <span class="highlight">loud</span></td></tr>
<tr><td style="padding:4px 8px; font-style:italic; font-size:1.2em;"><b>ff</b></td><td>fortissimo — <span class="highlight">very loud</span></td></tr>
</table>
<p><span class="mnemonic">Fun fact: The instrument "piano" is short for "pianoforte" — meaning "soft-loud" — because it was the first keyboard that could play both!</span></p>`,
            render: null
        },
        {
            title: "Gradual Changes — Crescendo & Decrescendo",
            content: `<h3>Gradual Changes</h3>
<p>Music often changes volume gradually rather than jumping from one level to another.</p>
<p><span class="highlight">Crescendo</span> (cresc. or hairpin opening to the right): get <b>gradually louder</b></p>
<svg width="120" height="30" style="display:block; margin:0.3em auto;"><line x1="5" y1="15" x2="115" y2="5" stroke="currentColor" stroke-width="2"/><line x1="5" y1="15" x2="115" y2="25" stroke="currentColor" stroke-width="2"/></svg>
<p><span class="highlight">Decrescendo</span> (decresc. or dim., hairpin opening to the left): get <b>gradually softer</b></p>
<svg width="120" height="30" style="display:block; margin:0.3em auto;"><line x1="5" y1="5" x2="115" y2="15" stroke="currentColor" stroke-width="2"/><line x1="5" y1="25" x2="115" y2="15" stroke="currentColor" stroke-width="2"/></svg>
<p>These hairpin symbols appear below the staff, spanning the notes where the change happens.</p>
<div class="staff-example" id="ch12-ex2"></div>`,
            render(container) {
                const el = container.querySelector("#ch12-ex2");
                if (!el) return;
                const f = new Factory({ renderer: { elementId: el.id, width: 300, height: 140 } });
                const s = f.EasyScore();
                const voice = s.voice(s.notes("C4/q, D4/q, E4/q, F4/q"));
                f.System({ x: 0, y: 0, width: 260 }).addStave({ voices: [voice] }).addClef("treble");
                f.draw();
                // Draw crescendo hairpin below staff
                const ctx = f.getContext();
                ctx.beginPath();
                ctx.moveTo(55, 120); ctx.lineTo(230, 110);
                ctx.moveTo(55, 120); ctx.lineTo(230, 130);
                ctx.stroke();
            }
        },
        {
            title: "Other Expression Marks",
            content: `<h3>Other Expression Marks</h3>
<p>Beyond dynamics, composers use other symbols to shape how individual notes are played:</p>
<p><span class="highlight">sfz</span> (sforzando) — a sudden strong accent on one note</p>
<p><span class="highlight">fp</span> (fortepiano) — loud, then immediately soft</p>
<p><span class="highlight">Accent (&gt;)</span> — emphasize this particular note</p>
<p><span class="highlight">Fermata (\u{1D110})</span> — hold this note longer than its written value; the performer decides how long</p>
<p>These marks add character and emotion to music — they're the difference between playing <em>notes</em> and playing <em>music</em>.</p>
<div class="staff-example" id="ch12-ex3"></div>
<p>Above: a note with a fermata — hold it as long as you feel is right.</p>`,
            render(container) {
                const el = container.querySelector("#ch12-ex3");
                if (!el) return;
                const f = new Factory({ renderer: { elementId: el.id, width: 200, height: 140 } });
                const s = f.EasyScore();
                const notes = s.notes("C4/w");
                notes[0].addModifier(new VexFlow.Articulation("a@a").setPosition(VexFlow.Modifier.Position.ABOVE));
                f.System({ x: 0, y: 0, width: 160 }).addStave({ voices: [s.voice(notes)] }).addClef("treble");
                f.draw();
            }
        }
    ],
    quizPool: [
        { id: "12-1", prompt: "What does f mean?", render: null, options: ["Soft", "Moderately loud", "Loud", "Very loud"], correctIndex: 2 },
        { id: "12-2", prompt: "What does p mean?", render: null, options: ["Soft", "Loud", "Moderately soft", "Very soft"], correctIndex: 0 },
        { id: "12-3", prompt: "What does pp mean?", render: null, options: ["Moderately soft", "Very soft", "Soft", "Silent"], correctIndex: 1 },
        { id: "12-4", prompt: "What does ff mean?", render: null, options: ["Moderately loud", "Loud", "Very loud", "As loud as possible"], correctIndex: 2 },
        { id: "12-5", prompt: "What does mp mean?", render: null, options: ["Very soft", "Soft", "Moderately soft", "Moderately loud"], correctIndex: 2 },
        { id: "12-6", prompt: "What does mf mean?", render: null, options: ["Moderately soft", "Moderately loud", "Loud", "Very loud"], correctIndex: 1 },
        { id: "12-7", prompt: "This symbol means:", render(el) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "120"); svg.setAttribute("height", "30");
            svg.innerHTML = `<line x1="5" y1="15" x2="115" y2="5" stroke="currentColor" stroke-width="2"/><line x1="5" y1="15" x2="115" y2="25" stroke="currentColor" stroke-width="2"/>`;
            el.appendChild(svg);
        }, options: ["Get softer", "Get louder", "Stay the same", "Accent"], correctIndex: 1 },
        { id: "12-8", prompt: "This symbol means:", render(el) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "120"); svg.setAttribute("height", "30");
            svg.innerHTML = `<line x1="5" y1="5" x2="115" y2="15" stroke="currentColor" stroke-width="2"/><line x1="5" y1="25" x2="115" y2="15" stroke="currentColor" stroke-width="2"/>`;
            el.appendChild(svg);
        }, options: ["Get louder", "Get softer", "Pause", "Repeat"], correctIndex: 1 },
        { id: "12-9", prompt: "Order from softest to loudest: pp, f, mp, ff", render: null, options: ["pp, mp, f, ff", "mp, pp, f, ff", "pp, f, mp, ff", "f, mp, pp, ff"], correctIndex: 0 },
        { id: "12-10", prompt: "What does sfz mean?", render: null, options: ["Very soft", "Gradually louder", "A sudden strong accent", "Slowly"], correctIndex: 2 }
    ]
};

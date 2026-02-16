# Tier 2 Chapters (12-14) — Design

## Overview

3 new chapters covering "how to read the rest of the page" — the symbols and markings beyond notes and key/time signatures. These follow the same architecture as chapters 1-11: lesson pages with VexFlow/visual examples, then a multiple-choice quiz with SM-2 spaced repetition.

Visual rendering uses VexFlow where it adds value (dynamics on a staff, repeat barlines, volta brackets) and simple inline SVG or styled text for isolated symbol identification (hairpin shapes, Italian terms).

> **Tier 3** (Intervals in Depth, Circle of Fifths, Seventh Chords) to be designed later.

## VexFlow Notes

- Dynamics use `TextDynamics` class for p, f, mf, ff, sfz, etc.
- Crescendo/decrescendo hairpins use `StaveHairpin`
- Repeat barlines: `Barline.type.REPEAT_BEGIN`, `Barline.type.REPEAT_END`
- Volta brackets (1st/2nd endings): `VoltaBracket`
- Fermata and accent are `Articulation` modifiers on notes
- For quiz questions showing isolated symbols, use inline SVG or styled text rather than full VexFlow setup

---

## Chapter 12: Dynamics & Expression

**Subtitle:** "How loud and how soft"

### Lesson Pages (4)

**Page 1: "Volume in Music"**
- Music isn't all the same volume — composers indicate how loud or soft to play
- Dynamic markings are Italian abbreviations written below the staff
- The basic range from softest to loudest: pp → p → mp → mf → f → ff
- VexFlow: A staff with a few notes and a "p" dynamic marking below

**Page 2: "The Dynamic Markings"**
- **pp** (pianissimo) = very soft
- **p** (piano) = soft
- **mp** (mezzo piano) = moderately soft
- **mf** (mezzo forte) = moderately loud
- **f** (forte) = loud
- **ff** (fortissimo) = very loud
- Notice: "piano" means soft (yes, the instrument is named after a dynamic!)
- Styled text showing each marking with its meaning

**Page 3: "Gradual Changes — Crescendo & Decrescendo"**
- Music often changes volume gradually rather than jumping
- Crescendo (cresc. or hairpin opening right): get gradually louder
- Decrescendo/Diminuendo (decresc./dim. or hairpin opening left): get gradually softer
- Inline SVG: Show crescendo and decrescendo hairpin symbols
- VexFlow: Staff with notes showing a crescendo hairpin below

**Page 4: "Other Expression Marks"**
- **sfz** (sforzando) = a sudden strong accent
- **fp** (fortepiano) = loud, then immediately soft
- **accent (>)** = emphasize this note
- **fermata** = hold this note longer than its written value
- These add character and emotion to music
- VexFlow: Staff with a note showing a fermata and accent

### Quiz Pool (10 questions)

1. "What does **f** mean?" → Soft / Moderately loud / Loud / Very loud [2]
2. "What does **p** mean?" → Soft / Loud / Moderately soft / Very soft [0]
3. "What does **pp** mean?" → Moderately soft / Very soft / Soft / Silent [1]
4. "What does **ff** mean?" → Moderately loud / Loud / Very loud / As loud as possible [2]
5. "What does **mp** mean?" → Very soft / Soft / Moderately soft / Moderately loud [2]
6. "What does **mf** mean?" → Moderately soft / Moderately loud / Loud / Very loud [1]
7. "This symbol means:" (render crescendo hairpin via inline SVG) → Get softer / Get louder / Stay the same / Accent [1]
8. "This symbol means:" (render decrescendo hairpin via inline SVG) → Get louder / Get softer / Pause / Repeat [1]
9. "Put these in order from softest to loudest: pp, f, mp, ff" → pp, mp, f, ff / mp, pp, f, ff / pp, f, mp, ff / f, mp, pp, ff [0]
10. "What does **sfz** mean?" → Very soft / Gradually louder / A sudden strong accent / Slowly [2]

---

## Chapter 13: Tempo Markings

**Subtitle:** "How fast or slow"

### Lesson Pages (4)

**Page 1: "What Is Tempo?"**
- Tempo is the speed of the music — how fast the beats go by
- Tempo is measured in BPM (beats per minute): 60 BPM = one beat per second
- Tempo markings are written above the staff at the beginning of a piece (or where the tempo changes)
- Two ways composers indicate tempo: Italian terms or exact BPM (♩ = 120)
- VexFlow: A staff with a tempo marking "Allegro ♩ = 120" above it

**Page 2: "Common Tempo Terms"**
- From slowest to fastest:
- **Grave** (~40 BPM) = very slow, solemn
- **Largo** (~50 BPM) = slow, broad
- **Adagio** (~70 BPM) = slow, at ease
- **Andante** (~80 BPM) = walking pace
- **Moderato** (~100 BPM) = moderate speed
- **Allegro** (~130 BPM) = fast, lively
- **Vivace** (~160 BPM) = very fast, vivid
- **Presto** (~180 BPM) = extremely fast
- You don't need to memorize exact BPMs — just know the relative order
- No VexFlow — styled text/table

**Page 3: "Changing Tempo"**
- Music doesn't always stay at one speed — composers indicate gradual changes
- **rit.** (ritardando) = gradually slow down
- **accel.** (accelerando) = gradually speed up
- **a tempo** = return to the original tempo (after a rit. or accel.)
- **rubato** = flexible tempo, slight push and pull (common in romantic piano music)
- These markings appear above or below the staff where the change begins
- No VexFlow — text focus

**Page 4: "Tempo in Practice"**
- When you see a tempo marking, set your metronome to that BPM before playing
- Start slow and work up to the written tempo — don't rush
- Italian terms give the character/mood, BPM gives the exact speed
- Many pieces use both: "Allegro (♩ = 132)" — the word sets the mood, the number sets the speed
- Practice tip: The existing modes in this app can be played at different speeds to build tempo control
- No VexFlow — practical advice

### Quiz Pool (10 questions)

1. "What does **Allegro** mean?" → Slow / Walking pace / Fast and lively / Extremely fast [2]
2. "What does **Adagio** mean?" → Fast / Moderate / Slow, at ease / Walking pace [2]
3. "What does **Presto** mean?" → Slow / Moderate / Fast / Extremely fast [3]
4. "What does **Andante** mean?" → Very slow / Walking pace / Fast / Very fast [1]
5. "What does **rit.** mean?" → Speed up / Slow down gradually / Return to tempo / Play freely [1]
6. "What does **accel.** mean?" → Slow down / Speed up gradually / Hold the note / Return to tempo [1]
7. "What does **a tempo** mean?" → Play faster / Play slower / Return to the original tempo / End the piece [2]
8. "Put these in order from slowest to fastest: Allegro, Largo, Presto, Andante" → Largo, Andante, Allegro, Presto / Andante, Largo, Allegro, Presto / Largo, Allegro, Andante, Presto / Presto, Allegro, Andante, Largo [0]
9. "BPM stands for:" → Bars per measure / Beats per minute / Bass per measure / Beats per melody [1]
10. "What does **Moderato** mean?" → Very slow / Moderate speed / Fast / Extremely fast [1]

---

## Chapter 14: Repeat Signs & Navigation

**Subtitle:** "Finding your way through the music"

### Lesson Pages (5)

**Page 1: "Repeat Barlines"**
- The most common navigation symbol: repeat barlines tell you to play a section again
- A **start repeat** has two dots on the right side of a thick barline
- An **end repeat** has two dots on the left side of a thick barline
- When you reach an end repeat, go back to the matching start repeat (or to the beginning if there's no start repeat)
- VexFlow: A short passage with start and end repeat barlines

**Page 2: "First and Second Endings"**
- Sometimes you repeat a section but change the ending the second time
- **1st ending** (bracket with "1."): play this the first time through
- **2nd ending** (bracket with "2."): skip the 1st ending and play this instead on the repeat
- These are called "volta brackets"
- VexFlow: A passage showing 1st and 2nd ending brackets

**Page 3: "D.C. and D.S."**
- **D.C.** (Da Capo) = go back to the very beginning
- **D.S.** (Dal Segno) = go back to the segno sign (𝄋)
- Both are usually followed by "al Fine" or "al Coda":
  - **D.C. al Fine** = go to the beginning, play until you see "Fine" (the end)
  - **D.S. al Coda** = go to the segno, play until the coda sign (𝄌), then jump to the Coda section
- No VexFlow — text with symbol references

**Page 4: "The Coda and Fine"**
- **Coda** (𝄌) = a special ending section, usually at the bottom of the page
- **Fine** = the end (when the piece doesn't end at the last measure on the page)
- Typical flow: play through, hit "D.S. al Coda," jump back to 𝄋, play until 𝄌, jump to Coda section, play to end
- This saves page space by avoiding rewriting repeated sections
- No VexFlow — conceptual with symbol display

**Page 5: "Putting It All Together"**
- A roadmap example showing how to read through a full piece with repeats and navigation:
  - Measures 1-8 with repeat → play 1-8, play 1-8 again
  - D.S. al Coda → jump back to segno, play until coda sign, jump to Coda
- Reading order matters — always follow the navigation markers in sequence
- When in doubt: repeat signs first, then D.C./D.S., then endings
- Practice tip: before playing a piece, trace the roadmap with your finger to know where you're going
- No VexFlow — text-based walkthrough

### Quiz Pool (10 questions)

1. "What do repeat barlines tell you to do?" → Play louder / Play the section again / Skip ahead / Slow down [1]
2. "When you see a 2nd ending bracket, you should:" → Play it both times / Play it the first time only / Skip the 1st ending and play this on the repeat / Go back to the beginning [2]
3. "What does D.C. stand for?" → Da Coda / Dal Capo / Da Capo / Dal Coda [2]
4. "What does D.C. al Fine mean?" → Go to the coda / Go to the beginning and play until Fine / Play the ending / Repeat the last measure [1]
5. "What does D.S. mean?" → Go to the beginning / Go to the coda / Go back to the segno sign / Go to the fine [2]
6. "The segno sign (𝄋) is used with:" → D.C. / D.S. / Fine / Repeat barlines [1]
7. "What is a Coda?" → A repeat sign / The beginning of a piece / A special ending section / A tempo marking [2]
8. "What does Fine mean?" → Fast / The end / Repeat / The beginning [1]
9. "In a passage with 1st and 2nd endings, how many times do you play the main section?" → 1 / 2 / 3 / 4 [1]
10. "D.S. al Coda means:" → Go to the beginning, play to coda sign, jump to coda / Go to the segno, play to coda sign, jump to coda / Go to the coda and play to the end / Repeat from the coda sign [1]

---

## Implementation Notes

- Chapters 12-14 follow the exact same architecture as 1-11: `pages[]` with `title`, `content`, optional `render`; `quizPool[]` with `id`, `prompt`, `render`, `options`, `correctIndex`
- Dynamic markings in quiz questions: render as styled italic text in a music-style font, or use VexFlow TextDynamics for staff context
- Hairpin symbols (crescendo/decrescendo): render as simple inline SVG `<svg>` elements — two lines forming a wedge shape
- Repeat barlines and volta brackets: use VexFlow's built-in barline types and VoltaBracket
- For D.C., D.S., segno (𝄋), and coda (𝄌): use Unicode characters with styled text
- Chapter count will auto-update since all references use `NOTATION_CHAPTERS.length`
- Initial HTML "Chapter 1 of 11" will need updating to "Chapter 1 of 14"

## Future Work

- **Tier 3:** Intervals in Depth, Circle of Fifths, Seventh Chords

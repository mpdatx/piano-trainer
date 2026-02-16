# Tier 3 Chapters (15-17) — Design

## Overview

3 advanced theory chapters that deepen understanding of harmony and key relationships. These build on Tier 1 foundations (scales, chords, progressions) and go further into intervals, key relationships, and extended chords. Same architecture as chapters 1-14: lesson pages with VexFlow examples, multiple-choice quiz with SM-2 spaced repetition.

## VexFlow Notes

- Intervals rendered as two notes on a staff (e.g., C4 and E4 for a 3rd)
- Key signatures via `.addKeySignature("G")`, `.addKeySignature("D")`, `.addKeySignature("F")`, `.addKeySignature("Bb")`
- Seventh chords use parenthesized syntax: `(C4 E4 G4 B4)/w` for 4-note stacks
- All existing rendering patterns carry over from chapters 1-14

---

## Chapter 15: Intervals in Depth

**Subtitle:** "Measuring the distance between notes"

### Lesson Pages (5)

**Page 1: "What Is an Interval?"**
- An interval is the distance between two notes, measured by both quantity (number) and quality (type)
- We touched on half steps and whole steps in Chapter 7 — intervals give us a richer vocabulary
- The number comes from counting letter names: C to E = a 3rd (C-D-E, three letters)
- VexFlow: Show C4 and E4 on a staff

**Page 2: "Interval Numbers"**
- Count inclusively from the bottom note to the top: unison (1), 2nd, 3rd, 4th, 5th, 6th, 7th, octave (8)
- C→C = unison, C→D = 2nd, C→E = 3rd, C→F = 4th, C→G = 5th, C→A = 6th, C→B = 7th, C→C = octave
- The number tells you the general size, but not the exact size — that's where quality comes in
- VexFlow: Show intervals from C4 up: 3rd (C-E), 5th (C-G), octave (C-C)

**Page 3: "Interval Quality — Major and Minor"**
- The quality describes the exact number of half steps
- For 2nds, 3rds, 6ths, and 7ths: **major** (M) or **minor** (m)
- Minor = one half step smaller than major
- Key intervals: m2 = 1 half step, M2 = 2, m3 = 3, M3 = 4, m6 = 8, M6 = 9, m7 = 10, M7 = 11
- Quick trick: If both notes are in the major scale of the lower note, it's a major interval
- No VexFlow — reference table

**Page 4: "Perfect Intervals"**
- 4ths, 5ths, unisons, and octaves use "perfect" instead of major/minor
- Perfect 4th (P4) = 5 half steps, Perfect 5th (P5) = 7 half steps
- Perfect unison (P1) = 0 half steps, Perfect octave (P8) = 12 half steps
- These are called "perfect" because they sound especially stable and consonant
- Augmented = one half step wider than perfect; Diminished = one half step narrower
- VexFlow: Show P4 (C-F) and P5 (C-G) on a staff

**Page 5: "Why Intervals Matter"**
- Intervals are the building blocks of everything: melodies move by intervals, chords are stacked intervals
- A major triad = M3 + m3 (from Chapter 10 — now you know the precise interval names)
- Recognizing intervals helps with sight-reading, ear training, and transposing music
- This connects to the app's Interval Training mode for ear-based practice
- No VexFlow — conceptual wrap-up

### Quiz Pool (10 questions)

1. "C to E is what interval number?" → 2nd / 3rd / 4th / 5th [1]
2. "C to G is what interval number?" → 4th / 5th / 6th / 7th [1]
3. "How many half steps in a minor 3rd?" → 2 / 3 / 4 / 5 [1]
4. "How many half steps in a major 3rd?" → 2 / 3 / 4 / 5 [2]
5. "How many half steps in a perfect 5th?" → 5 / 6 / 7 / 8 [2]
6. "How many half steps in a perfect 4th?" → 4 / 5 / 6 / 7 [1]
7. "A major triad is built from which two intervals?" → P4 + P5 / M3 + m3 / m3 + M3 / M2 + M2 [1]
8. "What quality do 4ths and 5ths use?" → Major/minor / Perfect / Augmented / Diminished [1]
9. "C to A is what interval?" → Minor 6th / Major 6th / Minor 7th / Major 7th [1]
10. "If a perfect 5th is 7 half steps, a diminished 5th is:" → 6 half steps / 7 half steps / 8 half steps / 5 half steps [0]

---

## Chapter 16: Circle of Fifths

**Subtitle:** "The map of all keys"

### Lesson Pages (5)

**Page 1: "What Is the Circle of Fifths?"**
- The Circle of Fifths is a visual diagram that arranges all 12 major keys in a circle
- Moving clockwise, each key is a perfect 5th (7 half steps) higher than the last
- C → G → D → A → E → B → F#/Gb → Db → Ab → Eb → Bb → F → back to C
- It's the single most useful diagram in music theory — a "map" of how keys relate
- No VexFlow — text introduction

**Page 2: "Sharps Go Clockwise"**
- Starting at C (no sharps or flats) and moving clockwise, each key adds one sharp
- C = 0, G = 1♯, D = 2♯, A = 3♯, E = 4♯, B = 5♯, F♯ = 6♯
- The new sharp each time is always the 7th degree of the new scale
- Order of sharps: F♯ C♯ G♯ D♯ A♯ E♯
- VexFlow: Show G major key signature (1 sharp), then D major (2 sharps)

**Page 3: "Flats Go Counter-Clockwise"**
- Moving counter-clockwise from C, each key adds one flat
- C = 0, F = 1♭, B♭ = 2♭, E♭ = 3♭, A♭ = 4♭, D♭ = 5♭, G♭ = 6♭
- The new flat each time is always the 4th degree of the new scale
- Order of flats: B♭ E♭ A♭ D♭ G♭ C♭ — it's the order of sharps reversed!
- VexFlow: Show F major key signature (1 flat), then Bb major (2 flats)

**Page 4: "Relative Minors on the Circle"**
- Each major key's relative minor sits on the inner ring of the circle (or 3 positions clockwise)
- C major → A minor, G major → E minor, F major → D minor
- The relative minor shares the same key signature — same sharps/flats, different home note
- This connects back to Chapter 9 (Minor Scales) — now you can see ALL relative pairs at once
- No VexFlow — conceptual reference

**Page 5: "Using the Circle"**
- To find a key signature: count clockwise for sharps, counter-clockwise for flats
- To find closely related keys: neighbors on the circle share the most notes (differ by just one sharp or flat)
- Chord progressions often move by 5ths — the V→I resolution is a step counter-clockwise on the circle
- The I-IV-V chords in any key are always neighbors on the circle (IV is one step counter-clockwise, V is one step clockwise)
- No VexFlow — practical tips

### Quiz Pool (10 questions)

1. "Moving clockwise on the Circle of Fifths, each key is a ___ higher:" → Perfect 4th / Perfect 5th / Major 3rd / Minor 3rd [1]
2. "How many sharps does G major have?" → 0 / 1 / 2 / 3 [1]
3. "How many sharps does D major have?" → 1 / 2 / 3 / 4 [1]
4. "How many flats does F major have?" → 0 / 1 / 2 / 3 [1]
5. "How many flats does Bb major have?" → 1 / 2 / 3 / 4 [1]
6. "The order of sharps begins with:" → B♭ E♭ A♭ / F♯ C♯ G♯ / C♯ F♯ G♯ / G♯ D♯ A♯ [1]
7. "The relative minor of G major is:" → B minor / D minor / E minor / A minor [2]
8. "On the circle, keys that are neighbors differ by:" → 3 sharps or flats / 2 sharps or flats / 1 sharp or flat / No sharps or flats [2]
9. "Which key has 3 sharps?" → G major / D major / A major / E major [2]
10. "Moving counter-clockwise from C, the first key is:" → G major / F major / D major / B♭ major [1]

---

## Chapter 17: Seventh Chords

**Subtitle:** "Adding color to your chords"

### Lesson Pages (5)

**Page 1: "Beyond Triads"**
- In Chapter 10, we built triads — three-note chords (root, 3rd, 5th)
- A seventh chord adds one more note: the 7th above the root — four notes total
- Seventh chords sound richer, more colorful, and often more "tense" than triads
- They're essential in jazz, pop, blues, and classical music
- VexFlow: Show C major triad `(C4 E4 G4)/w` next to C major seventh `(C4 E4 G4 B4)/w`

**Page 2: "Major Seventh Chords"**
- A major seventh chord (Cmaj7) = major triad + major 7th on top
- Formula: Root + M3 + m3 + M3 (or root, major 3rd, perfect 5th, major 7th)
- Cmaj7 = C-E-G-B (the B is 11 half steps above C — a major 7th)
- Sound: dreamy, smooth, sophisticated — common in jazz and bossa nova
- VexFlow: Show Cmaj7 `(C4 E4 G4 B4)/w`

**Page 3: "Dominant Seventh Chords"**
- A dominant seventh chord (C7) = major triad + minor 7th on top
- Formula: Root + M3 + m3 + m3 (or root, major 3rd, perfect 5th, minor 7th)
- C7 = C-E-G-Bb (the Bb is 10 half steps above C — a minor 7th)
- Sound: strong, wants to resolve — the "engine" of V→I progressions
- The V7→I progression is the strongest resolution in music (e.g., G7→C in the key of C)
- VexFlow: Show C7 `(C4 E4 G4 Bb4)/w`

**Page 4: "Minor Seventh Chords"**
- A minor seventh chord (Cm7) = minor triad + minor 7th on top
- Formula: Root + m3 + M3 + m3 (or root, minor 3rd, perfect 5th, minor 7th)
- Cm7 = C-Eb-G-Bb
- Am7 = A-C-E-G (all white keys — try it on the piano!)
- Sound: mellow, warm — the workhorse of jazz and R&B
- The ii-V-I progression in jazz uses all seventh chords: Dm7→G7→Cmaj7
- VexFlow: Show Am7 `(A3 C4 E4 G4)/w`

**Page 5: "Recognizing Seventh Chords"**
- Summary of the three main types:
- **maj7** = major triad + major 7th (dreamy) — written Cmaj7 or CΔ7
- **7** (dominant) = major triad + minor 7th (tense, wants to resolve) — written C7
- **m7** = minor triad + minor 7th (mellow) — written Cm7 or C-7
- There's also the dim7 (diminished seventh) — save that for later
- When you see chord symbols like Dm7-G7-Cmaj7, you now know exactly what notes to play
- No VexFlow — summary/reference

### Quiz Pool (10 questions)

1. "A seventh chord has how many notes?" → 2 / 3 / 4 / 5 [2]
2. "What notes make up Cmaj7?" → C-E-G-Bb / C-Eb-G-Bb / C-E-G-B / C-Eb-G-B [2]
3. "What notes make up C7 (dominant seventh)?" → C-E-G-B / C-E-G-Bb / C-Eb-G-Bb / C-Eb-G-B [1]
4. "A dominant seventh chord has a ___ 7th on top:" → Major / Minor / Perfect / Diminished [1]
5. "A major seventh chord has a ___ 7th on top:" → Major / Minor / Perfect / Augmented [0]
6. "Which chord wants to resolve most strongly?" → Cmaj7 / Cm7 / C7 (dominant) / C minor triad [2]
7. "What notes make up Am7?" → A-C#-E-G / A-C-E-G# / A-C-E-G / A-C#-E-G# [2]
8. "The ii-V-I in C major is:" → Dm-G-C / Dm7-G7-Cmaj7 / Cm7-F7-Bbmaj7 / Em7-A7-Dmaj7 [1]
9. "How many half steps from C to B (major 7th)?" → 10 / 11 / 12 / 9 [1]
10. "How many half steps from C to Bb (minor 7th)?" → 9 / 10 / 11 / 12 [1]

---

## Implementation Notes

- Chapters 15-17 follow the exact same architecture as 1-14: `pages[]` with `title`, `content`, optional `render`; `quizPool[]` with `id`, `prompt`, `render`, `options`, `correctIndex`
- Seventh chord VexFlow uses 4-note parenthesized syntax: `(C4 E4 G4 B4)/w`
- Key signatures for Circle of Fifths chapter use `.addKeySignature("G")`, `.addKeySignature("D")`, `.addKeySignature("F")`, `.addKeySignature("Bb")`
- Chapter count will auto-update since all references use `NOTATION_CHAPTERS.length`
- Initial HTML "Chapter 1 of 14" will need updating to "Chapter 1 of 17"

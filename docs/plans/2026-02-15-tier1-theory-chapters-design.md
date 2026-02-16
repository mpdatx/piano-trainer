# Tier 1 Theory Chapters (7-11) — Design

## Overview

5 new chapters extending the Music Notation learning mode from "reading notation" into "understanding the music." These follow the same architecture as chapters 1-6: lesson pages with VexFlow examples, then a multiple-choice quiz with SM-2 spaced repetition.

> **Tier 2** (Dynamics, Tempo, Repeat Signs) and **Tier 3** (Intervals in Depth, Circle of Fifths, Seventh Chords) to be designed later.

## VexFlow Notes

- Chords use parenthesized syntax: `(C4 E4 G4)/q`
- Scales render as sequential notes: `C4/q, D4/q, E4/q, ...`
- Key signatures via `.addKeySignature("G")`
- All existing rendering patterns carry over from chapters 1-6

---

## Chapter 7: Half Steps & Whole Steps

**Subtitle:** "The building blocks of music"

### Lesson Pages (4)

**Page 1: "What Is a Half Step?"**
- A half step is the smallest distance between two notes in Western music
- On the piano, a half step is from one key to the very next key (white or black)
- Examples: E→F (two white keys, no black key between), C→C# (white to black)
- Highlight: Most white keys have a black key between them, but E→F and B→C are natural half steps
- VexFlow: Show C4 and C#4 side by side, then E4 and F4

**Page 2: "What Is a Whole Step?"**
- A whole step = two half steps
- Skip one key to move a whole step: C→D (skip C#), D→E (skip D#)
- On the keyboard, whole steps always skip exactly one key
- VexFlow: Show C4 to D4, then D4 to E4

**Page 3: "The Piano Keyboard Pattern"**
- The pattern of half/whole steps creates the piano layout
- Between most white keys: whole step (because there's a black key between)
- E→F and B→C: half steps (no black key between)
- This pattern repeats every octave
- Diagram-style text showing the W-W-H-W-W-W-H pattern on C-D-E-F-G-A-B-C
- No VexFlow — text/diagram focus

**Page 4: "Counting Half Steps"**
- Counting half steps = counting keys (include black keys)
- C to E = 4 half steps (C→C#→D→D#→E)
- C to G = 7 half steps
- This matters because intervals, scales, and chords are all built from specific numbers of half steps
- Ties into the existing Interval Training mode
- No VexFlow — conceptual

### Quiz Pool (10 questions)

1. "What is a half step?" → The smallest distance between two notes / A skip of two keys / The distance between C and E / The distance between octaves [0]
2. "How many half steps from E to F?" → 1 / 2 / 3 / 0 [0]
3. "How many half steps from B to C?" → 2 / 3 / 0 / 1 [3]
4. "What is a whole step?" → Three half steps / One half step / Two half steps / Four half steps [2]
5. "How many half steps from C to D?" → 1 / 2 / 3 / 4 [1]
6. "Which pair of white keys has NO black key between them?" → C and D / D and E / E and F / G and A [2]
7. "How many half steps from C to E?" → 2 / 3 / 4 / 5 [2]
8. "How many half steps from C to G?" → 5 / 6 / 7 / 8 [2]
9. "A whole step on the piano always skips ___ key(s):" → 0 / 1 / 2 / 3 [1]
10. "Which of these is a half step?" → C to D / D to F / F to F# / G to B [2]

---

## Chapter 8: The Major Scale

**Subtitle:** "The most important pattern in music"

### Lesson Pages (5)

**Page 1: "What Is a Scale?"**
- A scale is a set of notes arranged in order by pitch
- Scales provide the "palette" of notes a piece of music uses
- The most common scale is the major scale — it sounds bright and happy
- VexFlow: C major scale ascending (C4 D4 E4 F4 G4 A4 B4 C5) in treble clef

**Page 2: "The Major Scale Formula"**
- Every major scale follows the same pattern of whole and half steps: W-W-H-W-W-W-H
- C major is the easiest — all white keys: C(W)D(W)E(H)F(W)G(W)A(W)B(H)C
- The half steps always fall between notes 3-4 and 7-8
- VexFlow: C major scale with W/H annotations (text-based, staff for reference)

**Page 3: "Building Major Scales"**
- You can start on ANY note and apply W-W-H-W-W-W-H to build a major scale
- G major: G-A-B-C-D-E-F#-G (needs one sharp to keep the pattern)
- F major: F-G-A-Bb-C-D-E-F (needs one flat to keep the pattern)
- This is WHY key signatures exist — they tell you which sharps/flats the scale needs
- VexFlow: G major scale with key signature, then F major scale with key signature

**Page 4: "Scale Degrees"**
- Each note in a scale has a number (degree) and a name
- 1st = Tonic (home base), 2nd = Supertonic, 3rd = Mediant, 4th = Subdominant, 5th = Dominant, 6th = Submediant, 7th = Leading Tone
- The most important: 1 (Tonic), 4 (Subdominant), 5 (Dominant)
- Don't memorize all the names yet — just know that scale degrees are numbered 1-7
- No VexFlow — conceptual with text

**Page 5: "Why Scales Matter"**
- Scales are the foundation for melodies — most melodies use notes from a single scale
- Chords are built from scale notes (covered in Chapter 10)
- Knowing your scales helps you read music faster, improvise, and understand harmony
- Practice tip: The existing Note Reading and Note Finding modes help you build keyboard familiarity, which makes scales easier
- No VexFlow — motivational/connecting

### Quiz Pool (10 questions)

1. "The major scale formula (in whole and half steps) is:" → W-H-W-W-H-W-W / W-W-H-W-W-W-H / H-W-W-H-W-W-W / W-W-W-H-W-W-H [1]
2. "How many notes are in a major scale (including the octave)?" → 6 / 7 / 8 / 12 [2]
3. "In a major scale, the half steps fall between degrees:" → 1-2 and 5-6 / 2-3 and 6-7 / 3-4 and 7-8 / 4-5 and 1-2 [2]
4. "C major uses:" → One sharp / One flat / No sharps or flats / Two sharps [2]
5. "What note is the 5th degree of C major?" → E / F / G / A [2]
6. "G major has one sharp. Which note is sharp?" → C# / G# / F# / D# [2]
7. "F major has one flat. Which note is flat?" → Eb / Ab / Db / Bb [3]
8. "The 1st degree of a scale is called the:" → Dominant / Mediant / Leading tone / Tonic [3]
9. "The 5th degree of a scale is called the:" → Tonic / Dominant / Subdominant / Mediant [1]
10. VexFlow render: Show D major scale → "What major scale is shown?" → C Major / D Major / G Major / A Major [1]

---

## Chapter 9: The Minor Scale

**Subtitle:** "The other side of the coin"

### Lesson Pages (4)

**Page 1: "Major vs. Minor"**
- Major scales sound bright, happy, triumphant
- Minor scales sound darker, sadder, more dramatic
- The difference comes down to the pattern of whole and half steps
- The natural minor scale formula: W-H-W-W-H-W-W
- Compare: C major (C D E F G A B C) vs. A minor (A B C D E F G A) — same white keys, different starting note!
- VexFlow: A natural minor scale (A4 B4 C5 D5 E5 F5 G5 A5) or (A3 B3 C4 D4 E4 F4 G4 A4)

**Page 2: "Relative Major and Minor"**
- Every major key has a relative minor that shares the same key signature (same sharps/flats)
- The relative minor starts on the 6th degree of the major scale
- C major → A minor (both: no sharps or flats)
- G major → E minor (both: one sharp, F#)
- F major → D minor (both: one flat, Bb)
- Quick trick: count down 3 half steps from any major key to find its relative minor
- VexFlow: C major scale, then A minor scale — highlight they use the same notes

**Page 3: "Harmonic and Melodic Minor"**
- The natural minor is the simplest, but composers often modify it
- Harmonic minor: raise the 7th degree by a half step — creates a "leading tone" that pulls strongly toward the tonic. This gives it a distinctive, slightly exotic sound.
- A harmonic minor: A B C D E F G# A
- Melodic minor: raise the 6th AND 7th going up, natural minor going down
- A melodic minor (up): A B C D E F# G# A, (down): A G F E D C B A
- For now, just recognize that minor scales have variations — you'll encounter all three in real music
- VexFlow: A harmonic minor scale (showing the G#)

**Page 4: "Finding Minor Keys"**
- In sheet music, the key signature alone doesn't tell you if a piece is major or minor
- A piece with no sharps/flats could be C major OR A minor
- Look at the melody: does it tend to start/end on C (major) or A (minor)?
- Look at the chords: does the piece feel resolved on C or A?
- Common relative pairs to memorize: C/Am, G/Em, D/Bm, F/Dm, Bb/Gm, Eb/Cm
- No VexFlow — conceptual

### Quiz Pool (10 questions)

1. "The natural minor scale formula is:" → W-W-H-W-W-W-H / W-H-W-W-H-W-W / H-W-W-H-W-W-W / W-W-H-W-W-H-W [1]
2. "Minor scales generally sound:" → Bright and happy / Dark or sad / Fast and energetic / Loud and bold [1]
3. "What is the relative minor of C major?" → D minor / E minor / A minor / G minor [2]
4. "What is the relative minor of G major?" → B minor / D minor / E minor / A minor [2]
5. "The relative minor starts on which degree of the major scale?" → 3rd / 4th / 5th / 6th [3]
6. "A minor and C major share the same:" → Tempo / Key signature / Time signature / Clef [1]
7. "In harmonic minor, which degree is raised?" → 3rd / 5th / 6th / 7th [3]
8. "What note is raised in A harmonic minor?" → F / E / G / D [2] (G becomes G#)
9. "How many half steps down from a major key to its relative minor?" → 1 / 2 / 3 / 4 [2]
10. "What is the relative major of D minor?" → C major / D major / F major / G major [2]

---

## Chapter 10: Chords — Major & Minor Triads

**Subtitle:** "Playing notes together"

### Lesson Pages (5)

**Page 1: "What Is a Chord?"**
- A chord is three or more notes played at the same time
- The simplest chord is a triad — three notes stacked in thirds
- Chords provide the harmony that supports a melody
- On the piano, you play chords by pressing multiple keys simultaneously
- VexFlow: C major chord `(C4 E4 G4)/w` — show the three notes stacked on the staff

**Page 2: "Building Major Triads"**
- A major triad is built from three notes: Root, 3rd, and 5th of a major scale
- Another way: Root + 4 half steps + 3 half steps
- C major triad: C-E-G (root C, skip 4 half steps to E, skip 3 more to G)
- G major triad: G-B-D
- F major triad: F-A-C
- VexFlow: Show C major, G major, F major triads as stacked chords

**Page 3: "Building Minor Triads"**
- A minor triad has a "lowered 3rd" — the middle note is one half step lower than in a major triad
- Formula: Root + 3 half steps + 4 half steps (reversed from major!)
- C minor triad: C-Eb-G (compare: C major is C-E-G)
- A minor triad: A-C-E
- The difference between major and minor is just one note — the 3rd
- VexFlow: Show C major vs C minor side by side, then A minor triad

**Page 4: "Common Triads to Know"**
- Every piano player should know these triads:
- Major: C (C-E-G), D (D-F#-A), E (E-G#-B), F (F-A-C), G (G-B-D), A (A-C#-E), Bb (Bb-D-F)
- Minor: Am (A-C-E), Dm (D-F-A), Em (E-G-B), Gm (G-Bb-D)
- Notice: Minor chords are named with a lowercase "m" (Am, Dm, Em)
- Practice tip: Try playing these on the piano using the Note Finding mode to build familiarity
- No VexFlow — reference list

**Page 5: "Inversions"**
- A chord doesn't have to start on the root — you can rearrange the notes
- Root position: C-E-G (root on bottom)
- First inversion: E-G-C (3rd on bottom)
- Second inversion: G-C-E (5th on bottom)
- Same chord, same letter name, just rearranged — this gives different voicings and makes chord transitions smoother
- VexFlow: Show C major in root position, 1st inversion, 2nd inversion

### Quiz Pool (10 questions)

1. "A triad is made up of how many notes?" → 2 / 3 / 4 / 5 [1]
2. "A major triad is built with:" → Root + 3 half steps + 4 half steps / Root + 4 half steps + 3 half steps / Root + 2 half steps + 2 half steps / Root + 5 half steps + 2 half steps [1]
3. "What notes make up a C major triad?" → C-D-E / C-Eb-G / C-E-G / C-F-A [2]
4. "What notes make up a G major triad?" → G-A-B / G-Bb-D / G-B-D / G-C-E [2]
5. "A minor triad is built with:" → Root + 4 half steps + 3 half steps / Root + 3 half steps + 3 half steps / Root + 3 half steps + 4 half steps / Root + 4 half steps + 4 half steps [2]
6. "What notes make up an A minor triad?" → A-C-E / A-C#-E / A-D-F / A-Cb-E [0]
7. "The difference between C major and C minor is:" → The root / The 3rd / The 5th / The octave [1]
8. VexFlow render: Show `(C4 E4 G4)/w` → "What chord is this?" → C minor / F major / C major / G major [2]
9. "In first inversion, which note is on the bottom?" → The root / The 3rd / The 5th / The 7th [1]
10. VexFlow render: Show `(A3 C4 E4)/w` → "What chord is this?" → C major / A major / E minor / A minor [3]

---

## Chapter 11: Chord Progressions

**Subtitle:** "How chords work together"

### Lesson Pages (5)

**Page 1: "Chords in a Key"**
- Just as scales give you the notes in a key, you can build a chord on each note of the scale
- In C major: C(I), Dm(ii), Em(iii), F(IV), G(V), Am(vi), Bdim(vii°)
- Notice the pattern: I, ii, iii are major, minor, minor; IV, V are major; vi is minor; vii° is diminished
- Roman numerals: uppercase = major, lowercase = minor
- This same pattern applies to EVERY major key
- No VexFlow — conceptual table/list

**Page 2: "The I, IV, and V Chords"**
- The three most important chords in any key are I (Tonic), IV (Subdominant), and V (Dominant)
- In C major: C, F, G
- In G major: G, C, D
- Thousands of songs use only these three chords
- The V chord has a strong pull back to I — this "tension and resolution" is the engine of Western music
- VexFlow: Show I (C major), IV (F major), V (G major) chords in sequence

**Page 3: "The I-V-vi-IV Progression"**
- The most common chord progression in pop music: I → V → vi → IV
- In C major: C → G → Am → F
- Songs using this: "Let It Be," "No Woman No Cry," "Someone Like You," "With or Without You," countless others
- Try it: play C-G-Am-F on the piano, repeating — you'll recognize the sound instantly
- VexFlow: Show the four chords in sequence with Roman numerals labeled

**Page 4: "Other Common Progressions"**
- I → IV → V → I (the classic resolution — blues, rock, folk)
- I → vi → IV → V (50s progression — "Stand By Me," "Every Breath You Take")
- ii → V → I (jazz turnaround — the foundation of jazz harmony)
- The 12-bar blues: I-I-I-I-IV-IV-I-I-V-IV-I-V (12 measures, the backbone of blues and rock)
- You don't need to memorize these — just know that chord progressions follow patterns
- No VexFlow — text/list focus

**Page 5: "Reading Chord Symbols"**
- In lead sheets and pop music, chords are written above the melody as symbols
- C = C major, Cm = C minor, C7 = C dominant seventh
- G/B = G major with B in the bass (slash chord)
- When you see chord symbols, you now know how to build each chord from the formulas in Chapter 10
- This connects notation reading (chapters 1-6) with harmonic understanding
- No VexFlow — conceptual wrap-up

### Quiz Pool (10 questions)

1. "In C major, what is the IV chord?" → G major / A minor / F major / D minor [2]
2. "In C major, what is the V chord?" → F major / G major / A minor / E minor [1]
3. "In G major, what is the I chord?" → C major / D major / G major / A major [2]
4. "Roman numeral 'vi' indicates a:" → Major chord / Minor chord / Diminished chord / Augmented chord [1]
5. "The most common pop progression is:" → I-IV-V-I / ii-V-I / I-V-vi-IV / I-vi-ii-V [2]
6. "In C major, the I-V-vi-IV progression is:" → C-F-Am-G / C-G-Am-F / C-G-Em-F / C-F-G-Am [1]
7. "The V chord naturally wants to resolve to the:" → IV chord / vi chord / I chord / ii chord [2]
8. "In C major, which chord is built on the 2nd degree?" → C major / D minor / E minor / F major [1]
9. "What does 'Cm' mean as a chord symbol?" → C major / C minor / C diminished / C with a melody [1]
10. "In G major, the I-IV-V chords are:" → G-C-D / G-B-D / G-D-A / G-F-C [0]

---

## Implementation Notes

- Chapters 7-11 follow the exact same architecture as 1-6: `pages[]` with `title`, `content`, optional `render`; `quizPool[]` with `id`, `prompt`, `render`, `options`, `correctIndex`
- VexFlow chord rendering uses parenthesized syntax: `(C4 E4 G4)/w`
- Chapter count in menu card and `getNotationCurrentChapter()` need updating from 6 → 11
- No new UI components needed — all existing lesson/quiz infrastructure works as-is
- The chord chapters (10-11) pair naturally with the existing Interval Training mode for ear-based learning

## Future Work

- **Tier 2:** Dynamics & Expression, Tempo Markings, Repeat Signs & Navigation
- **Tier 3:** Intervals in Depth, Circle of Fifths, Seventh Chords

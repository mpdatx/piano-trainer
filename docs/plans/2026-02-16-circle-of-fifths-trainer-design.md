# Circle of Fifths Trainer — Design

## Overview

A new practice mode that drills Circle of Fifths knowledge through mixed question types with button-grid answers. Follows the same architecture as the existing Interval and Key Signature trainer modes (text prompt + answer buttons, no piano keyboard). Text-only presentation (no VexFlow rendering). Progressive levels that introduce new question categories.

## Mode Card

- Card ID: `#card-circle`
- Icon: 🔄
- Title: "Circle of Fifths"
- Shows level name and accuracy like other modes
- Placed after the Key Signatures card on the main menu

## Question System

Questions are generated dynamically based on the current level. Each question has a text prompt and 4 answer buttons. The question generator picks from the question types unlocked at the current level.

### Question Types

| Type | Example Prompt | Example Answer | Distractors |
|------|---------------|----------------|-------------|
| fifth_up | "What key is a 5th above D?" | A | G, E, B |
| fourth_up | "What key is a 4th above D?" | G | A, C, E |
| sharp_count | "How many sharps in A major?" | 3 | 1, 2, 4 |
| flat_count | "How many flats in Eb major?" | 3 | 1, 2, 4 |
| relative_minor | "What is the relative minor of G major?" | E minor | A minor, B minor, D minor |
| relative_major | "What is the relative major of C# minor?" | E major | A major, D major, B major |
| chord_I_IV_V | "In G major, what is the V chord?" | D major | C major, A major, E major |

Distractors are plausible wrong answers drawn from other keys on the circle (neighbors preferred for difficulty).

## Level Structure

| Level | Name | Question Types | Items | Threshold | Min Attempts |
|-------|------|---------------|-------|-----------|-------------|
| 1 | Fifths Up | fifth_up | 12 keys | 80% | 3 per key |
| 2 | Fourths Up | fourth_up | 12 keys | 80% | 3 per key |
| 3 | Sharps & Flats | sharp_count, flat_count | 12 key signatures | 80% | 3 each |
| 4 | Relative Minors | relative_minor, relative_major | 12 pairs | 80% | 3 each |
| 5 | I-IV-V Chords | chord_I_IV_V | I/IV/V for 7 common keys (C, G, D, A, F, Bb, Eb) | 80% | 3 each |
| 6 | Full Circle | All types mixed | All items from levels 1-5 | 80% | 2 each |

## Circle of Fifths Data

Lookup table used by the question generator:

```
Key   Sharps/Flats  Relative Minor  5th Up  4th Up
C     0             Am              G       F
G     1♯            Em              D       C
D     2♯            Bm              A       G
A     3♯            F#m             E       D
E     4♯            C#m             B       A
B     5♯            G#m             F#      E
F#    6♯            D#m             C#(Db)  B
Db    5♭            Bbm             Ab      Gb
Ab    4♭            Fm              Eb      Db
Eb    3♭            Cm              Bb      Ab
Bb    2♭            Gm              F       Eb
F     1♭            Dm              C       Bb
```

I-IV-V chords for common keys:
```
C:  I=C   IV=F   V=G
G:  I=G   IV=C   V=D
D:  I=D   IV=G   V=A
A:  I=A   IV=D   V=E
F:  I=F   IV=Bb  V=C
Bb: I=Bb  IV=Eb  V=F
Eb: I=Eb  IV=Ab  V=Bb
```

## UI & Interaction

- Uses the shared `#quiz-screen` (no new screen HTML)
- Hides piano keyboard (like Interval/Key Sig modes)
- Shows button grid in `#circle-buttons` container (new, follows `#keysig-buttons` pattern)
- Question text displayed in `#staff-container` as styled text (no VexFlow)
- Buttons rebuilt per question with the 4 answer choices (1 correct + 3 distractors)
- Correct/wrong feedback, streak, progress bar all work identically to other modes

### Button Grid Behavior

- 4 buttons per question (shuffled order)
- Click correct → green flash, "Correct!" feedback, next question after 400ms
- Click wrong → red flash, "Wrong — the answer was X" feedback
- Same `handleKeyClick` / `recordAttempt` flow as other button-based modes

## Progress & Scoring

Reuses the existing progress infrastructure:

- Progress stored in `modeProgress.circle` (same shape as other modes: `noteStats`, `noteMemory`, `currentLevel`, `currentStreak`, `longestStreak`, `roundNumber`)
- SM-2 spaced repetition for question selection (same `pickNextNote` algorithm)
- Items tracked as compound keys: `"fifth_up_C"`, `"sharp_count_G"`, `"rel_minor_D"`, `"chord_V_G"` etc.
- Stats grid shows per-item accuracy
- Level-complete overlay works unchanged

## Integration Points

- Add `"circle"` to the mode system alongside `"visual"`, `"audio"`, `"reverse"`, `"interval"`, `"keysig"`
- `showQuizScreen("circle")` hides keyboard, builds circle answer buttons
- `getLevelsForMode("circle")` returns `COF_LEVELS` array
- `getLevelItems()` extended to return items for circle levels
- Question generation: new `generateCofQuestion(item)` function creates prompt + options from the lookup table
- `recordAttempt()` and `checkLevelUp()` work unchanged
- `saveProgress()` / `loadProgress()` include `circle` in `modeProgress`
- `createDefaultProgress()` called with circle items for initialization

## Implementation Notes

- No new HTML screens needed — reuses `#quiz-screen`
- Needs new button container `#circle-buttons` (or reuse `#keysig-buttons` pattern with dynamic rebuild)
- Question text goes in `#staff-container` styled as large text (similar to Note Finding mode's note name display)
- The `renderQuizNote` function needs a branch for `quizMode === "circle"` to show text instead of staff notation
- Level dropdown in `#level-display` needs to include circle levels
- Mode card needs to be added to the `.mode-cards` container in HTML

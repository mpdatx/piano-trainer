# Music Notation Learning Mode — Design

## Overview

A new mode in the Piano Trainer app that teaches users to read music notation through linear chapters with lesson content and spaced-repetition quizzes. Unlike the existing quiz-only modes, this mode teaches first, then tests.

## Approach

Separate Lesson + Quiz screens per chapter. A chapter list shows all chapters with progress. Each chapter has a lesson phase (paginated pages with text + VexFlow examples) followed by a quiz phase (multiple choice with SM-2 spaced repetition).

## Chapters

| # | Chapter | Lesson Topics | Example Quiz Questions |
|---|---------|--------------|----------------------|
| 1 | The Staff & Clefs | 5 lines/4 spaces, treble clef, bass clef, grand staff, ledger lines | "Which clef is this?", "How many lines on a staff?" |
| 2 | Notes on the Staff | Note placement = pitch, line vs space notes, reading treble/bass clef notes, mnemonics | "What note is on the 3rd line of treble clef?", identify a note |
| 3 | Note Values | Whole, half, quarter, eighth, sixteenth notes — appearance and relative duration, beaming, stems | "Which note gets 4 beats?", identify a note type |
| 4 | Rests | Whole, half, quarter, eighth, sixteenth rests — appearance and duration | "Which rest is this?", "How many beats?" |
| 5 | Time Signatures | Top/bottom numbers, 4/4, 3/4, 2/4, 6/8, counting beats | "How many beats per measure in 3/4?", "Which time signature fits?" |
| 6 | Key Signatures & Accidentals | Sharp, flat, natural signs, key signatures on staff, order of sharps/flats | "What does this symbol mean?", "How many sharps in G major?" |

Each lesson has 3-5 pages. Each quiz draws from a pool of questions per chapter.

## UI & Navigation

### Main Menu
- New "Music Notation" mode card alongside existing 5 modes
- Shows progress: "Chapter 3 of 6"

### Chapter List Screen
- List of all 6 chapters
- Completed: checkmark, Current: highlighted, Locked: grayed out
- Title + subtitle per chapter

### Lesson Screen
- Top: Back button + chapter title + page indicator ("2 / 4")
- Middle: Text explanation + VexFlow-rendered examples
- Bottom: Previous / Next buttons; last page shows "Start Quiz"
- Dark theme matching existing app

### Quiz Screen
- Reuses existing staff container for notation rendering
- 3-4 multiple choice answer buttons (styled like interval training)
- Correct/incorrect feedback with right answer on wrong guess
- SM-2 spaced repetition for question selection
- Accuracy stats grid, streak tracking, progress bar
- Level complete overlay when quiz is passed (80% threshold)

## Data Model

### Lesson Content (JS)
```js
{
  id: 1,
  title: "The Staff & Clefs",
  subtitle: "The foundation of written music",
  pages: [
    { html: "...", renderFn: (container) => { /* VexFlow rendering */ } },
    // ...
  ],
  quizPool: [
    { prompt: "Which clef is this?", renderFn: fn, options: [...], correctIndex: 0 },
    // ...
  ]
}
```

### Progress (localStorage)
```js
notationProgress: {
  chapters: {
    1: { lessonComplete: true, quizStats: { /* per-question SM-2 data */ } },
    // ...
  },
  currentChapter: 3
}
```

### Quiz Logic
- Questions weighted by SM-2 algorithm (reuses existing `pickNextItem` / `updateSRS`)
- Per-question accuracy tracked
- Pass threshold: 80% accuracy + minimum attempts
- Users can keep practicing after passing
- Unlock-all toggle support

## Technical Notes
- All code in index.html (matching existing architecture)
- VexFlow rendering via small helper functions per example
- Reuses existing: staff rendering, feedback UI, stats grid, progress bar, level complete overlay, SM-2 algorithm
- New: lesson page pagination, chapter list screen, multiple choice question UI

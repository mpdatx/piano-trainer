# Content Extraction — Design

## Overview

Extract the monolithic `index.html` (~4,600 lines) into a modular `src/` directory with separate files for chapters, data, app logic, CSS, and HTML. A build script using esbuild assembles everything back into the root `index.html` for deployment. The output is functionally identical to the current file.

## Goals

- **Easier content authoring**: Each chapter in its own file, easy to find, edit, and review
- **Code maintainability**: App logic split into a few logical modules instead of one giant script
- **Zero deployment change**: Root `index.html` remains the single build artifact

## Source File Structure

```
piano/
  src/
    index.html              # HTML shell with BUILD:CSS and BUILD:JS placeholders
    styles.css              # All CSS (~643 lines)
    chapters/
      ch01-staff-and-clefs.js
      ch02-notes-on-staff.js
      ch03-rhythm-basics.js
      ch04-time-signatures.js
      ch05-rests-and-note-values.js
      ch06-grand-staff.js
      ch07-accidentals.js
      ch08-interval-basics.js
      ch09-scales.js
      ch10-key-signatures.js
      ch11-chords.js
      ch12-dynamics-and-articulation.js
      ch13-tempo-and-expression.js
      ch14-repeat-signs.js
      ch15-intervals-in-depth.js
      ch16-circle-of-fifths.js
      ch17-seventh-chords.js
      index.js               # Imports all chapters, exports NOTATION_CHAPTERS array
    data/
      constants.js           # STORAGE_KEY, global state variables
      levels.js              # DIFFICULTY_LEVELS, ALL_NOTES
      intervals.js           # INTERVALS, INTERVAL_LEVELS, ALL_INTERVALS
      keysigs.js             # KEY_SIGNATURES, KEYSIG_LEVELS, ALL_KEYSIGS
      cof.js                 # COF_DATA, COF_KEYS, COF_LEVELS, ALL_COF_ITEMS
    app/
      progress.js            # Progress/storage, spaced repetition, SM-2
      quiz.js                # Quiz generation, rendering, button builders, handlers
      notation-mode.js       # Chapter list, lessons, notation quiz
      ui.js                  # Menu, screen management, display updates, keyboard
      audio.js               # Note/MIDI helpers, sampler init, playback
    main.js                  # Event handlers + initialization (entry point)
  build.js                   # Node.js build script
  package.json               # devDependency: esbuild
  sw.js                      # Service worker (unchanged, stays at root)
```

## Chapter Module Format

Each chapter file exports a single object matching the current `NOTATION_CHAPTERS` element shape:

```js
// src/chapters/ch01-staff-and-clefs.js
const { Factory } = Vex.Flow;

export default {
    id: 1,
    title: "The Staff & Clefs",
    subtitle: "The foundation of written music",
    pages: [
        {
            title: "The Musical Staff",
            content: `<h3>The Musical Staff</h3>...`,
            render(container) {
                const el = container.querySelector("#ch1-ex1");
                if (!el) return;
                const factory = new Factory({ ... });
                // ... VexFlow rendering
            }
        },
        // ... more pages
    ],
    quizPool: [
        { id: "1-1", prompt: "...", render: null, options: [...], correctIndex: 0 },
        // ... 10 questions
    ]
};
```

The chapters index gathers them into the array:

```js
// src/chapters/index.js
import ch01 from './ch01-staff-and-clefs.js';
import ch02 from './ch02-notes-on-staff.js';
// ... all 17 chapters
export const NOTATION_CHAPTERS = [ch01, ch02, /* ... */ ch17];
```

## Build Script

`build.js` uses esbuild as a library to bundle all JS modules into a single IIFE, then assembles the final HTML:

```js
// build.js
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';

const result = await build({
    entryPoints: ['src/main.js'],
    bundle: true,
    write: false,
    format: 'iife',
    external: ['Vex', 'Tone'],
});

const js = result.outputFiles[0].text;
const html = readFileSync('src/index.html', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');

const output = html
    .replace('/* BUILD:CSS */', css)
    .replace('/* BUILD:JS */', js);

writeFileSync('index.html', output);
console.log('Built index.html');
```

**Key details:**
- `external: ['Vex', 'Tone']` — VexFlow and Tone.js are loaded via CDN `<script>` tags, not bundled
- `format: 'iife'` — output is a self-executing function, same as the current inline `<script>` block
- Output goes to root `index.html` — deployment workflow unchanged

## HTML Template

`src/index.html` contains the HTML shell with placeholder comments:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- ... meta, title, icons ... -->
    <style>/* BUILD:CSS */</style>
    <script src="https://cdn.jsdelivr.net/npm/vexflow@4.2.6/build/cjs/vexflow.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script>
</head>
<body>
    <!-- All screen/container HTML stays here -->
    <script>/* BUILD:JS */</script>
</body>
</html>
```

## App Module Split

The ~1,650 lines of app logic split into 5 modules by responsibility:

| Module | Responsibilities | Approx lines |
|--------|-----------------|-------------|
| `progress.js` | localStorage read/write, spaced repetition (SM-2), `recordAttempt`, `checkLevelUp`, `resetLevelStats`, notation progress helpers | ~200 |
| `quiz.js` | `beginQuiz`, `pickNextNote`, `renderQuizNote`, interval/keysig/circle question generation, button builders, click handlers | ~400 |
| `notation-mode.js` | `showNotationChapterList`, `buildChapterList`, `startChapter`, `renderLessonPage`, `showNotationQuiz`, `renderNQQuestion`, `handleNQAnswer`, notation quiz progress | ~350 |
| `ui.js` | `showMainMenu`, `showQuizScreen`, `showWaitingState`, `showFeedback`, `showLevelComplete`, `updateStreakDisplay`, `updateLevelDisplay`, `updateStatsDisplay`, `updateMenuStats`, `populateLevelPicker`, keyboard DOM | ~500 |
| `audio.js` | `playNote`, `playNoteStr`, `parseNote`, `noteToMidi`, `midiToNote`, `getClefForNote`, sampler initialization, `addTouchHandlers` | ~200 |

Modules use ES module imports/exports. Shared state (like `quizMode`, `showLabels`) lives in `constants.js` and is imported where needed.

## What Stays the Same

- **localStorage format**: No data migration. Same `STORAGE_KEY`, same object shape
- **Service worker**: `sw.js` stays at root, same registration code, same `APP_VERSION` cache busting
- **CDN dependencies**: VexFlow and Tone.js loaded via script tags in the HTML template
- **User-facing behavior**: Identical — the built output is the same single-file app
- **Chapter data shape**: Same object structure (`id`, `title`, `subtitle`, `pages[]`, `quizPool[]`)

## Workflow

1. Edit source files in `src/`
2. Run `node build.js` (or `npm run build`)
3. Root `index.html` is regenerated
4. Commit and push as usual

The root `index.html` becomes a build artifact with a generated-file comment at the top.

## Package.json

Minimal `package.json` for the build tooling:

```json
{
  "name": "piano-trainer",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node build.js"
  },
  "devDependencies": {
    "esbuild": "^0.24.0"
  }
}
```

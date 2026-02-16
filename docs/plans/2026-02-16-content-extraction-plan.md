# Content Extraction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract the monolithic `index.html` (~4,600 lines) into a modular `src/` directory with separate files for chapters, data, app logic, CSS, and HTML, assembled by a build script.

**Architecture:** ES modules in `src/` directory, bundled by esbuild into a single IIFE injected into an HTML template. The root `index.html` is the build output — deployment unchanged. VexFlow and Tone.js remain CDN-loaded externals.

**Tech Stack:** Node.js, esbuild (devDependency), ES modules

---

## Important Context

- The current app is a single `index.html` file with inline CSS and a single `<script>` block
- VexFlow (`Vex.Flow`) and Tone.js (`Tone`) are loaded via CDN `<script>` tags as globals
- Chapter render functions use `const { Factory } = Vex.Flow;` and reference global `Vex`
- The sampler uses global `Tone.Sampler` and `Tone.start()`
- All mutable state is module-scoped (no globals on `window`)
- localStorage uses key `"pianoTrainerProgress"` with nested `modeProgress` and `notationProgress`
- Service worker at `sw.js` with `APP_VERSION` for cache busting

## Shared State Variables

These variables are mutated across modules and need to be exported from a shared state module:

```js
// src/data/state.js
export let showLabels = true;
export let quizMode = "visual";
export let allLevelsUnlocked = false;
export let pianoLoaded = false;
export let currentNote = null;
export let currentInterval = null;
export let firstAttempt = true;
export let noteDisplayTime = null;
export let isProcessingClick = false;
export let currentKeySig = null;
export let currentCofItem = null;
export let currentCofAnswer = null;
export let currentCofPrompt = "";
export let notationProgress = null;
export let currentChapterId = null;
export let currentLessonPage = 0;
export let currentQuizQuestion = null;
export let nqFirstAttempt = true;
export let nqDisplayTime = null;
export let isNotationQuizActive = false;
```

**Critical:** ES module `export let` creates live bindings — imports see updated values. Modules that mutate state need setter functions or need to import the state module object. The simplest approach: export a `state` object and mutate its properties.

```js
// src/data/state.js
const state = {
    showLabels: true,
    quizMode: "visual",
    allLevelsUnlocked: false,
    // ... all mutable state
};
export default state;
```

Then: `import state from '../data/state.js'; state.quizMode = "interval";`

---

## Task 1: Set Up Build Infrastructure

**Files:**
- Create: `package.json`
- Create: `build.js`
- Create: `src/index.html` (HTML template shell)
- Create: `src/styles.css` (extract CSS)
- Create: `src/main.js` (minimal entry point)
- Modify: `.gitignore` — add `node_modules/`

**Step 1: Create package.json**

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

**Step 2: Install esbuild**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` generated

**Step 3: Add `node_modules/` to .gitignore**

Append `node_modules/` to `.gitignore` (currently only has `.worktrees/`).

**Step 4: Create build.js**

```js
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

**Step 5: Create src/index.html template**

Extract lines 1-16 (head), 660-816 (body HTML), and the closing tags from the current `index.html`. Replace the inline `<style>` content with `/* BUILD:CSS */` and the `<script>` content with `/* BUILD:JS */`. Keep the CDN script tags for VexFlow and Tone.js.

**Step 6: Create src/styles.css**

Extract lines 15-658 (all CSS) from the current `index.html` into `src/styles.css`.

**Step 7: Create src/main.js (stub)**

```js
console.log("Piano Trainer loaded");
```

**Step 8: Test the build**

Run: `npm run build`
Expected: `index.html` is generated. Opening it in a browser should show the styled HTML with "Piano Trainer loaded" in the console. No JS functionality yet.

**Step 9: Commit**

```bash
git add package.json package-lock.json build.js src/index.html src/styles.css src/main.js .gitignore
git commit -m "Set up build infrastructure with esbuild"
```

---

## Task 2: Extract Data Constants

**Files:**
- Create: `src/data/constants.js`
- Create: `src/data/state.js`
- Create: `src/data/levels.js`
- Create: `src/data/intervals.js`
- Create: `src/data/keysigs.js`
- Create: `src/data/cof.js`
- Modify: `src/main.js` — import and verify all data

**Step 1: Create src/data/state.js**

Extract all mutable state variables (lines 823-825, 2930, 2998-3002, 3474-3477, 4019-4025) into a state object:

```js
const state = {
    showLabels: true,
    quizMode: "visual",
    allLevelsUnlocked: false,
    pianoLoaded: false,
    currentNote: null,
    currentInterval: null,
    firstAttempt: true,
    noteDisplayTime: null,
    isProcessingClick: false,
    currentKeySig: null,
    currentCofItem: null,
    currentCofAnswer: null,
    currentCofPrompt: "",
    notationProgress: null,
    currentChapterId: null,
    currentLessonPage: 0,
    currentQuizQuestion: null,
    nqFirstAttempt: true,
    nqDisplayTime: null,
    isNotationQuizActive: false,
};
export default state;
```

**Step 2: Create src/data/constants.js**

```js
export const STORAGE_KEY = "pianoTrainerProgress";
```

**Step 3: Create src/data/levels.js**

Extract `DIFFICULTY_LEVELS` (lines 830-842) and `ALL_NOTES` (line 844):

```js
export const DIFFICULTY_LEVELS = [
    { name: "C Position", notes: ["C4", "E4", "G4"], threshold: 0.80, minAttempts: 3 },
    // ... all 11 levels
];
export const ALL_NOTES = [...new Set(DIFFICULTY_LEVELS.flatMap(l => l.notes))];
```

**Step 4: Create src/data/intervals.js**

Extract `INTERVALS` (lines 849-862), `INTERVAL_LEVELS` (lines 864-871), `ALL_INTERVALS` (line 873):

```js
export const INTERVALS = { "m2": { semitones: 1, name: "Minor 2nd" }, /* ... */ };
export const INTERVAL_LEVELS = [ /* ... */ ];
export const ALL_INTERVALS = [...new Set(INTERVAL_LEVELS.flatMap(l => l.intervals))];
```

**Step 5: Create src/data/keysigs.js**

Extract `KEY_SIGNATURES` (lines 878-902), `KEYSIG_LEVELS` (lines 894-900), `ALL_KEYSIGS` (line 902):

```js
export const KEY_SIGNATURES = { "C": { sharps: 0, flats: 0, name: "C Major", vexKey: "C" }, /* ... */ };
export const KEYSIG_LEVELS = [ /* ... */ ];
export const ALL_KEYSIGS = [...new Set(KEYSIG_LEVELS.flatMap(l => l.keys))];
```

**Step 6: Create src/data/cof.js**

Extract `COF_DATA` (lines 905-918), `COF_KEYS` (line 920), `COF_LEVELS` (lines 922-929), `ALL_COF_ITEMS` (line 934):

```js
export const COF_DATA = { "C": { fifthUp: "G", fourthUp: "F", /* ... */ }, /* ... */ };
export const COF_KEYS = Object.keys(COF_DATA);
export const COF_LEVELS = [ /* ... */ ];
export const ALL_COF_ITEMS = [ /* ... */ ];
```

**Step 7: Update src/main.js to import and verify**

```js
import state from './data/state.js';
import { STORAGE_KEY } from './data/constants.js';
import { DIFFICULTY_LEVELS, ALL_NOTES } from './data/levels.js';
import { INTERVALS, INTERVAL_LEVELS, ALL_INTERVALS } from './data/intervals.js';
import { KEY_SIGNATURES, KEYSIG_LEVELS, ALL_KEYSIGS } from './data/keysigs.js';
import { COF_DATA, COF_KEYS, COF_LEVELS, ALL_COF_ITEMS } from './data/cof.js';

console.log("Data loaded:", {
    levels: DIFFICULTY_LEVELS.length,
    notes: ALL_NOTES.length,
    intervals: Object.keys(INTERVALS).length,
    keysigs: Object.keys(KEY_SIGNATURES).length,
    cofKeys: COF_KEYS.length,
});
```

**Step 8: Build and verify**

Run: `npm run build`
Expected: Build succeeds. Opening `index.html` in browser shows data counts in console.

**Step 9: Commit**

```bash
git add src/data/
git commit -m "Extract data constants into separate modules"
```

---

## Task 3: Extract All 17 Chapter Files

**Files:**
- Create: `src/chapters/ch01-staff-and-clefs.js` through `src/chapters/ch17-seventh-chords.js`
- Create: `src/chapters/index.js`
- Modify: `src/main.js` — import and verify chapters

This is the largest single task (1,812 lines). Each chapter file exports a default object with `{id, title, subtitle, pages[], quizPool[]}`.

**Step 1: Create all 17 chapter files**

For each chapter, extract the corresponding object from the `NOTATION_CHAPTERS` array (lines 939-2751). Each file follows this pattern:

```js
// src/chapters/ch01-staff-and-clefs.js
const { Factory } = Vex.Flow;

export default {
    id: 1,
    title: "The Staff & Clefs",
    subtitle: "The foundation of written music",
    pages: [ /* exact content from current file */ ],
    quizPool: [ /* exact content from current file */ ]
};
```

**Important:** The `const { Factory } = Vex.Flow;` line goes at the top of each chapter file that has render functions using `Factory`. `Vex` is a global (CDN-loaded, marked as `external` in esbuild), so this works.

Chapter line ranges in current `index.html`:
- Ch 1: lines 940-1054
- Ch 2: lines 1055-1180
- Ch 3: lines 1181-1288
- Ch 4: lines 1289-1373
- Ch 5: lines 1374-1472
- Ch 6: lines 1473-1585
- Ch 7: lines 1586-1669
- Ch 8: lines 1670-1772
- Ch 9: lines 1773-1861
- Ch 10: lines 1862-1992
- Ch 11: lines 1993-2089
- Ch 12: lines 2090-2205
- Ch 13: lines 2206-2282
- Ch 14: lines 2283-2391
- Ch 15: lines 2392-2512
- Ch 16: lines 2513-2636
- Ch 17: lines 2637-2750

**Step 2: Create src/chapters/index.js**

```js
import ch01 from './ch01-staff-and-clefs.js';
import ch02 from './ch02-notes-on-staff.js';
import ch03 from './ch03-rhythm-basics.js';
import ch04 from './ch04-time-signatures.js';
import ch05 from './ch05-rests-and-note-values.js';
import ch06 from './ch06-grand-staff.js';
import ch07 from './ch07-accidentals.js';
import ch08 from './ch08-interval-basics.js';
import ch09 from './ch09-scales.js';
import ch10 from './ch10-key-signatures.js';
import ch11 from './ch11-chords.js';
import ch12 from './ch12-dynamics-and-articulation.js';
import ch13 from './ch13-tempo-and-expression.js';
import ch14 from './ch14-repeat-signs.js';
import ch15 from './ch15-intervals-in-depth.js';
import ch16 from './ch16-circle-of-fifths.js';
import ch17 from './ch17-seventh-chords.js';

export const NOTATION_CHAPTERS = [ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11, ch12, ch13, ch14, ch15, ch16, ch17];
```

**Step 3: Update src/main.js to import chapters**

Add:
```js
import { NOTATION_CHAPTERS } from './chapters/index.js';
console.log("Chapters loaded:", NOTATION_CHAPTERS.length);
```

**Step 4: Build and verify**

Run: `npm run build`
Expected: Build succeeds, console shows "Chapters loaded: 17". Check that the `Vex.Flow` references in render functions are preserved in the bundled output.

**Step 5: Commit**

```bash
git add src/chapters/
git commit -m "Extract 17 notation chapters into separate modules"
```

---

## Task 4: Extract Audio Module

**Files:**
- Create: `src/app/audio.js`
- Modify: `src/main.js` — import audio functions

**Step 1: Create src/app/audio.js**

Extract these functions and the sampler initialization (note line numbers from current `index.html`):

- `NOTE_ORDER` array (line 2798)
- `noteToMidi` (lines 2800-2806)
- `midiToNote` (lines 2808-2812)
- `SAMPLE_BASE_URL` and `piano` sampler (lines 2914-2928)
- `pianoLoaded` handling (lines 2930-2932)
- `playNote` (lines 2934-2937)
- `playNoteStr` (lines 2939-2942)
- `parseNote` (lines 2947-2956)
- `getClefForNote` (lines 2958-2963)
- `levelHasBothClefs` (lines 2965-2976)
- `getKeyboardRange` (lines 3741-3755)

```js
import state from '../data/state.js';
import { DIFFICULTY_LEVELS } from '../data/levels.js';
import { INTERVAL_LEVELS } from '../data/intervals.js';
import { KEYSIG_LEVELS } from '../data/keysigs.js';
import { COF_LEVELS } from '../data/cof.js';

const NOTE_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function noteToMidi(noteStr) { /* ... */ }
export function midiToNote(midi) { /* ... */ }

const SAMPLE_BASE_URL = "https://tonejs.github.io/audio/salamander/";
export const piano = new Tone.Sampler({ /* ... */ }).toDestination();
piano.on("load", () => { state.pianoLoaded = true; });

export function playNote(name, octave) { /* ... */ }
export function playNoteStr(noteStr) { /* ... */ }
export function parseNote(noteStr) { /* ... */ }
export function getClefForNote(noteStr) { /* ... */ }
export function levelHasBothClefs() { /* ... */ }
export function getKeyboardRange() { /* ... */ }
```

`levelHasBothClefs` and `getKeyboardRange` reference `getLevelsForMode` and `getActiveNotes` which will be in `progress.js`. These need to be imported. For now, these functions can accept the needed data as parameters, or we handle circular imports by having `progress.js` not import from `audio.js`.

**Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds. No errors about undefined `Tone` (it's external).

**Step 3: Commit**

```bash
git add src/app/audio.js
git commit -m "Extract audio module"
```

---

## Task 5: Extract Progress Module

**Files:**
- Create: `src/app/progress.js`
- Modify: `src/main.js` — import progress functions

**Step 1: Create src/app/progress.js**

Extract these functions:

- `createDefaultProgress` (lines 2824-2839)
- `modeProgress` object (lines 2841-2848)
- `getCurrentProgress` (lines 2850-2852)
- `saveProgress` (lines 2854-2863)
- `loadProgress` (lines 2865-2903)
- `resetProgress` (lines 2905-2909)
- `getNotationProgress` (lines 2753-2762)
- `createDefaultNotationProgress` (lines 2764-2779)
- `getNotationCurrentChapter` (lines 2781-2786)
- `saveNotationProgress` (lines 2788-2796)
- `getLevelsForMode` (function that returns appropriate levels array for current mode)
- `getLevelItems` (function that returns items for current level)
- `getActiveNotes` (function that returns notes/items active at current level)
- `updateSpacedRepetition` (lines 3007-3029)
- `calculateQuality` (lines 3031-3037)
- `recordAttempt` (lines 3161-3201) — note: this calls UI functions like `showFeedback`, so it may need those passed in or imported
- `checkLevelUp` (lines 3202-3232) — calls `showLevelComplete`, UI function
- `resetLevelStats` (lines 3234-3246)

```js
import state from '../data/state.js';
import { STORAGE_KEY } from '../data/constants.js';
import { DIFFICULTY_LEVELS, ALL_NOTES } from '../data/levels.js';
import { INTERVAL_LEVELS, ALL_INTERVALS } from '../data/intervals.js';
import { KEYSIG_LEVELS, ALL_KEYSIGS } from '../data/keysigs.js';
import { COF_LEVELS, ALL_COF_ITEMS } from '../data/cof.js';
import { NOTATION_CHAPTERS } from '../chapters/index.js';

export function createDefaultProgress(items) { /* ... */ }
export const modeProgress = { /* ... */ };
export function getCurrentProgress() { return modeProgress[state.quizMode]; }
// ... etc
```

**Circular dependency note:** `recordAttempt` and `checkLevelUp` call UI functions (`showFeedback`, `showLevelComplete`, `updateStreakDisplay`, etc.). To avoid circular imports between progress.js and ui.js, these functions can accept callback parameters or we can use a late-binding pattern (import at call time). The simplest approach: have `recordAttempt` and `checkLevelUp` accept the UI callbacks as parameters, and wire them up in `main.js`.

**Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/app/progress.js
git commit -m "Extract progress and spaced repetition module"
```

---

## Task 6: Extract UI Module

**Files:**
- Create: `src/app/ui.js`
- Modify: `src/main.js` — import UI functions

**Step 1: Create src/app/ui.js**

Extract these functions:

- `showMainMenu` (lines 3954-3966)
- `showQuizScreen` (lines 3968-3999)
- `showWaitingState` (lines 4001-4008)
- `showFeedback` (lines 3757-3761)
- `showLevelComplete` (lines 3248-3263)
- `updateStreakDisplay` (lines 3042-3046)
- `updateLevelDisplay` (lines 3048-3057)
- `updateLevelProgress` (lines 3063-3096)
- `updateStatsDisplay` (lines 3115-3156)
- `updateMenuStats` (lines 3925-3952)
- `populateLevelPicker` (lines 3098-3113)
- `rebuildKeyboard` (lines 3817-3920)
- `handleKeyClick` (lines 3763-3788)
- `addTouchHandlers` (lines 3791-3815)

```js
import state from '../data/state.js';
import { getCurrentProgress, modeProgress, getLevelsForMode, getActiveNotes, /* ... */ } from './progress.js';
import { playNote, playNoteStr, getClefForNote, getKeyboardRange } from './audio.js';
// ... etc
```

**Step 2: Build and verify**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/ui.js
git commit -m "Extract UI module"
```

---

## Task 7: Extract Quiz Module

**Files:**
- Create: `src/app/quiz.js`
- Modify: `src/main.js` — import quiz functions

**Step 1: Create src/app/quiz.js**

Extract these functions:

- `beginQuiz` (lines 4010-4014)
- `pickNextNote` (lines 3695-3732)
- `renderQuizNote` (lines 3270-3366)
- `generateInterval` (lines 3379-3419)
- `playCurrentInterval` (lines 3421-3425)
- `buildIntervalButtons` (lines 3427-3445)
- `handleIntervalClick` (lines 3447-3469)
- `generateKeySig` (lines 3479-3505)
- `buildKeySigButtons` (lines 3507-3525)
- `handleKeySigClick` (lines 3527-3549)
- `generateCofQuestion` (lines 3554-3645)
- `buildCofAnswerButtons` (lines 3650-3667)
- `handleCofClick` (lines 3668-3694)
- `replayCurrentNote` (lines 3368-3374)

```js
import state from '../data/state.js';
import { INTERVALS } from '../data/intervals.js';
import { KEY_SIGNATURES } from '../data/keysigs.js';
import { COF_DATA } from '../data/cof.js';
import { getCurrentProgress, recordAttempt, updateSpacedRepetition } from './progress.js';
import { playNote, playNoteStr, noteToMidi, midiToNote, getClefForNote, parseNote } from './audio.js';
import { showFeedback, updateStreakDisplay, updateStatsDisplay, rebuildKeyboard } from './ui.js';
```

**Step 2: Build and verify**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/quiz.js
git commit -m "Extract quiz module"
```

---

## Task 8: Extract Notation Mode Module

**Files:**
- Create: `src/app/notation-mode.js`
- Modify: `src/main.js` — import notation mode functions

**Step 1: Create src/app/notation-mode.js**

Extract these functions:

- `showNotationChapterList` (lines 4027-4036)
- `buildChapterList` (lines 4038-4066)
- `startChapter` (lines 4068-4076)
- `showNotationLesson` (lines 4078-4091)
- `renderLessonPage` (lines 4093-4117)
- `showNotationQuiz` (lines 4119-4145)
- `pickNextNQQuestion` (lines 4147-4172)
- `renderNQQuestion` (lines 4174-4208)
- `handleNQAnswer` (lines 4210-4281)
- `updateNQSpacedRepetition` (lines 4283-4302)
- `updateNQProgress` (lines 4304-4334)
- `updateNQStreak` (lines 4336-4340)
- `updateNQStatsDisplay` (lines 4342-4369)
- `checkNQChapterComplete` (lines 4371-4390)
- `showNQChapterComplete` (lines 4392-4408)

```js
import state from '../data/state.js';
import { NOTATION_CHAPTERS } from '../chapters/index.js';
import { getNotationProgress, saveNotationProgress, getNotationCurrentChapter } from './progress.js';
```

**Step 2: Build and verify**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/notation-mode.js
git commit -m "Extract notation mode module"
```

---

## Task 9: Wire Up main.js with Event Handlers

**Files:**
- Modify: `src/main.js` — full entry point with all imports and event handlers

**Step 1: Write the complete main.js**

This file imports everything and wires up all event handlers (currently lines 4410-4571 in `index.html`):

```js
// Imports
import state from './data/state.js';
import { STORAGE_KEY } from './data/constants.js';
import { DIFFICULTY_LEVELS, ALL_NOTES } from './data/levels.js';
import { INTERVALS, INTERVAL_LEVELS, ALL_INTERVALS } from './data/intervals.js';
import { KEY_SIGNATURES, KEYSIG_LEVELS, ALL_KEYSIGS } from './data/keysigs.js';
import { COF_DATA, COF_KEYS, COF_LEVELS, ALL_COF_ITEMS } from './data/cof.js';
import { NOTATION_CHAPTERS } from './chapters/index.js';
import { loadProgress, saveProgress, resetProgress, getCurrentProgress } from './app/progress.js';
import { showMainMenu, showQuizScreen, rebuildKeyboard, populateLevelPicker, updateLevelDisplay, updateStatsDisplay, buildIntervalButtons, buildKeySigButtons } from './app/ui.js';
import { beginQuiz, replayCurrentNote } from './app/quiz.js';
import { showNotationChapterList, startChapter, renderLessonPage, showNotationQuiz } from './app/notation-mode.js';
import { piano } from './app/audio.js';

// Initialize
loadProgress();
document.getElementById("show-labels").checked = state.showLabels;
showMainMenu();

// Event handlers (lines 4417-4571 from current index.html)
document.getElementById("card-visual").addEventListener("click", () => showQuizScreen("visual"));
// ... all other event handlers, same logic as current
```

**Step 2: Build and verify**

Run: `npm run build`
Expected: Full app works. Open in browser, test each mode briefly.

**Step 3: Commit**

```bash
git add src/main.js
git commit -m "Wire up main.js entry point with all event handlers"
```

---

## Task 10: Full Verification and Cleanup

**Step 1: Build the final output**

Run: `npm run build`

**Step 2: Diff the output against the original**

Save a copy of the pre-refactor `index.html` (from git) and compare the built output. The HTML structure, CSS, and functional behavior should be identical. The JS will be in IIFE format from esbuild, so it won't be a character-for-character match, but the logic should be the same.

**Step 3: Manual testing checklist**

Open `index.html` in a browser and verify:
- [ ] Main menu loads with all 7 mode cards
- [ ] Note Reading mode: start quiz, click correct key, see feedback
- [ ] Ear Training mode: start, hear note, click key
- [ ] Intervals mode: start, hear interval, click button
- [ ] Key Signatures mode: start, see key sig, click button
- [ ] Circle of Fifths mode: start, see question, click button
- [ ] Music Notation: open chapter list, read lesson pages (verify VexFlow renders), take quiz
- [ ] Level-up dialog works (continue, stay, reset)
- [ ] Progress persists across page reload (localStorage)
- [ ] Service worker registers (check DevTools > Application)
- [ ] Version number displays

**Step 4: Add generated-file comment**

Add a comment to the top of `src/index.html` template that results in this at the top of the built `index.html`:

```html
<!-- GENERATED FILE — do not edit. Source is in src/ directory. Run: npm run build -->
```

**Step 5: Bump version and commit**

Update `APP_VERSION` in `sw.js` to trigger cache refresh.

```bash
git add -A
git commit -m "Complete content extraction: modular src/ with esbuild build"
```

---

## Dependency Graph

```
main.js
├── data/state.js
├── data/constants.js
├── data/levels.js
├── data/intervals.js
├── data/keysigs.js
├── data/cof.js
├── chapters/index.js
│   ├── chapters/ch01-staff-and-clefs.js
│   ├── chapters/ch02-notes-on-staff.js
│   └── ... (17 chapter files)
├── app/audio.js
│   ├── data/state.js
│   └── data/levels.js (for getKeyboardRange)
├── app/progress.js
│   ├── data/state.js
│   ├── data/constants.js
│   ├── data/levels.js
│   ├── data/intervals.js
│   ├── data/keysigs.js
│   ├── data/cof.js
│   └── chapters/index.js
├── app/ui.js
│   ├── data/state.js
│   ├── app/progress.js
│   └── app/audio.js
├── app/quiz.js
│   ├── data/state.js
│   ├── data/*.js
│   ├── app/progress.js
│   ├── app/audio.js
│   └── app/ui.js
└── app/notation-mode.js
    ├── data/state.js
    ├── chapters/index.js
    └── app/progress.js
```

## Handling Circular Dependencies

The main risk is between `progress.js` and `ui.js`:
- `recordAttempt()` in progress.js calls `showFeedback()` from ui.js
- `checkLevelUp()` in progress.js calls `showLevelComplete()` from ui.js
- UI functions import from progress.js

**Resolution:** Move `recordAttempt` and `checkLevelUp` to `ui.js` (they're really UI orchestration functions that happen to update progress), OR have them accept callback functions that `main.js` wires up. The cleanest approach: keep them in `progress.js` but use dynamic `import()` for the UI calls, or simply accept that esbuild handles circular imports fine for IIFE bundles (it does — it hoists everything into one scope).

Since esbuild flattens all modules into a single IIFE scope, circular imports between our modules are a non-issue at runtime. The modules just need to be valid ES module syntax at the source level. esbuild will resolve the dependency order.

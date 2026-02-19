import state from '../data/state.js';
import { INTERVALS } from '../data/intervals.js';
import { KEY_SIGNATURES } from '../data/keysigs.js';
import { NOTATION_CHAPTERS } from '../chapters/index.js';
import { parseNote, getClefForNote, getKeyboardRange, playNote, playNoteStr, startNoteStr, stopNoteStr, midiToNote } from './audio.js';
import { getCurrentProgress, getLevelsForMode, getLevelItems, getActiveNotes, modeProgress, getNotationProgress, getNotationCurrentChapter, recordAttempt, saveProgress } from './progress.js';
import { pickNextNote, renderQuizNote, buildIntervalButtons, buildKeySigButtons } from './quiz.js';

export function showMainMenu() {
    updateMenuStats();
    state.isNotationQuizActive = false;
    document.getElementById("main-menu").classList.remove("hidden");
    document.getElementById("quiz-screen").classList.remove("active");
    document.getElementById("freeplay-screen").classList.remove("active");
    document.getElementById("level-complete").style.display = "none";
    document.getElementById("interval-buttons").style.display = "none";
    document.getElementById("keysig-buttons").style.display = "none";
    document.getElementById("circle-buttons").style.display = "none";
    document.getElementById("notation-chapters").classList.remove("active");
    document.getElementById("notation-lesson").classList.remove("active");
    document.getElementById("notation-quiz").classList.remove("active");
}

export function showQuizScreen(mode) {
    state.isNotationQuizActive = false;
    state.quizMode = mode;
    saveProgress();
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("quiz-screen").classList.add("active");
    document.getElementById("level-complete").style.display = "none";

    updateLevelDisplay();
    updateStreakDisplay();
    updateStatsDisplay();
    document.getElementById("delay-control").style.display = mode === "audio" ? "" : "none";

    document.getElementById("keyboard-container").style.display = "none";
    document.getElementById("interval-buttons").style.display = "none";
    document.getElementById("keysig-buttons").style.display = "none";
    document.getElementById("circle-buttons").style.display = "none";

    if (mode === "interval") {
        buildIntervalButtons();
    } else if (mode === "keysig") {
        buildKeySigButtons();
    } else if (mode === "circle") {
        document.getElementById("circle-buttons").style.display = "flex";
    } else {
        document.getElementById("keyboard-container").style.display = "flex";
        rebuildKeyboard();
    }

    showWaitingState();
}

export function showWaitingState() {
    const staffDiv = document.getElementById("staff");
    staffDiv.innerHTML = "";
    document.getElementById("start-btn").style.display = "inline-block";
    document.getElementById("replay-btn").style.display = "none";
    document.getElementById("feedback").textContent = "";
    document.getElementById("response-time").textContent = "";
}

export function showFeedback(isCorrect, itemStr) {
    const feedback = document.getElementById("feedback");
    feedback.textContent = isCorrect ? "Correct!" : `Wrong - that was ${itemStr}`;
    feedback.className = isCorrect ? "correct" : "wrong";
}

export function updateStreakDisplay() {
    const progress = getCurrentProgress();
    const streakDisplay = document.getElementById("streak-display");
    streakDisplay.textContent = `Streak: ${progress.currentStreak} | Best: ${progress.longestStreak}`;
}

export function updateLevelDisplay() {
    const progress = getCurrentProgress();
    const levels = getLevelsForMode(state.quizMode);
    const level = levels[progress.currentLevel];
    const levelDisplay = document.getElementById("level-display");
    const modeLabel = { visual: "Note Reading", audio: "Ear Training", reverse: "Note Finding", interval: "Intervals", keysig: "Key Signatures", circle: "Circle of Fifths" }[state.quizMode];
    levelDisplay.childNodes[0].textContent = `${modeLabel} - Level ${progress.currentLevel + 1}: ${level.name} `;
    populateLevelPicker();
    updateLevelProgress();
}

export function updateLevelProgress() {
    const progress = getCurrentProgress();
    const levels = getLevelsForMode(state.quizMode);
    const level = levels[progress.currentLevel];
    const items = getLevelItems(level);

    let totalCorrect = 0, totalAttempts = 0;
    let itemsReady = 0;
    for (const item of items) {
        const stat = progress.noteStats[item];
        if (!stat) continue;
        totalCorrect += stat.correct;
        totalAttempts += stat.total;
        if (stat.total >= level.minAttempts) itemsReady++;
    }

    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;
    const accuracyPct = Math.round(accuracy * 100);
    const thresholdPct = Math.round(level.threshold * 100);
    const allReady = itemsReady === items.length;

    const attemptProgress = itemsReady / items.length;
    const accuracyProgress = Math.min(1, accuracy / level.threshold);
    const overallProgress = Math.min(1, attemptProgress * 0.4 + accuracyProgress * 0.6);

    const fill = document.getElementById("level-progress-fill");
    fill.style.width = `${Math.round(overallProgress * 100)}%`;
    fill.style.background = accuracy >= level.threshold && allReady ? "#22aa55" :
        accuracy >= level.threshold ? "#cc8800" : "#4488cc";

    const text = document.getElementById("level-progress-text");
    text.textContent = `${accuracyPct}% accuracy (need ${thresholdPct}%) · ${itemsReady}/${items.length} notes practiced (need ${level.minAttempts} each)`;
}

export function updateStatsDisplay() {
    const grid = document.getElementById("stats-grid");
    grid.innerHTML = "";

    const progress = getCurrentProgress();
    const activeItems = getActiveNotes();

    let sortedActive;
    if (state.quizMode === "interval" || state.quizMode === "keysig") {
        sortedActive = [...activeItems];
    } else {
        sortedActive = [...activeItems].sort((a, b) => {
            const pa = parseNote(a), pb = parseNote(b);
            if (pa.octave !== pb.octave) return pa.octave - pb.octave;
            const order = "CDEFGAB";
            return order.indexOf(pa.name) - order.indexOf(pb.name);
        });
    }

    for (const item of sortedActive) {
        const stat = progress.noteStats[item];
        if (!stat) continue;
        const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;

        const div = document.createElement("div");
        div.className = "note-stat";

        if (accuracy !== null) {
            if (accuracy === 100) div.classList.add("perfect");
            else if (accuracy >= 80) div.classList.add("good");
            else if (accuracy >= 50) div.classList.add("struggling");
            else div.classList.add("bad");
        }

        const displayName = state.quizMode === "interval" ? INTERVALS[item].name : state.quizMode === "keysig" ? KEY_SIGNATURES[item].name : item;
        div.innerHTML = `
            <div class="note-name">${displayName}</div>
            <div class="note-accuracy">${accuracy !== null ? `${accuracy}%` : '-'}</div>
        `;
        grid.appendChild(div);
    }
}

export function updateMenuStats() {
    const modes = ["visual", "audio", "reverse", "interval", "keysig", "circle"];
    for (const mode of modes) {
        const progress = modeProgress[mode];
        const levels = getLevelsForMode(mode);
        const level = levels[progress.currentLevel];

        document.getElementById(`menu-${mode}-level`).textContent = `Level ${progress.currentLevel + 1}: ${level.name}`;

        let total = 0, correct = 0;
        Object.values(progress.noteStats).forEach(s => {
            total += s.total;
            correct += s.correct;
        });
        const acc = total > 0 ? Math.round((correct / total) * 100) : null;
        document.getElementById(`menu-${mode}-accuracy`).textContent = acc !== null
            ? `${acc}% accuracy (${total} attempts)`
            : "No attempts yet";
    }

    const notProg = getNotationProgress();
    const chapNum = getNotationCurrentChapter(notProg);
    document.getElementById("menu-notation-level").textContent = `Chapter ${chapNum} of ${NOTATION_CHAPTERS.length}`;
    const completedCount = Object.values(notProg.chapters).filter(c => c.quizPassed).length;
    document.getElementById("menu-notation-accuracy").textContent = completedCount > 0
        ? `${completedCount}/${NOTATION_CHAPTERS.length} chapters complete`
        : "Not started";
}

export function populateLevelPicker() {
    const progress = getCurrentProgress();
    const levels = getLevelsForMode(state.quizMode);
    const picker = document.getElementById("level-picker");
    picker.innerHTML = "";
    for (let i = 0; i < levels.length; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `Lv ${i + 1}: ${levels[i].name}`;
        opt.disabled = !state.allLevelsUnlocked && i > progress.currentLevel;
        picker.appendChild(opt);
    }
    picker.value = progress.currentLevel;
    const unlockBtn = document.getElementById("unlock-all-btn");
    unlockBtn.textContent = state.allLevelsUnlocked ? "[lock]" : "[unlock all]";
}

const NOTE_NAMES = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_KEY_MAP = { C: "C#", D: "D#", F: "F#", G: "G#", A: "A#" };
const HAS_BLACK_AFTER = new Set(["C", "D", "F", "G", "A"]);
const TOUCH_SCROLL_THRESHOLD = 10;

export function rebuildKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";

    if (state.quizMode === "interval") {
        document.getElementById("keyboard-container").style.display = "none";
        return;
    }
    document.getElementById("keyboard-container").style.display = "flex";

    const range = getKeyboardRange();
    const activeNotes = getActiveNotes();
    const hasAccidentals = activeNotes.some(n => n.includes("#"));
    const numOctaves = range.end - range.start + 1;

    const totalWhiteKeys = numOctaves * 7;
    const availableWidth = window.innerWidth - 20;
    const fittedKeyWidth = Math.floor(availableWidth / totalWhiteKeys);
    const keyWidth = Math.min(50, Math.max(40, fittedKeyWidth));
    keyboard.style.setProperty("--key-width", `${keyWidth}px`);
    const keyHeight = Math.min(160, Math.max(120, keyWidth * 3));
    keyboard.style.setProperty("--key-height", `${keyHeight}px`);

    for (let oct = range.start; oct <= range.end; oct++) {
        const octaveWrapper = document.createElement("div");
        octaveWrapper.style.position = "relative";
        octaveWrapper.style.display = "flex";

        if (numOctaves > 1) {
            const octaveLabel = document.createElement("span");
            octaveLabel.className = "octave-label";
            octaveLabel.textContent = `Octave ${oct}`;
            octaveWrapper.appendChild(octaveLabel);
        }

        for (const note of NOTE_NAMES) {
            const noteStr = `${note}${oct}`;
            const whiteKey = document.createElement("div");
            whiteKey.className = "key white";
            whiteKey.dataset.note = noteStr;

            const label = document.createElement("span");
            label.className = "key-label";
            label.textContent = noteStr;
            whiteKey.appendChild(label);

            const handleWhiteKeyDown = () => {
                whiteKey.classList.add("active");
                handleKeyClick(noteStr, whiteKey);
            };
            const handleWhiteKeyUp = () => whiteKey.classList.remove("active");

            whiteKey.addEventListener("mousedown", handleWhiteKeyDown);
            whiteKey.addEventListener("mouseup", handleWhiteKeyUp);
            whiteKey.addEventListener("mouseleave", handleWhiteKeyUp);
            addTouchHandlers(whiteKey, handleWhiteKeyDown, handleWhiteKeyUp);

            octaveWrapper.appendChild(whiteKey);

            if (HAS_BLACK_AFTER.has(note)) {
                const blackNoteStr = `${BLACK_KEY_MAP[note]}${oct}`;
                const blackKey = document.createElement("div");
                blackKey.className = "key black";
                blackKey.dataset.note = blackNoteStr;

                const bLabel = document.createElement("span");
                bLabel.className = "key-label";
                bLabel.textContent = blackNoteStr;
                blackKey.appendChild(bLabel);

                const handleBlackKeyDown = () => {
                    blackKey.classList.add("active");
                    if (hasAccidentals && activeNotes.includes(blackNoteStr)) {
                        handleKeyClick(blackNoteStr, blackKey);
                    } else {
                        blackKey.classList.add("wrong");
                        setTimeout(() => blackKey.classList.remove("wrong"), 200);
                    }
                };
                const handleBlackKeyUp = () => blackKey.classList.remove("active");

                blackKey.addEventListener("mousedown", handleBlackKeyDown);
                blackKey.addEventListener("mouseup", handleBlackKeyUp);
                blackKey.addEventListener("mouseleave", handleBlackKeyUp);
                addTouchHandlers(blackKey, handleBlackKeyDown, handleBlackKeyUp);

                octaveWrapper.appendChild(blackKey);
            }
        }

        keyboard.appendChild(octaveWrapper);

        if (oct < range.end) {
            const separator = document.createElement("div");
            separator.className = "octave-marker";
            keyboard.appendChild(separator);
        }
    }

    keyboard.classList.toggle("labels-hidden", !state.showLabels);

    const container = document.getElementById("keyboard-container");
    container.scrollLeft = (keyboard.scrollWidth - container.clientWidth) / 2;
}

export function handleKeyClick(noteStr, keyElement) {
    if (state.isProcessingClick) return;

    const responseTime = Date.now() - state.noteDisplayTime;
    const parsed = parseNote(noteStr);

    if (noteStr === state.currentNote) {
        state.isProcessingClick = true;
        recordAttempt(state.currentNote, true, responseTime);
        playNote(parsed.name + parsed.accidental, parsed.octave);
        keyElement.classList.add("correct");
        showFeedback(true, noteStr);
        const delay = state.quizMode === "audio" ? parseInt(document.getElementById("next-delay").value) : 400;
        setTimeout(() => {
            keyElement.classList.remove("correct");
            const nextNote = pickNextNote();
            renderQuizNote(nextNote);
            state.isProcessingClick = false;
        }, delay);
    } else {
        recordAttempt(state.currentNote, false, responseTime);
        keyElement.classList.add("wrong");
        showFeedback(false, state.currentNote);
        setTimeout(() => keyElement.classList.remove("wrong"), 200);
    }
}

export function addTouchHandlers(el, onDown, onUp) {
    let startX, startY, scrolled;
    el.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        scrolled = false;
    }, { passive: true });
    el.addEventListener("touchmove", (e) => {
        if (scrolled) return;
        const t = e.touches[0];
        if (Math.abs(t.clientX - startX) > TOUCH_SCROLL_THRESHOLD ||
            Math.abs(t.clientY - startY) > TOUCH_SCROLL_THRESHOLD) {
            scrolled = true;
            onUp();
        }
    }, { passive: true });
    el.addEventListener("touchend", (e) => {
        if (!scrolled) {
            e.preventDefault();
            onDown();
            setTimeout(onUp, 150);
        }
    }, { passive: false });
}

const { Factory } = Vex.Flow;

const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const WHITE_INDICES = new Set([0, 2, 4, 5, 7, 9, 11]);

let freePlayStartMidi = 48; // C3
let freePlayNoteTimes = false;
const FREEPLAY_MIN_START = 24;  // C1
const FREEPLAY_MAX_END = 108;   // C8 (top of standard piano)

export function showFreePlayScreen() {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("freeplay-screen").classList.add("active");
    freePlayStartMidi = 48;
    freePlayNoteBuffer = [];
    renderEmptyGrandStaff();
    buildFreePlayKeyboard();
}

function getFreePlayNoteCount() {
    return (window.innerWidth - 20) >= 840 ? 36 : 24;
}

export function shiftFreePlayOctave(delta) {
    const noteIdx = freePlayStartMidi % 12;
    // C(0) → F(5) is +5, F(5) → C(0) is +7; reverse for down
    let shift;
    if (delta > 0) {
        shift = noteIdx === 0 ? 5 : 7;
    } else {
        shift = noteIdx === 0 ? -7 : -5;
    }
    const next = freePlayStartMidi + shift;
    const maxStart = FREEPLAY_MAX_END - getFreePlayNoteCount() + 1;
    if (next < FREEPLAY_MIN_START || next > maxStart) return;
    freePlayStartMidi = next;
    buildFreePlayKeyboard();
}

let freePlayNoteBuffer = [];
const BEAT_VALUES = { w: 4, h: 2, q: 1, "8": 0.5, "16": 0.25 };
const MAX_BEATS = 8; // 2 measures of 4/4

export function toggleFreePlayNoteTimes(enabled) {
    freePlayNoteTimes = enabled;
}

function durationToNoteValue(ms) {
    if (ms >= 1400) return "w";
    if (ms >= 700) return "h";
    if (ms >= 350) return "q";
    if (ms >= 175) return "8";
    return "16";
}

function addFreePlayNote(noteStr, duration) {
    const dur = duration || "w";
    const beats = BEAT_VALUES[dur] || 4;
    const currentBeats = freePlayNoteBuffer.reduce((sum, n) => sum + n.beats, 0);
    if (currentBeats + beats > MAX_BEATS) {
        freePlayNoteBuffer = [];
    }
    freePlayNoteBuffer.push({ noteStr, dur, clef: getClefForNote(noteStr), beats });
    renderFreePlayStaff();
}

function addFreePlayTouchHandlers(el, noteStr, handleDown, handleUp) {
    let startX, startY, scrolled;
    el.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        scrolled = false;
        if (freePlayNoteTimes) {
            handleDown();
        }
    }, { passive: true });
    el.addEventListener("touchmove", (e) => {
        if (scrolled) return;
        const t = e.touches[0];
        if (Math.abs(t.clientX - startX) > TOUCH_SCROLL_THRESHOLD ||
            Math.abs(t.clientY - startY) > TOUCH_SCROLL_THRESHOLD) {
            scrolled = true;
            handleUp();
        }
    }, { passive: true });
    el.addEventListener("touchend", (e) => {
        if (scrolled) return;
        e.preventDefault();
        if (freePlayNoteTimes) {
            handleUp();
        } else {
            handleDown();
            setTimeout(handleUp, 150);
        }
    }, { passive: false });
}

function buildFreePlayKeyboard() {
    const keyboard = document.getElementById("freeplay-keyboard");
    keyboard.innerHTML = "";

    const startMidi = freePlayStartMidi;
    const noteCount = getFreePlayNoteCount();
    const endMidi = startMidi + noteCount - 1;

    // Build note list
    const notes = [];
    for (let midi = startMidi; midi <= endMidi; midi++) {
        const octave = Math.floor(midi / 12) - 1;
        const chrIdx = midi % 12;
        const name = CHROMATIC[chrIdx];
        notes.push({ name, octave, noteStr: `${name}${octave}`, isWhite: WHITE_INDICES.has(chrIdx) });
    }

    // Group by octave
    const groups = [];
    let cur = null;
    for (const note of notes) {
        if (!cur || note.octave !== cur.octave) {
            cur = { octave: note.octave, notes: [] };
            groups.push(cur);
        }
        cur.notes.push(note);
    }

    // Sizing — on narrow screens, size keys to fit the widest group (one row)
    const whiteCount = notes.filter(n => n.isWhite).length;
    const availableWidth = window.innerWidth - 20;
    const narrow = availableWidth < whiteCount * 40;
    const maxGroupWhites = Math.max(...groups.map(g => g.notes.filter(n => n.isWhite).length));
    const sizingWhites = narrow ? maxGroupWhites : whiteCount;
    const keyWidth = Math.min(60, Math.max(30, availableWidth / sizingWhites - 2));
    keyboard.style.setProperty("--key-width", `${keyWidth}px`);
    const keyHeight = Math.min(160, Math.max(120, keyWidth * 3));
    keyboard.style.setProperty("--key-height", `${keyHeight}px`);
    keyboard.classList.toggle("freeplay-narrow", narrow);

    for (let g = 0; g < groups.length; g++) {
        const group = groups[g];
        const wrapper = document.createElement("div");
        wrapper.className = "octave-group";
        wrapper.style.position = "relative";
        wrapper.style.display = "flex";

        if (groups.length > 1) {
            const label = document.createElement("span");
            label.className = "octave-label";
            label.textContent = `Octave ${group.octave}`;
            wrapper.appendChild(label);
        }

        for (const note of group.notes) {
            const key = document.createElement("div");
            key.className = note.isWhite ? "key white" : "key black";
            key.dataset.note = note.noteStr;

            const lbl = document.createElement("span");
            lbl.className = "key-label";
            lbl.textContent = note.noteStr;
            key.appendChild(lbl);

            const handleDown = () => {
                key.classList.add("active");
                if (freePlayNoteTimes) {
                    startNoteStr(note.noteStr);
                    key._noteStart = Date.now();
                } else {
                    playNoteStr(note.noteStr);
                    addFreePlayNote(note.noteStr);
                }
            };
            const handleUp = () => {
                key.classList.remove("active");
                if (key._noteStart) {
                    stopNoteStr(note.noteStr);
                    const ms = Date.now() - key._noteStart;
                    key._noteStart = null;
                    addFreePlayNote(note.noteStr, durationToNoteValue(ms));
                }
            };

            key.addEventListener("mousedown", handleDown);
            key.addEventListener("mouseup", handleUp);
            key.addEventListener("mouseleave", handleUp);
            addFreePlayTouchHandlers(key, note.noteStr, handleDown, handleUp);

            wrapper.appendChild(key);
        }

        keyboard.appendChild(wrapper);

        if (g < groups.length - 1) {
            const sep = document.createElement("div");
            sep.className = "octave-marker";
            keyboard.appendChild(sep);
        }
    }

    keyboard.classList.toggle("labels-hidden", !state.showLabels);

    // Update arrow states and label
    const noteIdx = startMidi % 12;
    const upShift = noteIdx === 0 ? 5 : 7;
    const downShift = noteIdx === 0 ? 7 : 5;
    const maxStart = FREEPLAY_MAX_END - noteCount + 1;
    document.getElementById("freeplay-octave-down").disabled = startMidi - downShift < FREEPLAY_MIN_START;
    document.getElementById("freeplay-octave-up").disabled = startMidi + upShift > maxStart;
    document.getElementById("freeplay-octave-label").textContent = `${midiToNote(startMidi)} – ${midiToNote(endMidi)}`;

    const container = document.getElementById("freeplay-keyboard-container");
    container.scrollLeft = (keyboard.scrollWidth - container.clientWidth) / 2;
}

function renderEmptyGrandStaff() {
    const staffDiv = document.getElementById("freeplay-staff");
    staffDiv.innerHTML = "";
    try {
        const containerWidth = Math.min(window.innerWidth * 0.9, 400);
        const staffWidth = Math.max(containerWidth - 40, 140);
        const staffHeight = Math.min(250, Math.max(window.innerHeight * 0.28, 180));
        const factory = new Factory({
            renderer: { elementId: "freeplay-staff", width: containerWidth, height: staffHeight },
        });
        const score = factory.EasyScore();
        const system = factory.System({ x: 0, y: 0, width: staffWidth });
        const trebleVoice = score.voice(score.notes("B4/w/r", { clef: "treble" }));
        const bassVoice = score.voice(score.notes("D3/w/r", { clef: "bass" }));
        system.addStave({ voices: [trebleVoice] }).addClef("treble");
        system.addStave({ voices: [bassVoice] }).addClef("bass");
        system.addConnector("brace");
        system.addConnector("singleLeft");
        factory.draw();
    } catch (error) {
        console.error("Error rendering empty grand staff:", error);
    }
}

function generateRestPadding(beats, restNote) {
    const rests = [];
    let remaining = Math.round(beats * 100) / 100;
    for (const [dur, val] of [["w", 4], ["h", 2], ["q", 1], ["8", 0.5], ["16", 0.25]]) {
        while (remaining >= val - 0.001) {
            rests.push(`${restNote}/${dur}/r`);
            remaining = Math.round((remaining - val) * 100) / 100;
        }
    }
    return rests;
}

function renderFreePlayStaff() {
    const staffDiv = document.getElementById("freeplay-staff");
    staffDiv.innerHTML = "";

    if (freePlayNoteBuffer.length === 0) {
        renderEmptyGrandStaff();
        return;
    }

    try {
        const totalBeats = freePlayNoteBuffer.reduce((sum, n) => sum + n.beats, 0);
        const targetBeats = totalBeats <= 4 ? 4 : 8;
        const remainingBeats = Math.round((targetBeats - totalBeats) * 100) / 100;

        // Build note strings for each voice
        const trebleParts = [];
        const bassParts = [];

        for (const note of freePlayNoteBuffer) {
            const parsed = parseNote(note.noteStr);
            const vexNote = `${parsed.name}${parsed.accidental}${parsed.octave}/${note.dur}`;
            if (note.clef === "treble") {
                trebleParts.push(vexNote);
                bassParts.push(`D3/${note.dur}/r`);
            } else {
                trebleParts.push(`B4/${note.dur}/r`);
                bassParts.push(vexNote);
            }
        }

        // Pad remaining beats with rests
        if (remainingBeats > 0) {
            trebleParts.push(...generateRestPadding(remainingBeats, "B4"));
            bassParts.push(...generateRestPadding(remainingBeats, "D3"));
        }

        // Scale staff width for 2 measures
        const baseWidth = Math.min(window.innerWidth * 0.9, 400);
        const containerWidth = targetBeats <= 4 ? baseWidth : Math.min(baseWidth * 1.6, window.innerWidth * 0.95);
        const staffWidth = Math.max(containerWidth - 40, 140);
        const staffHeight = Math.min(250, Math.max(window.innerHeight * 0.28, 180));
        const timeStr = targetBeats <= 4 ? "4/4" : "8/4";

        const factory = new Factory({
            renderer: { elementId: "freeplay-staff", width: containerWidth, height: staffHeight },
        });
        const score = factory.EasyScore();
        const system = factory.System({ x: 0, y: 0, width: staffWidth });

        const trebleVoice = score.voice(score.notes(trebleParts.join(", "), { clef: "treble" }), { time: timeStr });
        const bassVoice = score.voice(score.notes(bassParts.join(", "), { clef: "bass" }), { time: timeStr });
        system.addStave({ voices: [trebleVoice] }).addClef("treble");
        system.addStave({ voices: [bassVoice] }).addClef("bass");
        system.addConnector("brace");
        system.addConnector("singleLeft");

        factory.draw();
    } catch (error) {
        console.error("Error rendering free play staff:", error);
    }
}

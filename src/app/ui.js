import state from '../data/state.js';
import { INTERVALS } from '../data/intervals.js';
import { KEY_SIGNATURES } from '../data/keysigs.js';
import { NOTATION_CHAPTERS } from '../chapters/index.js';
import { parseNote, getClefForNote, getKeyboardRange, playNote } from './audio.js';
import { getCurrentProgress, getLevelsForMode, getLevelItems, getActiveNotes, modeProgress, getNotationProgress, getNotationCurrentChapter, recordAttempt, saveProgress } from './progress.js';
import { pickNextNote, renderQuizNote, buildIntervalButtons, buildKeySigButtons } from './quiz.js';

export function showMainMenu() {
    updateMenuStats();
    state.isNotationQuizActive = false;
    document.getElementById("main-menu").classList.remove("hidden");
    document.getElementById("quiz-screen").classList.remove("active");
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

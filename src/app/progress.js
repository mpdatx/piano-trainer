import state from '../data/state.js';
import { STORAGE_KEY } from '../data/constants.js';
import { DIFFICULTY_LEVELS, ALL_NOTES } from '../data/levels.js';
import { INTERVALS, INTERVAL_LEVELS, ALL_INTERVALS } from '../data/intervals.js';
import { KEY_SIGNATURES, KEYSIG_LEVELS, ALL_KEYSIGS } from '../data/keysigs.js';
import { COF_LEVELS, ALL_COF_ITEMS } from '../data/cof.js';
import { NOTATION_CHAPTERS } from '../chapters/index.js';
import { showFeedback, updateStreakDisplay, updateLevelProgress, updateLevelDisplay, updateStatsDisplay, rebuildKeyboard } from './ui.js';
import { buildIntervalButtons, buildKeySigButtons } from './quiz.js';

// Notation progress
export function getNotationProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.notationProgress) return data.notationProgress;
        } catch (e) {}
    }
    return createDefaultNotationProgress();
}

export function createDefaultNotationProgress() {
    const chapters = {};
    for (const ch of NOTATION_CHAPTERS) {
        chapters[ch.id] = {
            lessonComplete: false,
            lessonPage: 0,
            quizPassed: false,
            quizStats: {},
            quizMemory: {},
            roundNumber: 0,
            currentStreak: 0,
            longestStreak: 0,
        };
    }
    return { chapters };
}

export function getNotationCurrentChapter(progress) {
    for (const ch of NOTATION_CHAPTERS) {
        if (!progress.chapters[ch.id] || !progress.chapters[ch.id].quizPassed) return ch.id;
    }
    return NOTATION_CHAPTERS.length;
}

export function saveNotationProgress(progress) {
    const saved = localStorage.getItem(STORAGE_KEY);
    let data = {};
    if (saved) {
        try { data = JSON.parse(saved); } catch (e) {}
    }
    data.notationProgress = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Per-mode progress
export function createDefaultProgress(allItems) {
    const stats = {};
    const memory = {};
    allItems.forEach(item => {
        stats[item] = { correct: 0, total: 0 };
        memory[item] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
    });
    return {
        currentLevel: 0,
        noteStats: stats,
        noteMemory: memory,
        currentStreak: 0,
        longestStreak: 0,
        roundNumber: 0,
    };
}

export const modeProgress = {
    visual: createDefaultProgress(ALL_NOTES),
    audio: createDefaultProgress(ALL_NOTES),
    reverse: createDefaultProgress(ALL_NOTES),
    interval: createDefaultProgress(ALL_INTERVALS),
    keysig: createDefaultProgress(ALL_KEYSIGS),
    circle: createDefaultProgress(ALL_COF_ITEMS),
};

export function getCurrentProgress() {
    return modeProgress[state.quizMode];
}

export function saveProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    let data = {};
    if (saved) {
        try { data = JSON.parse(saved); } catch (e) {}
    }
    data.modeProgress = modeProgress;
    data.showLabels = state.showLabels;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        if (data.modeProgress) {
            for (const mode of ["visual", "audio", "reverse", "interval", "keysig", "circle"]) {
                if (data.modeProgress[mode]) {
                    Object.assign(modeProgress[mode], data.modeProgress[mode]);
                    const allItems = mode === "interval" ? ALL_INTERVALS : mode === "keysig" ? ALL_KEYSIGS : mode === "circle" ? ALL_COF_ITEMS : ALL_NOTES;
                    allItems.forEach(item => {
                        if (!modeProgress[mode].noteStats[item]) {
                            modeProgress[mode].noteStats[item] = { correct: 0, total: 0 };
                        }
                        if (!modeProgress[mode].noteMemory[item]) {
                            modeProgress[mode].noteMemory[item] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
                        }
                    });
                }
            }
        } else if (data.currentLevel !== undefined) {
            modeProgress.visual.currentLevel = data.currentLevel || 0;
            if (data.noteStats) Object.assign(modeProgress.visual.noteStats, data.noteStats);
            if (data.noteMemory) Object.assign(modeProgress.visual.noteMemory, data.noteMemory);
            modeProgress.visual.currentStreak = data.currentStreak || 0;
            modeProgress.visual.longestStreak = data.longestStreak || 0;
            modeProgress.visual.roundNumber = data.roundNumber || 0;
        }

        state.showLabels = data.showLabels !== false;
    } catch (e) {
        console.error("Failed to load progress:", e);
    }
}

export function resetProgress() {
    if (!confirm("Reset all progress? This will clear your level, stats, and streaks for all modes.")) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}

export function getLevelsForMode(mode) {
    if (mode === "interval") return INTERVAL_LEVELS;
    if (mode === "keysig") return KEYSIG_LEVELS;
    if (mode === "circle") return COF_LEVELS;
    return DIFFICULTY_LEVELS;
}

export function getLevelItems(level) {
    return state.quizMode === "interval" ? level.intervals : state.quizMode === "keysig" ? level.keys : state.quizMode === "circle" ? level.items : level.notes;
}

export function getActiveNotes() {
    const progress = getCurrentProgress();
    if (state.quizMode === "interval") {
        return INTERVAL_LEVELS[progress.currentLevel].intervals;
    }
    if (state.quizMode === "keysig") {
        return KEYSIG_LEVELS[progress.currentLevel].keys;
    }
    if (state.quizMode === "circle") {
        return COF_LEVELS[progress.currentLevel].items;
    }
    return DIFFICULTY_LEVELS[progress.currentLevel].notes;
}

// Spaced repetition
export function updateSpacedRepetition(itemStr, quality) {
    const progress = getCurrentProgress();
    if (!progress.noteMemory[itemStr]) {
        progress.noteMemory[itemStr] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
    }
    const mem = progress.noteMemory[itemStr];

    if (quality >= 3) {
        if (mem.repetitions === 0) mem.interval = 1;
        else if (mem.repetitions === 1) mem.interval = 3;
        else mem.interval = Math.round(mem.interval * mem.easiness);
        mem.repetitions++;
    } else {
        mem.repetitions = 0;
        mem.interval = 1;
    }

    mem.easiness = Math.max(1.3,
        mem.easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    mem.lastSeen = progress.roundNumber;
    mem.priority = Math.max(0.1, 1 / mem.easiness);
}

export function calculateQuality(responseTimeMs, isCorrect, wasFirstAttempt) {
    if (!isCorrect) return 0;
    if (!wasFirstAttempt) return 2;
    if (responseTimeMs < 1500) return 5;
    if (responseTimeMs < 3000) return 4;
    return 3;
}

export function recordAttempt(itemStr, wasCorrect, responseTimeMs) {
    const progress = getCurrentProgress();
    const wasFirstAttempt = state.firstAttempt;

    if (state.firstAttempt) {
        if (!progress.noteStats[itemStr]) progress.noteStats[itemStr] = { correct: 0, total: 0 };
        progress.noteStats[itemStr].total++;
        if (wasCorrect) progress.noteStats[itemStr].correct++;

        if (wasCorrect) {
            progress.currentStreak++;
            progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
        } else {
            progress.currentStreak = 0;
        }
        updateStreakDisplay();
    }

    if (wasCorrect) {
        const quality = calculateQuality(responseTimeMs, true, wasFirstAttempt);
        updateSpacedRepetition(itemStr, quality);

        const rtDisplay = document.getElementById("response-time");
        const timeStr = (responseTimeMs / 1000).toFixed(1);
        const speedLabel = responseTimeMs < 1500 ? "Fast!" : responseTimeMs < 3000 ? "Good" : "Keep practicing";
        rtDisplay.textContent = `${timeStr}s - ${speedLabel}`;
    } else if (state.firstAttempt) {
        updateSpacedRepetition(itemStr, 0);
        document.getElementById("response-time").textContent = "";
    }

    state.firstAttempt = false;
    updateStatsDisplay();
    updateLevelProgress();
    checkLevelUp();
    saveProgress();
}

export function checkLevelUp() {
    const progress = getCurrentProgress();
    const levels = getLevelsForMode(state.quizMode);
    if (progress.currentLevel >= levels.length - 1) return false;

    const level = levels[progress.currentLevel];
    const items = getLevelItems(level);
    let totalCorrect = 0, totalAttempts = 0;
    let allHaveMinAttempts = true;

    for (const item of items) {
        const stat = progress.noteStats[item];
        if (!stat) continue;
        totalCorrect += stat.correct;
        totalAttempts += stat.total;
        if (stat.total < level.minAttempts) allHaveMinAttempts = false;
    }

    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

    if (accuracy >= level.threshold && allHaveMinAttempts) {
        progress.currentLevel++;
        updateLevelDisplay();
        if (state.quizMode === "interval") buildIntervalButtons();
        else if (state.quizMode === "keysig") buildKeySigButtons();
        else if (state.quizMode !== "circle") rebuildKeyboard();
        showLevelComplete();
        return true;
    }
    return false;
}

export function resetLevelStats(levelIndex) {
    const progress = getCurrentProgress();
    const levels = getLevelsForMode(state.quizMode);
    const level = levels[levelIndex];
    const items = getLevelItems(level);
    for (const item of items) {
        progress.noteStats[item] = { correct: 0, total: 0 };
        if (progress.noteMemory[item]) {
            progress.noteMemory[item] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
        }
    }
    saveProgress();
}

export function showLevelComplete() {
    const progress = getCurrentProgress();
    const levels = getLevelsForMode(state.quizMode);
    const isLastLevel = progress.currentLevel >= levels.length - 1;
    const nextLevel = levels[progress.currentLevel];
    document.getElementById("next-level-name").textContent = isLastLevel
        ? "You've completed all levels!"
        : `Next: ${nextLevel.name}`;
    document.getElementById("level-complete").style.display = "flex";
    document.getElementById("start-btn").style.display = "none";
    document.getElementById("replay-btn").style.display = "none";

    document.getElementById("continue-btn").style.display = isLastLevel ? "none" : "inline-block";
    document.getElementById("stay-btn").style.display = "inline-block";
    document.getElementById("reset-stay-btn").style.display = "inline-block";
}

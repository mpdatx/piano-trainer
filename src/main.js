import state from './data/state.js';
import { NOTATION_CHAPTERS } from './chapters/index.js';
import { loadProgress, saveProgress, resetProgress, getCurrentProgress, resetLevelStats, saveNotationProgress } from './app/progress.js';
import { showMainMenu, showQuizScreen, showWaitingState, updateLevelDisplay, updateStatsDisplay, rebuildKeyboard, showFreePlayScreen, shiftFreePlayOctave, toggleFreePlayNoteTimes } from './app/ui.js';
import { beginQuiz, replayCurrentNote, buildIntervalButtons, buildKeySigButtons, renderQuizNote, pickNextNote } from './app/quiz.js';
import { showNotationChapterList, startChapter, showNotationLesson, showNotationQuiz, renderLessonPage } from './app/notation-mode.js';
import { populateLevelPicker } from './app/ui.js';

// Initialize
loadProgress();
document.getElementById("show-labels").checked = state.showLabels;
showMainMenu();

// Event Handlers
document.getElementById("card-visual").addEventListener("click", () => showQuizScreen("visual"));
document.getElementById("card-audio").addEventListener("click", async () => {
    await Tone.start();
    showQuizScreen("audio");
});
document.getElementById("card-reverse").addEventListener("click", () => showQuizScreen("reverse"));
document.getElementById("card-interval").addEventListener("click", async () => {
    await Tone.start();
    showQuizScreen("interval");
});
document.getElementById("card-keysig").addEventListener("click", () => showQuizScreen("keysig"));
document.getElementById("card-circle").addEventListener("click", () => showQuizScreen("circle"));
document.getElementById("card-notation").addEventListener("click", () => showNotationChapterList());
document.getElementById("card-freeplay").addEventListener("click", async () => {
    await Tone.start();
    showFreePlayScreen();
});

document.getElementById("back-to-menu").addEventListener("click", () => showMainMenu());
document.getElementById("freeplay-back-menu").addEventListener("click", () => showMainMenu());
document.getElementById("freeplay-octave-down").addEventListener("click", () => shiftFreePlayOctave(-1));
document.getElementById("freeplay-octave-up").addEventListener("click", () => shiftFreePlayOctave(1));
document.getElementById("freeplay-note-times").addEventListener("change", (e) => toggleFreePlayNoteTimes(e.target.checked));
document.getElementById("notation-back-menu").addEventListener("click", () => showMainMenu());

document.getElementById("lesson-prev").addEventListener("click", () => {
    if (state.currentLessonPage > 0) {
        state.currentLessonPage--;
        const chapter = NOTATION_CHAPTERS.find(c => c.id === state.currentChapterId);
        renderLessonPage(chapter);
    }
});

document.getElementById("lesson-next").addEventListener("click", () => {
    const chapter = NOTATION_CHAPTERS.find(c => c.id === state.currentChapterId);
    if (state.currentLessonPage >= chapter.pages.length - 1) {
        state.notationProgress.chapters[chapter.id].lessonComplete = true;
        saveNotationProgress(state.notationProgress);
        showNotationQuiz(chapter.id);
    } else {
        state.currentLessonPage++;
        renderLessonPage(chapter);
    }
});

document.getElementById("lesson-back-chapters").addEventListener("click", () => showNotationChapterList());
document.getElementById("quiz-back-chapters").addEventListener("click", () => showNotationChapterList());

document.getElementById("start-btn").addEventListener("click", async () => {
    await Tone.start();
    beginQuiz();
});

document.getElementById("replay-btn").addEventListener("click", async () => {
    await Tone.start();
    replayCurrentNote();
});

document.getElementById("continue-btn").addEventListener("click", () => {
    document.getElementById("level-complete").style.display = "none";
    if (state.isNotationQuizActive) {
        const nextChapter = NOTATION_CHAPTERS.find(c => c.id === state.currentChapterId + 1);
        if (nextChapter) startChapter(nextChapter.id);
        return;
    }
    beginQuiz();
});

document.getElementById("stay-btn").addEventListener("click", () => {
    document.getElementById("level-complete").style.display = "none";
    if (state.isNotationQuizActive) {
        showNotationQuiz(state.currentChapterId);
        return;
    }
    const progress = getCurrentProgress();
    progress.currentLevel = Math.max(0, progress.currentLevel - 1);
    saveProgress();
    updateLevelDisplay();
    if (state.quizMode === "interval") buildIntervalButtons();
    else if (state.quizMode === "keysig") buildKeySigButtons();
    else rebuildKeyboard();
    beginQuiz();
});

document.getElementById("reset-stay-btn").addEventListener("click", () => {
    document.getElementById("level-complete").style.display = "none";
    if (state.isNotationQuizActive) {
        const cp = state.notationProgress.chapters[state.currentChapterId];
        cp.quizPassed = false;
        cp.quizStats = {};
        cp.quizMemory = {};
        cp.currentStreak = 0;
        cp.longestStreak = 0;
        cp.roundNumber = 0;
        const chapter = NOTATION_CHAPTERS.find(c => c.id === state.currentChapterId);
        for (const q of chapter.quizPool) {
            cp.quizStats[q.id] = { correct: 0, total: 0 };
            cp.quizMemory[q.id] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
        }
        saveNotationProgress(state.notationProgress);
        showNotationQuiz(state.currentChapterId);
        return;
    }
    const progress = getCurrentProgress();
    const targetLevel = Math.max(0, progress.currentLevel - 1);
    progress.currentLevel = targetLevel;
    resetLevelStats(targetLevel);
    updateLevelDisplay();
    updateStatsDisplay();
    if (state.quizMode === "interval") buildIntervalButtons();
    else if (state.quizMode === "keysig") buildKeySigButtons();
    else rebuildKeyboard();
    beginQuiz();
});

document.getElementById("menu-btn").addEventListener("click", () => {
    document.getElementById("level-complete").style.display = "none";
    showMainMenu();
});

document.getElementById("level-picker").addEventListener("change", (e) => {
    const progress = getCurrentProgress();
    progress.currentLevel = parseInt(e.target.value, 10);
    saveProgress();
    updateLevelDisplay();
    if (state.quizMode === "interval") buildIntervalButtons();
    else if (state.quizMode === "keysig") buildKeySigButtons();
    else rebuildKeyboard();
    showWaitingState();
    updateStatsDisplay();
});

document.getElementById("unlock-all-btn").addEventListener("click", (e) => {
    e.preventDefault();
    state.allLevelsUnlocked = !state.allLevelsUnlocked;
    populateLevelPicker();
});

document.getElementById("show-labels").addEventListener("change", (e) => {
    state.showLabels = e.target.checked;
    document.getElementById("keyboard").classList.toggle("labels-hidden", !state.showLabels);
    saveProgress();
});

document.getElementById("reset-btn").addEventListener("click", resetProgress);

// Register service worker for offline support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}

// Display app version
fetch('./sw.js')
    .then(r => r.text())
    .then(text => {
        const match = text.match(/APP_VERSION\s*=\s*['"](.+?)['"]/);
        if (match) document.getElementById('app-version').textContent = `v${match[1]}`;
    })
    .catch(() => {});

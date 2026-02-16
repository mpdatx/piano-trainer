import state from '../data/state.js';
import { NOTATION_CHAPTERS } from '../chapters/index.js';
import { getNotationProgress, getNotationCurrentChapter, saveNotationProgress, calculateQuality } from './progress.js';

export function showNotationChapterList() {
    state.notationProgress = getNotationProgress();
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("active");
    document.getElementById("notation-lesson").classList.remove("active");
    document.getElementById("notation-quiz").classList.remove("active");
    document.getElementById("notation-chapters").classList.add("active");
    state.isNotationQuizActive = false;
    buildChapterList();
}

export function buildChapterList() {
    const list = document.getElementById("chapter-list");
    list.innerHTML = "";
    const currentCh = getNotationCurrentChapter(state.notationProgress);

    for (const ch of NOTATION_CHAPTERS) {
        const chProg = state.notationProgress.chapters[ch.id];
        const isCompleted = chProg && chProg.quizPassed;
        const isCurrent = ch.id === currentCh;
        const isLocked = !state.allLevelsUnlocked && ch.id > currentCh;

        const item = document.createElement("div");
        item.className = "chapter-item" + (isCompleted ? " completed" : "") + (isCurrent ? " current" : "") + (isLocked ? " locked" : "");

        item.innerHTML = `
            <div class="chapter-num">${isCompleted ? "\u2713" : ch.id}</div>
            <div class="chapter-info">
                <h3>${ch.title}</h3>
                <p>${ch.subtitle}${chProg && chProg.lessonComplete ? " · Lesson complete" : ""}${isCompleted ? " · Quiz passed" : ""}</p>
            </div>
        `;

        if (!isLocked) {
            item.addEventListener("click", () => startChapter(ch.id));
        }

        list.appendChild(item);
    }
}

export function startChapter(chapterId) {
    state.currentChapterId = chapterId;
    const chProg = state.notationProgress.chapters[chapterId];
    if (chProg && chProg.lessonComplete) {
        showNotationLesson(chapterId, 0);
    } else {
        showNotationLesson(chapterId, chProg ? chProg.lessonPage : 0);
    }
}

export function showNotationLesson(chapterId, pageIndex) {
    state.currentChapterId = chapterId;
    const chapter = NOTATION_CHAPTERS.find(c => c.id === chapterId);
    if (!chapter) return;

    state.currentLessonPage = Math.min(pageIndex, chapter.pages.length - 1);

    document.getElementById("notation-chapters").classList.remove("active");
    document.getElementById("notation-quiz").classList.remove("active");
    document.getElementById("notation-lesson").classList.add("active");

    document.getElementById("lesson-title").textContent = chapter.title;
    renderLessonPage(chapter);
}

export function renderLessonPage(chapter) {
    const page = chapter.pages[state.currentLessonPage];
    const content = document.getElementById("lesson-content");
    content.innerHTML = page.content;

    if (page.render) {
        requestAnimationFrame(() => page.render(content));
    }

    document.getElementById("lesson-page-indicator").textContent =
        `Page ${state.currentLessonPage + 1} of ${chapter.pages.length}`;

    const prevBtn = document.getElementById("lesson-prev");
    const nextBtn = document.getElementById("lesson-next");
    prevBtn.style.display = state.currentLessonPage > 0 ? "inline-block" : "none";

    const isLastPage = state.currentLessonPage >= chapter.pages.length - 1;
    nextBtn.textContent = isLastPage ? "Start Quiz" : "Next";
    nextBtn.className = isLastPage ? "primary" : "";

    if (!state.notationProgress.chapters[chapter.id].lessonComplete) {
        state.notationProgress.chapters[chapter.id].lessonPage = state.currentLessonPage;
        saveNotationProgress(state.notationProgress);
    }
}

export function showNotationQuiz(chapterId) {
    state.currentChapterId = chapterId;
    const chapter = NOTATION_CHAPTERS.find(c => c.id === chapterId);
    if (!chapter) return;

    state.isNotationQuizActive = true;
    document.getElementById("notation-chapters").classList.remove("active");
    document.getElementById("notation-lesson").classList.remove("active");
    document.getElementById("notation-quiz").classList.add("active");

    document.getElementById("nq-title").textContent = `Quiz: ${chapter.title}`;

    const chProg = state.notationProgress.chapters[chapterId];
    if (!chProg.quizStats || Object.keys(chProg.quizStats).length === 0) {
        chProg.quizStats = {};
        chProg.quizMemory = {};
        for (const q of chapter.quizPool) {
            chProg.quizStats[q.id] = { correct: 0, total: 0 };
            chProg.quizMemory[q.id] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
        }
    }

    updateNQStatsDisplay();
    updateNQProgress();
    updateNQStreak();
    pickNextNQQuestion();
}

export function pickNextNQQuestion() {
    const chapter = NOTATION_CHAPTERS.find(c => c.id === state.currentChapterId);
    const chProg = state.notationProgress.chapters[state.currentChapterId];
    chProg.roundNumber = (chProg.roundNumber || 0) + 1;

    const candidates = chapter.quizPool
        .filter(q => !state.currentQuizQuestion || q.id !== state.currentQuizQuestion.id)
        .map(q => {
            if (!chProg.quizMemory[q.id]) {
                chProg.quizMemory[q.id] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
            }
            const mem = chProg.quizMemory[q.id];
            const roundsSince = chProg.roundNumber - mem.lastSeen;
            const isDue = roundsSince >= mem.interval;
            let score = mem.priority;
            if (isDue) score += 10;
            if (roundsSince > mem.interval * 2) score += 5;
            score += Math.random() * 0.5;
            return { question: q, score };
        })
        .sort((a, b) => b.score - a.score);

    state.currentQuizQuestion = candidates[0].question;
    state.nqFirstAttempt = true;
    renderNQQuestion();
}

export function renderNQQuestion() {
    const q = state.currentQuizQuestion;

    const staffContainer = document.getElementById("nq-staff-container");
    const staffEl = document.getElementById("nq-staff");
    staffEl.innerHTML = "";
    if (q.render) {
        staffContainer.style.display = "flex";
        q.render(staffEl);
    } else {
        staffContainer.style.display = "none";
    }

    document.getElementById("nq-prompt").textContent = q.prompt;

    const btnContainer = document.getElementById("nq-buttons");
    btnContainer.innerHTML = "";
    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "mc-btn";
        btn.textContent = opt;
        btn.addEventListener("click", () => handleNQAnswer(idx, btn));
        btn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            handleNQAnswer(idx, btn);
        }, { passive: false });
        btnContainer.appendChild(btn);
    });

    document.getElementById("nq-feedback").textContent = "";
    document.getElementById("nq-feedback").className = "";
    document.getElementById("nq-response-time").textContent = "";

    state.nqDisplayTime = Date.now();
}

export function handleNQAnswer(selectedIndex, btnElement) {
    if (state.isProcessingClick || !state.currentQuizQuestion) return;

    const q = state.currentQuizQuestion;
    const isCorrect = selectedIndex === q.correctIndex;
    const responseTime = Date.now() - state.nqDisplayTime;
    const chProg = state.notationProgress.chapters[state.currentChapterId];

    if (isCorrect) {
        state.isProcessingClick = true;
        btnElement.classList.add("correct");

        if (state.nqFirstAttempt) {
            if (!chProg.quizStats[q.id]) chProg.quizStats[q.id] = { correct: 0, total: 0 };
            chProg.quizStats[q.id].total++;
            chProg.quizStats[q.id].correct++;
            chProg.currentStreak = (chProg.currentStreak || 0) + 1;
            chProg.longestStreak = Math.max(chProg.longestStreak || 0, chProg.currentStreak);
        }

        const quality = calculateQuality(responseTime, true, state.nqFirstAttempt);
        updateNQSpacedRepetition(q.id, quality, chProg);

        const feedback = document.getElementById("nq-feedback");
        feedback.textContent = "Correct!";
        feedback.style.color = "#8f8";
        const rtDisplay = document.getElementById("nq-response-time");
        const timeStr = (responseTime / 1000).toFixed(1);
        const speedLabel = responseTime < 1500 ? "Fast!" : responseTime < 3000 ? "Good" : "Keep practicing";
        rtDisplay.textContent = `${timeStr}s - ${speedLabel}`;

        saveNotationProgress(state.notationProgress);
        updateNQStatsDisplay();
        updateNQProgress();
        updateNQStreak();

        if (checkNQChapterComplete()) {
            setTimeout(() => {
                state.isProcessingClick = false;
                showNQChapterComplete();
            }, 500);
            return;
        }

        setTimeout(() => {
            btnElement.classList.remove("correct");
            pickNextNQQuestion();
            state.isProcessingClick = false;
        }, 500);
    } else {
        btnElement.classList.add("wrong");

        if (state.nqFirstAttempt) {
            if (!chProg.quizStats[q.id]) chProg.quizStats[q.id] = { correct: 0, total: 0 };
            chProg.quizStats[q.id].total++;
            chProg.currentStreak = 0;
            updateNQSpacedRepetition(q.id, 0, chProg);
        }
        state.nqFirstAttempt = false;

        const feedback = document.getElementById("nq-feedback");
        feedback.textContent = `Wrong \u2014 ${q.options[q.correctIndex]}`;
        feedback.style.color = "#f88";

        saveNotationProgress(state.notationProgress);
        updateNQStatsDisplay();
        updateNQProgress();
        updateNQStreak();

        setTimeout(() => btnElement.classList.remove("wrong"), 200);
    }
}

export function updateNQSpacedRepetition(questionId, quality, chProg) {
    if (!chProg.quizMemory[questionId]) {
        chProg.quizMemory[questionId] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
    }
    const mem = chProg.quizMemory[questionId];

    if (quality >= 3) {
        if (mem.repetitions === 0) mem.interval = 1;
        else if (mem.repetitions === 1) mem.interval = 3;
        else mem.interval = Math.round(mem.interval * mem.easiness);
        mem.repetitions++;
    } else {
        mem.repetitions = 0;
        mem.interval = 1;
    }

    mem.easiness = Math.max(1.3, mem.easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    mem.lastSeen = chProg.roundNumber;
    mem.priority = Math.max(0.1, 1 / mem.easiness);
}

export function updateNQProgress() {
    const chapter = NOTATION_CHAPTERS.find(c => c.id === state.currentChapterId);
    const chProg = state.notationProgress.chapters[state.currentChapterId];
    const pool = chapter.quizPool;

    let totalCorrect = 0, totalAttempts = 0, itemsReady = 0;
    const minAttempts = 1;
    const threshold = 0.80;

    for (const q of pool) {
        const stat = chProg.quizStats[q.id];
        if (!stat) continue;
        totalCorrect += stat.correct;
        totalAttempts += stat.total;
        if (stat.total >= minAttempts) itemsReady++;
    }

    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;
    const accuracyPct = Math.round(accuracy * 100);
    const attemptProgress = itemsReady / pool.length;
    const accuracyProgress = Math.min(1, accuracy / threshold);
    const overallProgress = Math.min(1, attemptProgress * 0.4 + accuracyProgress * 0.6);

    const fill = document.getElementById("nq-progress-fill");
    fill.style.width = `${Math.round(overallProgress * 100)}%`;
    fill.style.background = accuracy >= threshold && itemsReady === pool.length ? "#22aa55" :
        accuracy >= threshold ? "#cc8800" : "#4488cc";

    document.getElementById("nq-progress-text").textContent =
        `${accuracyPct}% accuracy (need 80%) \u00b7 ${itemsReady}/${pool.length} questions seen`;
}

export function updateNQStreak() {
    const chProg = state.notationProgress.chapters[state.currentChapterId];
    document.getElementById("nq-streak").textContent =
        `Streak: ${chProg.currentStreak || 0} | Best: ${chProg.longestStreak || 0}`;
}

export function updateNQStatsDisplay() {
    const chapter = NOTATION_CHAPTERS.find(c => c.id === state.currentChapterId);
    const chProg = state.notationProgress.chapters[state.currentChapterId];
    const grid = document.getElementById("nq-stats-grid");
    grid.innerHTML = "";

    for (const q of chapter.quizPool) {
        const stat = chProg.quizStats[q.id];
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

        const shortPrompt = q.prompt.length > 20 ? q.prompt.substring(0, 18) + "\u2026" : q.prompt;
        div.innerHTML = `
            <div class="note-name" style="font-size:clamp(0.6rem,2vw,0.7rem);">${shortPrompt}</div>
            <div class="note-accuracy">${accuracy !== null ? `${accuracy}%` : '-'}</div>
        `;
        grid.appendChild(div);
    }
}

export function checkNQChapterComplete() {
    const chapter = NOTATION_CHAPTERS.find(c => c.id === state.currentChapterId);
    const chProg = state.notationProgress.chapters[state.currentChapterId];
    const minAttempts = 1;
    const threshold = 0.80;

    let totalCorrect = 0, totalAttempts = 0;
    let allHaveMinAttempts = true;

    for (const q of chapter.quizPool) {
        const stat = chProg.quizStats[q.id];
        if (!stat) continue;
        totalCorrect += stat.correct;
        totalAttempts += stat.total;
        if (stat.total < minAttempts) allHaveMinAttempts = false;
    }

    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;
    return accuracy >= threshold && allHaveMinAttempts;
}

export function showNQChapterComplete() {
    const chProg = state.notationProgress.chapters[state.currentChapterId];
    chProg.quizPassed = true;
    saveNotationProgress(state.notationProgress);

    const isLastChapter = state.currentChapterId >= NOTATION_CHAPTERS.length;
    const nextChapter = NOTATION_CHAPTERS.find(c => c.id === state.currentChapterId + 1);

    document.getElementById("next-level-name").textContent = isLastChapter || !nextChapter
        ? "You've completed all chapters!"
        : `Next: ${nextChapter.title}`;
    document.getElementById("level-complete").style.display = "flex";

    document.getElementById("continue-btn").style.display = (!isLastChapter && nextChapter) ? "inline-block" : "none";
    document.getElementById("stay-btn").style.display = "inline-block";
    document.getElementById("reset-stay-btn").style.display = "inline-block";
}

import state from '../data/state.js';
import { INTERVALS } from '../data/intervals.js';
import { KEY_SIGNATURES } from '../data/keysigs.js';
import { COF_DATA, COF_KEYS } from '../data/cof.js';
import { parseNote, getClefForNote, levelHasBothClefs, playNoteStr, playNote, noteToMidi, midiToNote } from './audio.js';
import { getCurrentProgress, getActiveNotes, recordAttempt, saveProgress } from './progress.js';
import { showFeedback, rebuildKeyboard } from './ui.js';

const { Factory } = Vex.Flow;

export function beginQuiz() {
    document.getElementById("start-btn").style.display = "none";
    document.getElementById("level-complete").style.display = "none";
    renderQuizNote(pickNextNote());
}

export function pickNextNote() {
    if (state.quizMode === "interval") {
        return generateInterval();
    }
    if (state.quizMode === "keysig") {
        return generateKeySig();
    }
    if (state.quizMode === "circle") {
        return generateCofQuestion();
    }

    const progress = getCurrentProgress();
    const activeNotes = getActiveNotes();
    progress.roundNumber++;

    const candidates = activeNotes
        .filter(note => note !== state.currentNote)
        .map(note => {
            if (!progress.noteMemory[note]) {
                progress.noteMemory[note] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
            }
            const mem = progress.noteMemory[note];
            const roundsSince = progress.roundNumber - mem.lastSeen;
            const isDue = roundsSince >= mem.interval;

            let score = mem.priority;
            if (isDue) score += 10;
            if (roundsSince > mem.interval * 2) score += 5;
            score += Math.random() * 0.5;

            return { note, score };
        })
        .sort((a, b) => b.score - a.score);

    state.currentNote = candidates[0].note;
    state.firstAttempt = true;
    return state.currentNote;
}

export function renderQuizNote(noteStr) {
    try {
        const staffDiv = document.getElementById("staff");
        staffDiv.innerHTML = "";

        if (state.quizMode === "interval") {
            staffDiv.innerHTML = '<div id="audio-prompt">&#x1F50A; Interval</div>';
            document.getElementById("replay-btn").style.display = "inline-block";
            playCurrentInterval();
            state.noteDisplayTime = Date.now();
            return;
        }

        if (state.quizMode === "keysig") {
            document.getElementById("replay-btn").style.display = "none";
            const keySig = KEY_SIGNATURES[state.currentKeySig];
            const containerWidth = Math.min(window.innerWidth * 0.9, 400);
            const staffWidth = Math.max(containerWidth - 40, 140);
            const staffHeight = Math.min(150, Math.max(window.innerWidth * 0.35, 100));

            const factory = new Factory({
                renderer: { elementId: "staff", width: containerWidth, height: staffHeight },
            });
            const score = factory.EasyScore();
            const system = factory.System({ x: 0, y: 0, width: staffWidth });
            const voice = score.voice(score.notes("B4/w/r", { clef: "treble" }));
            system.addStave({ voices: [voice] }).addClef("treble").addKeySignature(keySig.vexKey);
            factory.draw();
            state.noteDisplayTime = Date.now();
            return;
        }

        if (state.quizMode === "circle") {
            document.getElementById("replay-btn").style.display = "none";
            staffDiv.innerHTML = `<div id="note-prompt">${state.currentCofPrompt}</div>`;
            state.noteDisplayTime = Date.now();
            return;
        }

        const parsed = parseNote(noteStr);
        if (!parsed) return;

        if (state.quizMode === "audio") {
            staffDiv.innerHTML = '<div id="audio-prompt">&#x1F50A;</div>';
            document.getElementById("replay-btn").style.display = "inline-block";
            playNoteStr(noteStr);
            state.noteDisplayTime = Date.now();
            return;
        }

        if (state.quizMode === "reverse") {
            staffDiv.innerHTML = `<div id="note-prompt">${noteStr}</div>`;
            document.getElementById("replay-btn").style.display = "none";
            state.noteDisplayTime = Date.now();
            return;
        }

        // Visual mode: show note on staff
        document.getElementById("replay-btn").style.display = "none";

        const clef = getClefForNote(noteStr);
        const vexNote = `${parsed.name}${parsed.accidental}${parsed.octave}/w`;
        const useGrandStaff = levelHasBothClefs();

        const containerWidth = Math.min(window.innerWidth * 0.9, 400);
        const staffWidth = Math.max(containerWidth - 40, 140);
        const staffHeight = useGrandStaff
            ? Math.min(250, Math.max(window.innerHeight * 0.28, 180))
            : Math.min(150, Math.max(window.innerWidth * 0.35, 100));

        const factory = new Factory({
            renderer: { elementId: "staff", width: containerWidth, height: staffHeight },
        });
        const score = factory.EasyScore();
        const system = factory.System({ x: 0, y: 0, width: staffWidth });

        if (useGrandStaff) {
            const trebleNotes = clef === "treble" ? vexNote : "B4/w/r";
            const bassNotes = clef === "bass" ? vexNote : "D3/w/r";
            const trebleVoice = score.voice(score.notes(trebleNotes, { clef: "treble" }));
            const bassVoice = score.voice(score.notes(bassNotes, { clef: "bass" }));
            system.addStave({ voices: [trebleVoice] }).addClef("treble");
            system.addStave({ voices: [bassVoice] }).addClef("bass");
            system.addConnector("brace");
            system.addConnector("singleLeft");
        } else {
            const voice = score.voice(score.notes(vexNote, { clef }));
            system.addStave({ voices: [voice] }).addClef(clef);
        }

        factory.draw();
        state.noteDisplayTime = Date.now();
    } catch (error) {
        console.error("Error rendering note:", error);
    }
}

export function replayCurrentNote() {
    if (state.quizMode === "interval" && state.currentInterval) {
        playCurrentInterval();
    } else if (state.currentNote && (state.quizMode === "audio" || state.quizMode === "reverse")) {
        playNoteStr(state.currentNote);
    }
}

// Interval mode
export function generateInterval() {
    const progress = getCurrentProgress();
    const activeIntervals = getActiveNotes();
    progress.roundNumber++;

    const candidates = activeIntervals
        .filter(iv => !state.currentInterval || iv !== state.currentInterval.interval)
        .map(iv => {
            if (!progress.noteMemory[iv]) {
                progress.noteMemory[iv] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
            }
            const mem = progress.noteMemory[iv];
            const roundsSince = progress.roundNumber - mem.lastSeen;
            const isDue = roundsSince >= mem.interval;
            let score = mem.priority;
            if (isDue) score += 10;
            if (roundsSince > mem.interval * 2) score += 5;
            score += Math.random() * 0.5;
            return { interval: iv, score };
        })
        .sort((a, b) => b.score - a.score);

    const chosenInterval = candidates[0].interval;
    const semitones = INTERVALS[chosenInterval].semitones;

    const minMidi = noteToMidi("C3");
    const maxMidi = noteToMidi("C5");
    const rootMidi = minMidi + Math.floor(Math.random() * (maxMidi - minMidi - semitones + 1));
    const targetMidi = rootMidi + semitones;

    state.currentInterval = {
        root: midiToNote(rootMidi),
        target: midiToNote(targetMidi),
        interval: chosenInterval,
    };
    state.currentNote = chosenInterval;
    state.firstAttempt = true;
    return chosenInterval;
}

export function playCurrentInterval() {
    if (!state.currentInterval) return;
    playNoteStr(state.currentInterval.root);
    setTimeout(() => playNoteStr(state.currentInterval.target), 600);
}

export function buildIntervalButtons() {
    const container = document.getElementById("interval-buttons");
    container.innerHTML = "";
    container.style.display = "flex";

    const activeIntervals = getActiveNotes();
    for (const iv of activeIntervals) {
        const btn = document.createElement("button");
        btn.className = "interval-btn";
        btn.textContent = INTERVALS[iv].name;
        btn.dataset.interval = iv;
        btn.addEventListener("click", () => handleIntervalClick(iv, btn));
        btn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            handleIntervalClick(iv, btn);
        }, { passive: false });
        container.appendChild(btn);
    }
}

export function handleIntervalClick(intervalName, btnElement) {
    if (state.isProcessingClick || !state.currentInterval) return;

    const responseTime = Date.now() - state.noteDisplayTime;

    if (intervalName === state.currentInterval.interval) {
        state.isProcessingClick = true;
        recordAttempt(state.currentInterval.interval, true, responseTime);
        btnElement.classList.add("correct");
        showFeedback(true, INTERVALS[state.currentInterval.interval].name);
        setTimeout(() => {
            btnElement.classList.remove("correct");
            generateInterval();
            renderQuizNote(state.currentNote);
            state.isProcessingClick = false;
        }, 400);
    } else {
        recordAttempt(state.currentInterval.interval, false, responseTime);
        btnElement.classList.add("wrong");
        showFeedback(false, INTERVALS[state.currentInterval.interval].name);
        setTimeout(() => btnElement.classList.remove("wrong"), 200);
    }
}

// Key signature mode
export function generateKeySig() {
    const progress = getCurrentProgress();
    const activeKeys = getActiveNotes();
    progress.roundNumber++;

    const candidates = activeKeys
        .filter(k => k !== state.currentKeySig)
        .map(k => {
            if (!progress.noteMemory[k]) {
                progress.noteMemory[k] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
            }
            const mem = progress.noteMemory[k];
            const roundsSince = progress.roundNumber - mem.lastSeen;
            const isDue = roundsSince >= mem.interval;
            let score = mem.priority;
            if (isDue) score += 10;
            if (roundsSince > mem.interval * 2) score += 5;
            score += Math.random() * 0.5;
            return { key: k, score };
        })
        .sort((a, b) => b.score - a.score);

    state.currentKeySig = candidates[0].key;
    state.currentNote = state.currentKeySig;
    state.firstAttempt = true;
    return state.currentKeySig;
}

export function buildKeySigButtons() {
    const container = document.getElementById("keysig-buttons");
    container.innerHTML = "";
    container.style.display = "flex";

    const activeKeys = getActiveNotes();
    for (const k of activeKeys) {
        const btn = document.createElement("button");
        btn.className = "interval-btn";
        btn.textContent = KEY_SIGNATURES[k].name;
        btn.dataset.key = k;
        btn.addEventListener("click", () => handleKeySigClick(k, btn));
        btn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            handleKeySigClick(k, btn);
        }, { passive: false });
        container.appendChild(btn);
    }
}

export function handleKeySigClick(keyName, btnElement) {
    if (state.isProcessingClick || !state.currentKeySig) return;

    const responseTime = Date.now() - state.noteDisplayTime;

    if (keyName === state.currentKeySig) {
        state.isProcessingClick = true;
        recordAttempt(state.currentKeySig, true, responseTime);
        btnElement.classList.add("correct");
        showFeedback(true, KEY_SIGNATURES[state.currentKeySig].name);
        setTimeout(() => {
            btnElement.classList.remove("correct");
            generateKeySig();
            renderQuizNote(state.currentNote);
            state.isProcessingClick = false;
        }, 400);
    } else {
        recordAttempt(state.currentKeySig, false, responseTime);
        btnElement.classList.add("wrong");
        showFeedback(false, KEY_SIGNATURES[state.currentKeySig].name);
        setTimeout(() => btnElement.classList.remove("wrong"), 200);
    }
}

// Circle of Fifths mode
export function generateCofQuestion() {
    const progress = getCurrentProgress();
    const activeItems = getActiveNotes();
    progress.roundNumber++;

    const candidates = activeItems
        .filter(item => item !== state.currentCofItem)
        .map(item => {
            if (!progress.noteMemory[item]) {
                progress.noteMemory[item] = { easiness: 2.5, interval: 1, repetitions: 0, lastSeen: 0, priority: 1 };
            }
            const mem = progress.noteMemory[item];
            const roundsSince = progress.roundNumber - mem.lastSeen;
            const isDue = roundsSince >= mem.interval;
            let score = mem.priority;
            if (isDue) score += 10;
            if (roundsSince > mem.interval * 2) score += 5;
            score += Math.random() * 0.5;
            return { item, score };
        })
        .sort((a, b) => b.score - a.score);

    state.currentCofItem = candidates[0].item;
    state.firstAttempt = true;

    const parts = state.currentCofItem.split("_");
    const type = parts.slice(0, -1).join("_");
    const key = parts[parts.length - 1];
    const data = COF_DATA[key];

    let prompt, answer, distractorPool;

    if (type === "fifth_up") {
        prompt = `What key is a 5th above ${key}?`;
        answer = data.fifthUp;
        distractorPool = COF_KEYS.filter(k => k !== answer);
    } else if (type === "fourth_up") {
        prompt = `What key is a 4th above ${key}?`;
        answer = data.fourthUp;
        distractorPool = COF_KEYS.filter(k => k !== answer);
    } else if (type === "sig") {
        if (data.sharps > 0) {
            prompt = `How many sharps in ${key} major?`;
            answer = String(data.sharps);
            distractorPool = ["0","1","2","3","4","5","6"].filter(n => n !== answer);
        } else if (data.flats > 0) {
            prompt = `How many flats in ${key} major?`;
            answer = String(data.flats);
            distractorPool = ["0","1","2","3","4","5","6"].filter(n => n !== answer);
        } else {
            prompt = `How many sharps or flats in ${key} major?`;
            answer = "0";
            distractorPool = ["1","2","3","4","5","6"];
        }
    } else if (type === "rel_minor") {
        prompt = `What is the relative minor of ${key} major?`;
        answer = data.relMinor;
        distractorPool = COF_KEYS.map(k => COF_DATA[k].relMinor).filter(m => m !== answer);
    } else if (type === "rel_major") {
        const minorName = data.relMinor;
        prompt = `What is the relative major of ${minorName}?`;
        answer = key;
        distractorPool = COF_KEYS.filter(k => k !== answer);
    } else if (type === "chord_I") {
        prompt = `In ${key} major, what is the I chord?`;
        answer = key;
        distractorPool = COF_KEYS.filter(k => k !== answer);
    } else if (type === "chord_IV") {
        prompt = `In ${key} major, what is the IV chord?`;
        answer = data.IV;
        distractorPool = COF_KEYS.filter(k => k !== answer);
    } else if (type === "chord_V") {
        prompt = `In ${key} major, what is the V chord?`;
        answer = data.V;
        distractorPool = COF_KEYS.filter(k => k !== answer);
    }

    state.currentCofAnswer = answer;
    state.currentCofPrompt = prompt;

    const distractors = [];
    const shuffled = distractorPool.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
        distractors.push(shuffled[i]);
    }
    const options = [answer, ...distractors].sort(() => Math.random() - 0.5);
    buildCofAnswerButtons(options);

    state.currentNote = state.currentCofItem;
    return state.currentCofItem;
}

export function buildCofAnswerButtons(options) {
    const container = document.getElementById("circle-buttons");
    container.innerHTML = "";
    container.style.display = "flex";

    for (const opt of options) {
        const btn = document.createElement("button");
        btn.className = "interval-btn";
        btn.textContent = opt;
        btn.addEventListener("click", () => handleCofClick(opt, btn));
        btn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            handleCofClick(opt, btn);
        }, { passive: false });
        container.appendChild(btn);
    }
}

export function handleCofClick(selected, btnElement) {
    if (state.isProcessingClick || !state.currentCofAnswer) return;

    const responseTime = Date.now() - state.noteDisplayTime;

    if (selected === state.currentCofAnswer) {
        state.isProcessingClick = true;
        recordAttempt(state.currentCofItem, true, responseTime);
        btnElement.classList.add("correct");
        showFeedback(true, state.currentCofAnswer);
        setTimeout(() => {
            btnElement.classList.remove("correct");
            generateCofQuestion();
            renderQuizNote(state.currentNote);
            state.isProcessingClick = false;
        }, 400);
    } else {
        recordAttempt(state.currentCofItem, false, responseTime);
        btnElement.classList.add("wrong");
        showFeedback(false, state.currentCofAnswer);
        setTimeout(() => btnElement.classList.remove("wrong"), 200);
    }
}

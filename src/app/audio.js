import state from '../data/state.js';
import { getActiveNotes } from './progress.js';

const NOTE_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function noteToMidi(noteStr) {
    const parsed = parseNote(noteStr);
    if (!parsed) return 0;
    const noteName = parsed.name + parsed.accidental;
    const idx = NOTE_ORDER.indexOf(noteName);
    return (parsed.octave + 1) * 12 + idx;
}

export function midiToNote(midi) {
    const octave = Math.floor(midi / 12) - 1;
    const idx = midi % 12;
    return NOTE_ORDER[idx] + octave;
}

const SAMPLE_BASE_URL = "https://tonejs.github.io/audio/salamander/";
const piano = new Tone.Sampler({
    urls: {
        A0: "A0.mp3", C1: "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
        A1: "A1.mp3", C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
        A2: "A2.mp3", C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
        A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
        A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
        A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
        A6: "A6.mp3", C7: "C7.mp3", "D#7": "Ds7.mp3",
        C8: "C8.mp3",
    },
    release: 1,
    baseUrl: SAMPLE_BASE_URL,
}).toDestination();

piano.onsampleload = () => {};
Tone.loaded().then(() => { state.pianoLoaded = true; });

export function playNote(noteName, octave) {
    if (!state.pianoLoaded) return;
    piano.triggerAttackRelease(`${noteName}${octave}`, "4n");
}

export function playNoteStr(noteStr) {
    const parsed = parseNote(noteStr);
    if (parsed) playNote(parsed.name + parsed.accidental, parsed.octave);
}

export function parseNote(noteStr) {
    const match = noteStr.match(/^([A-G])(#|b)?(\d)$/);
    if (!match) return null;
    return {
        name: match[1],
        accidental: match[2] || "",
        octave: parseInt(match[3]),
        full: noteStr,
    };
}

export function getClefForNote(noteStr) {
    const parsed = parseNote(noteStr);
    if (!parsed) return "treble";
    if (parsed.octave >= 4) return "treble";
    return "bass";
}

export function levelHasBothClefs() {
    if (state.quizMode === "interval" || state.quizMode === "keysig") return false;
    const notes = getActiveNotes();
    let hasTreble = false, hasBass = false;
    for (const n of notes) {
        const clef = getClefForNote(n);
        if (clef === "treble") hasTreble = true;
        else hasBass = true;
        if (hasTreble && hasBass) return true;
    }
    return false;
}

export function getKeyboardRange() {
    const activeNotes = getActiveNotes();
    let minOctave = 9, maxOctave = 0;

    for (const noteStr of activeNotes) {
        const parsed = parseNote(noteStr);
        if (parsed) {
            minOctave = Math.min(minOctave, parsed.octave);
            maxOctave = Math.max(maxOctave, parsed.octave);
        }
    }

    if (minOctave > maxOctave) { minOctave = 4; maxOctave = 4; }
    return { start: minOctave, end: maxOctave };
}

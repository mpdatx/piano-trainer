import state from './data/state.js';
import { STORAGE_KEY } from './data/constants.js';
import { DIFFICULTY_LEVELS, ALL_NOTES } from './data/levels.js';
import { INTERVALS, INTERVAL_LEVELS, ALL_INTERVALS } from './data/intervals.js';
import { KEY_SIGNATURES, KEYSIG_LEVELS, ALL_KEYSIGS } from './data/keysigs.js';
import { COF_DATA, COF_KEYS, COF_LEVELS, ALL_COF_ITEMS } from './data/cof.js';
import { NOTATION_CHAPTERS } from './chapters/index.js';

console.log("Data loaded:", {
    levels: DIFFICULTY_LEVELS.length,
    notes: ALL_NOTES.length,
    intervals: Object.keys(INTERVALS).length,
    keysigs: Object.keys(KEY_SIGNATURES).length,
    cofKeys: COF_KEYS.length,
});
console.log("Chapters loaded:", NOTATION_CHAPTERS.length);

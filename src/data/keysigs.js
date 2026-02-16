export const KEY_SIGNATURES = {
    "C":  { sharps: 0, flats: 0, name: "C Major", vexKey: "C" },
    "G":  { sharps: 1, flats: 0, name: "G Major", vexKey: "G" },
    "D":  { sharps: 2, flats: 0, name: "D Major", vexKey: "D" },
    "A":  { sharps: 3, flats: 0, name: "A Major", vexKey: "A" },
    "E":  { sharps: 4, flats: 0, name: "E Major", vexKey: "E" },
    "B":  { sharps: 5, flats: 0, name: "B Major", vexKey: "B" },
    "F#": { sharps: 6, flats: 0, name: "F# Major", vexKey: "F#" },
    "F":  { sharps: 0, flats: 1, name: "F Major", vexKey: "F" },
    "Bb": { sharps: 0, flats: 2, name: "Bb Major", vexKey: "Bb" },
    "Eb": { sharps: 0, flats: 3, name: "Eb Major", vexKey: "Eb" },
    "Ab": { sharps: 0, flats: 4, name: "Ab Major", vexKey: "Ab" },
    "Db": { sharps: 0, flats: 5, name: "Db Major", vexKey: "Db" },
    "Gb": { sharps: 0, flats: 6, name: "Gb Major", vexKey: "Gb" },
};

export const KEYSIG_LEVELS = [
    { name: "No Accidentals", keys: ["C", "G", "F"], threshold: 0.80, minAttempts: 3 },
    { name: "One Sharp/Flat", keys: ["C", "G", "F", "D", "Bb"], threshold: 0.80, minAttempts: 3 },
    { name: "Two Sharps/Flats", keys: ["C", "G", "D", "A", "F", "Bb", "Eb"], threshold: 0.75, minAttempts: 2 },
    { name: "Three Sharps/Flats", keys: ["C", "G", "D", "A", "E", "F", "Bb", "Eb", "Ab"], threshold: 0.75, minAttempts: 2 },
    { name: "All Keys", keys: ["C", "G", "D", "A", "E", "B", "F#", "F", "Bb", "Eb", "Ab", "Db", "Gb"], threshold: 0.70, minAttempts: 2 },
];

export const ALL_KEYSIGS = [...new Set(KEYSIG_LEVELS.flatMap(l => l.keys))];

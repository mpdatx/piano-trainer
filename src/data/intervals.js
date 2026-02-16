export const INTERVALS = {
    "m2": { semitones: 1, name: "Minor 2nd" },
    "M2": { semitones: 2, name: "Major 2nd" },
    "m3": { semitones: 3, name: "Minor 3rd" },
    "M3": { semitones: 4, name: "Major 3rd" },
    "P4": { semitones: 5, name: "Perfect 4th" },
    "TT": { semitones: 6, name: "Tritone" },
    "P5": { semitones: 7, name: "Perfect 5th" },
    "m6": { semitones: 8, name: "Minor 6th" },
    "M6": { semitones: 9, name: "Major 6th" },
    "m7": { semitones: 10, name: "Minor 7th" },
    "M7": { semitones: 11, name: "Major 7th" },
    "P8": { semitones: 12, name: "Octave" },
};

export const INTERVAL_LEVELS = [
    { name: "Perfect Intervals", intervals: ["P4", "P5", "P8"], threshold: 0.80, minAttempts: 3 },
    { name: "Major Intervals", intervals: ["M2", "M3", "P4", "P5", "P8"], threshold: 0.75, minAttempts: 3 },
    { name: "Minor Intervals", intervals: ["m2", "M2", "m3", "M3", "P4", "P5"], threshold: 0.75, minAttempts: 2 },
    { name: "All Simple", intervals: ["m2", "M2", "m3", "M3", "P4", "TT", "P5"], threshold: 0.70, minAttempts: 2 },
    { name: "Extended", intervals: ["m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6"], threshold: 0.70, minAttempts: 2 },
    { name: "All Intervals", intervals: ["m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7", "P8"], threshold: 0.70, minAttempts: 2 },
];

export const ALL_INTERVALS = [...new Set(INTERVAL_LEVELS.flatMap(l => l.intervals))];

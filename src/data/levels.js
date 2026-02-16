export const DIFFICULTY_LEVELS = [
    { name: "C Position", notes: ["C4", "E4", "G4"], threshold: 0.80, minAttempts: 3 },
    { name: "C Position+", notes: ["C4", "D4", "E4", "F4", "G4"], threshold: 0.80, minAttempts: 3 },
    { name: "Full Treble Octave", notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"], threshold: 0.80, minAttempts: 3 },
    { name: "Bass C Position", notes: ["C3", "E3", "G3"], threshold: 0.80, minAttempts: 3 },
    { name: "Bass C Position+", notes: ["C3", "D3", "E3", "F3", "G3"], threshold: 0.80, minAttempts: 3 },
    { name: "Both Clefs Basic", notes: ["C3", "E3", "G3", "C4", "E4", "G4"], threshold: 0.80, minAttempts: 4 },
    { name: "Both Clefs Expanded", notes: ["C3", "D3", "E3", "F3", "G3", "C4", "D4", "E4", "F4", "G4"], threshold: 0.80, minAttempts: 4 },
    { name: "Full Range", notes: ["G2", "A2", "B2", "C3", "D3", "E3", "F3", "G3", "C4", "D4", "E4", "F4", "G4", "A4", "B4"], threshold: 0.80, minAttempts: 3 },
    { name: "High Treble", notes: ["G2", "A2", "B2", "C3", "D3", "E3", "F3", "G3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5"], threshold: 0.75, minAttempts: 3 },
    { name: "Ledger Lines", notes: ["G2", "A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5"], threshold: 0.75, minAttempts: 3 },
    { name: "Accidentals", notes: ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"], threshold: 0.75, minAttempts: 3 },
];

export const ALL_NOTES = [...new Set(DIFFICULTY_LEVELS.flatMap(l => l.notes))];

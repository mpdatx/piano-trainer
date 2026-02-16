export const COF_DATA = {
    "C":  { sharps: 0, flats: 0, fifthUp: "G",  fourthUp: "F",  relMinor: "Am",  I: "C",  IV: "F",  V: "G" },
    "G":  { sharps: 1, flats: 0, fifthUp: "D",  fourthUp: "C",  relMinor: "Em",  I: "G",  IV: "C",  V: "D" },
    "D":  { sharps: 2, flats: 0, fifthUp: "A",  fourthUp: "G",  relMinor: "Bm",  I: "D",  IV: "G",  V: "A" },
    "A":  { sharps: 3, flats: 0, fifthUp: "E",  fourthUp: "D",  relMinor: "F#m", I: "A",  IV: "D",  V: "E" },
    "E":  { sharps: 4, flats: 0, fifthUp: "B",  fourthUp: "A",  relMinor: "C#m", I: "E",  IV: "A",  V: "B" },
    "B":  { sharps: 5, flats: 0, fifthUp: "F#", fourthUp: "E",  relMinor: "G#m", I: "B",  IV: "E",  V: "F#" },
    "F#": { sharps: 6, flats: 0, fifthUp: "Db", fourthUp: "B",  relMinor: "D#m", I: "F#", IV: "B",  V: "C#" },
    "Db": { sharps: 0, flats: 5, fifthUp: "Ab", fourthUp: "Gb", relMinor: "Bbm", I: "Db", IV: "Gb", V: "Ab" },
    "Ab": { sharps: 0, flats: 4, fifthUp: "Eb", fourthUp: "Db", relMinor: "Fm",  I: "Ab", IV: "Db", V: "Eb" },
    "Eb": { sharps: 0, flats: 3, fifthUp: "Bb", fourthUp: "Ab", relMinor: "Cm",  I: "Eb", IV: "Ab", V: "Bb" },
    "Bb": { sharps: 0, flats: 2, fifthUp: "F",  fourthUp: "Eb", relMinor: "Gm",  I: "Bb", IV: "Eb", V: "F" },
    "F":  { sharps: 0, flats: 1, fifthUp: "C",  fourthUp: "Bb", relMinor: "Dm",  I: "F",  IV: "Bb", V: "C" },
};

export const COF_KEYS = Object.keys(COF_DATA);

export const COF_LEVELS = [
    { name: "Fifths Up",       items: COF_KEYS.map(k => `fifth_up_${k}`),    threshold: 0.80, minAttempts: 3 },
    { name: "Fourths Up",      items: COF_KEYS.map(k => `fourth_up_${k}`),   threshold: 0.80, minAttempts: 3 },
    { name: "Sharps & Flats",  items: COF_KEYS.map(k => `sig_${k}`),         threshold: 0.80, minAttempts: 3 },
    { name: "Relative Minors", items: COF_KEYS.flatMap(k => [`rel_minor_${k}`, `rel_major_${k}`]), threshold: 0.80, minAttempts: 3 },
    { name: "I-IV-V Chords",   items: ["C","G","D","A","F","Bb","Eb"].flatMap(k => [`chord_I_${k}`, `chord_IV_${k}`, `chord_V_${k}`]), threshold: 0.80, minAttempts: 3 },
    { name: "Full Circle",     items: null, threshold: 0.80, minAttempts: 2 },
];

// For level 6 (Full Circle), combine all items from levels 0-4
COF_LEVELS[5].items = COF_LEVELS.slice(0, 5).flatMap(l => l.items);

export const ALL_COF_ITEMS = [...new Set(COF_LEVELS.flatMap(l => l.items))];

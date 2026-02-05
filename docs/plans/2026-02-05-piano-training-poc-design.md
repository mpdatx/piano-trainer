# Piano Training App — Proof of Concept Design

## Overview

Single-page web app that renders a grand staff with musical notation and an interactive piano keyboard. First step toward a piano training application.

## Tech Stack

- Single `index.html` file, no build tools
- VexFlow (CDN) for music notation rendering
- Vanilla JS for keyboard logic and interaction
- CSS for piano keyboard styling and layout

## Layout

Staff centered on top, piano keyboard centered below. Clean, minimal styling.

## Music Staff

- Grand staff: treble + bass clef connected by a brace
- Renders "Mary Had a Little Lamb" in C major, 4/4 time
- Treble clef: melody (right hand)
- Bass clef: simple whole-note chords (left hand)
- Notes defined in a JS data structure, easy to swap for other songs
- SVG output, centered horizontally

## Piano Keyboard

- HTML/CSS divs (no images or canvas)
- Configurable octave count via JS constant (default: 2 octaves, C4-B5)
- White keys: rectangular divs; black keys: absolutely positioned narrower divs
- Note name labels at bottom of white keys
- Hover and click highlighting for visual feedback
- Centered below staff

## Future Additions

- Tone.js for piano sounds on key press
- MIDI input support
- Note highlighting synced between staff and keyboard

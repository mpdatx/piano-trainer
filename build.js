import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';

const result = await build({
    entryPoints: ['src/main.js'],
    bundle: true,
    write: false,
    format: 'iife',
    external: ['Vex', 'Tone'],
});

const js = result.outputFiles[0].text;
const html = readFileSync('src/index.html', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');

const output = html
    .replace('/* BUILD:CSS */', css)
    .replace('/* BUILD:JS */', js);

writeFileSync('index.html', output);
console.log('Built index.html');

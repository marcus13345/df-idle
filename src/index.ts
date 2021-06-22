import { render } from './ui/UI.js';
import { ensureDirSync } from 'fs-extra';
import { lstatSync } from 'fs';
import { parse, resolve } from 'path';
import walkSync from 'walk-sync';
import { fileURLToPath } from 'url';
import { Game } from '@game';

const saveFile = process.argv[2] || 'data/world01.json';

ensureDirSync(parse(saveFile).dir);


// TODO extract extension loading into separate file
console.log('df-idle: Loading extensions');
const extensionsPath = resolve(parse(fileURLToPath(import.meta.url)).dir, '../content');

const extensions = walkSync(extensionsPath)
  .map(path => resolve(extensionsPath, path))
  .filter(path => lstatSync(path).isFile())
  .filter(path => parse(path).ext === '.js');
  // .map(path => import(path));

console.log('found', extensions.length, 'extensions');

for(const path of extensions) {
  console.log('=== [', path, '] ===');
  await import(path);
  console.log();
}

// TODO move render logic into game, so that the ui doesnt exist until the game does...
// maybe, i mean, an argument could be made for not that, because the game
// isnt necessarily the entire thing, its just one instance of a save file.
// But probably the initial menu screens will be their own thing entirely.
const game = Game.create(saveFile);
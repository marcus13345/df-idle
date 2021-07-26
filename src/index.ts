import { ensureDirSync } from 'fs-extra';
import { parse } from 'path';
import { Game } from '@game';
import {
  isStarted,
  stop,
  update,
  GameView,
  setView,
  start
} from '@ui';
// @ts-ignore
import ansi from 'sisteransi';

// HACK static extension loading
import './../content/content.js';
import { loadExtensions } from './Util.js';
import { APPLICATION_NAME } from './Constants.js';

// console.clear();

function gracefulShutdown() {
  if (isStarted()) {
    stop();
  }
  console.log('shutting down gracefully...');
  if (Game.current) {
    console.log('saving world...');
    Game.current.sync();
  }
  console.log('exitting');
  process.stdout.write(ansi.cursor.show);

  process.exit(0);
}

process.on('exit', gracefulShutdown);

const saveFile = process.argv[2] || 'data/world01.json';

ensureDirSync(parse(saveFile).dir);

// loadExtensions();

for (let seconds = 0; seconds > 0; seconds --) {
  process.stdout.write('Starting ' + APPLICATION_NAME + ' in ' + seconds + '\r');
}
process.stdout.write('Starting ' + APPLICATION_NAME + ' in ' + 0 + '\n');
// console.clear();

// TODO move render logic into game, so that the ui doesnt exist until the game does...
// maybe, i mean, an argument could be made for not that, because the game
// isnt necessarily the entire thing, its just one instance of a save file.
// But probably the initial menu screens will be their own thing entirely.
const game = Game.create(saveFile);
start();
const gameView = new GameView(game);
setView(gameView);

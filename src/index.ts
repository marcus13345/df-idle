import { Game } from './Game.js';
import { render } from './ui/UI.js';
import { ensureDirSync } from 'fs-extra';
import { parse } from 'path';

const saveFile = process.argv[2] || 'data/world01.json';

ensureDirSync(parse(saveFile).dir);

// TODO move render logic into game, so that the ui doesnt exist until the game does...
// maybe, i mean, an argument could be made for not that, because the game
// isnt necessarily the entire thing, its just one instance of a save file.
// But probably the initial menu screens will be their own thing entirely.
const game = Game.create(saveFile);
render(game);

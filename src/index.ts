import { Game } from './Game.js';
import { render } from './ui/UI.js';
import { ensureDirSync } from 'fs-extra';
import { parse } from 'path';

const saveFile = process.argv[2] || 'data/world01.json';

ensureDirSync(parse(saveFile).dir);

const game = Game.create(saveFile);
render(game);

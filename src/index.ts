import { Game } from './Game.js';
import { render } from './ui/UI.js';

const saveFile = process.argv[2];

const game = Game.create(saveFile || 'data/world01.json');
render(game);

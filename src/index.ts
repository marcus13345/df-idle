import { Game } from './Game.js';
import { render } from './UI.js';

const game = Game.create('data/world01.json');
render(game);

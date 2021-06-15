import { Game } from './Game.js';
import { render } from './UI.js';

export type ItemID = string;

const game = Game.create('data/world01.json');
render(game);

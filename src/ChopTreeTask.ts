import chalk from 'chalk';
import { Game } from './Game.js';
import { Item } from './Item.js';
import { Pawn } from './Pawn.js';
import { Task } from './Task.js';


export class ChopTreeTask extends Task {
	work = 100;

	reward() {
		Game.current.inv.add(Item.LOG, 1);
	}

	static serializationDependencies() {
		return [Pawn];
	}

	get title() {
		return chalk.yellow('Chop Trees');
	}

	get status() {
		return chalk.yellow('LOGGING');
	}
}

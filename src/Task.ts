import { Serializable } from 'frigid';
import EventEmitter from 'events';
import chalk from 'chalk';
import { Pawn } from './Pawn.js';
import { render, tasksPanel } from './UI.js';
import { Game } from './Game.js';
import { progressbar } from './Progressbar.js';

export class Task extends Serializable {
	work = 0;
	progress = 0;
	worker: Pawn;

	ctor() {
		this.worker ??= null;
		this.testCompletion();
	}

	reward() {}

	get completed() {
		return this.completion >= 1;
	}

	stopJob() {
		this.worker = null;
	}

	doWork(work = 1, pawn: Pawn) {
		this.worker = pawn;
		this.progress += work;
		this.testCompletion();
	}

	testCompletion() {
		if (this.progress >= this.work) {
			this.reward();
			Game.current.board.removeTask(this);
		}
	}

	claim(pawn: Pawn) {
		this.worker = pawn;
	}

	get completion() {
		return Math.min(1, this.progress / this.work);
	}

	toString() {
		// HACK magic number 2 here, is the border
		// of the panel
		const width = tasksPanel.width - 2;
		const left = ' ' + this.title + ' ' + (this.worker?.toString() || chalk.bold.black('Queued'));
		const bar = width - 2;
		return `${left}\n ${progressbar(this.completion, bar)}\n`;
	}

	get title() {
		return chalk.bgRedBright.black('[Abstract Task]');
	}

	get status() {
		return chalk.bgRedBright.black('DOING A TASK');
	}
}
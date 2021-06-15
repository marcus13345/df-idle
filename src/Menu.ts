import { Pawn } from './Pawn.js';
import log from './log.js';
import { screen, menuPanel, render, tags, Renderable } from './UI.js';
import chalk from 'chalk';
import { Game } from './Game.js';
import { Task } from './Task.js';
import { ChopTreeTask } from './ChopTreeTask.js';
import { progressbar } from './Progressbar.js';

export class Menu implements Renderable {

	constructor() {
		screen.on('keypress', (evt, key) => {
			log.info('keypress', key);
			if (key.full === 'delete') {
				Game.current.removePawn(Game.current.selected);
			} else if (key.full === 'up') {
				Game.current.advanceSelection(-1);
			} else if (key.full === 'down') {
				Game.current.advanceSelection(1);
			} else if (key.full === 'c') {
				Game.current.pawns.push(new Pawn());
				Game.current.sync();
			} else if (key.full === 'x') {
				let i = 0;
				for(const task of Game.current.board.tasks) {
					setTimeout(_ => {
						Game.current.board.removeTask(task);
					}, i * 100);
					i ++;
				}
				Game.current.sync();
			} else if (key.full === 't') {
				const job: Task = new ChopTreeTask();
				Game.current.board.addTask(job);
			}
			// const pawn = new Pawn();
			// Game.current.pawns.push(pawn);
			Game.current.sync();
		});
	}

	renderJobs() {
		return (`\
  ${chalk.greenBright('t')}: Chop Trees
  ${chalk.greenBright('c')}: Create Pawn
  ${chalk.greenBright('x')}: Clear Tasks
`);

	}

	topBar() {
		const idlers = Game.current.pawns.filter(pawn => pawn.idle);
		return ` ${Game.current.clock.toString()}{|}Idle: ${idlers.length} `;
	}

	renderPawns() {
		return `${
			Game.current.pawns.map(pawn => `${(function() {
				const selected = pawn === Game.current.selected;
				let str = '';
				if(selected) {
					str += ` ${tags.white.fg} ❯ ${pawn.toString()}${tags.reset}{|}${pawn.status} \n`;
					str += `    Energy{|}${progressbar(pawn.energy / 100, (menuPanel.width - 4) / 2)} \n`;
				} else {
					str += ` ${tags.bright}${tags.black.fg}   ${pawn.toString()}${tags.reset}{|}${pawn.status} `;
				}
				return str;
			})()}`).join('\n')
		}`;
	}

	render() {
		const width = menuPanel.width - 2;
		const hr = chalk.bold.black('━'.repeat(width));
		const content = [this.topBar(), hr, this.renderPawns(), hr, this.renderJobs()].join('\n');
		menuPanel.setContent(content);
	}
}

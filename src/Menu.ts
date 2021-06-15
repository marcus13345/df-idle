import { Pawn } from './Pawn.js';
import log from './log.js';
import { screen, menuPanel, render, tags, Renderable } from './UI.js';
import chalk from 'chalk';
import { Game } from './Game.js';
import { Task } from './Task.js';
import { ChopTreeTask } from './ChopTreeTask.js';
import { progressbar } from './Progressbar.js';
import { inspect } from 'util';
import { Popup } from './Popup.js';

enum SubMenu {
	NONE = 'NONE',
	TREES = 'TREES'
};

enum View {
	PAWNS = 'Pawns',
	INVENTORY = 'Inventory',
	BUILDINGS = 'Buildings',
};

export class Menu implements Renderable {

	trees: number = 10;
	subMenu: SubMenu = SubMenu.NONE;
	view: View = View.PAWNS;

	constructor() {
		menuPanel.on('keypress', (evt, key) => {
			log.info('keypress', key);
			if (key.full === 'delete') {
				Game.current.removePawn(Game.current.selected);
			} else if (key.full === 'up') {
				Game.current.advanceSelection(-1);
			} else if (key.full === 'down') {
				Game.current.advanceSelection(1);
			} else if (key.full === 'left') {
				this.view = View[Object.keys(View)[Math.min(Math.max(Object.values(View).indexOf(this.view) - 1, 0), Object.keys(View).length - 1)]]
			} else if (key.full === 'right') {
				this.view = View[Object.keys(View)[Math.min(Math.max(Object.values(View).indexOf(this.view) + 1, 0), Object.keys(View).length - 1)]]
			} else if (key.full === 'q') {
				this.subMenu = SubMenu.TREES;
			} else if (key.full === '1') {
				new Popup('this is a test!');
			} else if (key.full === '2') {
				new Popup('Etiam hendrerit elit sit amet metus congue dictum nec eu lacus. Sed aliquam in justo efficitur faucibus. Duis tellus diam, congue volutpat lorem et, semper consectetur erat. Nunc ac velit dignissim, tincidunt augue eget, tristique orci. Duis lacus sapien, bibendum id pharetra vel, semper et nunc. Vestibulum eu tellus imperdiet, lacinia ante ac, porta nisl. Donec at eleifend risus, ac dictum odio.');
			} else if (key.full === 'escape') {
				this.subMenu = SubMenu.NONE;
			}

			if(this.subMenu === SubMenu.TREES) {
				if (key.full === '=') {
					this.trees ++;
				} else if (key.full === '-') {
					this.trees --;
					this.trees = Math.max(this.trees, 1);
				} else if (key.full === '+') {
					this.trees += 10;
				} else if (key.full === '_') {
					this.trees -= 10;
					this.trees = Math.max(this.trees, 1);
				} else if (key.full === 'enter') {
					for(let i = 0; i < this.trees; i ++) {
						Game.current.board.addTask(new ChopTreeTask(1));
					}
					this.subMenu = SubMenu.NONE;
				}
			} else if(this.subMenu === SubMenu.NONE) {
				if (key.full === 'z') {
					Game.current.pawns.push(new Pawn());
				} else if (key.full === 'x') {
					Game.current.board.clear();
				}
			}

			// const pawn = new Pawn();
			// Game.current.pawns.push(pawn);
			Game.current.sync();
		});
	}

	renderJobs() {

		const colSpace = ((menuPanel.width - 2) / 2);

		return (`    Menus:${' '.repeat(colSpace - 8)}Actions:\n  ${
			chalk.greenBright('q')
		}: ${
			(this.subMenu !== SubMenu.TREES ? chalk.bold.black : _ => _)('Chop Trees')
		}${
			' '.repeat(colSpace - 15)
		}${chalk.greenBright('z')}: ${
			(this.subMenu !== SubMenu.NONE ? chalk.bold.black : _ => _)('Create Pawn')

		}\n${
			' '.repeat(colSpace)
		}${
			chalk.greenBright('x')
		}: ${
			(this.subMenu !== SubMenu.NONE ? chalk.bold.black : _ => _)('Clear Tasks')
		}\
`);

	}

	renderTopBar() {
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

	renderView() {
		const colSpace = ((menuPanel.width - 2) / 2);
		return `${
			// ' '.repeat(colSpace - 20)
			'{center}'
		}${(() => {
			return Object.values(View).map(view => {
				if(view === this.view) {
					return chalk.cyan.inverse(` ${view} `);
				} else {
					return chalk.cyan(` ${view} `);
				}
			}).join('');
		})()}{/center}\n\n${(() => {
			switch(this.view) {
				case View.PAWNS: return this.renderPawns();
				case View.INVENTORY: return this.renderInv();
			}
		})()}`
	}

	renderInv() {
		return Game.current.inv.render();
	}

	renderSubMenu() {
		return `${(() => {
			switch(this.subMenu) {
				case SubMenu.NONE:
					return `{center}${tags.bright}${tags.black.fg}* Select a menu above for options *`;
				case SubMenu.TREES:
					return this.renderTreesSubMenu();
			}
		})()}`;
	}

	renderTreesSubMenu() {
		return [
			`{center}Chop Trees`,
			`{left}  ${chalk.greenBright('-=_+')}: ${this.trees}`,
			`{left}  ${chalk.greenBright('enter')}: Create Task`,
			`{left}  ${chalk.greenBright('escape')}: Cancel`
		].join('\n');
	}

	render() {
		const width = menuPanel.width - 2;
		const hr = chalk.bold.black('━'.repeat(width));
		const content = [
			this.renderTopBar(),
			hr,
			this.renderView(),
			hr,
			this.renderJobs(),
			hr,
			this.renderSubMenu()
		].join('\n');
		menuPanel.setContent(content);
	}
}